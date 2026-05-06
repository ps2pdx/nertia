'use client';

import { useEffect, useRef } from 'react';
import { attachThemeStrokeListener } from '@/components/hero-bg/themeColor';

type Props = { active: boolean };

type Kind = 'fill' | 'edge';

type Seed = {
    /** Rest position in the working-buffer coordinate space. */
    bx: number;
    by: number;
    kind: Kind;
    /** Per-particle phase offset for sinusoidal shimmer. */
    phase: number;
    r: number;
};

const PORTRAIT_SRC = '/scott-portrait.png';

// Working buffer dimensions for pixel sampling (small for perf).
const WORK_W = 480;
const WORK_H = 640;

// Sampling grid stride — controls density of the silhouette.
const STRIDE = 4;

// Luminance window for the silhouette pass. Excludes the bright wall
// background (~0.78+) and pure black; keeps the body, hat, plaid, and
// face midtones.
const LUM_LOW = 0.06;
const LUM_HIGH = 0.74;

// Sobel gradient threshold for "edge" tagging.
const EDGE_THRESHOLD = 0.18;

// Particle render styling.
const FILL_RADIUS = 1.0;
const EDGE_RADIUS = 1.4;
const FILL_ALPHA = 0.35;
const EDGE_ALPHA = 0.9;
const FILL_GLOW = 2.2;
const EDGE_GLOW = 3.0;

// Particle motion.
const SHIMMER_AMP_FILL = 0.45;
const SHIMMER_AMP_EDGE = 0.8;
const BREATH_AMP = 4.5;
const BREATH_SPEED = 0.18;

