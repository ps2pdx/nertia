import type { Handle } from "./brandContext";

/**
 * Extract a Handle from free-form user input. Pure — no fetches.
 * Ordered pattern matching; first match wins.
 */
export function detectPlatform(raw: string): Handle | null {
    const input = raw.trim();
    if (!input) return null;

    // twitter (bare @handle)
    const atBareMatch = input.match(/^@([A-Za-z0-9_]{1,15})$/);
    if (atBareMatch) {
        return twitter(atBareMatch[1]);
    }

    // twitter.com / x.com
    const twitterMatch = input.match(/^https?:\/\/(?:www\.)?twitter\.com\/@?([A-Za-z0-9_]{1,15})\/?$/i);
    if (twitterMatch) return twitter(twitterMatch[1]);
    const xMatch = input.match(/^https?:\/\/(?:www\.)?x\.com\/@?([A-Za-z0-9_]{1,15})\/?$/i);
    if (xMatch) {
        return { platform: "twitter", handle: xMatch[1], url: `https://x.com/${xMatch[1]}` };
    }
    const twitterBareMatch = input.match(/^twitter\.com\/@?([A-Za-z0-9_]{1,15})\/?$/i);
    if (twitterBareMatch) return twitter(twitterBareMatch[1]);

    // instagram
    const instagramMatch = input.match(/^https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9_.]{1,30})\/?$/i);
    if (instagramMatch) {
        return {
            platform: "instagram",
            handle: instagramMatch[1],
            url: `https://instagram.com/${instagramMatch[1]}`,
        };
    }

    // linkedin
    const linkedinMatch = input.match(/^https?:\/\/(?:www\.)?linkedin\.com\/in\/([A-Za-z0-9-]{1,100})\/?$/i);
    if (linkedinMatch) {
        return {
            platform: "linkedin",
            handle: linkedinMatch[1],
            url: `https://www.linkedin.com/in/${linkedinMatch[1]}`,
        };
    }

    // youtube
    const youtubeAtMatch = input.match(/^https?:\/\/(?:www\.)?youtube\.com\/@([A-Za-z0-9_-]{1,100})\/?$/i);
    if (youtubeAtMatch) {
        return {
            platform: "youtube",
            handle: youtubeAtMatch[1],
            url: `https://youtube.com/@${youtubeAtMatch[1]}`,
        };
    }
    const youtubeChannelMatch = input.match(/^https?:\/\/(?:www\.)?youtube\.com\/channel\/([A-Za-z0-9_-]{1,100})\/?$/i);
    if (youtubeChannelMatch) {
        return {
            platform: "youtube",
            handle: youtubeChannelMatch[1],
            url: `https://youtube.com/channel/${youtubeChannelMatch[1]}`,
        };
    }

    // tiktok
    const tiktokMatch = input.match(/^https?:\/\/(?:www\.)?tiktok\.com\/@([A-Za-z0-9_.]{1,30})\/?$/i);
    if (tiktokMatch) {
        return {
            platform: "tiktok",
            handle: tiktokMatch[1],
            url: `https://tiktok.com/@${tiktokMatch[1]}`,
        };
    }

    // bluesky
    const blueskyMatch = input.match(/^https?:\/\/(?:www\.)?bsky\.app\/profile\/([A-Za-z0-9._-]{1,100})\/?$/i);
    if (blueskyMatch) {
        return {
            platform: "bluesky",
            handle: blueskyMatch[1],
            url: `https://bsky.app/profile/${blueskyMatch[1]}`,
        };
    }

    // github
    const githubMatch = input.match(/^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9-]{1,100})\/?$/i);
    if (githubMatch) {
        return {
            platform: "github",
            handle: githubMatch[1],
            url: `https://github.com/${githubMatch[1]}`,
        };
    }

    // substack (subdomain OR @handle)
    const substackSubdomainMatch = input.match(/^https?:\/\/([A-Za-z0-9-]{1,63})\.substack\.com\/?$/i);
    if (substackSubdomainMatch) {
        return {
            platform: "substack",
            handle: substackSubdomainMatch[1],
            url: `https://${substackSubdomainMatch[1]}.substack.com`,
        };
    }
    const substackAtMatch = input.match(/^https?:\/\/substack\.com\/@([A-Za-z0-9_-]{1,100})\/?$/i);
    if (substackAtMatch) {
        return {
            platform: "substack",
            handle: substackAtMatch[1],
            url: `https://substack.com/@${substackAtMatch[1]}`,
        };
    }

    // mastodon
    const mastodonMatch = input.match(/^https?:\/\/([A-Za-z0-9.-]+)\/@([A-Za-z0-9_]{1,100})\/?$/i);
    if (mastodonMatch) {
        return {
            platform: "mastodon",
            handle: `${mastodonMatch[2]}@${mastodonMatch[1]}`,
            url: `https://${mastodonMatch[1]}/@${mastodonMatch[2]}`,
        };
    }

    // generic http(s) — site
    if (/^https?:\/\/\S+/i.test(input)) {
        const clean = input.replace(/\/+$/, "");
        return { platform: "site", handle: stripProtocol(clean), url: clean };
    }

    // bare handle (no @ no dot)
    if (/^[A-Za-z0-9_]{1,15}$/.test(input)) {
        return twitter(input);
    }

    // anything else
    return { platform: "link", handle: input, url: input };
}

function twitter(handle: string): Handle {
    return {
        platform: "twitter",
        handle,
        url: `https://twitter.com/${handle}`,
    };
}

function stripProtocol(url: string): string {
    return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
