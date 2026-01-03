'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { database } from '@/lib/firebase';
import { ref, set, onValue, remove, onDisconnect } from 'firebase/database';

interface MissileData {
  mesh: THREE.Mesh;
  life: number;
}

interface ExplosionData {
  mesh: THREE.Mesh;
  life: number;
}

interface Enemy {
  id: string;
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
}

interface PowerUp {
  id: string;
  mesh: THREE.Mesh;
  type: 'shield' | 'rapidfire' | 'health';
  lifetime: number;
}

interface OtherPlayer {
  mesh: THREE.Mesh;
  nameLabel?: CSS2DObject;
}

// Draggable widget hook
function useDraggable(initialPosition: { x: number; y: number }) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'BUTTON') return;
    
    // Don't start drag if clicking in the resize corner (bottom-right 20x20 area)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const isResizeCorner = (e.clientX > rect.right - 20) && (e.clientY > rect.bottom - 20);
    if (isResizeCorner) return;
    
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return { position, isDragging, handleMouseDown };
}

export default function BattlezoneGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fireSoundRef = useRef<HTMLAudioElement | null>(null);
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);
  const nameLabelRef = useRef<HTMLDivElement | null>(null);
  const playerNameRef = useRef<string | null>(null);
  const [playerId] = useState(() => `player_${Math.random().toString(36).substr(2, 9)}`);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState<{ name: string; score: number; health: number }[]>([]);
  const [chatMessages, setChatMessages] = useState<{ player: string; message: string; timestamp: number }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [volume, setVolume] = useState(0.5);

  // Draggable positions for widgets
  const playerListDrag = useDraggable({ x: 16, y: 48 });
  const chatDrag = useDraggable({ x: 16, y: 350 });
  const minimapDrag = useDraggable({ x: typeof window !== 'undefined' ? window.innerWidth - 180 : 500, y: typeof window !== 'undefined' ? window.innerHeight - 180 : 400 });
  
  // Minimap data
  const [tankPosition, setTankPosition] = useState({ x: 0, z: 0, rotation: 0 });
  const [enemyPositions, setEnemyPositions] = useState<{ x: number; z: number }[]>([]);
  const [otherPlayerPositions, setOtherPlayerPositions] = useState<{ x: number; z: number }[]>([]);
  
  // Active powerups state
  const [activeShield, setActiveShield] = useState(false);
  const [activeRapidFire, setActiveRapidFire] = useState(false);

  // Update name label and ref when playerName changes
  useEffect(() => {
    playerNameRef.current = playerName;
    if (playerName && nameLabelRef.current) {
      nameLabelRef.current.textContent = playerName;
      nameLabelRef.current.style.display = 'block';
    }
  }, [playerName]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim() || 'Player';
    setPlayerName(name);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !playerName || !database) return;
    
    const message = {
      player: playerName,
      message: chatInput,
      timestamp: Date.now(),
    };
    
    set(ref(database, `battlezone/chat/${Date.now()}_${playerId}`), message).catch(() => {});
    setChatInput('');
  };

  // Update volume when slider changes
  useEffect(() => {
    if (fireSoundRef.current) fireSoundRef.current.volume = volume;
    if (explosionSoundRef.current) explosionSoundRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Game variables
      let scene: THREE.Scene | null = null;
      let camera: THREE.PerspectiveCamera | null = null;
      let renderer: THREE.WebGLRenderer | null = null;
      let labelRenderer: CSS2DRenderer | null = null;
      let tank: THREE.Object3D | null = null;
      let myNameLabel: CSS2DObject | null = null;
      let animationId = 0;
      let staleCleanupInterval: NodeJS.Timeout | null = null;
      
      let moveForward = false;
      let moveBackward = false;
      let turnLeft = false;
      let turnRight = false;
      let rapidFire = false;
      let shieldActive = false;
      
      const speed = 0.1;
      const sprintSpeed = 0.25; // Speed when sprinting
      const flySpeed = 0.5; // ZOOM
      let currentSpeed = speed;
      let isSprinting = false;
      let isHoldingCtrl = false;
      let flyHeight = 0; // Current flying height
      const turnSpeed = 0.03;
      const bounds = 100;
      const missileSpeed = 0.5;
      const missileLifetime = 2000; // Range: 0.5 * 2000 = 1000 units (1km)
      const enemySpeed = 0.02;
      
      let missiles: MissileData[] = [];
      const enemies = new Map<string, Enemy>();
      let explosions: ExplosionData[] = [];
      let powerUps: PowerUp[] = [];
      let localScore = 0;
      let localHealth = 100;
      let rapidFireTimer = 0;
      let shieldTimer = 0;
      let lastSyncTime = 0;
      
      // Powerup indicator meshes (floating above tank)
      let shieldIndicator: THREE.Mesh | null = null;
      let rapidFireIndicator: THREE.Mesh | null = null;
      let boostIndicator: THREE.Mesh | null = null;
      
      // Audio pool for overlapping fire sounds
      const fireSoundPool: HTMLAudioElement[] = [];
      const FIRE_POOL_SIZE = 8;
      let firePoolIndex = 0;
      for (let i = 0; i < FIRE_POOL_SIZE; i++) {
        const sound = new Audio('/battlezone/fire.mp3');
        sound.volume = volume;
        fireSoundPool.push(sound);
      }
      
      // Audio pool for overlapping explosion sounds
      const explosionSoundPool: HTMLAudioElement[] = [];
      const EXPLOSION_POOL_SIZE = 12;
      let explosionPoolIndex = 0;
      for (let i = 0; i < EXPLOSION_POOL_SIZE; i++) {
        const sound = new Audio('/battlezone/boom.mp3');
        sound.volume = volume;
        explosionSoundPool.push(sound);
      }
      
      // Store refs for volume control
      fireSoundRef.current = fireSoundPool[0];
      explosionSoundRef.current = explosionSoundPool[0];
      
      // Helper to play pooled fire sound
      function playFireSound() {
        const sound = fireSoundPool[firePoolIndex];
        sound.volume = volume;
        sound.currentTime = 0;
        sound.play().catch(() => {});
        firePoolIndex = (firePoolIndex + 1) % FIRE_POOL_SIZE;
      }
      
      // Helper to play explosion with distance-based volume
      function playExplosionSound(explosionPosition: THREE.Vector3) {
        if (!tank) return;
        
        const distance = tank.position.distanceTo(explosionPosition);
        // Max volume at distance 0, fades to near-silence at 100+ units
        const maxDistance = 100;
        const minVolume = 0.05;
        const distanceFactor = Math.max(minVolume, 1 - (distance / maxDistance));
        const finalVolume = volume * distanceFactor;
        
        const sound = explosionSoundPool[explosionPoolIndex];
        sound.volume = finalVolume;
        sound.currentTime = 0;
        sound.play().catch(() => {});
        explosionPoolIndex = (explosionPoolIndex + 1) % EXPLOSION_POOL_SIZE;
      }

      const otherPlayers = new Map<string, OtherPlayer>();

      function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.Fog(0x000000, 200, 500);

        const width = window.innerWidth;
        const height = window.innerHeight;
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '1';
        renderer.domElement.style.margin = '0';
        renderer.domElement.style.padding = '0';
        containerRef.current!.appendChild(renderer.domElement);

        // CSS2D Renderer for name labels
        labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(width, height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.left = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        labelRenderer.domElement.style.zIndex = '2';
        containerRef.current!.appendChild(labelRenderer.domElement);

        // Create tank
        const tankMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        
        tank = new THREE.Object3D();
        
        // Tank body (main hull)
        const hullGeometry = new THREE.BoxGeometry(1.2, 0.5, 2.2);
        const hull = new THREE.Mesh(hullGeometry, tankMaterial);
        hull.position.y = 0.25;
        tank.add(hull);
        
        // Tank tracks (left and right)
        const trackGeometry = new THREE.BoxGeometry(0.3, 0.4, 2.4);
        const leftTrack = new THREE.Mesh(trackGeometry, tankMaterial);
        leftTrack.position.set(-0.75, 0.2, 0);
        tank.add(leftTrack);
        
        const rightTrack = new THREE.Mesh(trackGeometry, tankMaterial);
        rightTrack.position.set(0.75, 0.2, 0);
        tank.add(rightTrack);
        
        // Turret base
        const turretBaseGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 8);
        const turretBase = new THREE.Mesh(turretBaseGeometry, tankMaterial);
        turretBase.position.set(0, 0.65, -0.2);
        tank.add(turretBase);
        
        // Turret top
        const turretTopGeometry = new THREE.BoxGeometry(0.7, 0.35, 0.9);
        const turretTop = new THREE.Mesh(turretTopGeometry, tankMaterial);
        turretTop.position.set(0, 0.9, -0.2);
        tank.add(turretTop);
        
        // Main cannon
        const cannonGeometry = new THREE.CylinderGeometry(0.08, 0.1, 1.5, 6);
        const cannon = new THREE.Mesh(cannonGeometry, tankMaterial);
        cannon.rotation.x = Math.PI / 2;
        cannon.position.set(0, 0.85, -1.1);
        tank.add(cannon);
        
        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4);
        const antenna = new THREE.Mesh(antennaGeometry, tankMaterial);
        antenna.position.set(0.25, 1.3, 0);
        tank.add(antenna);
        
        // Powerup indicators (initially hidden)
        const shieldIndicatorGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const shieldIndicatorMat = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, transparent: true, opacity: 0 });
        shieldIndicator = new THREE.Mesh(shieldIndicatorGeo, shieldIndicatorMat);
        shieldIndicator.position.set(-0.4, 1.8, 0);
        tank.add(shieldIndicator);
        
        const rapidFireIndicatorGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const rapidFireIndicatorMat = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true, transparent: true, opacity: 0 });
        rapidFireIndicator = new THREE.Mesh(rapidFireIndicatorGeo, rapidFireIndicatorMat);
        rapidFireIndicator.position.set(0.4, 1.8, 0);
        tank.add(rapidFireIndicator);
        
        // Boost indicator - ring that appears when boosting
        const boostIndicatorGeo = new THREE.TorusGeometry(0.5, 0.1, 8, 16);
        const boostIndicatorMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0 });
        boostIndicator = new THREE.Mesh(boostIndicatorGeo, boostIndicatorMat);
        boostIndicator.position.set(0, 2.2, 0);
        boostIndicator.rotation.x = Math.PI / 2;
        tank.add(boostIndicator);
        
        scene.add(tank);

        camera.position.set(0, 2.5, 4);
        camera.lookAt(new THREE.Vector3(0, 0.5, -2));
        tank.add(camera);

        // Add name label above player's tank (initially hidden until name is set)
        const nameDiv = document.createElement('div');
        nameDiv.textContent = '';
        nameDiv.style.color = '#00ff00';
        nameDiv.style.fontFamily = 'monospace';
        nameDiv.style.fontSize = '12px';
        nameDiv.style.fontWeight = 'bold';
        nameDiv.style.textShadow = '0 0 4px #00ff00, 0 0 8px #000';
        nameDiv.style.padding = '2px 6px';
        nameDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        nameDiv.style.borderRadius = '4px';
        nameDiv.style.display = 'none'; // Hidden until name is entered
        nameLabelRef.current = nameDiv; // Store ref for later updates
        myNameLabel = new CSS2DObject(nameDiv);
        myNameLabel.position.set(0, 2, 0);
        tank.add(myNameLabel);

        // Create grid
        const gridHelper = new THREE.GridHelper(200, 100, 0x00ff00, 0x00ff00);
        scene.add(gridHelper);

        // Create starfield
        createStars();

        // Create mountains
        createMountains();

        // Spawn initial enemies
        for (let i = 0; i < 10; i++) spawnEnemy();
        setInterval(spawnEnemy, 3000);

        // Spawn power-ups
        setInterval(spawnPowerUp, 15000);

        window.addEventListener('resize', onWindowResize);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('touchstart', onTouchStart);
        document.addEventListener('touchend', onTouchEnd);

        // Firebase sync for other players
        if (database) {
          const db = database; // Capture for use in callbacks
          const playersRef = ref(db, 'battlezone/players');
          
          // Cleanup stale players every 30 seconds (remove players older than 2 minutes)
          const STALE_THRESHOLD = 2 * 60 * 1000; // 2 minutes in ms
          staleCleanupInterval = setInterval(() => {
            onValue(playersRef, (snapshot) => {
              if (!snapshot.exists()) return;
              const now = Date.now();
              snapshot.forEach((childSnapshot) => {
                const playerState = childSnapshot.val();
                if (playerState && playerState.timestamp) {
                  if (now - playerState.timestamp > STALE_THRESHOLD) {
                    remove(ref(db, `battlezone/players/${childSnapshot.key}`)).catch(() => {});
                  }
                }
              });
            }, { onlyOnce: true });
          }, 30000); // Check every 30 seconds
          
          onValue(playersRef, (snapshot) => {
            if (!snapshot.exists()) return;
            let count = 0;
            const activePlayers = new Set<string>();
            const playerList: { name: string; score: number; health: number }[] = [];

          snapshot.forEach((childSnapshot) => {
            const pId = childSnapshot.key as string;
            activePlayers.add(pId);
            
            const playerState = childSnapshot.val();
            if (!playerState) return;

            if (pId === playerId) {
              count++;
              if (playerNameRef.current) {
                playerList.push({
                  name: playerNameRef.current,
                  score: playerState.score || 0,
                  health: playerState.health || 100,
                });
              }
              return;
            }

            let playerMesh = otherPlayers.get(pId);

            if (!playerMesh) {
              const geo = new THREE.BoxGeometry(1, 1, 2);
              const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
              const mesh = new THREE.Mesh(geo, mat);
              
              // Create name label for other player
              const labelDiv = document.createElement('div');
              labelDiv.textContent = playerState.name || 'Unknown';
              labelDiv.style.color = '#ff00ff';
              labelDiv.style.fontFamily = 'monospace';
              labelDiv.style.fontSize = '12px';
              labelDiv.style.fontWeight = 'bold';
              labelDiv.style.textShadow = '0 0 4px #ff00ff, 0 0 8px #000';
              labelDiv.style.padding = '2px 6px';
              labelDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
              labelDiv.style.borderRadius = '4px';
              const nameLabel = new CSS2DObject(labelDiv);
              nameLabel.position.set(0, 2, 0);
              mesh.add(nameLabel);
              
              playerMesh = { mesh, nameLabel };
              scene!.add(playerMesh.mesh);
              otherPlayers.set(pId, playerMesh);
            } else {
              // Update name label if name changed
              if (playerMesh.nameLabel) {
                const labelDiv = playerMesh.nameLabel.element as HTMLDivElement;
                if (labelDiv.textContent !== (playerState.name || 'Unknown')) {
                  labelDiv.textContent = playerState.name || 'Unknown';
                }
              }
            }

            if (playerState.x !== undefined && playerState.z !== undefined) {
              playerMesh.mesh.position.set(playerState.x, 0, playerState.z);
            }
            if (playerState.rotationY !== undefined) {
              playerMesh.mesh.rotation.y = playerState.rotationY;
            }
            
            playerList.push({
              name: playerState.name || 'Unknown',
              score: playerState.score || 0,
              health: playerState.health || 100,
            });
            count++;
          });

          // Remove disconnected players
          otherPlayers.forEach((player, pId) => {
            if (!activePlayers.has(pId)) {
              scene!.remove(player.mesh);
              otherPlayers.delete(pId);
            }
          });

          setPlayerCount(count);
          setPlayers(playerList);
        }, () => {
          // Handle Firebase errors silently
        });

          // Firebase chat listener
          const chatRef = ref(database, 'battlezone/chat');
          onValue(chatRef, (snapshot) => {
            if (!snapshot.exists()) return;
            const messages: { player: string; message: string; timestamp: number }[] = [];
            snapshot.forEach((childSnapshot) => {
              const msg = childSnapshot.val();
              if (msg && msg.player && msg.message) {
                messages.push(msg);
              }
            });
            // Sort by timestamp and keep last 50
            messages.sort((a, b) => a.timestamp - b.timestamp);
            setChatMessages(messages.slice(-50));
          }, () => {
            // Handle Firebase errors silently
          });
        }
      }

      function createStars() {
        if (!scene) return;
        
        const starCount = 500;
        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
          // Distribute stars on a dome above the horizon
          const theta = Math.random() * Math.PI * 2; // Full circle around
          const phi = Math.random() * Math.PI * 0.4; // Only upper portion (above horizon)
          const radius = 400 + Math.random() * 100; // Varying distance
          
          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.cos(phi); // Y is up
          positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 1.5,
          sizeAttenuation: true
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
      }

      function createMountains() {
        if (!scene) return;
        
        // Create a distant ring of Cascade-style mountains around the play area
        // Pushed far back to avoid visual clutter near gameplay
        const mountainRadius = 350; // Far from center for clear sightlines
        const numMountains = 32; // Fewer mountains, less clutter
        
        for (let i = 0; i < numMountains; i++) {
          const angle = (i / numMountains) * Math.PI * 2;
          
          // Vary the distance slightly for natural look
          const radiusVariation = mountainRadius + (Math.sin(i * 3.7) * 30);
          const x = Math.cos(angle) * radiusVariation;
          const z = Math.sin(angle) * radiusVariation;
          
          // Larger mountains since they're further away, fewer segments to reduce line density
          const baseWidth = 60 + Math.sin(i * 2.3) * 25; // 35-85 width
          const height = 50 + Math.sin(i * 1.7) * 20 + Math.cos(i * 4.1) * 15; // 15-85 height
          
          // Fewer segments (6) for cleaner silhouette with less wireframe clutter
          const geometry = new THREE.ConeGeometry(baseWidth, height, 6);
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
          const mountain = new THREE.Mesh(geometry, material);
          
          // Position so base is at ground level (y = height/2 puts base at y=0)
          mountain.position.set(x, height / 2, z);
          
          // Slight random rotation for variety
          mountain.rotation.y = Math.random() * Math.PI * 2;
          
          scene!.add(mountain);
        }
      }

      function spawnEnemy() {
        if (!scene) return;
        const id = Math.random().toString(36).substr(2, 9);
        const geometry = new THREE.BoxGeometry(1, 1, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() * 160 - 80, 0, Math.random() * 160 - 80);
        mesh.rotation.y = Math.random() * Math.PI * 2;
        scene.add(mesh);

        const velocity = new THREE.Vector3(0, 0, enemySpeed);
        velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), mesh.rotation.y);

        enemies.set(id, { id, mesh, velocity });
      }

      function spawnPowerUp() {
        if (!scene) return;
        const types: Array<'shield' | 'rapidfire' | 'health'> = ['shield', 'rapidfire', 'health'];
        const type = types[Math.floor(Math.random() * types.length)];
        const id = Math.random().toString(36).substr(2, 9);

        const geometry = new THREE.SphereGeometry(0.7, 8, 8);
        const color = type === 'shield' ? 0x0000ff : type === 'rapidfire' ? 0xffff00 : 0x00ffff;
        const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() * 160 - 80, 0.5, Math.random() * 160 - 80);
        scene.add(mesh);

        powerUps.push({ id, mesh, type, lifetime: 1800 });
      }

      function fireMissile() {
        if (!scene || !tank) return;
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const missile = new THREE.Mesh(geometry, material);
        missile.position.set(0, 0.85, -2); // Spawn at cannon tip
        missile.quaternion.copy(tank.quaternion);
        tank.localToWorld(missile.position);
        scene.add(missile);
        missiles.push({ mesh: missile, life: missileLifetime });
        playFireSound();

        if (rapidFire) rapidFireTimer = 5;
      }

      function explodeAt(position: THREE.Vector3) {
        if (!scene) return;
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
        const explosion = new THREE.Mesh(geometry, material);
        explosion.position.copy(position);
        scene.add(explosion);
        explosions.push({ mesh: explosion, life: 20 });
        playExplosionSound(position);
      }

      function onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
          case 'ArrowUp':
          case 'KeyW':
            moveForward = true;
            break;
          case 'ShiftLeft':
          case 'ShiftRight':
            isSprinting = true;
            break;
          case 'ControlLeft':
          case 'ControlRight':
            isHoldingCtrl = true;
            break;
          case 'ArrowDown':
          case 'KeyS':
            moveBackward = true;
            break;
          case 'ArrowLeft':
          case 'KeyA':
            turnLeft = true;
            break;
          case 'ArrowRight':
          case 'KeyD':
            turnRight = true;
            break;
          case 'Space':
            fireMissile();
            break;
        }
      }

      function onKeyUp(event: KeyboardEvent) {
        switch (event.code) {
          case 'ArrowUp':
          case 'KeyW':
            moveForward = false;
            break;
          case 'ArrowDown':
          case 'KeyS':
            moveBackward = false;
            break;
          case 'ArrowLeft':
          case 'KeyA':
            turnLeft = false;
            break;
          case 'ArrowRight':
          case 'KeyD':
            turnRight = false;
            break;
          case 'ShiftLeft':
          case 'ShiftRight':
            isSprinting = false;
            break;
          case 'ControlLeft':
          case 'ControlRight':
            isHoldingCtrl = false;
            break;
        }
      }

      function onTouchStart(event: TouchEvent) {
        if (event.touches.length === 0) return;
        const touch = event.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (y < height * 0.3) {
          fireMissile();
        } else if (y > height * 0.7) {
          if (x < width * 0.5) {
            moveBackward = true;
          } else {
            moveForward = true;
          }
        } else {
          if (x < width * 0.5) {
            turnLeft = true;
          } else {
            turnRight = true;
          }
        }
      }

      function onTouchEnd() {
        moveForward = false;
        moveBackward = false;
        turnLeft = false;
        turnRight = false;
      }

      function onWindowResize() {
        if (!camera || !renderer) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        if (labelRenderer) {
          labelRenderer.setSize(width, height);
        }
      }

      function clampToBounds(object: THREE.Object3D) {
        const x = THREE.MathUtils.clamp(object.position.x, -bounds, bounds);
        const z = THREE.MathUtils.clamp(object.position.z, -bounds, bounds);
        object.position.set(x, object.position.y, z);
      }

      function animate() {
        animationId = requestAnimationFrame(animate);

        if (!tank || !scene) return;

        // Check for flying mode (Ctrl + Shift + W = ridiculous easter egg)
        const isFlying = isHoldingCtrl && isSprinting && moveForward;
        
        // Update sprint/fly speed
        if (isFlying) {
          currentSpeed = flySpeed;
          flyHeight = Math.min(flyHeight + 0.3, 50); // Rise up!
        } else {
          currentSpeed = isSprinting && moveForward ? sprintSpeed : speed;
          flyHeight = Math.max(flyHeight - 0.2, 0); // Gradually descend
        }
        tank.position.y = flyHeight;
        
        // Update boost indicator (shows when sprinting/flying)
        if (boostIndicator) {
          if (isFlying) {
            // Rainbow colors when flying!
            const hue = (Date.now() * 0.005) % 1;
            (boostIndicator.material as THREE.MeshBasicMaterial).color.setHSL(hue, 1, 0.5);
            (boostIndicator.material as THREE.MeshBasicMaterial).opacity = 1;
            boostIndicator.rotation.z += 0.3; // Spin fast!
          } else if (isSprinting && moveForward) {
            (boostIndicator.material as THREE.MeshBasicMaterial).color.setHex(0x00ffff);
            (boostIndicator.material as THREE.MeshBasicMaterial).opacity = 0.8;
            boostIndicator.rotation.z += 0.1;
          } else {
            (boostIndicator.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }

        // Tank movement
        if (moveForward) tank.translateZ(-currentSpeed);
        if (moveBackward) tank.translateZ(speed); // No sprint for reverse
        if (turnLeft) tank.rotation.y += turnSpeed;
        if (turnRight) tank.rotation.y -= turnSpeed;

        clampToBounds(tank);

        // Update missiles
        missiles = missiles.filter((m) => {
          m.mesh.translateZ(-missileSpeed);
          m.life--;

          let hit = false;
          enemies.forEach((enemy, id) => {
            if (m.mesh.position.distanceTo(enemy.mesh.position) < 1) {
              explodeAt(enemy.mesh.position);
              scene!.remove(enemy.mesh);
              enemies.delete(id);
              hit = true;
              localScore += 10;
              setScore(localScore);
            }
          });

          // Check for power-up hits
          powerUps = powerUps.filter((pu) => {
            if (m.mesh.position.distanceTo(pu.mesh.position) < 1.5) {
              // Activate power-up when shot
              if (pu.type === 'shield') {
                shieldTimer = 300;
                shieldActive = true;
                setActiveShield(true);
                if (shieldIndicator) {
                  (shieldIndicator.material as THREE.MeshBasicMaterial).opacity = 1;
                }
              } else if (pu.type === 'rapidfire') {
                rapidFire = true;
                rapidFireTimer = 300;
                setActiveRapidFire(true);
                if (rapidFireIndicator) {
                  (rapidFireIndicator.material as THREE.MeshBasicMaterial).opacity = 1;
                }
              } else if (pu.type === 'health') {
                localHealth = Math.min(100, localHealth + 25);
                setHealth(localHealth);
              }
              explodeAt(pu.mesh.position);
              scene!.remove(pu.mesh);
              hit = true;
              return false;
            }
            return true;
          });

          if (hit || m.life <= 0) {
            scene!.remove(m.mesh);
            return false;
          }
          return true;
        });

        // Update enemies
        enemies.forEach((enemy) => {
          enemy.mesh.translateZ(enemySpeed);
          if (Math.random() < 0.01) enemy.mesh.rotation.y += (Math.random() - 0.5) * 0.2;
          clampToBounds(enemy.mesh);
        });

        // Update power-ups
        powerUps = powerUps.filter((pu) => {
          pu.lifetime--;
          pu.mesh.rotation.x += 0.02;
          pu.mesh.rotation.z += 0.02;

          if (tank && tank.position.distanceTo(pu.mesh.position) < 2) {
            if (pu.type === 'shield') {
              shieldTimer = 300;
              shieldActive = true;
              setActiveShield(true);
              if (shieldIndicator) {
                (shieldIndicator.material as THREE.MeshBasicMaterial).opacity = 1;
              }
            } else if (pu.type === 'rapidfire') {
              rapidFire = true;
              rapidFireTimer = 300;
              setActiveRapidFire(true);
              if (rapidFireIndicator) {
                (rapidFireIndicator.material as THREE.MeshBasicMaterial).opacity = 1;
              }
            } else if (pu.type === 'health') {
              localHealth = Math.min(100, localHealth + 25);
              setHealth(localHealth);
            }
            scene!.remove(pu.mesh);
            return false;
          }

          if (pu.lifetime <= 0) {
            scene!.remove(pu.mesh);
            return false;
          }
          return true;
        });

        // Update timers and indicators
        if (shieldTimer > 0) {
          shieldTimer--;
          if (shieldIndicator) {
            shieldIndicator.rotation.y += 0.05;
          }
        } else {
          shieldActive = false;
          setActiveShield(false);
          if (shieldIndicator) {
            (shieldIndicator.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }

        if (rapidFireTimer > 0) {
          rapidFireTimer--;
          if (rapidFireTimer % 2 === 0) fireMissile();
          if (rapidFireIndicator) {
            rapidFireIndicator.rotation.y += 0.1;
          }
        } else {
          rapidFire = false;
          setActiveRapidFire(false);
          if (rapidFireIndicator) {
            (rapidFireIndicator.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }

        // Update explosions
        explosions = explosions.filter((ex) => {
          ex.life--;
          ex.mesh.scale.multiplyScalar(1.05);
          if (ex.life <= 0) {
            scene!.remove(ex.mesh);
            return false;
          }
          return true;
        });

        // Sync player state to Firebase every 10ms
        if (Date.now() - lastSyncTime > 10 && playerNameRef.current && database) {
          lastSyncTime = Date.now();
          set(ref(database, `battlezone/players/${playerId}`), {
            name: playerNameRef.current,
            x: tank.position.x,
            z: tank.position.z,
            rotationY: tank.rotation.y,
            score: localScore,
            health: localHealth,
            timestamp: Date.now(),
          }).catch(() => {});
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
          if (labelRenderer) {
            labelRenderer.render(scene, camera);
          }
        }
        
        // Update minimap data every few frames
        if (animationId % 5 === 0) {
          setTankPosition({ x: tank.position.x, z: tank.position.z, rotation: tank.rotation.y });
          const enemyPos: { x: number; z: number }[] = [];
          enemies.forEach((enemy) => {
            enemyPos.push({ x: enemy.mesh.position.x, z: enemy.mesh.position.z });
          });
          setEnemyPositions(enemyPos);
          const otherPos: { x: number; z: number }[] = [];
          otherPlayers.forEach((player) => {
            otherPos.push({ x: player.mesh.position.x, z: player.mesh.position.z });
          });
          setOtherPlayerPositions(otherPos);
        }
      }

      init();
      animate();

      // Set up Firebase onDisconnect to auto-remove player when connection is lost
      if (database) {
        const playerRef = ref(database, `battlezone/players/${playerId}`);
        onDisconnect(playerRef).remove().catch(() => {});
      }

      // Handle browser close/refresh
      const handleBeforeUnload = () => {
        if (database) {
          // Use fetch with keepalive for reliable cleanup on page unload
          fetch(`https://battlezone-e5deb-default-rtdb.firebaseio.com/battlezone/players/${playerId}.json`, {
            method: 'DELETE',
            keepalive: true
          }).catch(() => {});
        }
      };

      // Also handle visibility change (tab switch/minimize)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && database) {
          // Update timestamp when tab is hidden so we know they're still there
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup
      return () => {
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        document.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchend', onTouchEnd);
        cancelAnimationFrame(animationId);
        if (staleCleanupInterval) {
          clearInterval(staleCleanupInterval);
        }
        if (database) {
          remove(ref(database, `battlezone/players/${playerId}`)).catch(() => {});
        }
        if (renderer && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        if (labelRenderer && labelRenderer.domElement.parentNode) {
          labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
        }
      };
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }, [playerId]);

  return (
    <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', padding: 0, margin: 0 }}>
      {/* Style override for navigation on this page */}
      <style>{`
        header {
          background: rgba(0, 0, 0, 0.2) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border-bottom: 1px solid rgba(0, 255, 0, 0.3) !important;
        }
        header * {
          color: #00ff00 !important;
        }
      `}</style>
      
      {/* UI Layer - sits above canvas */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, pointerEvents: 'none' }}>
        {/* Name Dialog */}
        {!playerName && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
            <div style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.3)', 
              backdropFilter: 'blur(16px)', 
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 255, 0, 0.5)', 
              padding: '32px', 
              borderRadius: '8px', 
              fontFamily: 'monospace',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h1 style={{ color: '#00ff00', fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>Battlezone</h1>
              <p style={{ color: 'rgba(0, 255, 0, 0.7)', fontSize: '14px', fontStyle: 'italic', marginBottom: '24px' }}>
                A faithful revival of a forgotten frontier
              </p>

              <div style={{ borderTop: '1px solid rgba(0, 255, 0, 0.3)', paddingTop: '20px' }}>
                <h2 style={{ color: '#00ff00', fontSize: '16px', marginBottom: '12px' }}>Enter Your Name</h2>
                <form onSubmit={handleNameSubmit}>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your name"
                    autoFocus
                    maxLength={20}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0, 255, 0, 0.5)', color: '#00ff00', borderRadius: '4px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button
                    type="submit"
                    style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(0, 255, 0, 0.8)', color: 'black', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #00ff00', cursor: 'pointer', fontSize: '16px' }}
                  >
                    Start Game →
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Top HUD */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: '14px',
          pointerEvents: 'auto',
          alignItems: 'center'
        }}>
          <div>Score: {score}</div>
          <div>{playerName ? `${playerName} | ` : ''}Health: {health}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <span>Players: {playerCount}</span>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              <span style={{fontSize: '14px'}}>{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{
                  width: '60px',
                  accentColor: '#00ff00',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        </div>

        {/* Player List */}
        {playerName && (
          <div 
            onMouseDown={playerListDrag.handleMouseDown}
            style={{
              position: 'absolute',
              left: playerListDrag.position.x,
              top: playerListDrag.position.y,
              backgroundColor: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 255, 0, 0.5)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: '12px',
              pointerEvents: 'auto',
              cursor: playerListDrag.isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'}}>
              <div style={{color: '#00ff00', fontWeight: 'bold', fontSize: '14px'}}>⊕ {players.length}</div>
              {players.map((player, idx) => (
                <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#90EE90', padding: '4px 8px', backgroundColor: 'rgba(0,255,0,0.1)', borderRadius: '4px'}}>
                  <span style={{fontWeight: 'bold', color: '#00ff00'}}>{player.name}</span>
                  <span style={{color: '#888', fontSize: '10px'}}>{player.score}pts</span>
                  <span style={{color: player.health > 50 ? '#00ff00' : player.health > 25 ? '#ffff00' : '#ff0000', fontSize: '10px'}}>{player.health}hp</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Box */}
        {playerName && (
          <div 
            onMouseDown={chatDrag.handleMouseDown}
            style={{
              position: 'absolute',
              left: chatDrag.position.x,
              top: chatDrag.position.y,
              backgroundColor: 'rgba(0,0,0,0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '8px',
              padding: '12px',
              fontFamily: 'monospace',
              width: '320px',
              pointerEvents: 'auto',
              resize: 'both',
              overflow: 'hidden',
              minWidth: '250px',
              minHeight: '150px',
              cursor: chatDrag.isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column'
            }}>
            <div style={{flex: 1, overflowY: 'auto', marginBottom: '8px', borderRadius: '4px', padding: '8px', fontSize: '12px', minHeight: '60px'}}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{marginBottom: '4px', color: '#90EE90'}}>
                  <span style={{fontWeight: 'bold', color: '#00ff00'}}>{msg.player}: </span>
                  <span style={{color: '#ccc'}}>{msg.message}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} style={{display: 'flex', gap: '8px', flexShrink: 0}}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message..."
                maxLength={100}
                style={{flex: 1, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0, 255, 0, 0.5)', color: '#00ff00', fontSize: '12px', borderRadius: '4px', outline: 'none', cursor: 'text'}}
              />
              <button
                type="submit"
                style={{padding: '4px 12px', backgroundColor: 'rgba(0, 255, 0, 0.8)', color: 'black', fontWeight: 'bold', fontSize: '12px', borderRadius: '4px', border: '1px solid #00ff00', cursor: 'pointer'}}
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Minimap */}
        {playerName && (
          <div 
            onMouseDown={minimapDrag.handleMouseDown}
            style={{
              position: 'absolute',
              left: minimapDrag.position.x,
              top: minimapDrag.position.y,
              width: '150px',
              height: '150px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(0, 255, 0, 0.5)',
              borderRadius: '8px',
              pointerEvents: 'auto',
              cursor: minimapDrag.isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              overflow: 'hidden'
            }}>
            <svg width="150" height="150" viewBox="-100 -100 200 200" style={{display: 'block'}}>
              {/* Grid lines */}
              <line x1="-100" y1="0" x2="100" y2="0" stroke="rgba(0,255,0,0.2)" strokeWidth="0.5"/>
              <line x1="0" y1="-100" x2="0" y2="100" stroke="rgba(0,255,0,0.2)" strokeWidth="0.5"/>
              <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(0,255,0,0.15)" strokeWidth="0.5"/>
              
              {/* Enemies (red dots) */}
              {enemyPositions.map((enemy, idx) => (
                <circle key={`e${idx}`} cx={enemy.x} cy={enemy.z} r="2" fill="#ff0000"/>
              ))}
              
              {/* Other players (magenta dots) */}
              {otherPlayerPositions.map((player, idx) => (
                <circle key={`p${idx}`} cx={player.x} cy={player.z} r="3" fill="#ff00ff"/>
              ))}
              
              {/* Player tank (green triangle pointing in direction) */}
              <g transform={`translate(${tankPosition.x}, ${tankPosition.z}) rotate(${-tankPosition.rotation * 180 / Math.PI + 180})`}>
                <polygon points="0,-5 3,4 -3,4" fill="#00ff00"/>
              </g>
            </svg>
          </div>
        )}

        {/* Powerups Legend */}
        {playerName && (
          <div style={{
            position: 'absolute',
            right: 16,
            top: 48,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontFamily: 'monospace',
            fontSize: '11px',
            pointerEvents: 'none'
          }}>
            <div style={{color: '#00ff00', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px'}}>POWERUPS</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px'}}>
              <div style={{width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #0000ff', backgroundColor: activeShield ? 'rgba(0,0,255,0.5)' : 'transparent'}}/>
              <span style={{color: activeShield ? '#0088ff' : '#888'}}>Shield {activeShield && '●'}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px'}}>
              <div style={{width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #ffff00', backgroundColor: activeRapidFire ? 'rgba(255,255,0,0.5)' : 'transparent'}}/>
              <span style={{color: activeRapidFire ? '#ffff00' : '#888'}}>Rapid Fire {activeRapidFire && '●'}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <div style={{width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #00ffff', backgroundColor: 'transparent'}}/>
              <span style={{color: '#888'}}>+25 Health</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
