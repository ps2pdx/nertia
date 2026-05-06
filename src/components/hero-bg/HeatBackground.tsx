'use client';

import { useEffect, useRef } from 'react';

type Props = { active: boolean };

type Blob = {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    intensity: number;
    hue: number;
};

// Heat-signature / infrared style: drifting hot blobs on a cool base,
// blended additively to evoke a thermal-camera feed.
export default function HeatBackground({ active }: Props) {
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
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let blobs: Blob[] = [];

        const seedBlobs = () => {
            blobs = [];
            const count = 9;
            for (let i = 0; i < count; i++) {
                blobs.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: 110 + Math.random() * 140,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.25,
                    intensity: 0.4 + Math.random() * 0.6,
                    // Hue range: 0 (red) to 50 (yellow) — hot side of thermal
                    hue: Math.random() * 50,
                });
            }
        };

        const resize = () => {
            const rect = parent.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas.width = Math.floor(W * dpr);
            canvas.height = Math.floor(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            seedBlobs();
        };

        const draw = () => {
            // Cool base — deep indigo / near-black
            ctx.fillStyle = '#06080f';
            ctx.fillRect(0, 0, W, H);

            // Layered cold gradient at edges
            const coldGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
            coldGrad.addColorStop(0, 'rgba(20, 30, 70, 0.5)');
            coldGrad.addColorStop(1, 'rgba(2, 4, 12, 0.9)');
            ctx.fillStyle = coldGrad;
            ctx.fillRect(0, 0, W, H);

            // Hot blobs — additive blend so they bloom against the cool base
            ctx.globalCompositeOperation = 'screen';

            for (const b of blobs) {
                if (activeRef.current) {
                    b.x += b.vx;
                    b.y += b.vy;
                    if (b.x < -b.r) b.vx = Math.abs(b.vx);
                    if (b.x > W + b.r) b.vx = -Math.abs(b.vx);
                    if (b.y < -b.r) b.vy = Math.abs(b.vy);
                    if (b.y > H + b.r) b.vy = -Math.abs(b.vy);
                    // Subtle intensity breathing
                    b.intensity += (Math.random() - 0.5) * 0.005;
                    b.intensity = Math.max(0.3, Math.min(1.0, b.intensity));
                }

                const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                // Thermal palette: hot core (yellow/white) → orange → red → magenta → out
                const core = `hsla(${b.hue + 35}, 100%, 75%, ${b.intensity * 0.45})`;
                const mid = `hsla(${b.hue + 15}, 100%, 55%, ${b.intensity * 0.30})`;
                const cool = `hsla(${b.hue - 10}, 90%, 35%, ${b.intensity * 0.18})`;
                g.addColorStop(0, core);
                g.addColorStop(0.35, mid);
                g.addColorStop(0.7, cool);
                g.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';

            // Faint scanlines for that thermal-camera feel
            ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
            for (let y = 0; y < H; y += 3) {
                ctx.fillRect(0, y, W, 1);
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
