'use client';

import { useEffect, useRef, useState } from 'react';
import { attachThemeStrokeListener } from '@/components/hero-bg/themeColor';

type Props = { active: boolean };

const BLUEPRINT_SRC = '/scott-portrait-blueprint.svg';

type Mote = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    /** 0..1 base brightness */
    a: number;
    /** independent shimmer phase */
    phase: number;
};

// Slide 1 background — vector blueprint of the portrait, edge-traced
// from the source photo via Canny + potrace. Layered over a canvas
// atmosphere (faint blueprint grid, drifting dust motes, slow vertical
// scan-line sweep) for technical-illustration depth.
export default function PortraitBackground({ active }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const activeRef = useRef(active);
    const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

    useEffect(() => {
        activeRef.current = active;
    }, [active]);

    // Fetch SVG once and inject as innerHTML — 1300+ paths in JSX
    // would inflate the bundle and re-render cost.
    useEffect(() => {
        let cancelled = false;
        fetch(BLUEPRINT_SRC)
            .then((r) => r.text())
            .then((text) => {
                if (cancelled) return;
                setSvgMarkup(text);
            })
            .catch(() => {
                /* fall through — component just renders the atmosphere */
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // Atmosphere canvas — runs independently of the SVG.
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
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0;
        let t = 0;
        let motes: Mote[] = [];

        const seedMotes = () => {
            motes = [];
            const count = Math.max(40, Math.floor((W * H) / 14000));
            for (let i = 0; i < count; i++) {
                motes.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    // Slow upward drift with mild horizontal sway
                    vx: (Math.random() - 0.5) * 0.12,
                    vy: -(0.08 + Math.random() * 0.18),
                    r: 0.4 + Math.random() * 1.4,
                    a: 0.15 + Math.random() * 0.55,
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
            seedMotes();
        };

        const drawGrid = () => {
            // Faint blueprint grid — subtle background, doesn't compete
            // with the figure.
            const cell = 60;
            ctx.strokeStyle = `rgba(${strokeRgb}, 0.04)`;
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += cell) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }
            for (let y = 0; y < H; y += cell) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }
            // Slightly brighter intersection ticks
            ctx.fillStyle = `rgba(${strokeRgb}, 0.10)`;
            for (let x = 0; x < W; x += cell) {
                for (let y = 0; y < H; y += cell) {
                    ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
                }
            }
        };

        const drawScanLine = () => {
            // Slow vertical sweep, top → bottom, 9s loop.
            const period = 9;
            const phase = (t / period) % 1;
            const y = phase * (H + 60) - 30;
            const grad = ctx.createLinearGradient(0, y - 24, 0, y + 24);
            grad.addColorStop(0, `rgba(${strokeRgb}, 0)`);
            grad.addColorStop(0.5, `rgba(${strokeRgb}, 0.10)`);
            grad.addColorStop(1, `rgba(${strokeRgb}, 0)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, y - 24, W, 48);
            // Sharper centerline
            ctx.strokeStyle = `rgba(${strokeRgb}, 0.18)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        };

        const drawMotes = () => {
            for (const m of motes) {
                if (activeRef.current) {
                    m.x += m.vx;
                    m.y += m.vy;
                    if (m.y < -10) {
                        m.y = H + 10;
                        m.x = Math.random() * W;
                    }
                    if (m.x < -10) m.x = W + 10;
                    if (m.x > W + 10) m.x = -10;
                }
                const a = m.a * (0.6 + 0.4 * Math.sin(t * 1.4 + m.phase));
                const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
                g.addColorStop(0, `rgba(${strokeRgb}, ${a})`);
                g.addColorStop(1, `rgba(${strokeRgb}, 0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `rgba(${strokeRgb}, ${a})`;
                ctx.beginPath();
                ctx.arc(m.x, m.y, Math.max(0.4, m.r * 0.5), 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const loop = () => {
            if (activeRef.current) t += 0.016;
            ctx.clearRect(0, 0, W, H);
            drawGrid();
            drawScanLine();
            drawMotes();
            raf = requestAnimationFrame(loop);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            detachTheme();
        };
    }, []);

    return (
        <div className={`portrait-bg ${active ? 'is-active' : ''}`} aria-hidden>
            <canvas ref={canvasRef} className="portrait-bg__atmosphere" />
            {svgMarkup && (
                <div
                    className="portrait-bg__figure"
                    dangerouslySetInnerHTML={{ __html: svgMarkup }}
                />
            )}
        </div>
    );
}
