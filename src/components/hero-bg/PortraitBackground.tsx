'use client';

import { useEffect, useRef } from 'react';
import { attachThemeStrokeListener } from '@/components/hero-bg/themeColor';

type Props = { active: boolean };

// Slide 1 background — vector edge trace of the portrait laid over a
// canvas of vanishing-point perspective lines. The "atmosphere" lines
// radiate from a focal point behind the figure to anchor the subject
// in space rather than floating on a flat plane.
//
// The figure is rendered as a CSS mask-image so the SVG fill is driven
// by background-color (var(--accent)), avoiding the XML/innerHTML
// fragility of dangerouslySetInnerHTML for potrace SVGs.
export default function PortraitBackground({ active }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const activeRef = useRef(active);

    useEffect(() => {
        activeRef.current = active;
    }, [active]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let strokeRgb = '34, 197, 94';
        const detachTheme = attachThemeStrokeListener('--accent', '34, 197, 94', (rgb) => {
            strokeRgb = rgb;
        });

        let W = 0;
        let H = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0;
        let t = 0;

        // Vanishing point — placed roughly behind the head of the
        // mirrored figure (figure sits in the right ~half of the slide,
        // head a bit below the top). Keeps the perspective consistent
        // with where the subject is gazing.
        let vpX = 0;
        let vpY = 0;

        const resize = () => {
            const rect = parent.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas.width = Math.floor(W * dpr);
            canvas.height = Math.floor(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            vpX = W * 0.74;
            vpY = H * 0.30;
        };

        // Draw a ray from the vanishing point to (or past) the canvas
        // edge at the given angle. Alpha falls off near the vp so lines
        // appear to emerge from depth rather than originating at a dot.
        const drawRay = (angle: number, alpha: number, lineWidth: number) => {
            const length = Math.hypot(W, H) * 1.2;
            const x2 = vpX + Math.cos(angle) * length;
            const y2 = vpY + Math.sin(angle) * length;
            const grad = ctx.createLinearGradient(vpX, vpY, x2, y2);
            grad.addColorStop(0, `rgba(${strokeRgb}, 0)`);
            grad.addColorStop(0.18, `rgba(${strokeRgb}, ${alpha * 0.6})`);
            grad.addColorStop(0.7, `rgba(${strokeRgb}, ${alpha})`);
            grad.addColorStop(1, `rgba(${strokeRgb}, 0)`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(vpX, vpY);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        };

        const loop = () => {
            if (activeRef.current) t += 0.012;
            ctx.clearRect(0, 0, W, H);

            // Static perspective rays — 16 evenly-spaced spokes around
            // the vanishing point, alpha varying so some are emphasized.
            const RAY_COUNT = 16;
            for (let i = 0; i < RAY_COUNT; i++) {
                const baseAngle = (i / RAY_COUNT) * Math.PI * 2;
                // Slight per-ray drift so the field "breathes" rather
                // than feeling locked-in static.
                const drift = Math.sin(t * 0.4 + i * 1.13) * 0.012;
                const angle = baseAngle + drift;
                // Alternate emphasis — even-indexed rays brighter
                const isEmphasis = i % 4 === 0;
                const alpha = isEmphasis ? 0.18 : 0.07;
                const w = isEmphasis ? 1.1 : 0.7;
                drawRay(angle, alpha, w);
            }

            // Horizon line — faint horizontal through the vp, suggests
            // a ground/sky boundary the subject is grounded in.
            const horizonGrad = ctx.createLinearGradient(0, vpY, W, vpY);
            horizonGrad.addColorStop(0, `rgba(${strokeRgb}, 0)`);
            horizonGrad.addColorStop(0.4, `rgba(${strokeRgb}, 0.16)`);
            horizonGrad.addColorStop(0.6, `rgba(${strokeRgb}, 0.16)`);
            horizonGrad.addColorStop(1, `rgba(${strokeRgb}, 0)`);
            ctx.strokeStyle = horizonGrad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, vpY);
            ctx.lineTo(W, vpY);
            ctx.stroke();

            // Vanishing-point ring — a small circle marking the focal
            // point. Subtle, just a graphic anchor.
            ctx.strokeStyle = `rgba(${strokeRgb}, 0.35)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(vpX, vpY, 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(vpX, vpY, 14 + Math.sin(t * 1.2) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${strokeRgb}, 0.12)`;
            ctx.stroke();

            raf = requestAnimationFrame(loop);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            detachTheme();
        };
    }, []);

    return (
        <div className={`portrait-bg ${active ? 'is-active' : ''}`} aria-hidden>
            <canvas ref={canvasRef} className="portrait-bg__atmosphere" />
            <div className="portrait-bg__figure" />
        </div>
    );
}
