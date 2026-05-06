'use client';

import { useEffect, useRef } from 'react';

type Props = { active: boolean };

type Peak = {
    /** Position in normalized [0, 1] coords. */
    nx: number;
    ny: number;
    /** Per-frame drift in normalized coords. */
    vx: number;
    vy: number;
    /** Peak height. */
    h: number;
    /** Influence radius in pixels. */
    radius: number;
};

// Tight topographical map — concentric contour rings around drifting peaks.
// A military-style HUD target box rotates between peaks, snapping to each
// every few seconds with a callout label.
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

        const peaks: Peak[] = [
            { nx: 0.22, ny: 0.34, vx: 0.00010, vy: 0.00006, h: 3.6, radius: 220 },
            { nx: 0.68, ny: 0.58, vx: -0.00008, vy: 0.00009, h: 3.2, radius: 200 },
            { nx: 0.45, ny: 0.22, vx: 0.00006, vy: -0.00005, h: 2.8, radius: 170 },
            { nx: 0.82, ny: 0.28, vx: -0.00005, vy: 0.00008, h: 2.5, radius: 150 },
        ];

        // Smoothly-tracked HUD target — interpolates toward the focused peak.
        let targetX = 0;
        let targetY = 0;
        let lastFocusIdx = -1;

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

        const drawHud = (focusIdx: number) => {
            const p = peaks[focusIdx];
            const px = p.nx * W;
            const py = p.ny * H;

            // Snap-to-target with smoothing
            const ease = lastFocusIdx === focusIdx ? 0.05 : 0.08;
            targetX += (px - targetX) * ease;
            targetY += (py - targetY) * ease;

            const boxSize = 110;
            const half = boxSize / 2;
            const left = targetX - half;
            const right = targetX + half;
            const top = targetY - half;
            const bot = targetY + half;

            ctx.save();

            // Corner brackets
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
            ctx.shadowBlur = 3;
            const len = 16;
            const bracket = (x: number, y: number, dx: number, dy: number) => {
                ctx.beginPath();
                ctx.moveTo(x, y + dy * len);
                ctx.lineTo(x, y);
                ctx.lineTo(x + dx * len, y);
                ctx.stroke();
            };
            bracket(left, top, 1, 1);
            bracket(right, top, -1, 1);
            bracket(right, bot, -1, -1);
            bracket(left, bot, 1, -1);

            // Center crosshair
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.55)';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(targetX - 9, targetY);
            ctx.lineTo(targetX - 3, targetY);
            ctx.moveTo(targetX + 3, targetY);
            ctx.lineTo(targetX + 9, targetY);
            ctx.moveTo(targetX, targetY - 9);
            ctx.lineTo(targetX, targetY - 3);
            ctx.moveTo(targetX, targetY + 3);
            ctx.lineTo(targetX, targetY + 9);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(targetX, targetY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.85)';
            ctx.fill();

            // Label callout — anchored to top-right of the box, with a small
            // dogleg connector.
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
            ctx.beginPath();
            ctx.moveTo(right, top);
            ctx.lineTo(right + 12, top - 12);
            ctx.lineTo(right + 96, top - 12);
            ctx.stroke();

            ctx.font = '10px ui-monospace, "JetBrains Mono", monospace';
            ctx.fillStyle = 'rgba(34, 197, 94, 0.85)';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            const elev = Math.round(p.h * 1240 + 800);
            ctx.fillText(`PEAK ${String(focusIdx + 1).padStart(2, '0')}`, right + 16, top - 16);
            ctx.fillStyle = 'rgba(160, 220, 180, 0.7)';
            ctx.fillText(`ELEV ${elev}M`, right + 16, top - 4);

            // Coords pinned bottom-left of box
            const lat = (47 + p.ny * 0.4).toFixed(3);
            const lon = (122 + p.nx * 0.5).toFixed(3);
            ctx.fillStyle = 'rgba(160, 220, 180, 0.6)';
            ctx.fillText(`${lat}°N`, left, bot + 14);
            ctx.fillText(`${lon}°W`, left, bot + 26);

            ctx.restore();
        };

        const drawFrameHud = (focusIdx: number) => {
            ctx.save();
            ctx.font = '10px ui-monospace, "JetBrains Mono", monospace';
            ctx.fillStyle = 'rgba(34, 197, 94, 0.55)';
            ctx.textBaseline = 'top';
            ctx.fillText(`RECON · ${(t * 12).toFixed(0).padStart(4, '0')}`, 16, 16);
            ctx.textAlign = 'right';
            ctx.fillText(`SECTOR 47 · ${peaks.length} PEAKS`, W - 16, 16);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`ELEV BANDS · 240M`, 16, H - 16);
            ctx.textAlign = 'right';
            ctx.fillText(`TGT ${String(focusIdx + 1).padStart(2, '0')} · LOCK`, W - 16, H - 16);
            ctx.restore();
        };

        const draw = () => {
            if (activeRef.current) {
                t += 0.005;
                for (const p of peaks) {
                    p.nx += p.vx;
                    p.ny += p.vy;
                    if (p.nx < 0.1 || p.nx > 0.9) p.vx *= -1;
                    if (p.ny < 0.15 || p.ny > 0.85) p.vy *= -1;
                }
            }
            ctx.clearRect(0, 0, W, H);

            // Compute the current focused peak — rotates every 4 seconds.
            const focusIdx = Math.floor(t / 4) % peaks.length;
            if (focusIdx !== lastFocusIdx) {
                // First frame on a new focus — initialize target near the peak
                // so it eases in rather than flying across the canvas.
                if (lastFocusIdx === -1) {
                    targetX = peaks[focusIdx].nx * W;
                    targetY = peaks[focusIdx].ny * H;
                }
                lastFocusIdx = focusIdx;
            }

            // ── Sample heightfield + draw contours via marching squares ──
            const cell = 12;
            const cols = Math.ceil(W / cell) + 1;
            const rows = Math.ceil(H / cell) + 1;
            const heights = new Float32Array(cols * rows);

            const heightAt = (x: number, y: number) => {
                let h = 0;
                for (const p of peaks) {
                    const dx = x - p.nx * W;
                    const dy = y - p.ny * H;
                    const d2 = dx * dx + dy * dy;
                    h += p.h * Math.exp(-d2 / (p.radius * p.radius * 1.4));
                }
                // Slow background undulation so contours breathe rather than freeze
                h += Math.sin(x * 0.0035 + t * 0.4) * 0.18;
                h += Math.cos(y * 0.0042 - t * 0.3) * 0.14;
                return h;
            };

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    heights[r * cols + c] = heightAt(c * cell, r * cell);
                }
            }

            // Tight contour spacing — many thresholds for that topo-map density
            const thresholds: number[] = [];
            for (let i = -2; i <= 22; i++) thresholds.push(i * 0.18);

            for (const th of thresholds) {
                const intensity = th < 0 ? 0.05 : Math.min(0.22, 0.08 + th * 0.012);
                ctx.strokeStyle = `rgba(140, 210, 220, ${intensity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let r = 0; r < rows - 1; r++) {
                    for (let c = 0; c < cols - 1; c++) {
                        const tl = heights[r * cols + c];
                        const tr = heights[r * cols + c + 1];
                        const bl = heights[(r + 1) * cols + c];
                        const br = heights[(r + 1) * cols + c + 1];

                        let code = 0;
                        if (tl > th) code |= 1;
                        if (tr > th) code |= 2;
                        if (br > th) code |= 4;
                        if (bl > th) code |= 8;
                        if (code === 0 || code === 15) continue;

                        const x = c * cell;
                        const y = r * cell;
                        const lerp = (a: number, b: number) => (th - a) / (b - a || 1e-9);
                        const top = { x: x + lerp(tl, tr) * cell, y };
                        const right = { x: x + cell, y: y + lerp(tr, br) * cell };
                        const bot = { x: x + lerp(bl, br) * cell, y: y + cell };
                        const left = { x, y: y + lerp(tl, bl) * cell };
                        const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => {
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                        };
                        switch (code) {
                            case 1: case 14: seg(left, top); break;
                            case 2: case 13: seg(top, right); break;
                            case 4: case 11: seg(right, bot); break;
                            case 8: case 7: seg(bot, left); break;
                            case 3: case 12: seg(left, right); break;
                            case 6: case 9: seg(top, bot); break;
                            case 5: seg(left, top); seg(right, bot); break;
                            case 10: seg(top, right); seg(bot, left); break;
                        }
                    }
                }
                ctx.stroke();
            }

            // Subtle accent at peaks (warm spot inside the tightest contours)
            for (const p of peaks) {
                const px = p.nx * W;
                const py = p.ny * H;
                const g = ctx.createRadialGradient(px, py, 0, px, py, 36);
                g.addColorStop(0, 'rgba(34, 197, 94, 0.18)');
                g.addColorStop(1, 'rgba(34, 197, 94, 0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(px, py, 36, 0, Math.PI * 2);
                ctx.fill();
            }

            drawHud(focusIdx);
            drawFrameHud(focusIdx);

            raf = requestAnimationFrame(draw);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();
        // Seed target so the box doesn't fly in from origin
        targetX = peaks[0].nx * W;
        targetY = peaks[0].ny * H;
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-bg" aria-hidden />;
}
