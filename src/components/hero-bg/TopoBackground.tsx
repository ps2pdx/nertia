'use client';

import { useEffect, useRef } from 'react';

type Props = { active: boolean };

// Renders a wave field that slowly morphs into a topographical contour map.
// Phase oscillates 0 → 1 → 0 over time. At phase 0 the lines are smooth
// horizontal sine waves; at phase 1 they wrap into concentric topo-style
// contours around two drifting summits.
export default function TopoBackground({ active }: Props) {
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

        let W = 0;
        let H = 0;
        let raf = 0;
        let t = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const rect = parent.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas.width = Math.floor(W * dpr);
            canvas.height = Math.floor(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const draw = () => {
            if (activeRef.current) t += 0.005;
            ctx.clearRect(0, 0, W, H);

            // Morph factor: oscillates 0 → 1 → 0 over ~14 seconds
            const morph = (Math.sin(t * 0.18) + 1) / 2;

            // Two drifting "summits" for the topo phase
            const s1x = W * (0.35 + Math.sin(t * 0.2) * 0.05);
            const s1y = H * (0.5 + Math.cos(t * 0.15) * 0.08);
            const s2x = W * (0.75 + Math.cos(t * 0.18) * 0.05);
            const s2y = H * (0.55 + Math.sin(t * 0.12) * 0.08);

            // Render contour lines by sampling a height field on a grid
            // and using marching-squares on each cell.
            const cell = 14;
            const cols = Math.ceil(W / cell) + 1;
            const rows = Math.ceil(H / cell) + 1;
            const heights = new Float32Array(cols * rows);

            const heightAt = (x: number, y: number) => {
                // Wave component: stacked sin waves
                const wave =
                    Math.sin((x * 0.012) + t * 0.6) * 1.0 +
                    Math.sin((x * 0.022) - t * 0.4) * 0.6 +
                    Math.sin((y * 0.018) + t * 0.3) * 0.7;

                // Topo component: distance from each summit, normalized
                const d1 = Math.hypot(x - s1x, y - s1y) * 0.012;
                const d2 = Math.hypot(x - s2x, y - s2y) * 0.012;
                const topo = -Math.exp(-d1 * 0.5) * 3 - Math.exp(-d2 * 0.6) * 2.5 + d1 * 0.5 + d2 * 0.4;

                return wave * (1 - morph) + topo * morph;
            };

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    heights[r * cols + c] = heightAt(c * cell, r * cell);
                }
            }

            // Draw a series of contour lines at evenly-spaced thresholds.
            const thresholds = [-2.6, -1.8, -1.0, -0.2, 0.6, 1.4, 2.2, 3.0];
            ctx.strokeStyle = 'rgba(180, 220, 255, 0.18)';
            ctx.lineWidth = 1;

            for (const th of thresholds) {
                ctx.beginPath();
                for (let r = 0; r < rows - 1; r++) {
                    for (let c = 0; c < cols - 1; c++) {
                        const tl = heights[r * cols + c];
                        const tr = heights[r * cols + c + 1];
                        const bl = heights[(r + 1) * cols + c];
                        const br = heights[(r + 1) * cols + c + 1];

                        const x = c * cell;
                        const y = r * cell;

                        // Marching squares — encode corners above/below threshold
                        let code = 0;
                        if (tl > th) code |= 1;
                        if (tr > th) code |= 2;
                        if (br > th) code |= 4;
                        if (bl > th) code |= 8;
                        if (code === 0 || code === 15) continue;

                        const lerp = (a: number, b: number) =>
                            (th - a) / (b - a || 1e-9);

                        const top = { x: x + lerp(tl, tr) * cell, y };
                        const right = { x: x + cell, y: y + lerp(tr, br) * cell };
                        const bottom = { x: x + lerp(bl, br) * cell, y: y + cell };
                        const left = { x, y: y + lerp(tl, bl) * cell };

                        const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => {
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                        };

                        switch (code) {
                            case 1: case 14: seg(left, top); break;
                            case 2: case 13: seg(top, right); break;
                            case 4: case 11: seg(right, bottom); break;
                            case 8: case 7: seg(bottom, left); break;
                            case 3: case 12: seg(left, right); break;
                            case 6: case 9: seg(top, bottom); break;
                            case 5: seg(left, top); seg(right, bottom); break;
                            case 10: seg(top, right); seg(bottom, left); break;
                        }
                    }
                }
                ctx.stroke();
            }

            // Subtle accent at the summits when in topo phase
            if (morph > 0.4) {
                const summitAlpha = (morph - 0.4) * 0.4;
                [
                    [s1x, s1y],
                    [s2x, s2y],
                ].forEach(([sx, sy]) => {
                    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 80);
                    g.addColorStop(0, `rgba(34, 197, 94, ${summitAlpha * 0.4})`);
                    g.addColorStop(1, 'rgba(34, 197, 94, 0)');
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 80, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            raf = requestAnimationFrame(draw);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-bg" aria-hidden />;
}
