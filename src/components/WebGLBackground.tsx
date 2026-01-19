'use client';

import { useEffect, useRef } from 'react';

export default function WebGLBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        let animationId: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let renderer: any = null;
        let isCleanedUp = false;

        const initScene = async () => {
            const THREE = await import('three');

            if (isCleanedUp) return;

            const container = containerRef.current!;
            let time = 0;

            const config = {
                surfaceSegments: 120,
                surfaceSize: 80,
                amplitude: 2.5,
                frequency: 0.12,
                speed: 0.0006,
                cameraHeight: 12,
                cameraDistance: 30,
                cameraAngle: 0.35,
            };

            // Detect color scheme
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // Color palette - adapts to theme
            const palette = isDark ? {
                background: 0x0a0a0a,
                surface: 0x08080c,
                gridPrimary: 0x1a1a2e,
                gridSecondary: 0x0f0f1a,
                lineHighlight: 0x2d2d4a,
                accent: 0x22c55e,
            } : {
                background: 0xffffff,
                surface: 0xf8f8fc,
                gridPrimary: 0xe0e0e8,
                gridSecondary: 0xf0f0f5,
                lineHighlight: 0xd0d0e0,
                accent: 0x22c55e,
            };

            // Scene
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(palette.background);
            scene.fog = new THREE.FogExp2(palette.background, 0.012);

            // Camera
            const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
            camera.position.set(0, config.cameraHeight, config.cameraDistance);
            camera.lookAt(0, 0, -20);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            // Surface geometry
            const surfaceGeometry = new THREE.PlaneGeometry(
                config.surfaceSize,
                config.surfaceSize * 2,
                config.surfaceSegments,
                config.surfaceSegments * 2
            );

            const surfaceMaterial = new THREE.MeshBasicMaterial({
                color: palette.surface,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide,
            });

            const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
            surface.rotation.x = -Math.PI / 2 - config.cameraAngle;
            surface.position.y = -5;
            surface.position.z = -20;
            scene.add(surface);

            // Grid lines - X direction
            const gridGroupX = new THREE.Group();
            const lineCountX = 60;

            for (let i = 0; i <= lineCountX; i++) {
                const z = (i / lineCountX - 0.5) * config.surfaceSize * 2;
                const points = [];
                const segments = 100;

                for (let j = 0; j <= segments; j++) {
                    const x = (j / segments - 0.5) * config.surfaceSize;
                    points.push(new THREE.Vector3(x, 0, z));
                }

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const opacity = 0.25 + (i % 5 === 0 ? 0.2 : 0);
                const material = new THREE.LineBasicMaterial({
                    color: i % 5 === 0 ? palette.lineHighlight : palette.gridPrimary,
                    transparent: true,
                    opacity: opacity,
                });

                const line = new THREE.Line(geometry, material);
                line.userData = { baseZ: z, index: i };
                gridGroupX.add(line);
            }

            gridGroupX.rotation.x = -Math.PI / 2 - config.cameraAngle;
            gridGroupX.position.y = -4.95;
            gridGroupX.position.z = -20;
            scene.add(gridGroupX);

            // Grid lines - Z direction
            const gridGroupZ = new THREE.Group();
            const lineCountZ = 40;

            for (let i = 0; i <= lineCountZ; i++) {
                const x = (i / lineCountZ - 0.5) * config.surfaceSize;
                const points = [];
                const segments = 100;

                for (let j = 0; j <= segments; j++) {
                    const z = (j / segments - 0.5) * config.surfaceSize * 2;
                    points.push(new THREE.Vector3(x, 0, z));
                }

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const opacity = 0.2 + (i % 4 === 0 ? 0.18 : 0);
                const material = new THREE.LineBasicMaterial({
                    color: i % 4 === 0 ? palette.lineHighlight : palette.gridSecondary,
                    transparent: true,
                    opacity: opacity,
                });

                const line = new THREE.Line(geometry, material);
                line.userData = { baseX: x, index: i };
                gridGroupZ.add(line);
            }

            gridGroupZ.rotation.x = -Math.PI / 2 - config.cameraAngle;
            gridGroupZ.position.y = -4.9;
            gridGroupZ.position.z = -20;
            scene.add(gridGroupZ);

            const gridLines = { x: gridGroupX, z: gridGroupZ };

            // Horizon accent lines
            const horizonGroup = new THREE.Group();

            for (let i = 0; i < 15; i++) {
                const width = 30 + Math.random() * 50;
                const xOffset = (Math.random() - 0.5) * 60;

                const geometry = new THREE.PlaneGeometry(width, 0.02);
                const material = new THREE.MeshBasicMaterial({
                    color: palette.accent,
                    transparent: true,
                    opacity: 0.35 + Math.random() * 0.35,
                    side: THREE.DoubleSide,
                });

                const line = new THREE.Mesh(geometry, material);
                line.position.set(xOffset, 0, -60 - i * 3);
                line.rotation.x = -Math.PI / 2;
                horizonGroup.add(line);
            }

            horizonGroup.position.y = -4;
            scene.add(horizonGroup);

            // Ambient particles
            const particleCount = 300;
            const particleGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 1] = Math.random() * 20 - 5;
                positions[i * 3 + 2] = Math.random() * -100 - 10;
            }

            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const particleMaterial = new THREE.PointsMaterial({
                color: isDark ? 0xffffff : 0x000000,
                size: 0.15,
                transparent: true,
                opacity: isDark ? 0.7 : 0.4,
                sizeAttenuation: true,
            });

            const particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);

            // Lighting
            const ambient = new THREE.AmbientLight(0xffffff, 0.08);
            scene.add(ambient);

            // Animation loop
            const animate = () => {
                if (isCleanedUp) return;

                animationId = requestAnimationFrame(animate);
                time++;

                // Smooth mouse interpolation using ref
                const mouse = mouseRef.current;
                mouse.x += (mouse.targetX - mouse.x) * 0.03;
                mouse.y += (mouse.targetY - mouse.y) * 0.03;

                // Update camera position based on mouse
                const targetY = config.cameraHeight + mouse.y * 3;
                const targetX = mouse.x * 8;
                camera.position.x = targetX;
                camera.position.y = targetY;
                camera.lookAt(0, 0, -20);

                // Update surface vertices
                const surfacePositions = surface.geometry.attributes.position.array as Float32Array;

                for (let i = 0; i < surfacePositions.length; i += 3) {
                    const x = surfacePositions[i];
                    const y = surfacePositions[i + 1];

                    const wave1 = Math.sin(x * config.frequency + time * config.speed) *
                        Math.cos(y * config.frequency * 0.5 + time * config.speed * 0.8);
                    const wave2 = Math.sin((x + y) * config.frequency * 0.3 + time * config.speed * 1.2) * 0.5;
                    const wave3 = Math.cos(x * config.frequency * 0.8 - time * config.speed * 0.4) *
                        Math.sin(y * config.frequency * 0.6 + time * config.speed * 0.6) * 0.4;

                    // Mouse ripple effect
                    const mouseWorldX = mouse.x * 20;
                    const mouseWorldY = mouse.y * 20 - 20;
                    const distToMouse = Math.sqrt((x - mouseWorldX) ** 2 + (y - mouseWorldY) ** 2);
                    const mouseRipple = Math.sin(distToMouse * 0.3 - time * 0.002) *
                        Math.exp(-distToMouse * 0.05) * 1.5;

                    const edgeFade = Math.min(1,
                        (config.surfaceSize / 2 - Math.abs(x)) / 10,
                        (config.surfaceSize - Math.abs(y)) / 15
                    );

                    surfacePositions[i + 2] = (wave1 + wave2 + wave3 + mouseRipple) *
                        config.amplitude * Math.max(0, edgeFade);
                }

                surface.geometry.attributes.position.needsUpdate = true;

                // Update grid lines
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                gridLines.x.children.forEach((line: any) => {
                    const positions = line.geometry.attributes.position.array;
                    const baseZ = line.userData.baseZ;

                    for (let i = 0; i < positions.length; i += 3) {
                        const x = positions[i];
                        const wave = Math.sin(x * config.frequency + time * config.speed) *
                            Math.cos(baseZ * config.frequency * 0.5 + time * config.speed * 0.8);
                        const edgeFade = Math.min(1,
                            (config.surfaceSize / 2 - Math.abs(x)) / 10,
                            (config.surfaceSize - Math.abs(baseZ)) / 15
                        );
                        positions[i + 2] = wave * config.amplitude * 0.8 * Math.max(0, edgeFade);
                    }
                    line.geometry.attributes.position.needsUpdate = true;
                });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                gridLines.z.children.forEach((line: any) => {
                    const positions = line.geometry.attributes.position.array;
                    const baseX = line.userData.baseX;

                    for (let i = 0; i < positions.length; i += 3) {
                        const z = positions[i + 2] || (i / 3 / 100 - 0.5) * config.surfaceSize * 2;
                        const wave = Math.sin(baseX * config.frequency + time * config.speed) *
                            Math.cos(z * config.frequency * 0.5 + time * config.speed * 0.8);
                        const edgeFade = Math.min(1,
                            (config.surfaceSize / 2 - Math.abs(baseX)) / 10,
                            (config.surfaceSize - Math.abs(z)) / 15
                        );
                        positions[i + 1] = wave * config.amplitude * 0.8 * Math.max(0, edgeFade);
                    }
                    line.geometry.attributes.position.needsUpdate = true;
                });

                renderer.render(scene, camera);
            };

            // Event handlers
            const onResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            const onMouseMove = (e: MouseEvent) => {
                mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
            };

            window.addEventListener('resize', onResize);
            window.addEventListener('mousemove', onMouseMove);

            animate();

            // Return cleanup function
            return () => {
                window.removeEventListener('resize', onResize);
                window.removeEventListener('mousemove', onMouseMove);
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
        <>
            <div
                ref={containerRef}
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: 0 }}
            />
            {/* Vignette overlay */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    zIndex: 1,
                    background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.2) 100%)',
                }}
            />
        </>
    );
}
