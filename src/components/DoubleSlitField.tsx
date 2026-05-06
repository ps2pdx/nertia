'use client';

import { useEffect, useRef } from 'react';

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    life: number;
    decay: number;
    phase: 'fall' | 'through' | 'blocked';
    targetX: number | null;
};

const SLIT_W = 36;
// Slits sit at fixed pixel offset from the centerline so they stay close
// together on wide screens (where a percentage-based offset would drift apart).
const SLIT_OFFSET_PX = 32;
const TARGET_LEFT_FRAC = 0.22;
const TARGET_RIGHT_FRAC = 0.78;
const MAX_PARTICLES = 350;
const MOBILE_BREAKPOINT = 768;

export default function DoubleSlitField() {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const heroRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const root = wrap.parentElement;
        if (!root) return;

        const hero = root.querySelector<HTMLElement>('.home-hero');
        heroRef.current = hero;

        const reduceMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
        const mobileMql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

        let accentRgb = readAccentRgb();
        let throughRgb = computeThroughRgb(accentRgb);

        function readAccentRgb() {
            const accent = getComputedStyle(document.documentElement)
                .getPropertyValue('--accent').trim() || '#22c55e';
            return hexOrColorToRgb(accent);
        }

        function computeThroughRgb(rgb: string) {
            // On dark backgrounds, brighten toward white (post-slit "lit" effect).
            // On light backgrounds, darken slightly so particles remain visible.
            const bg = getComputedStyle(document.documentElement)
                .getPropertyValue('--bg').trim();
            const bgLum = relativeLuminance(hexOrColorToRgb(bg || '#0a0a0a'));
            return bgLum < 0.5 ? brightenRgb(rgb, 0.35) : darkenRgb(rgb, 0.25);
        }

        let W = 0;
        let H = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let lineY = 0;
        let slit1cx = 0;
        let slit2cx = 0;
        const slitHw = SLIT_W / 2;
        let particles: Particle[] = [];
        let frameCount = 0;
        let raf = 0;
        let mouseX = -9999;
        let mouseY = -9999;
        let mouseInHero = false;

        const resize = () => {
            const rect = root.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(W * dpr);
            canvas.height = Math.floor(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Slit line sits at the bottom edge of the hero section
            if (hero) {
                const heroRect = hero.getBoundingClientRect();
                lineY = heroRect.bottom - rect.top;
            } else {
                lineY = H * 0.55;
            }

            slit1cx = W / 2 - SLIT_OFFSET_PX;
            slit2cx = W / 2 + SLIT_OFFSET_PX;
            particles = [];
        };

        const onMove = (e: MouseEvent) => {
            if (!hero) return;
            const heroRect = hero.getBoundingClientRect();
            const rootRect = root.getBoundingClientRect();
            const x = e.clientX - rootRect.left;
            const y = e.clientY - rootRect.top;
            const inside =
                e.clientX >= heroRect.left &&
                e.clientX <= heroRect.right &&
                e.clientY >= heroRect.top &&
                e.clientY <= heroRect.bottom;
            mouseX = x;
            mouseY = y;
            mouseInHero = inside;
        };

        const onLeave = () => {
            mouseInHero = false;
        };

        const spawn = (x: number, y: number): Particle => {
            const spread = 0.45;
            const speed = 0.35 + Math.random() * 0.55;
            const angle = Math.PI / 2 + (Math.random() - 0.5) * spread;
            return {
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: 0.9 + Math.random() * 1.1,
                life: 1,
                decay: 0.0016 + Math.random() * 0.0025,
                phase: 'fall',
                targetX: null,
            };
        };

        const inSlit = (x: number) =>
            Math.abs(x - slit1cx) < slitHw || Math.abs(x - slit2cx) < slitHw;

        const slitTarget = (x: number) => {
            const d1 = Math.abs(x - slit1cx);
            const d2 = Math.abs(x - slit2cx);
            return d1 < d2 ? W * TARGET_LEFT_FRAC : W * TARGET_RIGHT_FRAC;
        };

        const update = () => {
            if (mouseInHero && mouseY < lineY - 10 && particles.length < MAX_PARTICLES) {
                const n = 2 + Math.floor(Math.random() * 2);
                for (let i = 0; i < n; i++) {
                    particles.push(
                        spawn(
                            mouseX + (Math.random() - 0.5) * 14,
                            mouseY + (Math.random() - 0.5) * 8,
                        ),
                    );
                }
            }

            // ambient idle drizzle when no mouse engagement
            if (!mouseInHero && frameCount % 8 === 0 && particles.length < 60) {
                particles.push(
                    spawn(W * (0.1 + Math.random() * 0.8), 60 + Math.random() * (lineY - 120)),
                );
            }

            const alive: Particle[] = [];
            for (const p of particles) {
                p.life -= p.decay;
                if (p.life <= 0.01 || p.y > H + 30) continue;

                if (p.phase === 'fall') {
                    p.vy = Math.min(p.vy + 0.012, 2.0);
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.y >= lineY) {
                        if (inSlit(p.x)) {
                            p.phase = 'through';
                            p.targetX = slitTarget(p.x);
                        } else {
                            p.y = lineY;
                            p.vx = 0;
                            p.vy = 0;
                            p.decay = 0.04;
                            p.phase = 'blocked';
                        }
                    }
                } else if (p.phase === 'through') {
                    if (p.targetX !== null) {
                        const dx = p.targetX - p.x;
                        p.vx += dx * 0.005;
                        p.vx *= 0.91;
                    }
                    p.vy = Math.min(p.vy + 0.025, 3);
                    p.x += p.vx;
                    p.y += p.vy;
                }
                // 'blocked' particles just sit and fade

                alive.push(p);
            }
            particles = alive;
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // Slit line: solid green with two gaps
            ctx.save();
            ctx.strokeStyle = `rgb(${accentRgb})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = `rgb(${accentRgb})`;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(slit1cx - slitHw, lineY);
            ctx.moveTo(slit1cx + slitHw, lineY);
            ctx.lineTo(slit2cx - slitHw, lineY);
            ctx.moveTo(slit2cx + slitHw, lineY);
            ctx.lineTo(W, lineY);
            ctx.stroke();
            ctx.restore();

            // Mouse cursor glow
            if (mouseInHero && mouseY < lineY) {
                const mg = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 24);
                mg.addColorStop(0, `rgba(${accentRgb},0.18)`);
                mg.addColorStop(0.5, `rgba(${accentRgb},0.05)`);
                mg.addColorStop(1, `rgba(${accentRgb},0)`);
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 24, 0, Math.PI * 2);
                ctx.fillStyle = mg;
                ctx.fill();
            }

            // Particles
            for (const p of particles) {
                const a = Math.max(0, p.life);
                const colorRgb = p.phase === 'through' ? throughRgb : accentRgb;
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.5);
                g.addColorStop(0, `rgba(${colorRgb},${a * 0.75})`);
                g.addColorStop(0.45, `rgba(${colorRgb},${a * 0.2})`);
                g.addColorStop(1, `rgba(${colorRgb},0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colorRgb},${a})`;
                ctx.fill();
            }
        };

        const drawStaticLine = () => {
            ctx.clearRect(0, 0, W, H);
            ctx.save();
            ctx.strokeStyle = `rgb(${accentRgb})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = `rgb(${accentRgb})`;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(slit1cx - slitHw, lineY);
            ctx.moveTo(slit1cx + slitHw, lineY);
            ctx.lineTo(slit2cx - slitHw, lineY);
            ctx.moveTo(slit2cx + slitHw, lineY);
            ctx.lineTo(W, lineY);
            ctx.stroke();
            ctx.restore();
        };

        const loop = () => {
            frameCount++;
            update();
            draw();
            raf = requestAnimationFrame(loop);
        };

        const stopAnimation = () => {
            if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
            particles = [];
        };

        const refreshMode = () => {
            stopAnimation();
            resize();
            if (mobileMql.matches) {
                // Below mobile breakpoint the fork stacks vertically — the
                // double-slit metaphor doesn't apply. Hide the canvas entirely.
                canvas.style.display = 'none';
                return;
            }
            canvas.style.display = 'block';
            if (reduceMotionMql.matches) {
                // Honor prefers-reduced-motion: draw the slit line as a static
                // graphic and skip particle simulation.
                drawStaticLine();
                return;
            }
            loop();
        };

        const refreshAccent = () => {
            accentRgb = readAccentRgb();
            throughRgb = computeThroughRgb(accentRgb);
            if (reduceMotionMql.matches) drawStaticLine();
        };

        const ro = new ResizeObserver(refreshMode);
        ro.observe(root);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);

        // Theme change reactivity: re-read --accent when html[data-theme]
        // toggles, or when prefers-color-scheme flips.
        const themeObserver = new MutationObserver(refreshAccent);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        const colorSchemeMql = window.matchMedia('(prefers-color-scheme: dark)');
        const onSchemeChange = () => refreshAccent();
        colorSchemeMql.addEventListener('change', onSchemeChange);

        const onMotionChange = () => refreshMode();
        const onMobileChange = () => refreshMode();
        reduceMotionMql.addEventListener('change', onMotionChange);
        mobileMql.addEventListener('change', onMobileChange);

        refreshMode();

        return () => {
            stopAnimation();
            ro.disconnect();
            themeObserver.disconnect();
            colorSchemeMql.removeEventListener('change', onSchemeChange);
            reduceMotionMql.removeEventListener('change', onMotionChange);
            mobileMql.removeEventListener('change', onMobileChange);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <div ref={wrapRef} className="double-slit-field" aria-hidden>
            <canvas ref={canvasRef} />
        </div>
    );
}

