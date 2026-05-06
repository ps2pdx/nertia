'use client';

import { useEffect, useRef } from 'react';

type Props = { active: boolean };

// All-seeing eye floating inside a triangle. The eye drifts around the
// interior of the triangle while the pupil darts to new directions
// (saccadic eye movement), with the occasional blink. Mood: deep purple
// vignette, cyan triangle outline, emerald iris.
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

        // Pupil direction within the iris
        let pupilOffX = 0;
        let pupilOffY = 0;
        let pupilTargetX = 0;
        let pupilTargetY = 0;
        let nextPupilMove = 0;

        // Blink state
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

            // Position the triangle in the right portion of the hero so it
            // doesn't fight with the left-aligned headline.
            triCx = W * 0.72;
            triCy = H * 0.5;
            triSize = Math.min(W * 0.5, H * 0.85);

            // Eye scales with triangle but stays modest enough to leave room
            // for drift.
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
            // Random point inside the triangle's safe interior.
            // Use the centroid + a bounded random offset.
            const drift = triSize * 0.16;
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * drift;
            eyeTargetX = triCx + Math.cos(angle) * dist;
            // Bias slightly upward so the eye stays inside the wedge of the
            // upward-pointing triangle.
            eyeTargetY = triCy + Math.sin(angle) * dist - drift * 0.15;
        };

        const pickPupilTarget = () => {
            // Direction vector inside the iris.
            const max = eyeWidth * 0.20;
            const angle = Math.random() * Math.PI * 2;
            const r = (0.4 + Math.random() * 0.6) * max;
            pupilTargetX = Math.cos(angle) * r;
            pupilTargetY = Math.sin(angle) * r * 0.6; // squash vertically (eye is wide)
        };

        const drawTriangle = () => {
            const rot = Math.sin(t * 0.15) * 0.04;
            const r = triSize / 2;

            ctx.save();
            ctx.translate(triCx, triCy);
            ctx.rotate(rot);

            // Faint inner glow fill
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
            grad.addColorStop(0, 'rgba(34, 211, 238, 0.05)');
            grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const px = Math.cos(a) * r;
                const py = Math.sin(a) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();

            // Outline
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = 'rgba(34, 211, 238, 0.5)';
            ctx.shadowBlur = 10;
            ctx.stroke();

            // Inner geometric flourish — concentric inverted triangle
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.18)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            const ir = r * 0.66;
            for (let i = 0; i < 3; i++) {
                const a = (i / 3) * Math.PI * 2 + Math.PI / 2;
                const px = Math.cos(a) * ir;
                const py = Math.sin(a) * ir;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        };

        const drawEye = () => {
            ctx.save();
            ctx.translate(eyeX, eyeY);

            // Sclera (almond shape) — squashed vertically by blinkPhase
            const lidH = eyeHeight * Math.max(0.02, blinkPhase);
            ctx.beginPath();
            ctx.ellipse(0, 0, eyeWidth, lidH, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(240, 240, 232, 0.92)';
            ctx.fill();

            // Clip iris/pupil to the eye shape so the iris doesn't extend
            // beyond the lid when partially closed.
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, eyeWidth - 1, lidH - 1, 0, 0, Math.PI * 2);
            ctx.clip();

            if (blinkPhase > 0.15) {
                const irisR = eyeWidth * 0.26;
                const px = pupilOffX;
                const py = pupilOffY;

                // Iris radial — emerald
                const irisGrad = ctx.createRadialGradient(px, py, 0, px, py, irisR);
                irisGrad.addColorStop(0, 'rgba(60, 220, 130, 0.95)');
                irisGrad.addColorStop(0.55, 'rgba(20, 140, 75, 0.92)');
                irisGrad.addColorStop(1, 'rgba(8, 60, 30, 0.95)');
                ctx.beginPath();
                ctx.arc(px, py, irisR, 0, Math.PI * 2);
                ctx.fillStyle = irisGrad;
                ctx.fill();

                // Iris detail — radial striations
                ctx.strokeStyle = 'rgba(8, 60, 30, 0.35)';
                ctx.lineWidth = 0.6;
                for (let i = 0; i < 24; i++) {
                    const a = (i / 24) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(px + Math.cos(a) * irisR * 0.4, py + Math.sin(a) * irisR * 0.4);
                    ctx.lineTo(px + Math.cos(a) * irisR * 0.95, py + Math.sin(a) * irisR * 0.95);
                    ctx.stroke();
                }

                // Outer iris ring
                ctx.beginPath();
                ctx.arc(px, py, irisR, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(4, 30, 12, 0.55)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Pupil
                ctx.beginPath();
                ctx.arc(px, py, irisR * 0.42, 0, Math.PI * 2);
                ctx.fillStyle = '#000';
                ctx.fill();

                // Catchlight
                ctx.beginPath();
                ctx.arc(px - irisR * 0.30, py - irisR * 0.30, irisR * 0.12, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fill();
            }

            ctx.restore(); // unclip

            // Eyelid outline
            ctx.beginPath();
            ctx.ellipse(0, 0, eyeWidth, lidH, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.65)';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = 'rgba(34, 211, 238, 0.5)';
            ctx.shadowBlur = 6;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Subtle radiating "all-seeing" rays
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
            ctx.lineWidth = 0.8;
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * Math.PI * 2 + t * 0.05;
                const inner = eyeWidth * 1.35;
                const outer = eyeWidth * 1.85;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
                ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
                ctx.stroke();
            }

            ctx.restore();
        };

        const draw = () => {
            if (activeRef.current) t += 0.016;

            // Background — moody purple vignette
            const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
            bg.addColorStop(0, '#1a0f2e');
            bg.addColorStop(0.55, '#0a0518');
            bg.addColorStop(1, '#000000');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            // Update eye drift target every 2-4s, ease toward it.
            if (t > nextEyeMove) {
                pickEyeTarget();
                nextEyeMove = t + 2 + Math.random() * 2;
            }
            eyeX += (eyeTargetX - eyeX) * 0.022;
            eyeY += (eyeTargetY - eyeY) * 0.022;

            // Update pupil saccade every 0.6-1.8s, snappier easing.
            if (t > nextPupilMove) {
                pickPupilTarget();
                nextPupilMove = t + 0.6 + Math.random() * 1.2;
            }
            pupilOffX += (pupilTargetX - pupilOffX) * 0.22;
            pupilOffY += (pupilTargetY - pupilOffY) * 0.22;

            // Blink schedule — blink every 4-8s, ~250ms total.
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
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-bg" aria-hidden />;
}
