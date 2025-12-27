'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { database } from '@/lib/firebase';
import { ref, set, onValue, remove, child, get } from 'firebase/database';

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
  scoreText?: THREE.Sprite;
}

export default function BattlezoneGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerId] = useState(() => `player_${Math.random().toString(36).substr(2, 9)}`);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState<{ name: string; score: number; health: number }[]>([]);
  const [chatMessages, setChatMessages] = useState<{ player: string; message: string; timestamp: number }[]>([]);
  const [chatInput, setChatInput] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim() || 'Player';
    setPlayerName(name);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !playerName) return;
    
    const message = {
      player: playerName,
      message: chatInput,
      timestamp: Date.now(),
    };
    
    set(ref(database, `battlezone/chat/${Date.now()}_${playerId}`), message).catch(() => {});
    setChatInput('');
  };

  useEffect(() => {
    if (!containerRef.current || !playerName) return;

    try {
      // Game variables
      let scene: THREE.Scene | null = null;
      let camera: THREE.PerspectiveCamera | null = null;
      let renderer: THREE.WebGLRenderer | null = null;
      let tank: THREE.Object3D | null = null;
      let animationId = 0;
      
      let moveForward = false;
      let moveBackward = false;
      let turnLeft = false;
      let turnRight = false;
      let rapidFire = false;
      let shieldActive = false;
      
      const speed = 0.1;
      const turnSpeed = 0.03;
      const bounds = 100;
      const missileSpeed = 0.3;
      const missileLifetime = 100;
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
      
      const fireSound = new Audio('/battlezone/fire.mp3');
      const explosionSound = new Audio('/battlezone/boom.mp3');

      const otherPlayers = new Map<string, OtherPlayer>();

      function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.Fog(0x000000, 200, 500);

        const width = window.innerWidth;
        const height = window.innerHeight;
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '0';
        renderer.domElement.style.margin = '0';
        renderer.domElement.style.padding = '0';
        document.body.appendChild(renderer.domElement);

        // Create tank
        const geometry = new THREE.BoxGeometry(1, 1, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const tankBody = new THREE.Mesh(geometry, material);

        tank = new THREE.Object3D();
        tank.add(tankBody);
        scene.add(tank);

        camera.position.set(0, 1, 0);
        camera.lookAt(new THREE.Vector3(0, 1, 1));
        tank.add(camera);

        // Create grid
        const gridHelper = new THREE.GridHelper(200, 100, 0x00ff00, 0x00ff00);
        scene.add(gridHelper);

        // Create mountains
        createMountains();

        // Spawn initial enemies
        for (let i = 0; i < 5; i++) spawnEnemy();
        setInterval(spawnEnemy, 8000);

        // Spawn power-ups
        setInterval(spawnPowerUp, 15000);

        window.addEventListener('resize', onWindowResize);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('touchstart', onTouchStart);
        document.addEventListener('touchend', onTouchEnd);

        // Firebase sync for other players
        const playersRef = ref(database, 'battlezone/players');
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
              if (playerName) {
                playerList.push({
                  name: playerName,
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
              playerMesh = { mesh: new THREE.Mesh(geo, mat) };
              scene!.add(playerMesh.mesh);
              otherPlayers.set(pId, playerMesh);
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

      function createMountains() {
        if (!scene) return;
        const mountainPositions = [
          { x: -60, z: -60 },
          { x: 60, z: -60 },
          { x: -60, z: 60 },
          { x: 60, z: 60 },
          { x: 0, z: -80 },
          { x: 0, z: 80 },
          { x: -80, z: 0 },
          { x: 80, z: 0 },
        ];

        mountainPositions.forEach((pos) => {
          const geometry = new THREE.ConeGeometry(20, 40, 8);
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
          const mountain = new THREE.Mesh(geometry, material);
          mountain.position.set(pos.x, 0, pos.z);
          scene!.add(mountain);
        });
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

        powerUps.push({ id, mesh, type, lifetime: 300 });
      }

      function fireMissile() {
        if (!scene || !tank) return;
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const missile = new THREE.Mesh(geometry, material);
        missile.position.set(0, 0.2, 1);
        missile.quaternion.copy(tank.quaternion);
        tank.localToWorld(missile.position);
        scene.add(missile);
        missiles.push({ mesh: missile, life: missileLifetime });
        fireSound.currentTime = 0;
        fireSound.play().catch(() => {});

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
        explosionSound.currentTime = 0;
        explosionSound.play().catch(() => {});
      }

      function onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
          case 'ArrowUp':
          case 'KeyW':
            moveForward = true;
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
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function clampToBounds(object: THREE.Object3D) {
        const x = THREE.MathUtils.clamp(object.position.x, -bounds, bounds);
        const z = THREE.MathUtils.clamp(object.position.z, -bounds, bounds);
        object.position.set(x, object.position.y, z);
      }

      function animate() {
        animationId = requestAnimationFrame(animate);

        if (!tank || !scene) return;

        // Tank movement
        if (moveForward) tank.translateZ(-speed);
        if (moveBackward) tank.translateZ(speed);
        if (turnLeft) tank.rotation.y += turnSpeed;
        if (turnRight) tank.rotation.y -= turnSpeed;

        clampToBounds(tank);

        // Update missiles
        missiles = missiles.filter((m) => {
          m.mesh.translateZ(missileSpeed);
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
            } else if (pu.type === 'rapidfire') {
              rapidFire = true;
              rapidFireTimer = 300;
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

        // Update timers
        if (shieldTimer > 0) shieldTimer--;
        else shieldActive = false;

        if (rapidFireTimer > 0) {
          rapidFireTimer--;
          if (rapidFireTimer % 2 === 0) fireMissile();
        } else {
          rapidFire = false;
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

        // Sync player state to Firebase every 100ms
        if (Date.now() - lastSyncTime > 100 && playerName) {
          lastSyncTime = Date.now();
          set(ref(database, `battlezone/players/${playerId}`), {
            name: playerName,
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
        }
      }

      init();
      animate();

      // Cleanup
      return () => {
        window.removeEventListener('resize', onWindowResize);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        document.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchend', onTouchEnd);
        cancelAnimationFrame(animationId);
        remove(ref(database, `battlezone/players/${playerId}`)).catch(() => {});
        if (renderer && renderer.domElement.parentNode === document.body) {
          document.body.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }, [playerId, playerName]);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-screen h-screen bg-transparent overflow-hidden" style={{ padding: 0, margin: 0 }}>
      {/* Name Dialog */}
      {!playerName && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 pointer-events-auto">
          <div className="bg-gray-900 border-2 border-green-400 p-8 rounded-lg font-mono">
            <h2 className="text-green-400 text-lg mb-4">Enter Your Name</h2>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                autoFocus
                maxLength={20}
                className="w-full px-3 py-2 bg-gray-800 border border-green-400 text-green-400 rounded mb-4 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition"
              >
                Start Game
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Top HUD */}
      <div className="fixed top-0 left-0 right-0 text-center text-green-400 bg-black bg-opacity-80 p-2 z-20 font-mono text-sm pointer-events-none flex justify-between px-4">
        <div>Score: {score}</div>
        <div>Health: {health}</div>
        <div>Players: {playerCount}</div>
      </div>

      {/* Player List */}
      {playerName && (
        <div className="fixed top-12 left-4 bg-black bg-opacity-95 border-2 border-green-400 rounded p-4 z-20 font-mono text-xs pointer-events-auto max-w-72">
          <div className="text-green-400 font-bold mb-2 text-sm">⊕ PLAYERS ({players.length})</div>
          <div className="max-h-64 overflow-y-auto">
            {players.map((player, idx) => (
              <div key={idx} className="text-green-300 mb-2 pb-1 border-b border-green-900">
                <div className="font-bold text-green-400">{player.name}</div>
                <div className="text-gray-400">Score: {player.score} | HP: {player.health}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Box */}
      {playerName && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-95 border-2 border-green-400 rounded p-3 z-20 font-mono w-80 pointer-events-auto">
          <div className="text-green-400 font-bold mb-2 text-xs">⊕ CHAT</div>
          <div className="max-h-40 overflow-y-auto mb-2 bg-gray-900 rounded p-2 text-xs">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="mb-1 text-green-300">
                <span className="font-bold text-green-400">{msg.player}: </span>
                <span className="text-gray-300">{msg.message}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message..."
              maxLength={100}
              className="flex-1 px-2 py-1 bg-gray-800 border border-green-400 text-green-400 text-xs rounded focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-green-400 text-black font-bold text-xs rounded hover:bg-green-300"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