function brightenRgb(rgb: string, amount: number): string {
    const parts = rgb.split(',').map((v) => parseInt(v.trim(), 10));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return rgb;
    const lift = (n: number) =>
        Math.max(0, Math.min(255, Math.round(n + (255 - n) * amount)));
    return `${lift(parts[0])},${lift(parts[1])},${lift(parts[2])}`;
}

function darkenRgb(rgb: string, amount: number): string {
    const parts = rgb.split(',').map((v) => parseInt(v.trim(), 10));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return rgb;
    const drop = (n: number) =>
        Math.max(0, Math.min(255, Math.round(n * (1 - amount))));
    return `${drop(parts[0])},${drop(parts[1])},${drop(parts[2])}`;
}

function relativeLuminance(rgb: string): number {
    const parts = rgb.split(',').map((v) => parseInt(v.trim(), 10));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return 0;
    const [r, g, b] = parts.map((n) => {
        const c = n / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexOrColorToRgb(input: string): string {
    const trimmed = input.trim();
    if (trimmed.startsWith('#')) {
        const hex = trimmed.slice(1);
        const full = hex.length === 3
            ? hex.split('').map((c) => c + c).join('')
            : hex;
        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);
        if ([r, g, b].every((n) => Number.isFinite(n))) return `${r},${g},${b}`;
    }
    const m = trimmed.match(/rgba?\(([^)]+)\)/i);
    if (m) {
        const parts = m[1].split(',').slice(0, 3).map((s) => s.trim());
        return parts.join(',');
    }
    return '34,197,94';
}
