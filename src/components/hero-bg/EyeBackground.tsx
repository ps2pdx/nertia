'use client';

import { useEffect, useRef } from 'react';
import { attachThemeStrokeListener } from '@/components/hero-bg/themeColor';

type Props = { active: boolean };

type V3 = { x: number; y: number; z: number };

// 3D scene for slide 3:
//   • A grid of wireframe tetrahedra on a plane, fading into the distance
//   • The central pyramid is split horizontally near the top — the cap
//     hovers above, revealing a wireframe sphere (the eye) inside
//   • Eye is mouse-tracked: pupil follows the cursor; sphere drifts slowly
//   • Eyelid layer wraps the entire sphere (two latitude rings) and
//     blinks periodically by closing toward the equator
//
// All rendering is monochrome line work, --fg-derived so it reads in
// both light and dark themes.
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

        // Two-color palette: white-ish (--fg) for the pyramid grid,
        // accent-green for the eye + iris.
        let pyramidRgb = '243, 241, 236';
        let eyeRgb = '34, 197, 94';
        const detachPyramid = attachThemeStrokeListener('--fg', '243, 241, 236', (rgb) => {
            pyramidRgb = rgb;
        });
        const detachEye = attachThemeStrokeListener('--accent', '34, 197, 94', (rgb) => {
            eyeRgb = rgb;
        });

        let W = 0;
        let H = 0;
        let raf = 0;
        let t = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Mouse position in normalized canvas coords (-1..1)
        let mouseNx = 0;
        let mouseNy = 0;
        let mouseSmoothNx = 0;
        let mouseSmoothNy = 0;

        // ── 3D primitives ────────────────────────────────────────
        // Regular tetrahedron with apex at +Y, base in the XZ plane at y=-0.5
        const TET_APEX: V3 = { x: 0, y: 1, z: 0 };
        const TET_BASE: V3[] = [
            { x: Math.cos(0) * 1.0, y: -0.5, z: Math.sin(0) * 1.0 },
            { x: Math.cos(2 * Math.PI / 3) * 1.0, y: -0.5, z: Math.sin(2 * Math.PI / 3) * 1.0 },
            { x: Math.cos(4 * Math.PI / 3) * 1.0, y: -0.5, z: Math.sin(4 * Math.PI / 3) * 1.0 },
        ];

        // Cut the tetrahedron at parameter `t` along the apex→base edge
        // (t = 0 cuts at the apex, t = 1 cuts at the base). Returns the
        // frustum vertices, the cap vertices (= apex + the 3 cut points),
        // and edge lists for each.
        const buildSplitTet = (cutT: number) => {
            const lerp = (a: V3, b: V3, k: number): V3 => ({
                x: a.x + (b.x - a.x) * k,
                y: a.y + (b.y - a.y) * k,
                z: a.z + (b.z - a.z) * k,
            });
            const cuts = TET_BASE.map((b) => lerp(TET_APEX, b, 1 - cutT));
            const frustumVerts: V3[] = [...TET_BASE, ...cuts]; // 0..2 base, 3..5 cut
            const frustumEdges: [number, number][] = [
                [0, 1], [1, 2], [2, 0],     // base triangle
                [3, 4], [4, 5], [5, 3],     // top (cut) triangle
                [0, 3], [1, 4], [2, 5],     // sides
            ];
            const capVerts: V3[] = [TET_APEX, ...cuts]; // 0 apex, 1..3 cut
            const capEdges: [number, number][] = [
                [0, 1], [0, 2], [0, 3],
                [1, 2], [2, 3], [3, 1],
            ];
            return { frustumVerts, frustumEdges, capVerts, capEdges };
        };

        // Sphere wireframe: arrays of latitude rings and longitude arcs
        // in unit-radius local space. Returns small re-usable geometry.
        const buildSphere = (nLat: number, nLong: number, segPerLat: number) => {
            const latitudes: V3[][] = [];
            for (let i = 1; i < nLat; i++) {
                const phi = (i / nLat) * Math.PI;
                const y = Math.cos(phi);
                const r = Math.sin(phi);
                const ring: V3[] = [];
                for (let j = 0; j <= segPerLat; j++) {
                    const theta = (j / segPerLat) * Math.PI * 2;
                    ring.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) });
                }
                latitudes.push(ring);
            }
            const longitudes: V3[][] = [];
            for (let k = 0; k < nLong; k++) {
                const theta = (k / nLong) * Math.PI * 2;
                const arc: V3[] = [];
                for (let i = 0; i <= segPerLat; i++) {
                    const phi = (i / segPerLat) * Math.PI;
                    arc.push({
                        x: Math.sin(phi) * Math.cos(theta),
                        y: Math.cos(phi),
                        z: Math.sin(phi) * Math.sin(theta),
                    });
                }
                longitudes.push(arc);
            }
            return { latitudes, longitudes };
        };

        // Cut at 0.55 — keeps the lower frustum dominant (~55% of pyramid
        // height) while leaving the floating cap big enough to enclose
        // the eye sphere comfortably. Reads as the dollar-bill silhouette:
        // wide pyramid base below, small triangular eye-cap floating
        // detached at the top.
        const split = buildSplitTet(0.55);
        const sphere = buildSphere(8, 12, 36);

        // ── camera / projection ──────────────────────────────────
        // Tightly framed on the central pyramid + eye-cap. Camera sits
        // close, slightly to the left, roughly cap-level — places the
        // cap (and the eye inside) in the upper-right of the canvas
        // while the rest of the grid extends off into the distance.
        const camPos: V3 = { x: -0.9, y: 1.45, z: -3.4 };
        const camPitch = -0.05;          // mostly horizontal, slight down
        const fov = 4.6;                 // perspective scale

        // Project a world point to canvas coords, returning null if it's
        // behind the camera.
        const project = (v: V3): { x: number; y: number; depth: number } | null => {
            // Translate to camera-relative coords
            const tx = v.x - camPos.x;
            const ty = v.y - camPos.y;
            const tz = v.z - camPos.z;
            // Pitch (rotation around X axis)
            const cp = Math.cos(camPitch);
            const sp = Math.sin(camPitch);
            const ry = ty * cp - tz * sp;
            const rz = ty * sp + tz * cp;
            if (rz < 0.25) return null;
            const persp = fov / rz;
            return {
                x: W / 2 + tx * persp * (W / 4),
                y: H / 2 - ry * persp * (W / 4),
                depth: rz,
            };
        };

        // ── grid layout ──────────────────────────────────────────
        const GRID_RANGE = 2; // ±2 → 5×5 grid
        const GRID_SPACING = 3.6;

        type PyramidInstance = {
            offset: V3;
            scale: number;
            isCenter: boolean;
        };
        const pyramids: PyramidInstance[] = [];
        for (let xi = -GRID_RANGE; xi <= GRID_RANGE; xi++) {
            for (let zi = -GRID_RANGE; zi <= GRID_RANGE; zi++) {
                pyramids.push({
                    offset: { x: xi * GRID_SPACING, y: 0, z: zi * GRID_SPACING },
                    scale: 1,
                    isCenter: xi === 0 && zi === 0,
                });
            }
        }
        // Sort back-to-front so depth painting reads correctly
        pyramids.sort((a, b) => b.offset.z - a.offset.z);

        // ── mouse tracking ────────────────────────────────────────
        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseNx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseNy = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        };
        const onLeave = () => {
            mouseNx = 0;
            mouseNy = 0;
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);

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

        // ── draw helpers ─────────────────────────────────────────
        const transformInstance = (v: V3, off: V3, scale: number, rotY: number): V3 => {
            // Rotate around Y, then scale, then translate
            const c = Math.cos(rotY);
            const s = Math.sin(rotY);
            const rx = v.x * c + v.z * s;
            const rz = -v.x * s + v.z * c;
            return {
                x: rx * scale + off.x,
                y: v.y * scale + off.y,
                z: rz * scale + off.z,
            };
        };

        const drawEdges = (
            verts: V3[],
            edges: [number, number][],
            offset: V3,
            scale: number,
            rotY: number,
            alpha: number,
            lineWidth: number,
            rgb: string = pyramidRgb,
        ) => {
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            for (const [a, b] of edges) {
                const va = project(transformInstance(verts[a], offset, scale, rotY));
                const vb = project(transformInstance(verts[b], offset, scale, rotY));
                if (!va || !vb) continue;
                ctx.moveTo(va.x, va.y);
                ctx.lineTo(vb.x, vb.y);
            }
            ctx.stroke();
        };

        const drawPolyline = (
            poly: V3[],
            offset: V3,
            scale: number,
            rotY: number,
            alpha: number,
            lineWidth: number,
            rgb: string = eyeRgb,
        ) => {
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            let started = false;
            for (const p of poly) {
                const proj = project(transformInstance(p, offset, scale, rotY));
                if (!proj) {
                    started = false;
                    continue;
                }
                if (!started) {
                    ctx.moveTo(proj.x, proj.y);
                    started = true;
                } else {
                    ctx.lineTo(proj.x, proj.y);
                }
            }
            ctx.stroke();
        };

        // ── eye: sphere + eyelids + pupil ────────────────────────
        // Eye sits inside the floating cap (the disconnected upper
        // portion), like the Eye of Providence on the dollar bill.
        // Cap occupies y ≈ 0.325 → 1.0 in local space; eye centered
        // at y = 0.55 (lower-middle of cap) with r = 0.18 to fit
        // inside the cap's interior cross-section without touching
        // the wireframe walls.
        const EYE_OFFSET: V3 = { x: 0, y: 0.55, z: 0 };
        const EYE_RADIUS = 0.18;

        const drawEye = (instance: PyramidInstance, capHoverY: number) => {
            // Eye floats with the cap so it always sits inside the
            // disconnected upper portion regardless of hover state.
            const eyeOffset: V3 = {
                x: EYE_OFFSET.x + instance.offset.x,
                y: EYE_OFFSET.y + instance.offset.y + capHoverY,
                z: EYE_OFFSET.z + instance.offset.z,
            };

            // Slow auto-rotation around Y for visual life
            const autoRot = t * 0.05;

            // Sphere wireframe (eye uses accent-green)
            for (const ring of sphere.latitudes) {
                drawPolyline(ring, eyeOffset, EYE_RADIUS * instance.scale, autoRot, 0.45, 1, eyeRgb);
            }
            for (const arc of sphere.longitudes) {
                drawPolyline(arc, eyeOffset, EYE_RADIUS * instance.scale, autoRot, 0.32, 0.9, eyeRgb);
            }

            // Blink: 0 = open, 1 = closed. Smoothly increases for ~250ms
            // every ~5-9 seconds, then back.
            const blinkPhase = (Math.sin(t * 0.6) + 1) / 2;
            const blinkBurst =
                blinkPhase > 0.985
                    ? Math.sin((blinkPhase - 0.985) / 0.015 * Math.PI)
                    : 0;
            const lidOpening = 0.55 - blinkBurst * 0.5; // y span of eyelid opening

            // Eyelid rings — two latitude rings at +lidOpening and
            // -lidOpening, drawn brighter to read as the lid edge.
            const lidRing = (yWorld: number, alpha: number) => {
                const localY = yWorld; // already in unit sphere space
                if (Math.abs(localY) > 1) return;
                const r = Math.sqrt(1 - localY * localY);
                const seg = 36;
                const ring: V3[] = [];
                for (let j = 0; j <= seg; j++) {
                    const th = (j / seg) * Math.PI * 2;
                    ring.push({ x: r * Math.cos(th), y: localY, z: r * Math.sin(th) });
                }
                drawPolyline(ring, eyeOffset, EYE_RADIUS * instance.scale, 0, alpha, 1.4, eyeRgb);
            };
            lidRing(lidOpening, 0.95);
            lidRing(-lidOpening, 0.95);

            // Iris/pupil — positioned on sphere surface in the direction
            // the eye is "looking" (toward smoothed mouse). Constrained
            // within the eyelid opening so it can't wander above/below.
            const lookX = mouseSmoothNx;
            const lookYRaw = -mouseSmoothNy * 0.7; // dampen vertical
            const lookY = Math.max(
                -lidOpening * 0.85,
                Math.min(lidOpening * 0.85, lookYRaw),
            );
            // Project (lookX, lookY) onto unit sphere — solve for z so
            // |(x,y,z)|=1, picking the front-facing solution (+z relative
            // to camera, which after camera rotation is small +z in world).
            const lensXY = lookX * lookX + lookY * lookY;
            const lookZ = lensXY < 1 ? -Math.sqrt(1 - lensXY) : 0; // -z front
            const irisLocal: V3 = { x: lookX, y: lookY, z: lookZ };
            const irisWorld = transformInstance(
                {
                    x: irisLocal.x * EYE_RADIUS,
                    y: irisLocal.y * EYE_RADIUS,
                    z: irisLocal.z * EYE_RADIUS,
                },
                eyeOffset,
                instance.scale,
                0,
            );
            const irisProj = project(irisWorld);
            if (irisProj && blinkBurst < 0.95) {
                // Iris scales with the (smaller) eye sphere — was 18,
                // now ~8 to stay proportional to EYE_RADIUS = 0.18.
                const irisR = 8 * (fov / irisProj.depth) * instance.scale;
                const pupilR = irisR * 0.45;

                // Iris ring
                ctx.strokeStyle = `rgba(${eyeRgb}, 0.95)`;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.arc(irisProj.x, irisProj.y, irisR, 0, Math.PI * 2);
                ctx.stroke();

                // Iris striations — short ticks pointing inward
                ctx.strokeStyle = `rgba(${eyeRgb}, 0.45)`;
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                for (let i = 0; i < 16; i++) {
                    const a = (i / 16) * Math.PI * 2;
                    ctx.moveTo(
                        irisProj.x + Math.cos(a) * (pupilR + 2),
                        irisProj.y + Math.sin(a) * (pupilR + 2),
                    );
                    ctx.lineTo(
                        irisProj.x + Math.cos(a) * (irisR - 1),
                        irisProj.y + Math.sin(a) * (irisR - 1),
                    );
                }
                ctx.stroke();

                // Pupil — solid dot (deeper green for contrast against iris)
                ctx.beginPath();
                ctx.arc(irisProj.x, irisProj.y, pupilR, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(8, 80, 40, 1)`;
                ctx.fill();

                // Catchlight
                ctx.beginPath();
                ctx.arc(
                    irisProj.x - pupilR * 0.4,
                    irisProj.y - pupilR * 0.4,
                    pupilR * 0.25,
                    0, Math.PI * 2,
                );
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.fill();
            }
        };

        // ── main loop ────────────────────────────────────────────
        const loop = () => {
            if (activeRef.current) t += 0.012;

            // Smooth mouse → eye look direction
            mouseSmoothNx += (mouseNx - mouseSmoothNx) * 0.06;
            mouseSmoothNy += (mouseNy - mouseSmoothNy) * 0.06;

            ctx.clearRect(0, 0, W, H);

            // Cap hover offset for the center pyramid — slow up/down
            const capHoverY = 0.18 + Math.sin(t * 0.5) * 0.12;

            for (const inst of pyramids) {
                // Distance fade — farther pyramids are dimmer
                const depth = inst.offset.z - camPos.z;
                const fade = Math.max(0.18, Math.min(0.95, 8 / depth));

                if (inst.isCenter) {
                    // Frustum (lower portion) — drawn first so it sits
                    // behind the cap + eye in painter order.
                    drawEdges(
                        split.frustumVerts,
                        split.frustumEdges,
                        inst.offset,
                        inst.scale,
                        0,
                        fade * 0.85,
                        1.3,
                    );
                    // Eye inside the cap — drawn before the cap so the
                    // cap's wireframe overlays the eye, reinforcing
                    // "eye enclosed in cap" reading.
                    drawEye(inst, capHoverY);
                    // Cap (apex portion), hovering above the frustum
                    const capOffset: V3 = {
                        x: inst.offset.x,
                        y: inst.offset.y + capHoverY,
                        z: inst.offset.z,
                    };
                    drawEdges(
                        split.capVerts,
                        split.capEdges,
                        capOffset,
                        inst.scale,
                        0,
                        fade * 0.7,
                        1.0,
                    );
                } else {
                    // Surrounding pyramids: full tetrahedron, no split
                    const verts: V3[] = [TET_APEX, ...TET_BASE];
                    const edges: [number, number][] = [
                        [0, 1], [0, 2], [0, 3],
                        [1, 2], [2, 3], [3, 1],
                    ];
                    drawEdges(verts, edges, inst.offset, inst.scale, 0, fade * 0.6, 0.9);
                }
            }

            raf = requestAnimationFrame(loop);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            detachPyramid();
            detachEye();
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-bg" aria-hidden />;
}