// Right-half placement on the hero canvas. The portrait is composed
// into the right ~55% of the slide so the left-aligned headline reads
// without overlap.
const PLACEMENT_X_FRAC = 0.50;  // left edge of the placement region
const PLACEMENT_W_FRAC = 0.50;
const PLACEMENT_Y_FRAC = 0.04;
const PLACEMENT_H_FRAC = 0.92;

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
        let raf = 0;
        let t = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let seeds: Seed[] = [];
        let placementOffsetX = 0;
        let placementOffsetY = 0;
        let placementScale = 1;

        // ── one-shot pixel sampling ────────────────────────────────
        const buildSeeds = (img: HTMLImageElement) => {
            const off = document.createElement('canvas');
            off.width = WORK_W;
            off.height = WORK_H;
            const offCtx = off.getContext('2d');
            if (!offCtx) return;
            offCtx.drawImage(img, 0, 0, WORK_W, WORK_H);
            const data = offCtx.getImageData(0, 0, WORK_W, WORK_H).data;

            const lumAt = (x: number, y: number) => {
                const i = (y * WORK_W + x) * 4;
                // Rec. 601 luma, normalized 0..1
                return (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
            };

            const newSeeds: Seed[] = [];
            for (let y = STRIDE; y < WORK_H - STRIDE; y += STRIDE) {
                for (let x = STRIDE; x < WORK_W - STRIDE; x += STRIDE) {
                    const lum = lumAt(x, y);
                    const inSilhouette = lum > LUM_LOW && lum < LUM_HIGH;
                    if (!inSilhouette) continue;

                    // Sobel 3×3 on luminance for edge detection
                    const tl = lumAt(x - 1, y - 1);
                    const tt = lumAt(x, y - 1);
                    const tr = lumAt(x + 1, y - 1);
                    const ml = lumAt(x - 1, y);
                    const mr = lumAt(x + 1, y);
                    const bl = lumAt(x - 1, y + 1);
                    const bb = lumAt(x, y + 1);
                    const br = lumAt(x + 1, y + 1);
                    const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
                    const gy = -tl - 2 * tt - tr + bl + 2 * bb + br;
                    const mag = Math.hypot(gx, gy);

                    const kind: Kind = mag > EDGE_THRESHOLD ? 'edge' : 'fill';

                    // Drop ~70% of fill particles to avoid overcrowding
                    if (kind === 'fill' && Math.random() > 0.3) continue;

                    newSeeds.push({
                        bx: x,
                        by: y,
                        kind,
                        phase: Math.random() * Math.PI * 2,
                        r: kind === 'edge' ? EDGE_RADIUS : FILL_RADIUS,
                    });
                }
            }
            seeds = newSeeds;
        };

        const img = new Image();
        img.src = PORTRAIT_SRC;
        if (img.complete) buildSeeds(img);
        else img.addEventListener('load', () => buildSeeds(img), { once: true });

        // ── layout ────────────────────────────────────────────────
        const resize = () => {
            const rect = parent.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas.width = Math.floor(W * dpr);
            canvas.height = Math.floor(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Compose the working buffer into the right portion of the
            // hero, fit-contain style.
            const regionW = W * PLACEMENT_W_FRAC;
            const regionH = H * PLACEMENT_H_FRAC;
            const regionX = W * PLACEMENT_X_FRAC;
            const regionY = H * PLACEMENT_Y_FRAC;
            const scaleX = regionW / WORK_W;
            const scaleY = regionH / WORK_H;
            placementScale = Math.min(scaleX, scaleY);
            const renderedW = WORK_W * placementScale;
            const renderedH = WORK_H * placementScale;
            placementOffsetX = regionX + (regionW - renderedW) / 2;
            placementOffsetY = regionY + (regionH - renderedH) / 2;
        };

        // ── draw ──────────────────────────────────────────────────
        const draw = () => {
            if (activeRef.current) t += 0.012;
            ctx.clearRect(0, 0, W, H);

            const breath = Math.sin(t * BREATH_SPEED) * BREATH_AMP;

            for (const s of seeds) {
                const shimmer = s.kind === 'edge' ? SHIMMER_AMP_EDGE : SHIMMER_AMP_FILL;
                const sx = s.bx + Math.sin(t * 1.6 + s.phase) * shimmer;
                const sy = s.by + Math.cos(t * 1.3 + s.phase * 1.7) * shimmer + breath;

                const px = placementOffsetX + sx * placementScale;
                const py = placementOffsetY + sy * placementScale;

                const r = s.r;
                const alpha = s.kind === 'edge' ? EDGE_ALPHA : FILL_ALPHA;
                const glow = s.kind === 'edge' ? EDGE_GLOW : FILL_GLOW;

                // Outer glow
                const g = ctx.createRadialGradient(px, py, 0, px, py, r * glow);
                g.addColorStop(0, `rgba(${strokeRgb}, ${alpha})`);
                g.addColorStop(0.5, `rgba(${strokeRgb}, ${alpha * 0.25})`);
                g.addColorStop(1, `rgba(${strokeRgb}, 0)`);
                ctx.beginPath();
                ctx.arc(px, py, r * glow, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();

                // Solid core
                ctx.beginPath();
                ctx.arc(px, py, r * 0.55, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${strokeRgb}, ${alpha})`;
                ctx.fill();
            }

            // ── 3D wireframe: hovering tetrahedron near the face ──
            // Face area is roughly upper-center of the portrait buffer.
            // Place a small tumbling tetrahedron just to the right of
            // the face — reads as a "deconstructed reality" overlay.
            const faceBufX = WORK_W * 0.50;
            const faceBufY = WORK_H * 0.30;
            const faceX = placementOffsetX + faceBufX * placementScale;
            const faceY = placementOffsetY + faceBufY * placementScale + breath;
            const tetSize = 36 * placementScale * 1.6;
            drawTetrahedron(ctx, faceX, faceY, tetSize, t, strokeRgb);

            raf = requestAnimationFrame(draw);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            detachTheme();
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-bg" aria-hidden />;
}

// Tumbling wireframe tetrahedron — 4 vertices in 3D, projected to 2D
// with a simple perspective divide. Edges drawn as faint green lines.
function drawTetrahedron(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    t: number,
    rgb: string,
) {
    const verts3 = [
        [0, -1, 0],
        [Math.sqrt(8 / 9), 1 / 3, 0],
        [-Math.sqrt(2 / 9), 1 / 3, Math.sqrt(2 / 3)],
        [-Math.sqrt(2 / 9), 1 / 3, -Math.sqrt(2 / 3)],
    ];
    const angY = t * 0.4;
    const angX = t * 0.25;
    const cy2d = Math.cos(angY);
    const sy2d = Math.sin(angY);
    const cx2d = Math.cos(angX);
    const sx2d = Math.sin(angX);
    const proj = verts3.map(([x, y, z]) => {
        const x1 = x * cy2d + z * sy2d;
        const z1 = -x * sy2d + z * cy2d;
        const y2 = y * cx2d - z1 * sx2d;
        const z2 = y * sx2d + z1 * cx2d;
        const persp = 1 / (1 + z2 * 0.18);
        return { x: cx + x1 * size * persp, y: cy + y2 * size * persp };
    });
    const edges = [
        [0, 1], [0, 2], [0, 3],
        [1, 2], [2, 3], [3, 1],
    ];
    ctx.save();
    ctx.strokeStyle = `rgba(${rgb}, 0.35)`;
    ctx.lineWidth = 1;
    ctx.shadowColor = `rgba(${rgb}, 0.3)`;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    for (const [a, b] of edges) {
        ctx.moveTo(proj[a].x, proj[a].y);
        ctx.lineTo(proj[b].x, proj[b].y);
    }
    ctx.stroke();
    for (const v of proj) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.7)`;
        ctx.fill();
    }
    ctx.restore();
}
