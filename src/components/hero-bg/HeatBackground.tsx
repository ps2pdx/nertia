'use client';

import { useEffect, useRef } from 'react';

type Props = { active: boolean };

type Subject = {
    nx: number;
    ny: number;
    vx: number;
    vy: number;
    halfW: number;
    halfH: number;
    /** Core temperature 0..1; modulates intensity. */
    temp: number;
    /** Animated breathing phase. */
    phase: number;
};

type SceneryPatch = {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
};

// Classic FLIR / Predator-style thermal imaging.
// - Vibrant cool-blue field with low-contrast scenery patches (walls/doorways)
// - Humanoid silhouettes rendered with the full thermal rainbow palette:
//   blue → green → yellow → orange → red → white (hottest)
// - Heat ripples + tracking reticle on the hottest subject
// - Scan-line texture + drifting horizontal scan band
// - Corner HUD: REC timestamp, AUTO TRACK, peak temperature
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
        let scenery: SceneryPatch[] = [];

        const seedSubjects = () => {
            subjects = [];
            const count = 4;
            for (let i = 0; i < count; i++) {
                subjects.push({
                    nx: 0.18 + (i / count) * 0.7 + (Math.random() - 0.5) * 0.06,
                    ny: 0.45 + Math.random() * 0.20,
                    vx: (Math.random() - 0.5) * 0.0006,
                    vy: (Math.random() - 0.5) * 0.0003,
                    halfW: 75 + Math.random() * 30,
                    halfH: 150 + Math.random() * 40,
                    temp: 0.55 + Math.random() * 0.45,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        };

        const seedScenery = () => {
            // Static darker-blue rectangles to suggest walls / doorways behind.
            scenery = [];
            const tones = [
                'rgba(8, 24, 56, 0.55)',
                'rgba(4, 18, 42, 0.65)',
                'rgba(12, 36, 72, 0.45)',
                'rgba(2, 16, 38, 0.7)',
            ];
            const count = 6 + Math.floor(Math.random() * 3);
            for (let i = 0; i < count; i++) {
                const w = 80 + Math.random() * 220;
                const h = 120 + Math.random() * 280;
                scenery.push({
                    x: Math.random() * W - w * 0.2,
                    y: Math.random() * H - h * 0.2,
                    w,
                    h,
                    fill: tones[i % tones.length],
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
            seedScenery();
        };

        // Render a humanoid heat signature using the full thermal palette.
        // Multiple body "parts" (head, chest, hips, legs) are drawn as radial
        // gradients with `lighten` blending so overlapping regions merge into
        // one continuous silhouette with proper isothermal banding.
        const drawSubject = (s: Subject) => {
            const cx = s.nx * W;
            const cy = s.ny * H;
            const breath = 1 + Math.sin(t * 1.5 + s.phase) * 0.025;
            const hw = s.halfW * breath;
            const hh = s.halfH * breath;

            const parts = [
                { ox: 0,         oy: -hh * 0.72, r: hw * 0.55, weight: 1.0 },  // head
                { ox: 0,         oy: -hh * 0.30, r: hw * 0.95, weight: 1.0 },  // shoulders/chest
                { ox: 0,         oy:  hh * 0.10, r: hw * 0.85, weight: 0.95 }, // torso/hips
                { ox: -hw * 0.30, oy:  hh * 0.55, r: hw * 0.45, weight: 0.85 }, // left leg
                { ox:  hw * 0.30, oy:  hh * 0.55, r: hw * 0.45, weight: 0.85 }, // right leg
                { ox: -hw * 0.55, oy: -hh * 0.05, r: hw * 0.30, weight: 0.80 }, // left arm
                { ox:  hw * 0.55, oy: -hh * 0.05, r: hw * 0.30, weight: 0.80 }, // right arm
            ];

            ctx.save();
            ctx.globalCompositeOperation = 'lighten';
            for (const p of parts) {
                const px = cx + p.ox;
                const py = cy + p.oy;
                // Gradient extent — pad beyond the "hot core" so the cool halo
                // (blue/green) shows around the body edges.
                const ext = p.r * 1.55;
                const heat = s.temp * p.weight;
                const g = ctx.createRadialGradient(px, py, 0, px, py, ext);
                // Classic FLIR rainbow palette
                g.addColorStop(0.00, `rgba(255, 250, 230, ${heat * 0.95})`); // white-hot core
                g.addColorStop(0.10, `rgba(255, 215, 90,  ${heat * 0.95})`); // yellow
                g.addColorStop(0.25, `rgba(255, 140, 40,  ${heat * 0.92})`); // orange
                g.addColorStop(0.42, `rgba(225, 50, 60,   ${heat * 0.88})`); // red
                g.addColorStop(0.58, `rgba(150, 35, 130,  ${heat * 0.70})`); // magenta
                g.addColorStop(0.72, `rgba(60, 200, 110,  ${heat * 0.55})`); // green band
                g.addColorStop(0.85, `rgba(30, 130, 220,  ${heat * 0.45})`); // cyan/blue
                g.addColorStop(1.00, 'rgba(10, 40, 100, 0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(px, py, ext, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        };

        const drawRipple = (s: Subject) => {
            const cx = s.nx * W;
            const cy = s.ny * H;
            for (let i = 0; i < 3; i++) {
                const phase = (t * 0.5 + i / 3) % 1;
                const radius = 50 + phase * 220;
                const alpha = (1 - phase) * 0.18 * s.temp;
                ctx.strokeStyle = `rgba(255, 220, 90, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        };

        const drawTrackingReticle = (s: Subject) => {
            const cx = s.nx * W;
            const cy = s.ny * H;
            const size = 38;
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 80, 30, 0.85)';
            ctx.lineWidth = 1.2;
            ctx.shadowColor = 'rgba(255, 80, 30, 0.6)';
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.moveTo(cx - size, cy); ctx.lineTo(cx - 8, cy);
            ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + size, cy);
            ctx.moveTo(cx, cy - size); ctx.lineTo(cx, cy - 8);
            ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy + size);
            ctx.stroke();
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

            ctx.fillStyle = 'rgba(255, 90, 30, 0.85)';
            ctx.fillText('● THERMAL', 16, 16);
            ctx.fillStyle = 'rgba(220, 200, 130, 0.55)';
            ctx.fillText('IR · ACTIVE', 16, 30);

            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255, 90, 30, 0.85)';
            const blink = Math.sin(t * 4) > 0;
            const dot = blink ? '●' : ' ';
            ctx.fillText(`${dot} REC ${formatTime(t)}`, W - 16, 16);
            ctx.fillStyle = 'rgba(220, 200, 130, 0.55)';
            ctx.fillText('30 FPS · 1080P', W - 16, 30);

            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = 'rgba(255, 200, 80, 0.85)';
            const tempC = (24 + hottest.temp * 16).toFixed(1);
            ctx.fillText(`PEAK · ${tempC}°C`, 16, H - 16);
            ctx.fillStyle = 'rgba(220, 200, 130, 0.55)';
            ctx.fillText('RANGE 18° — 41°', 16, H - 30);

            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255, 90, 30, 0.85)';
            ctx.fillText('AUTO TRACK · ON', W - 16, H - 16);
            ctx.fillStyle = 'rgba(220, 200, 130, 0.55)';
            ctx.fillText(`SUBJ ${subjects.indexOf(hottest) + 1} OF ${subjects.length}`, W - 16, H - 30);

            ctx.restore();
        };

        const draw = () => {
            if (activeRef.current) {
                t += 0.012;
                for (const s of subjects) {
                    s.nx += s.vx;
                    s.ny += s.vy;
                    if (s.nx < 0.12 || s.nx > 0.88) s.vx *= -1;
                    if (s.ny < 0.30 || s.ny > 0.78) s.vy *= -1;
                    s.temp = Math.max(0.45, Math.min(1, s.temp + (Math.random() - 0.5) * 0.004));
                }
            }

            // ── Cool blue field (vibrant, not black) ──
            const base = ctx.createLinearGradient(0, 0, 0, H);
            base.addColorStop(0, '#0a3a78');
            base.addColorStop(0.55, '#0a2a5a');
            base.addColorStop(1, '#06183a');
            ctx.fillStyle = base;
            ctx.fillRect(0, 0, W, H);

            // Scenery patches (architectural hints behind subjects)
            for (const patch of scenery) {
                ctx.fillStyle = patch.fill;
                ctx.fillRect(patch.x, patch.y, patch.w, patch.h);
            }

            // Subjects with full thermal palette
            for (const s of subjects) drawSubject(s);

            // Ripple + tracking on the hottest
            let hottest = subjects[0];
            for (const s of subjects) if (s.temp > hottest.temp) hottest = s;
            drawRipple(hottest);
            drawTrackingReticle(hottest);

            // Scan lines
            ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
            for (let y = 0; y < H; y += 3) {
                ctx.fillRect(0, y, W, 1);
            }
            // Drifting horizontal scan band
            const scanY = ((t * 60) % (H + 80)) - 40;
            const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            scanGrad.addColorStop(0, 'rgba(255, 220, 80, 0)');
            scanGrad.addColorStop(0.5, 'rgba(255, 220, 80, 0.05)');
            scanGrad.addColorStop(1, 'rgba(255, 220, 80, 0)');
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
