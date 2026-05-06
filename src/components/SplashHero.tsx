'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
    onDismiss: () => void;
};

const SPLASH_DURATION = 7000;
const FADE_OUT_MS = 800;
const SLIT_W = 36;
const SLIT_OFFSET_PX = 32;
const MAX_PARTICLES = 360;
const WALL_RGB = '34, 211, 238';
const ACCENT_RGB = '34, 197, 94';
const THROUGH_RGB = '120, 230, 120';

type Phase = 'fall' | 'through' | 'blocked';

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    life: number;
    decay: number;
    phase: Phase;
    side?: 'left' | 'right';
};

export default function SplashHero({ onDismiss }: Props) {
    const [fading, setFading] = useState(false);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const emitterRef = useRef<HTMLSpanElement | null>(null);

    // Auto-dismiss timer + reduced-motion guard
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ttl = reduce ? 1500 : SPLASH_DURATION;
        const t = window.setTimeout(() => {
            setFading(true);
            window.setTimeout(onDismiss, FADE_OUT_MS);
        }, ttl);
        return () => window.clearTimeout(t);
    }, [onDismiss]);

    const skip = () => {
        if (fading) return;
        setFading(true);
        window.setTimeout(onDismiss, FADE_OUT_MS);
    };

    // Canvas sim — emits from the bottom of the I, falls through two slits
    // centered under it, particles either pass through or stop at the wall.
    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let W = 0;
        let H = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let emitterX = 0;
        let emitterY = 0;
        let lineY = 0;
        let slit1cx = 0;
        let slit2cx = 0;
        const slitHw = SLIT_W / 2;
        let particles: Particle[] = [];
        let frameCount = 0;
        let raf = 0;

        const findEmitter = () => {
            const wrapRect = wrap.getBoundingClientRect();
            const el = emitterRef.current;
            if (el) {
                const rect = el.getBoundingClientRect();
                emitterX = rect.left + rect.width / 2 - wrapRect.left;
                emitterY = rect.bottom - wrapRect.top - 1;
            } else {
                emitterX = W * 0.5;
                emitterY = H * 0.6;
            }
            slit1cx = emitterX - SLIT_OFFSET_PX;
            slit2cx = emitterX + SLIT_OFFSET_PX;
        };

        const resize = () => {
            const rect = wrap.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas.width = Math.floor(W * dpr);
            canvas.height = Math.floor(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // Slit line low in the splash viewport — emitter is in the
            // subtitle area, so we need fall room beneath it.
            lineY = H * 0.86;
            findEmitter();
            particles = [];
        };

        const spawn = (): Particle => {
            const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
            const speed = 0.45 + Math.random() * 0.55;
            return {
                x: emitterX + (Math.random() - 0.5) * 6,
                y: emitterY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: 0.9 + Math.random() * 1.0,
                life: 1,
                decay: 0.0014 + Math.random() * 0.0014,
                phase: 'fall',
            };
        };

        const inSlit = (x: number) =>
            Math.abs(x - slit1cx) < slitHw || Math.abs(x - slit2cx) < slitHw;

        const update = () => {
            if (frameCount % 3 === 0 && particles.length < MAX_PARTICLES) {
                particles.push(spawn());
                if (Math.random() < 0.5 && particles.length < MAX_PARTICLES) {
                    particles.push(spawn());
                }
            }

            const alive: Particle[] = [];
            for (const p of particles) {
                p.life -= p.decay;
                if (p.life <= 0.01 || p.y > H + 30) continue;

                if (p.phase === 'fall') {
                    p.vy = Math.min(p.vy + 0.022, 3);
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.y >= lineY) {
                        if (inSlit(p.x)) {
                            p.phase = 'through';
                            p.side = p.x < emitterX ? 'left' : 'right';
                        } else {
                            p.y = lineY;
                            p.vx = 0;
                            p.vy = 0;
                            p.decay = 0.05;
                            p.phase = 'blocked';
                        }
                    }
                } else if (p.phase === 'through') {
                    // Diverge toward outer corner
                    p.vx += p.side === 'left' ? -0.025 : 0.025;
                    p.vy = Math.min(p.vy + 0.025, 3.4);
                    p.vx *= 0.96;
                    p.x += p.vx;
                    p.y += p.vy;
                }
                alive.push(p);
            }
            particles = alive;
        };

        const drawSlit = () => {
            ctx.save();
            ctx.strokeStyle = `rgb(${WALL_RGB})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = `rgb(${WALL_RGB})`;
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
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            drawSlit();

            // Emitter glow under the I
            const eg = ctx.createRadialGradient(emitterX, emitterY, 0, emitterX, emitterY, 20);
            eg.addColorStop(0, `rgba(${ACCENT_RGB}, 0.32)`);
            eg.addColorStop(0.5, `rgba(${ACCENT_RGB}, 0.08)`);
            eg.addColorStop(1, `rgba(${ACCENT_RGB}, 0)`);
            ctx.beginPath();
            ctx.arc(emitterX, emitterY, 20, 0, Math.PI * 2);
            ctx.fillStyle = eg;
            ctx.fill();

            for (const p of particles) {
                const a = Math.max(0, p.life);
                const colorRgb =
                    p.phase === 'through' ? THROUGH_RGB :
                    p.phase === 'blocked' ? WALL_RGB :
                    ACCENT_RGB;
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.5);
                g.addColorStop(0, `rgba(${colorRgb}, ${a * 0.75})`);
                g.addColorStop(0.45, `rgba(${colorRgb}, ${a * 0.2})`);
                g.addColorStop(1, `rgba(${colorRgb}, 0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colorRgb}, ${a})`;
                ctx.fill();
            }
        };

        const loop = () => {
            frameCount++;
            update();
            draw();
            raf = requestAnimationFrame(loop);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(wrap);
        resize();

        if (reduceMotion) {
            // Static slit line, no particles
            drawSlit();
        } else {
            loop();
        }

        // Re-anchor emitter once webfonts have loaded (the I shifts slightly)
        if (document.fonts && typeof document.fonts.ready?.then === 'function') {
            document.fonts.ready.then(() => findEmitter()).catch(() => {});
        }

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    return (
        <div
            ref={wrapRef}
            className={`splash-hero ${fading ? 'is-fading' : ''}`}
            onClick={skip}
            role="presentation"
        >
            <canvas ref={canvasRef} className="splash-hero__canvas" aria-hidden />
            <div className="splash-hero__content">
                <div className="home-hero__eyebrow">
                    <span className="home-hero__bracket">[ NERTIA ]</span>
                    <span className="home-hero__rule" aria-hidden />
                    <span className="home-hero__role">PMM × AI-GTM × FULL-STACK</span>
                </div>
                <h1 className="home-hero__title splash-hero__title">
                    FRAMEWORKS<br />
                    <span className="home-hero__title-muted">FOR </span>
                    <span className="home-hero__title-mark">
                        PROPULSION<span className="home-hero__title-dot">.</span>
                    </span>
                </h1>
                <p className="home-hero__sub">
                    Applied AI GTM pipelines, brand systems, and production code automation.
                    Designed universally. Built in Portland<span ref={emitterRef} className="home-hero__sub-emitter">.</span>
                </p>
            </div>
            <button
                type="button"
                className="splash-hero__skip"
                onClick={(e) => {
                    e.stopPropagation();
                    skip();
                }}
                aria-label="Skip intro"
            >
                Skip ↓
            </button>
        </div>
    );
}
