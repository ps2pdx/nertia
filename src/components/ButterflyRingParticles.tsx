'use client';

import { useEffect, useRef } from 'react';

export default function ButterflyRingParticles() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, worldX: 0, worldY: 0 });
    const dragRef = useRef({
        isDragging: false,
        lastX: 0,
        lastY: 0,
        rotationX: Math.PI - Math.PI / 6,
        rotationY: Math.PI,
        velocityX: 0,
        velocityY: 0
    });
    const zoomRef = useRef({ current: 16, target: 16, velocity: 0 });  // Zoom with inertia

    useEffect(() => {
        if (!containerRef.current) return;

        let animationId: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let renderer: any = null;
        let isCleanedUp = false;

        const initScene = async () => {
            const THREE = await import('three');

            if (isCleanedUp) return;

            // Load vertex data from exported Blender mesh
            const response = await fetch('/butterfly-ring-vertices.json');
            const data = await response.json();
            const vertices: number[][] = data.vertices;

            if (isCleanedUp) return;

            const container = containerRef.current!;

            // Configuration
            const config = {
                scale: 8,  // Scale up the model
                rotationSpeed: 0.0003,
                mouseInfluenceRadius: 1.2,
                mouseStrength: 0.15,
                returnSpeed: 0.04,
            };

            // Spring green color from reference image
            const GREEN_COLOR = new THREE.Color(0x7CC82A);

            // Scene setup
            const scene = new THREE.Scene();

            // Detect color scheme for background
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            scene.background = new THREE.Color(isDark ? 0x0a0a0a : 0xffffff);

            // Camera - perpendicular angle (tilted view)
            const camera = new THREE.PerspectiveCamera(
                50,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.set(0, 6, 16);
            camera.lookAt(0, 0, 0);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            // Convert vertices to Float32Array with scaling
            const positions = new Float32Array(vertices.length * 3);
            for (let i = 0; i < vertices.length; i++) {
                positions[i * 3] = vertices[i][0] * config.scale;
                positions[i * 3 + 1] = vertices[i][1] * config.scale;
                positions[i * 3 + 2] = vertices[i][2] * config.scale;
            }

            const actualCount = vertices.length;

            // Store original positions for regrouping
            const originalPositions = new Float32Array(positions);

            // Current velocities for smooth movement
            const velocities = new Float32Array(actualCount * 3);

            // Create geometry
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            // Particle material - translucent green with glow effect
            const material = new THREE.PointsMaterial({
                color: GREEN_COLOR,
                size: 0.08,
                transparent: true,
                opacity: 0.85,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
            });

            // Create particle system
            const particles = new THREE.Points(geometry, material);

            // Add a subtle glow layer with larger, more transparent particles
            const glowGeometry = new THREE.BufferGeometry();
            glowGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));

            const glowMaterial = new THREE.PointsMaterial({
                color: GREEN_COLOR,
                size: 0.18,
                transparent: true,
                opacity: 0.1,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
            });

            const glowParticles = new THREE.Points(glowGeometry, glowMaterial);

            // Group for rotation
            const butterflyGroup = new THREE.Group();
            butterflyGroup.add(particles);
            butterflyGroup.add(glowParticles);
            scene.add(butterflyGroup);

            // Animation loop
            const animate = () => {
                if (isCleanedUp) return;
                animationId = requestAnimationFrame(animate);

                const drag = dragRef.current;
                const zoom = zoomRef.current;

                // Apply inertia to rotation
                if (!drag.isDragging) {
                    // Apply velocity with damping
                    drag.rotationX += drag.velocityX;
                    drag.rotationY += drag.velocityY;

                    // Dampen velocity (friction)
                    drag.velocityX *= 0.95;
                    drag.velocityY *= 0.95;

                    // Add subtle auto-rotation when velocity is very low
                    if (Math.abs(drag.velocityY) < 0.0001) {
                        drag.rotationY += config.rotationSpeed;
                    }
                }

                // Apply rotation
                butterflyGroup.rotation.y = drag.rotationY;
                butterflyGroup.rotation.x = drag.rotationX;

                // Apply inertia to zoom
                zoom.current += (zoom.target - zoom.current) * 0.08;
                camera.position.z = zoom.current;

                // Get position attributes
                const posAttr = geometry.attributes.position;
                const posArray = posAttr.array as Float32Array;
                const glowPosAttr = glowGeometry.attributes.position;
                const glowPosArray = glowPosAttr.array as Float32Array;

                // Mouse interaction
                const mouse = mouseRef.current;

                // Create vectors for proper 3D math
                const particleWorldPos = new THREE.Vector3();
                const particleScreenPos = new THREE.Vector3();
                const mouseWorldPos = new THREE.Vector3(mouse.worldX, mouse.worldY, 0);
                const forceDir = new THREE.Vector3();
                const inverseMatrix = new THREE.Matrix4();

                // Get inverse of group's world matrix to transform forces back to local space
                butterflyGroup.updateMatrixWorld();
                inverseMatrix.copy(butterflyGroup.matrixWorld).invert();

                for (let i = 0; i < actualCount; i++) {
                    const i3 = i * 3;

                    // Get particle local position
                    particleWorldPos.set(posArray[i3], posArray[i3 + 1], posArray[i3 + 2]);

                    // Transform to world space
                    particleWorldPos.applyMatrix4(butterflyGroup.matrixWorld);

                    // Project to screen space (just use x, y for 2D distance)
                    particleScreenPos.copy(particleWorldPos).project(camera);

                    // Mouse is already in normalized device coords (-1 to 1)
                    const dx = particleScreenPos.x - mouse.x;
                    const dy = particleScreenPos.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Apply mouse repulsion (only when not dragging)
                    // Using screen-space distance (0-2 range roughly)
                    const screenInfluenceRadius = 0.3;
                    if (!drag.isDragging && dist < screenInfluenceRadius && dist > 0.001) {
                        const force = (1 - dist / screenInfluenceRadius) * config.mouseStrength;

                        // Calculate force direction in world space (away from mouse)
                        forceDir.set(dx, dy, 0).normalize().multiplyScalar(force * 0.02);

                        // Transform force direction back to local space
                        forceDir.applyMatrix4(inverseMatrix).sub(new THREE.Vector3().applyMatrix4(inverseMatrix));

                        velocities[i3] += forceDir.x;
                        velocities[i3 + 1] += forceDir.y;
                        velocities[i3 + 2] += forceDir.z + (Math.random() - 0.5) * force * 0.01;
                    }

                    // Apply velocity
                    posArray[i3] += velocities[i3];
                    posArray[i3 + 1] += velocities[i3 + 1];
                    posArray[i3 + 2] += velocities[i3 + 2];

                    // Spring back to original position
                    const origX = originalPositions[i3];
                    const origY = originalPositions[i3 + 1];
                    const origZ = originalPositions[i3 + 2];

                    posArray[i3] += (origX - posArray[i3]) * config.returnSpeed;
                    posArray[i3 + 1] += (origY - posArray[i3 + 1]) * config.returnSpeed;
                    posArray[i3 + 2] += (origZ - posArray[i3 + 2]) * config.returnSpeed;

                    // Dampen velocity
                    velocities[i3] *= 0.94;
                    velocities[i3 + 1] *= 0.94;
                    velocities[i3 + 2] *= 0.94;

                    // Sync glow particles
                    glowPosArray[i3] = posArray[i3];
                    glowPosArray[i3 + 1] = posArray[i3 + 1];
                    glowPosArray[i3 + 2] = posArray[i3 + 2];
                }

                posAttr.needsUpdate = true;
                glowPosAttr.needsUpdate = true;

                renderer.render(scene, camera);
            };

            // Event handlers
            const onResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            // For proper mouse-to-world mapping
            const raycaster = new THREE.Raycaster();
            const mouseVec = new THREE.Vector2();
            const intersectPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const intersectPoint = new THREE.Vector3();

            const onMouseMove = (e: MouseEvent) => {
                // Normalize mouse position
                mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

                // Use raycaster to find world position on the object's plane
                mouseVec.set(mouseRef.current.x, mouseRef.current.y);
                raycaster.setFromCamera(mouseVec, camera);

                // Intersect with a plane at z=0 (where object center is)
                if (raycaster.ray.intersectPlane(intersectPlane, intersectPoint)) {
                    mouseRef.current.worldX = intersectPoint.x;
                    mouseRef.current.worldY = intersectPoint.y;
                }

                // Handle drag rotation with velocity tracking
                const drag = dragRef.current;
                if (drag.isDragging) {
                    const deltaX = e.clientX - drag.lastX;
                    const deltaY = e.clientY - drag.lastY;

                    // Apply rotation
                    drag.rotationY += deltaX * 0.005;
                    drag.rotationX += deltaY * 0.005;

                    // Store velocity for inertia
                    drag.velocityY = deltaX * 0.005;
                    drag.velocityX = deltaY * 0.005;

                    drag.lastX = e.clientX;
                    drag.lastY = e.clientY;
                }
            };

            const onMouseDown = (e: MouseEvent) => {
                dragRef.current.isDragging = true;
                dragRef.current.lastX = e.clientX;
                dragRef.current.lastY = e.clientY;
            };

            const onMouseUp = () => {
                dragRef.current.isDragging = false;
            };

            const onWheel = (e: WheelEvent) => {
                e.preventDefault();
                const zoom = zoomRef.current;
                zoom.target += e.deltaY * 0.02;
                // Clamp zoom target
                zoom.target = Math.max(5, Math.min(40, zoom.target));
            };

            window.addEventListener('resize', onResize);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mouseup', onMouseUp);
            renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

            animate();

            return () => {
                window.removeEventListener('resize', onResize);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mousedown', onMouseDown);
                window.removeEventListener('mouseup', onMouseUp);
                renderer.domElement.removeEventListener('wheel', onWheel);
            };
        };

        initScene();

        const container = containerRef.current;
        return () => {
            isCleanedUp = true;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (renderer) {
                if (renderer.domElement && container?.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
                renderer.dispose();
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0 }}
        />
    );
}
