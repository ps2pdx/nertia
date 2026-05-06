'use client';

import { useEffect, useRef } from 'react';
import { attachThemeStrokeListener } from '@/components/hero-bg/themeColor';

type Props = { active: boolean };

type Seed = {
    /** Rest position in the working-buffer coordinate space. */
    bx: number;
    by: number;
    /** 0..1 — drives alpha, radius, glow, shimmer amplitude. Higher
     *  values are sharper edges; lower values are soft fill. */
    intensity: number;
    /** Per-particle phase offset for sinusoidal shimmer. */
    phase: number;
};

const PORTRAIT_SRC = '/scott-portrait.png';

// Working buffer for pixel sampling. Larger = more fidelity.
const WORK_W = 600;
const WORK_H = 800;

// Sampling grid stride.
const STRIDE = 3;

// Luminance window for silhouette inclusion. Drops the bright wall
// background and the deepest blacks.
const LUM_LOW = 0.05;
const LUM_HIGH = 0.78;

// Sobel gradient magnitude that maps to intensity = 1 (saturated edge).
const EDGE_NORM = 0.42;

// Minimum probability of keeping a sampled pixel (applied to weakest
// fills). Strong edges always kept.
const FILL_KEEP_FLOOR = 0.45;

// Particle motion.
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
            // Horizontal flip — mirror the photo so the body faces the
            // headline rather than away from it.
            offCtx.translate(WORK_W, 0);
            offCtx.scale(-1, 1);
            offCtx.drawImage(img, 0, 0, WORK_W, WORK_H);
            // Reset transform before reading pixels
            offCtx.setTransform(1, 0, 0, 1, 0, 0);
            const data = offCtx.getImageData(0, 0, WORK_W, WORK_H).data;

            // S-curve contrast boost — pushes midtones apart so the
            // Sobel gradient picks up softer features (cheek shadow,
            // shirt creases) that the original near-flat lighting
            // doesn't surface on its own.
            const sCurve = (v: number) => {
                const k = 1.6;
                return 0.5 + Math.tanh((v - 0.5) * k * 2) / Math.tanh(k * 2) * 0.5;
            };

            const rawLum = new Float32Array(WORK_W * WORK_H);
            const lumBuf = new Float32Array(WORK_W * WORK_H);
            for (let i = 0, j = 0; i < data.length; i += 4, j++) {
                const v = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
                rawLum[j] = v;
                lumBuf[j] = sCurve(v);
            }

            const lumAt = (x: number, y: number) => lumBuf[y * WORK_W + x];
            const rawAt = (x: number, y: number) => rawLum[y * WORK_W + x];

            const newSeeds: Seed[] = [];
            for (let y = 1; y < WORK_H - 1; y += STRIDE) {
                for (let x = 1; x < WORK_W - 1; x += STRIDE) {
                    // Use raw luminance for the silhouette window so we
                    // exclude background regardless of contrast curve.
                    const raw = rawAt(x, y);
                    if (raw <= LUM_LOW || raw >= LUM_HIGH) continue;

                    // Sobel 3×3 on contrast-boosted luminance
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

                    // Continuous intensity instead of binary edge/fill —
                    // particle alpha + radius + shimmer all scale with it.
                    const intensity = Math.min(1, mag / EDGE_NORM);

                    // Probabilistic keep — fills are sampled less often
                    // than edges to keep particle count manageable while
                    // preserving sharp outlines.
                    const keepProb = FILL_KEEP_FLOOR + intensity * (1 - FILL_KEEP_FLOOR);
                    if (Math.random() > keepProb) continue;

                    newSeeds.push({
                        bx: x,
                        by: y,
                        intensity,
                        phase: Math.random() * Math.PI * 2,
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

            // Soft aura behind the figure — faint radial glow centered
            // on the chest area, gives the silhouette some depth so
            // particles don't read as floating in pure black.
            const auraX = placementOffsetX + WORK_W * 0.50 * placementScale;
            const auraY = placementOffsetY + WORK_H * 0.55 * placementScale;
            const auraR = WORK_W * 0.55 * placementScale;
            const aura = ctx.createRadialGradient(auraX, auraY, 0, auraX, auraY, auraR);
            aura.addColorStop(0, `rgba(${strokeRgb}, 0.07)`);
            aura.addColorStop(0.5, `rgba(${strokeRgb}, 0.02)`);
            aura.addColorStop(1, `rgba(${strokeRgb}, 0)`);
            ctx.fillStyle = aura;
            ctx.fillRect(auraX - auraR, auraY - auraR, auraR * 2, auraR * 2);

            for (const s of seeds) {
                // Intensity-driven render parameters
                const alpha = 0.18 + s.intensity * 0.78;       // fills 0.18 → edges 0.96
                const r = (0.7 + s.intensity * 1.0) * placementScale * 0.9;
                const glow = 2.0 + s.intensity * 2.0;          // 2.0 → 4.0
                const shimmer = 0.35 + s.intensity * 0.7;      // weak fills shimmer least

                const sx = s.bx + Math.sin(t * 1.6 + s.phase) * shimmer;
                const sy = s.by + Math.cos(t * 1.3 + s.phase * 1.7) * shimmer + breath;
                const px = placementOffsetX + sx * placementScale;
                const py = placementOffsetY + sy * placementScale;

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
                ctx.arc(px, py, Math.max(0.5, r * 0.6), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${strokeRgb}, ${alpha})`;
                ctx.fill();
            }

            // ── 3D wireframe: hovering tetrahedron near the face ──
            // After the horizontal flip the face center sits roughly
            // at 0.50/0.27 of the working buffer. Tumbling tetrahedron
            // hovers there as a "deconstructed reality" overlay.
            const faceBufX = WORK_W * 0.50;
            const faceBufY = WORK_H * 0.27;
            const faceX = placementOffsetX + faceBufX * placementScale;
            const faceY = placementOffsetY + faceBufY * placementScale + breath;
            const tetSize = 30 * placementScale * 1.6;
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
