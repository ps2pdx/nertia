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

            // Floating waypoint marker — wireframe square bipyramid in
            // gold, hovering above the head of the figure. Spins around
            // its vertical axis and bobs gently. GTA-style.
            drawWaypoint();

            raf = requestAnimationFrame(loop);
        };

        // Square bipyramid (8-sided diamond) — 6 vertices in unit space:
        // top, bottom, and four equator points. Faces filled with
        // translucent yellow (sorted back-to-front so overlapping faces
        // composite correctly), edges stroked over the top with a glow.
        const drawWaypoint = () => {
            // Anchor above the figure's head. Figure is flush bottom-
            // right at width 62%, so head sits around 80-85% across and
            // ~50-55% down. Marker hovers at 82% / 18% — directly above.
            const cx = W * 0.82;
            const cy = H * 0.18;
            const size = Math.min(W, H) * 0.075;

            const rotY = t * 0.55;
            const bob = Math.sin(t * 1.3) * size * 0.10;

            const verts3 = [
                [0,   1.4, 0],   // 0 top apex
                [0,  -1.4, 0],   // 1 bottom apex
                [0.55, 0,  0],   // 2 east
                [-0.55, 0, 0],   // 3 west
                [0,   0,  0.55], // 4 north
                [0,   0, -0.55], // 5 south
            ];
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const proj = verts3.map(([x, y, z]) => {
                const x1 = x * cosY + z * sinY;
                const z1 = -x * sinY + z * cosY;
                const persp = 1 / (1 + z1 * 0.32);
                return {
                    x: cx + x1 * size * persp,
                    y: cy + y * size * persp + bob,
                    depth: z1,
                };
            });

            // 8 triangle faces — 4 around the top apex, 4 around the
            // bottom apex.
            const faces: [number, number, number][] = [
                [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2],
                [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5],
            ];

            // Sort back-to-front so transparent fills layer correctly.
            // Larger depth (z1) = farther; render those first.
            const sorted = [...faces].sort((a, b) => {
                const da = (proj[a[0]].depth + proj[a[1]].depth + proj[a[2]].depth) / 3;
                const db = (proj[b[0]].depth + proj[b[1]].depth + proj[b[2]].depth) / 3;
                return db - da;
            });

            ctx.save();

            // Translucent face fills — back-to-front. Nearer faces get
            // a slightly higher alpha so they "front-light".
            for (const [a, b, c] of sorted) {
                const avgDepth =
                    (proj[a].depth + proj[b].depth + proj[c].depth) / 3;
                // depth in [-0.55, 0.55] roughly; map to alpha.
                const alpha = 0.14 + Math.max(0, -avgDepth) * 0.12;
                ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(proj[a].x, proj[a].y);
                ctx.lineTo(proj[b].x, proj[b].y);
                ctx.lineTo(proj[c].x, proj[c].y);
                ctx.closePath();
                ctx.fill();
            }

            // Edges
            const edges: [number, number][] = [
                [0, 2], [0, 3], [0, 4], [0, 5],
                [1, 2], [1, 3], [1, 4], [1, 5],
                [2, 4], [4, 3], [3, 5], [5, 2],
            ];

            // Outer glow halo
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.20)';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            for (const [a, b] of edges) {
                ctx.moveTo(proj[a].x, proj[a].y);
                ctx.lineTo(proj[b].x, proj[b].y);
            }
            ctx.stroke();

            // Solid bright edges with shadow glow
            ctx.strokeStyle = 'rgba(250, 204, 21, 1)';
            ctx.lineWidth = 1.8;
            ctx.shadowColor = 'rgba(250, 204, 21, 0.75)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            for (const [a, b] of edges) {
                ctx.moveTo(proj[a].x, proj[a].y);
                ctx.lineTo(proj[b].x, proj[b].y);
            }
            ctx.stroke();

            // Apex dots
            ctx.shadowBlur = 5;
            ctx.fillStyle = 'rgba(255, 230, 100, 1)';
            for (const i of [0, 1]) {
                ctx.beginPath();
                ctx.arc(proj[i].x, proj[i].y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
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
            <div className="portrait-bg__figure portrait-bg__figure--top" />
        </div>
    );
}
