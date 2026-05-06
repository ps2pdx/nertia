'use client';

import { useEffect, useRef } from 'react';
import { attachThemeStrokeListener } from '@/components/hero-bg/themeColor';

type Props = { active: boolean };

// All-seeing eye floating inside a triangle — rendered as a monochrome
// line drawing with subtle 3D rotation, matching the wireframe aesthetic
// of the grid and topo slides. Strokes only (no fills) except for the
// pupil dot. Triangle gently tumbles around its Y axis; the eye drifts
// inside and the pupil saccades to new directions.
export default function EyeBackground({ active }: Props) {
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

        // Theme-reactive monochrome palette derived from --fg, so the
        // strokes flip to dark on light mode without losing contrast.
        let strokeRgb = '180, 220, 230';
        const detachTheme = attachThemeStrokeListener('--fg', '180, 220, 230', (rgb) => {
            strokeRgb = rgb;
        });
        const STROKE_BASE = () => `rgba(${strokeRgb}, 0.55)`;
        const STROKE_FAINT = () => `rgba(${strokeRgb}, 0.18)`;
        const STROKE_BRIGHT = () => `rgba(${strokeRgb}, 0.95)`;

        let W = 0;
        let H = 0;
        let raf = 0;
        let t = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Triangle
        let triCx = 0;
        let triCy = 0;
        let triSize = 0;

        // Eye drift inside the triangle
        let eyeX = 0;
        let eyeY = 0;
        let eyeTargetX = 0;
        let eyeTargetY = 0;
        let nextEyeMove = 0;
        let eyeWidth = 90;
        let eyeHeight = 50;

        // Pupil saccade
        let pupilOffX = 0;
        let pupilOffY = 0;
        let pupilTargetX = 0;
        let pupilTargetY = 0;
        let nextPupilMove = 0;

        // Blink
        let blinkPhase = 1;
        let nextBlink = 4;
        let blinkProgress = -1;

        const resize = () => {
            const rect = parent.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas.width = Math.floor(W * dpr);
            canvas.height = Math.floor(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            triCx = W * 0.72;
            triCy = H * 0.5;
            triSize = Math.min(W * 0.5, H * 0.85);

            eyeWidth = Math.min(110, triSize * 0.18);
            eyeHeight = eyeWidth * 0.55;

            eyeX = triCx;
            eyeY = triCy;
            eyeTargetX = triCx;
            eyeTargetY = triCy;
            nextEyeMove = 0;
            nextPupilMove = 0;
            nextBlink = t + 3;
        };

        const pickEyeTarget = () => {
            const drift = triSize * 0.15;
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * drift;
            eyeTargetX = triCx + Math.cos(angle) * dist;
            eyeTargetY = triCy + Math.sin(angle) * dist - drift * 0.1;
        };

        const pickPupilTarget = () => {
            const max = eyeWidth * 0.20;
            const angle = Math.random() * Math.PI * 2;
            const r = (0.4 + Math.random() * 0.6) * max;
            pupilTargetX = Math.cos(angle) * r;
            pupilTargetY = Math.sin(angle) * r * 0.6;
        };

        // Draw a regular triangle (point up) of the given outer radius.
        const trianglePath = (r: number) => {
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const px = Math.cos(a) * r;
                const py = Math.sin(a) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
        };

        const drawTriangle = () => {
            // 3D feel: scaleX via cos of a slow Y-axis rotation. Never fully
            // edge-on (clamped) so the triangle stays readable.
            const rotY = Math.sin(t * 0.22) * 0.55;
            const scaleX = Math.cos(rotY) * 0.85 + 0.15;
            const tilt = Math.sin(t * 0.13) * 0.04;
            const r = triSize / 2;

            ctx.save();
            ctx.translate(triCx, triCy);
            ctx.rotate(tilt);
            ctx.scale(scaleX, 1);

            // Outer triangle
            ctx.strokeStyle = STROKE_BASE();
            ctx.lineWidth = 1.5;
            trianglePath(r);
            ctx.stroke();

            // Concentric inner triangles for depth (line-drawing schematic)
            ctx.strokeStyle = STROKE_FAINT();
            ctx.lineWidth = 1;
            trianglePath(r * 0.78);
            ctx.stroke();
            trianglePath(r * 0.56);
            ctx.stroke();

            // Vertex markers — tiny perpendicular ticks at each corner
            ctx.strokeStyle = STROKE_BASE();
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const vx = Math.cos(a) * r;
                const vy = Math.sin(a) * r;
                ctx.beginPath();
                ctx.arc(vx, vy, 2.5, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        };

        const drawEye = () => {
            ctx.save();
            ctx.translate(eyeX, eyeY);

            const lidH = eyeHeight * Math.max(0.02, blinkPhase);

            // Almond outline
            ctx.strokeStyle = STROKE_BASE();
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(0, 0, eyeWidth, lidH, 0, 0, Math.PI * 2);
            ctx.stroke();

            if (blinkPhase > 0.2) {
                // Iris circle (line only)
                const irisR = Math.min(eyeWidth * 0.32, lidH * 0.95);
                const px = pupilOffX;
                const py = pupilOffY;

                ctx.save();
                // Clip iris drawing to the lid so it doesn't escape on a blink
                ctx.beginPath();
                ctx.ellipse(0, 0, eyeWidth - 1, lidH - 1, 0, 0, Math.PI * 2);
                ctx.clip();

                ctx.strokeStyle = STROKE_BASE();
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(px, py, irisR, 0, Math.PI * 2);
                ctx.stroke();

                // Concentric inner ring
                ctx.strokeStyle = STROKE_FAINT();
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.arc(px, py, irisR * 0.6, 0, Math.PI * 2);
                ctx.stroke();

                // Pupil — solid dot
                ctx.beginPath();
                ctx.arc(px, py, irisR * 0.32, 0, Math.PI * 2);
                ctx.fillStyle = STROKE_BRIGHT();
                ctx.fill();

                ctx.restore();
            }

            // Sight line (horizontal axis through the eye) — schematic touch
            if (blinkPhase > 0.6) {
                ctx.strokeStyle = STROKE_FAINT();
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(-eyeWidth * 1.4, 0);
                ctx.lineTo(-eyeWidth, 0);
                ctx.moveTo(eyeWidth, 0);
                ctx.lineTo(eyeWidth * 1.4, 0);
                ctx.stroke();
            }

            ctx.restore();
        };

        const draw = () => {
            if (activeRef.current) t += 0.016;

            // Transparent canvas — let the page background show through to
            // match the grid/topo slides.
            ctx.clearRect(0, 0, W, H);

            // Eye drift
            if (t > nextEyeMove) {
                pickEyeTarget();
                nextEyeMove = t + 2 + Math.random() * 2;
            }
            eyeX += (eyeTargetX - eyeX) * 0.022;
            eyeY += (eyeTargetY - eyeY) * 0.022;

            // Pupil saccade
            if (t > nextPupilMove) {
                pickPupilTarget();
                nextPupilMove = t + 0.6 + Math.random() * 1.2;
            }
            pupilOffX += (pupilTargetX - pupilOffX) * 0.22;
            pupilOffY += (pupilTargetY - pupilOffY) * 0.22;

            // Blink
            if (blinkProgress < 0 && t > nextBlink) {
                blinkProgress = 0;
                nextBlink = t + 4 + Math.random() * 4;
            }
            if (blinkProgress >= 0) {
                blinkProgress += 0.07;
                if (blinkProgress < 0.5) {
                    blinkPhase = 1 - blinkProgress * 2;
                } else if (blinkProgress < 1) {
                    blinkPhase = (blinkProgress - 0.5) * 2;
                } else {
                    blinkPhase = 1;
                    blinkProgress = -1;
                }
            }

            drawTriangle();
            drawEye();

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
