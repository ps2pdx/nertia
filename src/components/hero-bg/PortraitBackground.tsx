'use client';

import { useEffect, useRef, useState } from 'react';

type Props = { active: boolean };

const BLUEPRINT_SRC = '/scott-portrait-blueprint.svg';

// Slide 1 background — vector blueprint of the portrait, edge-traced
// from the source photo via Canny + potrace and shipped as a static
// SVG. Uses currentColor so the figure picks up the slide's accent
// from CSS. Subtle "draw-in" reveal on activate using stroke-dashoffset
// over each path; otherwise renders as a still illustration.
export default function PortraitBackground({ active }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

    // Fetch SVG once and inject as innerHTML (avoids 1300+ paths in JSX)
    useEffect(() => {
        let cancelled = false;
        fetch(BLUEPRINT_SRC)
            .then((r) => r.text())
            .then((text) => {
                if (cancelled) return;
                setSvgMarkup(text);
            })
            .catch(() => {
                /* fall through — component just renders nothing */
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`portrait-bg ${active ? 'is-active' : ''}`}
            aria-hidden
            // SVG content is fetched from /public, controlled and trusted.
            dangerouslySetInnerHTML={svgMarkup ? { __html: svgMarkup } : undefined}
        />
    );
}
