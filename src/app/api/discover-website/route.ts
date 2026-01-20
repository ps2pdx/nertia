import { NextRequest, NextResponse } from 'next/server';
import { parseWebsiteHtml } from '@/utils/website-parser';
import { mapDiscoveryToInputs } from '@/utils/discovery-mapper';
import {
  DiscoverWebsiteRequest,
  DiscoverWebsiteResponse,
} from '@/types/website-discovery';

const FETCH_TIMEOUT = 10000; // 10 seconds
const MAX_HTML_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(
  request: NextRequest
): Promise<NextResponse<DiscoverWebsiteResponse>> {
  try {
    const body: DiscoverWebsiteRequest = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid URL starting with http:// or https://',
          errorCode: 'INVALID_URL',
        },
        { status: 400 }
      );
    }

    // Fetch the website HTML
    let html: string;
    try {
      html = await fetchWithTimeout(url, FETCH_TIMEOUT);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
        return NextResponse.json(
          {
            success: false,
            error: 'The website took too long to respond. Try again or enter details manually.',
            errorCode: 'TIMEOUT',
          },
          { status: 408 }
        );
      }

      if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        return NextResponse.json(
          {
            success: false,
            error: 'This website blocks automated access. Please enter details manually.',
            errorCode: 'BLOCKED',
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to access the website. It may be temporarily unavailable.',
          errorCode: 'FETCH_FAILED',
        },
        { status: 502 }
      );
    }

    // Check size limit
    if (html.length > MAX_HTML_SIZE) {
      html = html.substring(0, MAX_HTML_SIZE);
    }

    // Parse HTML and extract brand data
    let discoveryResult;
    try {
      discoveryResult = await parseWebsiteHtml(html, url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not extract brand information from this site. Try entering details manually.',
          errorCode: 'PARSE_ERROR',
        },
        { status: 422 }
      );
    }

    // Map to DiscoveryInputs
    const suggestedInputs = mapDiscoveryToInputs(discoveryResult);

    return NextResponse.json({
      success: true,
      data: discoveryResult,
      suggestedInputs,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        errorCode: 'PARSE_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * Validate that the URL is well-formed and uses http/https
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Fetch a URL with timeout and appropriate headers
 */
async function fetchWithTimeout(url: string, timeout: number): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; NertiaBrandDiscovery/1.0; +https://nertia.ai)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}
