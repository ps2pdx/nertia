'use client';

import { useEffect, useRef } from 'react';

type Props = { active: boolean };

export default function GridBackground({ active }: Props) {
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
            if (activeRef.current) t += 0.004;
            ctx.clearRect(0, 0, W, H);

            const cell = 56;
            const offset = (t * 18) % cell;

            // Base grid lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
            ctx.lineWidth = 1;
            for (let x = -offset; x < W + cell; x += cell) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }
            for (let y = -offset; y < H + cell; y += cell) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }

            // Sub-grid (denser, fainter)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
            const subCell = cell / 4;
            const subOffset = offset / 4;
            for (let x = -subOffset; x < W + subCell; x += subCell) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }
            for (let y = -subOffset; y < H + subCell; y += subCell) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }

            // Sweeping diagonal scan line
            const scanProgress = (t * 0.18) % 1.6 - 0.3;
            const scanX = scanProgress * W;
            const scanGrad = ctx.createLinearGradient(scanX - 80, 0, scanX + 80, 0);
            scanGrad.addColorStop(0, 'rgba(34, 197, 94, 0)');
            scanGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.06)');
            scanGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(scanX - 80, 0, 160, H);

            // Pulse highlights at intersections
            const pulse = Math.sin(t * 1.6) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(34, 197, 94, ${0.08 + pulse * 0.06})`;
            for (let x = -offset; x < W + cell; x += cell) {
                for (let y = -offset; y < H + cell; y += cell) {
                    ctx.beginPath();
                    ctx.arc(x, y, 1.6, 0, Math.PI * 2);
                    ctx.fill();
                }
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
