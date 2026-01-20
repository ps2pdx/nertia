import { NextRequest, NextResponse } from 'next/server';
import { BrandSystem } from '@/types/brand-system';
import { generateExport, isValidFormat, ExportFormat, GeneratorOptions } from '@/generators';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ format: string }> }
) {
  try {
    const { format } = await params;

    // Validate format
    if (!isValidFormat(format)) {
      return NextResponse.json(
        { error: `Invalid export format: ${format}` },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { tokens, options } = body as {
      tokens: BrandSystem;
      options?: GeneratorOptions;
    };

    // Validate tokens
    if (!tokens || !tokens.colors || !tokens.typography) {
      return NextResponse.json(
        { error: 'Invalid brand system tokens' },
        { status: 400 }
      );
    }

    // Generate export
    const result = await generateExport(format as ExportFormat, tokens, options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Export generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export generation failed' },
      { status: 500 }
    );
  }
}

// Also support GET for listing available formats
export async function GET() {
  const { getAvailableGenerators } = await import('@/generators');
  const generators = getAvailableGenerators();

  return NextResponse.json({
    formats: generators.map(g => ({
      id: g.format,
      name: g.name,
      description: g.description,
      icon: g.icon,
    })),
  });
}
