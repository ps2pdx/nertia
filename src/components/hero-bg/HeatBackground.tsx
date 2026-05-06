'use client';

import { useEffect, useRef } from 'react';

type Props = { active: boolean };

type Subject = {
    /** Center of the heat signature in normalized [0,1] coords. */
    nx: number;
    ny: number;
    vx: number;
    vy: number;
    /** Body half-width and half-height in pixels (humanoid roughly 1:2.4). */
    halfW: number;
    halfH: number;
    /** Core temperature 0..1; modulates intensity. */
    temp: number;
    /** Animated breathing phase. */
    phase: number;
};

// Predator-vision style thermal HUD.
// - Cool dark background (blue → black gradient)
// - Hot blobby silhouettes with a yellow/white core, halo of red/magenta
// - Concentric heat ripples emanating from the hottest subject
// - Slow vertical scan-line drift
// - Corner HUD: timestamp, lock-on indicator, temperature readout
// - The hottest subject gets a tracking reticle that follows it
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
        let t = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let subjects: Subject[] = [];

        const seedSubjects = () => {
            subjects = [];
            const count = 5;
            for (let i = 0; i < count; i++) {
                subjects.push({
                    nx: 0.15 + Math.random() * 0.7,
                    ny: 0.2 + Math.random() * 0.6,
                    vx: (Math.random() - 0.5) * 0.0006,
                    vy: (Math.random() - 0.5) * 0.0004,
                    halfW: 60 + Math.random() * 40,
                    halfH: 110 + Math.random() * 60,
                    temp: 0.5 + Math.random() * 0.5,
                    phase: Math.random() * Math.PI * 2,
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
            seedSubjects();
        };

        const drawHeatBody = (s: Subject) => {
            const cx = s.nx * W;
            const cy = s.ny * H;
            const breath = 1 + Math.sin(t * 1.5 + s.phase) * 0.04;
            const halfW = s.halfW * breath;
            const halfH = s.halfH * breath;

            // Render the body as a stack of ellipse gradients — head + torso
            // with the hottest band in the chest/head area.
            const bodyParts = [
                { ox: 0, oy: -halfH * 0.55, rx: halfW * 0.55, ry: halfH * 0.30, hot: 1.0 }, // head
                { ox: 0, oy: -halfH * 0.05, rx: halfW * 0.95, ry: halfH * 0.45, hot: 0.95 }, // chest
                { ox: 0, oy: halfH * 0.55, rx: halfW * 0.65, ry: halfH * 0.40, hot: 0.7 },  // legs
            ];

            for (const part of bodyParts) {
                const px = cx + part.ox;
                const py = cy + part.oy;
                const maxR = Math.max(part.rx, part.ry);
                const g = ctx.createRadialGradient(px, py, 0, px, py, maxR);
                const heat = s.temp * part.hot;
                // Predator palette: white/yellow core → orange → red → magenta → out
                g.addColorStop(0.0, `rgba(255, 245, 200, ${0.55 * heat})`);
                g.addColorStop(0.15, `rgba(255, 200, 80, ${0.50 * heat})`);
                g.addColorStop(0.40, `rgba(245, 90, 30, ${0.40 * heat})`);
                g.addColorStop(0.70, `rgba(180, 25, 110, ${0.25 * heat})`);
                g.addColorStop(1.0, `rgba(40, 0, 80, 0)`);

                ctx.save();
                ctx.translate(px, py);
                ctx.scale(part.rx / maxR, part.ry / maxR);
                ctx.beginPath();
                ctx.arc(0, 0, maxR, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
                ctx.restore();
            }
        };

        const drawRipple = (s: Subject) => {
            const cx = s.nx * W;
            const cy = s.ny * H;
            // Three expanding rings, each phase-offset
            for (let i = 0; i < 3; i++) {
                const phase = (t * 0.6 + i / 3) % 1;
                const radius = 30 + phase * 180;
                const alpha = (1 - phase) * 0.18 * s.temp;
                ctx.strokeStyle = `rgba(255, 200, 80, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        };

        const drawTrackingReticle = (s: Subject) => {
            const cx = s.nx * W;
            const cy = s.ny * H;
            const size = 36;
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 80, 30, 0.8)';
            ctx.lineWidth = 1.2;
            ctx.shadowColor = 'rgba(255, 80, 30, 0.5)';
            ctx.shadowBlur = 4;

            // Crosshair lines
            ctx.beginPath();
            ctx.moveTo(cx - size, cy); ctx.lineTo(cx - 8, cy);
            ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + size, cy);
            ctx.moveTo(cx, cy - size); ctx.lineTo(cx, cy - 8);
            ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy + size);
            ctx.stroke();

            // Tiny corner brackets
            const inner = 14;
            const len = 6;
            const bracket = (x: number, y: number, dx: number, dy: number) => {
                ctx.beginPath();
                ctx.moveTo(x, y + dy * len);
                ctx.lineTo(x, y);
                ctx.lineTo(x + dx * len, y);
                ctx.stroke();
            };
            bracket(cx - inner, cy - inner, 1, 1);
            bracket(cx + inner, cy - inner, -1, 1);
            bracket(cx + inner, cy + inner, -1, -1);
            bracket(cx - inner, cy + inner, 1, -1);

            ctx.restore();
        };

        const drawHud = (hottest: Subject) => {
            ctx.save();
            ctx.font = '10px ui-monospace, "JetBrains Mono", monospace';
            ctx.textBaseline = 'top';

            // Top-left: thermal mode
            ctx.fillStyle = 'rgba(255, 90, 30, 0.85)';
            ctx.fillText('● THERMAL', 16, 16);
            ctx.fillStyle = 'rgba(220, 180, 100, 0.55)';
            ctx.fillText('IR · ACTIVE', 16, 30);

            // Top-right: REC timestamp
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255, 90, 30, 0.85)';
            const blink = Math.sin(t * 4) > 0;
            const dot = blink ? '●' : ' ';
            ctx.fillText(`${dot} REC ${formatTime(t)}`, W - 16, 16);
            ctx.fillStyle = 'rgba(220, 180, 100, 0.55)';
            ctx.fillText('30 FPS · 1080P', W - 16, 30);

            // Bottom-left: temperature
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = 'rgba(255, 200, 80, 0.85)';
            const tempC = (24 + hottest.temp * 16).toFixed(1);
            ctx.fillText(`PEAK · ${tempC}°C`, 16, H - 16);
            ctx.fillStyle = 'rgba(220, 180, 100, 0.55)';
            ctx.fillText('RANGE 18° — 41°', 16, H - 30);

            // Bottom-right: lock-on
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255, 90, 30, 0.85)';
            ctx.fillText('AUTO TRACK · ON', W - 16, H - 16);
            ctx.fillStyle = 'rgba(220, 180, 100, 0.55)';
            ctx.fillText(`SUBJ ${subjects.indexOf(hottest) + 1} OF ${subjects.length}`, W - 16, H - 30);

            ctx.restore();
        };

        const draw = () => {
            if (activeRef.current) {
                t += 0.012;
                for (const s of subjects) {
                    s.nx += s.vx;
                    s.ny += s.vy;
                    if (s.nx < 0.1 || s.nx > 0.9) s.vx *= -1;
                    if (s.ny < 0.18 || s.ny > 0.82) s.vy *= -1;
                    // Slow temperature drift
                    s.temp = Math.max(0.4, Math.min(1, s.temp + (Math.random() - 0.5) * 0.004));
                }
            }

            // Cool base — deep blue → black radial vignette
            const base = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
            base.addColorStop(0, '#0a1228');
            base.addColorStop(0.6, '#04060f');
            base.addColorStop(1, '#000000');
            ctx.fillStyle = base;
            ctx.fillRect(0, 0, W, H);

            // Hot bodies with screen blend so cores pop
            ctx.globalCompositeOperation = 'screen';
            for (const s of subjects) drawHeatBody(s);
            ctx.globalCompositeOperation = 'source-over';

            // Find hottest subject for ripple + tracking reticle
            let hottest = subjects[0];
            for (const s of subjects) if (s.temp > hottest.temp) hottest = s;
            drawRipple(hottest);
            drawTrackingReticle(hottest);

            // Vertical scan lines (every 3px) with horizontal drift band
            ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
            for (let y = 0; y < H; y += 3) {
                ctx.fillRect(0, y, W, 1);
            }
            // Drifting horizontal "scan" band
            const scanY = ((t * 60) % (H + 80)) - 40;
            const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            scanGrad.addColorStop(0, 'rgba(255, 200, 80, 0)');
            scanGrad.addColorStop(0.5, 'rgba(255, 200, 80, 0.05)');
            scanGrad.addColorStop(1, 'rgba(255, 200, 80, 0)');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(0, scanY - 30, W, 60);

            drawHud(hottest);

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

function formatTime(seconds: number) {
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
