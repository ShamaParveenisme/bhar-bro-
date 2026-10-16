import React, { useEffect, useRef, useCallback } from 'react';
import { 
  CharacterConfig, 
  DistrictInfo, 
  Obstacle, 
  ObstacleType, 
  PowerUpItem, 
  PowerUpType, 
  CoinItem, 
  ActivePowerUp, 
  MemePopup, 
  GameStats 
} from '../types/game';
import { soundManager } from '../audio/soundManager';
import { MEME_QUIPS } from '../constants/gameData';

interface GameCanvasProps {
  character: CharacterConfig;
  district: DistrictInfo;
  isPaused: boolean;
  onGameOver: (finalStats: GameStats) => void;
  onStatsUpdate: (stats: GameStats, activePowerUps: ActivePowerUp[]) => void;
  onDistrictChange?: (newDistrictIndex: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  character,
  district,
  isPaused,
  onGameOver,
  onStatsUpdate,
  onDistrictChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Core Game Loop State stored in mutable ref for 60fps performance
  const stateRef = useRef({
    // Player
    lane: 1, // 0: Left, 1: Center, 2: Right
    targetLane: 1,
    laneXOffset: 0, // for smooth transition between lanes
    yOffset: 0, // Jump height (positive = up)
    yVelocity: 0,
    isJumping: false,
    isSliding: false,
    slideTimer: 0,
    runFrame: 0,
    invincibleTimer: 0, // after revive
    
    // World & Movement
    distance: 0,
    score: 0,
    coinsCollected: 0,
    barricadesDodged: 0,
    cannonsBlocked: 0,
    gasSurvived: 0,
    speed: district.baseSpeed,
    roadScroll: 0,
    currentDistrictIdx: 0,
    
    // Spawns
    obstacles: [] as Obstacle[],
    powerUps: [] as PowerUpItem[],
    coins: [] as CoinItem[],
    nextObstacleZ: 600,
    nextPowerUpZ: 1200,
    nextCoinZ: 300,
    activePowerUps: [] as ActivePowerUp[],
    memePopups: [] as MemePopup[],
    
    // Visual FX
    screenShake: 0,
    tearGasHaze: 0, // 0 to 1
    waterSprayFX: 0,
    
    // Touch controls
    touchStartX: 0,
    touchStartY: 0,
    touchStartTime: 0,
    
    isRunning: true,
  });

  const nextIdRef = useRef(1);

  // Trigger floating meme quip
  const spawnMeme = useCallback((text: string, color: string = '#facc15') => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 800;
    const height = canvas ? canvas.height : 600;
    stateRef.current.memePopups.push({
      id: nextIdRef.current++,
      text,
      color,
      x: width / 2 + (Math.random() * 160 - 80),
      y: height * 0.45 + (Math.random() * 40 - 20),
      opacity: 1,
      lifespan: 60,
    });
  }, []);

  // Player action handlers
  const moveLeft = useCallback(() => {
    const s = stateRef.current;
    if (s.targetLane > 0) {
      s.targetLane--;
      soundManager.playWhoosh();
    }
  }, []);

  const moveRight = useCallback(() => {
    const s = stateRef.current;
    if (s.targetLane < district.lanes - 1) {
      s.targetLane++;
      soundManager.playWhoosh();
    }
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.isJumping && !s.isSliding) {
      s.isJumping = true;
      s.yVelocity = 14;
      soundManager.playJump();
    }
  }, []);

  const slide = useCallback(() => {
    const s = stateRef.current;
    if (!s.isSliding) {
      if (s.isJumping) {
        // Fast fall if mid-air
        s.yVelocity = -12;
      } else {
        s.isSliding = true;
        s.slideTimer = 35; // ~0.6 sec
        soundManager.playSlide();
      }
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        slide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, moveLeft, moveRight, jump, slide]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const s = stateRef.current;
    s.touchStartX = touch.clientX;
    s.touchStartY = touch.clientY;
    s.touchStartTime = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const s = stateRef.current;
    const diffX = touch.clientX - s.touchStartX;
    const diffY = touch.clientY - s.touchStartY;
    const elapsed = Date.now() - s.touchStartTime;

    const minSwipeDist = 30;
    if (elapsed < 500 && (Math.abs(diffX) > minSwipeDist || Math.abs(diffY) > minSwipeDist)) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) moveLeft();
        else moveRight();
      } else {
        if (diffY < 0) jump();
        else slide();
      }
    }
  };

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    // Resize handling to match display container
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load backdrop image
    const bgImg = new Image();
    bgImg.src = district.backgroundImage;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const s = stateRef.current;

      if (!isPaused && s.isRunning) {
        // Active powerup checks
        const hasGasMask = s.activePowerUps.some(p => p.type === 'gas_mask');
        const hasShield = s.activePowerUps.some(p => p.type === 'riot_shield');
        const hasChai = s.activePowerUps.some(p => p.type === 'chai_boost');
        const hasMagnet = s.activePowerUps.some(p => p.type === 'viral_magnet');

        // Time modifier for Chai boost (Matrix slow-motion)
        const timeScale = hasChai ? 0.7 : 1.0;
        const currentSpeed = s.speed * timeScale;

        // Advance distance & score
        s.distance += currentSpeed * dt * 10;
        s.score += Math.floor(currentSpeed * dt * (hasChai ? 25 : 12));
        s.roadScroll = (s.roadScroll + currentSpeed * dt * 45) % 100;
        s.runFrame += dt * 14 * (currentSpeed / 6);

        // Gradually ramp up speed with distance
        s.speed = district.baseSpeed + Math.min(s.distance / 300, 4.5);

        // District progression milestones
        if (s.distance > 500 && s.currentDistrictIdx === 0) {
          s.currentDistrictIdx = 1;
          spawnMeme('DISTRICT 2: INDIA GATE REACHED!', '#38bdf8');
          soundManager.playPowerUp();
          if (onDistrictChange) onDistrictChange(1);
        } else if (s.distance > 1200 && s.currentDistrictIdx === 1) {
          s.currentDistrictIdx = 2;
          spawnMeme('DISTRICT 3: LAL QILA FORTRESS!', '#f43f5e');
          soundManager.playPowerUp();
          if (onDistrictChange) onDistrictChange(2);
        }

        // Update active powerup timers
        s.activePowerUps.forEach(p => {
          p.remainingTime -= dt;
        });
        s.activePowerUps = s.activePowerUps.filter(p => p.remainingTime > 0);

        if (s.invincibleTimer > 0) {
          s.invincibleTimer -= dt;
        }

        // Smooth lane interpolation
        const laneDiff = s.targetLane - s.lane;
        s.lane += laneDiff * Math.min(dt * 14, 1);

        // Jump physics
        if (s.isJumping) {
          s.yOffset += s.yVelocity;
          s.yVelocity -= 36 * dt; // gravity
          if (s.yOffset <= 0) {
            s.yOffset = 0;
            s.yVelocity = 0;
            s.isJumping = false;
          }
        }

        // Slide timer
        if (s.isSliding) {
          s.slideTimer--;
          if (s.slideTimer <= 0) {
            s.isSliding = false;
          }
        }

        // Screen shake decay
        if (s.screenShake > 0) {
          s.screenShake = Math.max(0, s.screenShake - dt * 15);
        }
        if (s.waterSprayFX > 0) {
          s.waterSprayFX = Math.max(0, s.waterSprayFX - dt * 2.5);
        }

        // ================= SPAWN LOGIC =================
        // Spawn Obstacles
        if (s.distance >= s.nextObstacleZ) {
          const availableHazards = district.hazards;
          const chosenType = availableHazards[Math.floor(Math.random() * availableHazards.length)];
          const chosenLane = Math.floor(Math.random() * district.lanes);

          s.obstacles.push({
            id: nextIdRef.current++,
            type: chosenType as ObstacleType,
            lane: chosenLane,
            z: 1100,
            width: 1.0,
            height: chosenType === 'cannon' ? 1.4 : chosenType === 'roadblock' ? 0.7 : 1.2,
            active: true,
            cannonSpraying: chosenType === 'cannon',
            gasRadius: chosenType === 'teargas' ? 1.6 : undefined,
          });

          // Next obstacle spawn distance depends on speed
          const spacing = Math.max(140, 260 - s.speed * 12);
          s.nextObstacleZ = s.distance + spacing;
        }

        // Spawn Coins
        if (s.distance >= s.nextCoinZ) {
          const coinLane = Math.floor(Math.random() * district.lanes);
          // Spawn line of 3 coins
          for (let i = 0; i < 3; i++) {
            s.coins.push({
              id: nextIdRef.current++,
              lane: coinLane,
              z: 1050 + i * 80,
              collected: false,
              value: 10,
            });
          }
          s.nextCoinZ = s.distance + 150 + Math.random() * 120;
        }

        // Spawn PowerUps
        if (s.distance >= s.nextPowerUpZ) {
          const powerUpTypes: PowerUpType[] = ['gas_mask', 'riot_shield', 'chai_boost', 'viral_magnet'];
          const chosenType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
          const puLane = Math.floor(Math.random() * district.lanes);

          s.powerUps.push({
            id: nextIdRef.current++,
            type: chosenType,
            lane: puLane,
            z: 1100,
            collected: false,
          });

          s.nextPowerUpZ = s.distance + 400 + Math.random() * 300;
        }

        // ================= UPDATE ENTITIES =================
        const entityMoveDist = currentSpeed * dt * 140;

        // Move & check coins
        s.coins.forEach(c => {
          c.z -= entityMoveDist;

          // Magnet pull
          if (hasMagnet && c.z < 600 && c.z > 30) {
            c.lane += (s.lane - c.lane) * Math.min(dt * 8, 1);
          }

          // Coin Collection
          if (!c.collected && c.z > 20 && c.z < 90) {
            if (Math.abs(c.lane - s.lane) < 0.65) {
              c.collected = true;
              s.coinsCollected++;
              s.score += 50;
              soundManager.playCoin();
            }
          }
        });
        s.coins = s.coins.filter(c => c.z > 0 && !c.collected);

        // Move & check powerups
        s.powerUps.forEach(p => {
          p.z -= entityMoveDist;
          if (!p.collected && p.z > 20 && p.z < 90) {
            if (Math.abs(p.lane - s.lane) < 0.65) {
              p.collected = true;
              soundManager.playPowerUp();

              // Activate powerup
              const duration = p.type === 'gas_mask' ? 12 : p.type === 'riot_shield' ? 10 : p.type === 'chai_boost' ? 8 : 12;
              const existing = s.activePowerUps.find(item => item.type === p.type);
              if (existing) {
                existing.remainingTime = duration;
              } else {
                s.activePowerUps.push({
                  type: p.type,
                  remainingTime: duration,
                  maxTime: duration,
                });
              }

              if (p.type === 'gas_mask') {
                soundManager.playGasMaskBreathe();
                spawnMeme('GAS MASK ON! 100% IMMUNITY', '#10b981');
              } else if (p.type === 'riot_shield') {
                soundManager.playShieldDeflect();
                spawnMeme('RIOT SHIELD ACTIVATED!', '#38bdf8');
              } else if (p.type === 'chai_boost') {
                spawnMeme('CUTTING CHAI MATRIX SLOW-MO!', '#f59e0b');
              } else if (p.type === 'viral_magnet') {
                spawnMeme('VIRAL REEL MAGNET ON!', '#ec4899');
              }
            }
          }
        });
        s.powerUps = s.powerUps.filter(p => p.z > 0 && !p.collected);

        // Move & check obstacles
        let collided = false;
        let collisionCause = '';

        s.obstacles.forEach(obs => {
          obs.z -= entityMoveDist;

          // Check tear gas haze presence
          if (obs.type === 'teargas' && obs.z < 350 && obs.z > 0) {
            if (!hasGasMask) {
              s.tearGasHaze = Math.min(0.7, s.tearGasHaze + dt * 1.5);
            } else {
              s.tearGasHaze = Math.max(0, s.tearGasHaze - dt * 3);
            }
          } else {
            s.tearGasHaze = Math.max(0, s.tearGasHaze - dt * 0.8);
          }

          // Hit detection window: z is near camera (30 to 80)
          if (obs.active && obs.z > 25 && obs.z < 85) {
            const laneOverlap = Math.abs(obs.lane - s.lane) < 0.62;

            if (laneOverlap) {
              // 1. Water Cannon
              if (obs.type === 'cannon') {
                if (hasShield) {
                  // Protected by shield!
                  obs.active = false;
                  s.cannonsBlocked++;
                  s.score += 500;
                  s.screenShake = 3;
                  s.waterSprayFX = 1.2;
                  soundManager.playShieldDeflect();
                  spawnMeme('BLOCKED WATER JET! +500', '#38bdf8');
                } else if (s.invincibleTimer <= 0) {
                  collided = true;
                  collisionCause = 'cannon';
                }
              }
              // 2. Tear Gas Cloud
              else if (obs.type === 'teargas') {
                if (hasGasMask) {
                  // Immune via gas mask!
                  obs.active = false;
                  s.gasSurvived++;
                  s.score += 300;
                  soundManager.playGasMaskBreathe();
                  spawnMeme('GAS CLEARED! +300', '#10b981');
                } else if (s.invincibleTimer <= 0) {
                  // Tear gas slows down or crashes without mask
                  collided = true;
                  collisionCause = 'teargas';
                }
              }
              // 3. Roadblock (jumpable or blockable with shield)
              else if (obs.type === 'roadblock') {
                if (s.isJumping && s.yOffset > 35) {
                  // Successfully jumped over!
                  obs.active = false;
                  s.score += 200;
                  spawnMeme('CLEAN JUMP! +200', '#facc15');
                } else if (hasShield) {
                  obs.active = false;
                  s.score += 250;
                  soundManager.playShieldDeflect();
                  spawnMeme('SHIELD SMASH! +250', '#38bdf8');
                } else if (s.invincibleTimer <= 0) {
                  collided = true;
                  collisionCause = 'roadblock';
                }
              }
              // 4. Barricade (Delhi Police Steel Barricade)
              else if (obs.type === 'barricade') {
                if (s.isJumping && s.yOffset > 55) {
                  // Vaulted high over barricade!
                  obs.active = false;
                  s.barricadesDodged++;
                  s.score += 350;
                  spawnMeme('HIGH VAULT OVER BARRICADE!', '#a855f7');
                } else if (hasShield) {
                  obs.active = false;
                  s.barricadesDodged++;
                  s.score += 300;
                  soundManager.playShieldDeflect();
                  spawnMeme('BARRICADE BASHED!', '#38bdf8');
                } else if (s.invincibleTimer <= 0) {
                  collided = true;
                  collisionCause = 'barricade';
                }
              }
            } else if (obs.z < 40 && obs.active) {
              // Successfully dodged by lane switch!
              obs.active = false;
              s.barricadesDodged++;
              s.score += 100;
              if (Math.random() < 0.25) {
                const randomMeme = MEME_QUIPS[Math.floor(Math.random() * MEME_QUIPS.length)];
                spawnMeme(randomMeme);
              }
            }
          }
        });
        s.obstacles = s.obstacles.filter(obs => obs.z > 0);

        // Update meme popups
        s.memePopups.forEach(m => {
          m.y -= dt * 45;
          m.lifespan--;
          m.opacity = Math.max(0, m.lifespan / 60);
        });
        s.memePopups = s.memePopups.filter(m => m.lifespan > 0);

        // Notify HUD
        onStatsUpdate({
          score: s.score,
          distance: Math.floor(s.distance),
          coinsCollected: s.coinsCollected,
          barricadesDodged: s.barricadesDodged,
          cannonsBlocked: s.cannonsBlocked,
          gasSurvived: s.gasSurvived,
          currentDistrictIndex: s.currentDistrictIdx,
          highScore: 0,
          totalCoins: 0,
          revivesUsed: 0,
        }, [...s.activePowerUps]);

        // Handle Collision / Game Over
        if (collided) {
          s.isRunning = false;
          s.screenShake = 12;
          soundManager.playCrash();

          let causeText = 'Caught by Barricade!';
          if (collisionCause === 'cannon') causeText = 'Blasted by Water Cannon! (Tip: Grab Shield)';
          if (collisionCause === 'teargas') causeText = 'Tear Gas Cough-out! (Tip: Wear Goggles)';
          if (collisionCause === 'roadblock') causeText = 'Tripped on Roadblock!';

          spawnMeme(causeText, '#ef4444');

          setTimeout(() => {
            onGameOver({
              score: s.score,
              distance: Math.floor(s.distance),
              coinsCollected: s.coinsCollected,
              barricadesDodged: s.barricadesDodged,
              cannonsBlocked: s.cannonsBlocked,
              gasSurvived: s.gasSurvived,
              currentDistrictIndex: s.currentDistrictIdx,
              highScore: 0,
              totalCoins: 0,
              revivesUsed: 0,
            });
          }, 800);
        }
      }

      // ================= RENDERING =================
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Apply screen shake
      if (s.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * s.screenShake * 3;
        const shakeY = (Math.random() - 0.5) * s.screenShake * 3;
        ctx.translate(shakeX, shakeY);
      }

      // 1. SKY / HORIZON
      const horizonY = height * 0.42;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, district.skyColorTop);
      skyGrad.addColorStop(1, district.skyColorBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Background Landmark Art / Backdrop
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.65;
        // Draw centered along horizon with subtle parallax offset
        const bgWidth = width * 1.05;
        const bgHeight = horizonY * 1.05;
        const parallaxX = (width - bgWidth) / 2 - (s.lane - 1) * 15;
        ctx.drawImage(bgImg, parallaxX, 0, bgWidth, bgHeight);
        ctx.restore();
      }

      // 2. 3D PERSPECTIVE ROAD
      const roadTopWidth = width * 0.28;
      const roadBottomWidth = width * 0.94;
      const roadTopLeft = (width - roadTopWidth) / 2;
      const roadBottomLeft = (width - roadBottomWidth) / 2;

      // Road Surface
      ctx.beginPath();
      ctx.moveTo(roadTopLeft, horizonY);
      ctx.lineTo(roadTopLeft + roadTopWidth, horizonY);
      ctx.lineTo(roadBottomLeft + roadBottomWidth, height);
      ctx.lineTo(roadBottomLeft, height);
      ctx.closePath();
      ctx.fillStyle = district.roadColor;
      ctx.fill();

      // Road Curbs with alternating caution stripes
      const numCurbs = 18;
      for (let i = 0; i < numCurbs; i++) {
        const z0 = ((i * 60 + s.roadScroll * 1.5) % 1100) / 1100;
        const z1 = (((i + 1) * 60 + s.roadScroll * 1.5) % 1100) / 1100;
        if (z1 < z0) continue;

        const y0 = horizonY + (height - horizonY) * Math.pow(z0, 2);
        const y1 = horizonY + (height - horizonY) * Math.pow(z1, 2);
        const rw0 = roadTopWidth + (roadBottomWidth - roadTopWidth) * z0;
        const rw1 = roadTopWidth + (roadBottomWidth - roadTopWidth) * z1;
        const rx0 = (width - rw0) / 2;
        const rx1 = (width - rw1) / 2;

        ctx.fillStyle = i % 2 === 0 ? district.curbColor : '#ffffff';
        // Left Curb
        ctx.beginPath();
        ctx.moveTo(rx0 - 12 * z0, y0);
        ctx.lineTo(rx0, y0);
        ctx.lineTo(rx1, y1);
        ctx.lineTo(rx1 - 12 * z1, y1);
        ctx.fill();

        // Right Curb
        ctx.beginPath();
        ctx.moveTo(rx0 + rw0, y0);
        ctx.lineTo(rx0 + rw0 + 12 * z0, y0);
        ctx.lineTo(rx1 + rw1 + 12 * z1, y1);
        ctx.lineTo(rx1 + rw1, y1);
        ctx.fill();
      }

      // Lane dividers (dashed perspective lines)
      const numLanes = district.lanes;
      for (let l = 1; l < numLanes; l++) {
        const laneRatio = l / numLanes;
        ctx.strokeStyle = district.laneColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([14, 18]);
        ctx.lineDashOffset = -s.roadScroll * 2;

        ctx.beginPath();
        const startX = roadTopLeft + roadTopWidth * laneRatio;
        const endX = roadBottomLeft + roadBottomWidth * laneRatio;
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Perspective Projection Helper
      const project = (laneIndex: number, z: number, yOff: number = 0) => {
        const normZ = Math.max(0, Math.min(1, 1 - z / 1100)); // 0 at horizon, 1 at camera
        const scale = Math.pow(normZ, 2.2);
        const roadW = roadTopWidth + (roadBottomWidth - roadTopWidth) * scale;
        const roadX = (width - roadW) / 2;
        const laneWidth = roadW / numLanes;
        const screenX = roadX + (laneIndex + 0.5) * laneWidth;
        const screenY = horizonY + (height - horizonY) * scale - yOff * scale * 2.2;
        return { x: screenX, y: screenY, scale: Math.max(0.12, scale) };
      };

      // 3. DRAW COLLECTIBLE COINS
      s.coins.forEach(c => {
        const p = project(c.lane, c.z, 20);
        if (p.scale > 0.1) {
          const coinRadius = 14 * p.scale;
          ctx.save();
          ctx.translate(p.x, p.y);
          // Coin glow
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(0, 0, coinRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 2 * p.scale;
          ctx.stroke();

          // ₹ symbol
          ctx.fillStyle = '#713f12';
          ctx.font = `bold ${Math.max(8, 14 * p.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('₹', 0, 1);
          ctx.restore();
        }
      });

      // 4. DRAW POWER-UPS
      s.powerUps.forEach(pu => {
        const p = project(pu.lane, pu.z, 30);
        if (p.scale > 0.1) {
          const size = 38 * p.scale;
          ctx.save();
          ctx.translate(p.x, p.y);

          // Orb backdrop
          let orbColor = '#10b981';
          let symbol = '🥽';
          if (pu.type === 'riot_shield') { orbColor = '#38bdf8'; symbol = '🛡️'; }
          if (pu.type === 'chai_boost') { orbColor = '#f59e0b'; symbol = '☕'; }
          if (pu.type === 'viral_magnet') { orbColor = '#ec4899'; symbol = '🧲'; }

          ctx.fillStyle = orbColor;
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2 * p.scale;
          ctx.stroke();

          ctx.font = `${Math.max(10, 20 * p.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbol, 0, 0);
          ctx.restore();
        }
      });

      // 5. DRAW OBSTACLES
      // Sort obstacles by distance so furthest render first
      const sortedObstacles = [...s.obstacles].sort((a, b) => b.z - a.z);

      sortedObstacles.forEach(obs => {
        const p = project(obs.lane, obs.z, 0);
        if (p.scale <= 0.08) return;

        ctx.save();
        ctx.translate(p.x, p.y);

        // A. Yellow Steel Barricade
        if (obs.type === 'barricade') {
          const bw = 90 * p.scale;
          const bh = 54 * p.scale;

          // Metal Frame
          ctx.fillStyle = '#facc15'; // Delhi yellow
          ctx.fillRect(-bw / 2, -bh, bw, bh);

          // Diagonal black caution stripes
          ctx.save();
          ctx.beginPath();
          ctx.rect(-bw / 2, -bh, bw, bh);
          ctx.clip();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 10 * p.scale;
          for (let sx = -bw; sx < bw * 2; sx += 20 * p.scale) {
            ctx.beginPath();
            ctx.moveTo(sx, -bh);
            ctx.lineTo(sx - 15 * p.scale, 0);
            ctx.stroke();
          }
          ctx.restore();

          // Outer steel frame and border
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 3 * p.scale;
          ctx.strokeRect(-bw / 2, -bh, bw, bh);

          // Top warning blinker light
          const blink = Math.floor(Date.now() / 250) % 2 === 0;
          ctx.fillStyle = blink ? '#ef4444' : '#7f1d1d';
          ctx.beginPath();
          ctx.arc(0, -bh - 6 * p.scale, 5 * p.scale, 0, Math.PI * 2);
          ctx.fill();

          // Barricade legs
          ctx.fillStyle = '#334155';
          ctx.fillRect(-bw / 2 + 4 * p.scale, 0, 8 * p.scale, 8 * p.scale);
          ctx.fillRect(bw / 2 - 12 * p.scale, 0, 8 * p.scale, 8 * p.scale);
        }

        // B. Water / Foam Cannon Truck & Spray
        else if (obs.type === 'cannon') {
          const cw = 110 * p.scale;
          const ch = 70 * p.scale;

          // Truck chassis
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-cw / 2, -ch, cw, ch * 0.75);

          // Siren lights
          ctx.fillStyle = Math.floor(Date.now() / 150) % 2 === 0 ? '#ef4444' : '#3b82f6';
          ctx.fillRect(-cw / 4, -ch - 8 * p.scale, cw / 2, 7 * p.scale);

          // Cannon Turret on top
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(0, -ch + 5 * p.scale, 14 * p.scale, Math.PI, 0);
          ctx.fill();

          // Nozzle
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-6 * p.scale, -ch - 6 * p.scale, 12 * p.scale, 12 * p.scale);

          // Water jet spray coming forward towards camera!
          ctx.save();
          const sprayGrad = ctx.createLinearGradient(0, -ch, 0, 60 * p.scale);
          sprayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          sprayGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
          sprayGrad.addColorStop(1, 'rgba(14, 165, 233, 0.2)');
          ctx.fillStyle = sprayGrad;

          ctx.beginPath();
          ctx.moveTo(-8 * p.scale, -ch);
          ctx.lineTo(8 * p.scale, -ch);
          ctx.lineTo(26 * p.scale, 50 * p.scale);
          ctx.lineTo(-26 * p.scale, 50 * p.scale);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // C. Tear-Gas Smoke Cloud
        else if (obs.type === 'teargas') {
          const r = 50 * p.scale;
          ctx.save();
          const gasGrad = ctx.createRadialGradient(0, -r, 5, 0, -r, r * 1.4);
          gasGrad.addColorStop(0, 'rgba(163, 230, 53, 0.85)'); // lime green chemical
          gasGrad.addColorStop(0.6, 'rgba(202, 138, 4, 0.5)');
          gasGrad.addColorStop(1, 'rgba(74, 222, 128, 0)');
          ctx.fillStyle = gasGrad;

          ctx.beginPath();
          ctx.arc(0, -r, r * 1.3, 0, Math.PI * 2);
          ctx.fill();

          // Little swirling puffs
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(-r * 0.4, -r * 1.2, r * 0.5, 0, Math.PI * 2);
          ctx.arc(r * 0.4, -r * 0.8, r * 0.6, 0, Math.PI * 2);
          ctx.fill();

          // Warning Skull / Gas icon
          ctx.fillStyle = '#14532d';
          ctx.font = `bold ${Math.max(10, 18 * p.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('⚠️ GAS', 0, -r);
          ctx.restore();
        }

        // D. Roadblock / Spike barrier
        else if (obs.type === 'roadblock') {
          const rw = 75 * p.scale;
          const rh = 34 * p.scale;

          ctx.fillStyle = '#ea580c'; // Construction orange
          ctx.fillRect(-rw / 2, -rh, rw, rh);

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-rw / 2, -rh * 0.6, rw, rh * 0.3);

          ctx.strokeStyle = '#9a3412';
          ctx.lineWidth = 2 * p.scale;
          ctx.strokeRect(-rw / 2, -rh, rw, rh);

          // Arrow direction decals
          ctx.fillStyle = '#000000';
          ctx.font = `bold ${Math.max(8, 12 * p.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('▲ JUMP ▲', 0, -rh * 0.25);
        }

        ctx.restore();
      });

      // 6. DRAW PLAYABLE CHARACTER
      const playerPos = project(s.lane, 50, s.yOffset);
      const pScale = playerPos.scale;
      const charW = 54 * pScale;
      const charH = (s.isSliding ? 40 : 86) * pScale;
      const charX = playerPos.x;
      const charY = playerPos.y;

      ctx.save();
      ctx.translate(charX, charY);

      // Lane switch tilt
      const laneTilt = (s.targetLane - s.lane) * 0.22;
      ctx.rotate(laneTilt);

      // Invincibility flashing
      if (s.invincibleTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Shadow on asphalt
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 0, charW * 0.65, charW * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Matrix Chai Trail FX
      if (s.activePowerUps.some(p => p.type === 'chai_boost')) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.fillRect(-charW / 2 - 8, -charH + 5, charW + 16, charH);
      }

      // Character Body & Styling
      const legCycle = Math.sin(s.runFrame);

      if (s.isSliding) {
        // Sliding posture (low horizontal skid)
        ctx.fillStyle = character.outfitColor;
        ctx.fillRect(-charW * 0.6, -charH * 0.9, charW * 1.2, charH * 0.7);

        // Sparks & dust puffs
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let sp = 0; sp < 4; sp++) {
          ctx.beginPath();
          ctx.arc(
            -charW * 0.6 + Math.random() * charW * 1.2,
            -Math.random() * 8,
            3 * pScale,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Head looking forward
        ctx.fillStyle = '#fbcfe8'; // skin
        ctx.beginPath();
        ctx.arc(charW * 0.5, -charH * 0.6, 12 * pScale, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = character.hairColor;
        ctx.beginPath();
        ctx.arc(charW * 0.45, -charH * 0.7, 13 * pScale, Math.PI * 0.8, Math.PI * 1.8);
        ctx.fill();
      } else {
        // Running Legs
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 8 * pScale;
        ctx.lineCap = 'round';

        // Left Leg
        ctx.beginPath();
        ctx.moveTo(-charW * 0.2, -charH * 0.4);
        ctx.lineTo(-charW * 0.25 + legCycle * 14 * pScale, 0);
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        ctx.moveTo(charW * 0.2, -charH * 0.4);
        ctx.lineTo(charW * 0.25 - legCycle * 14 * pScale, 0);
        ctx.stroke();

        // Sneakers (Neon Sole)
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-charW * 0.35 + legCycle * 14 * pScale, -4 * pScale, 14 * pScale, 6 * pScale);
        ctx.fillRect(charW * 0.15 - legCycle * 14 * pScale, -4 * pScale, 14 * pScale, 6 * pScale);

        // Torso / Outfit
        ctx.fillStyle = character.outfitColor;
        ctx.beginPath();
        ctx.roundRect(-charW * 0.35, -charH * 0.78, charW * 0.7, charH * 0.44, 8 * pScale);
        ctx.fill();

        // Backpack on back
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-charW * 0.42, -charH * 0.74, 8 * pScale, charH * 0.32);

        // Protest Placard strapped or held high
        ctx.save();
        ctx.translate(charW * 0.35, -charH * 0.85);
        ctx.rotate(-0.15 + Math.sin(s.runFrame * 0.5) * 0.08);

        // Stick
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-2 * pScale, 0, 4 * pScale, 35 * pScale);

        // Signboard
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2 * pScale;
        ctx.fillRect(-28 * pScale, -26 * pScale, 56 * pScale, 26 * pScale);
        ctx.strokeRect(-28 * pScale, -26 * pScale, 56 * pScale, 26 * pScale);

        // Slogan text
        ctx.fillStyle = '#e11d48';
        ctx.font = `900 ${Math.max(6, 7 * pScale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(character.placardText, 0, -12 * pScale);
        ctx.restore();

        // Head / Face
        ctx.fillStyle = '#fed7aa'; // warm skin tone
        ctx.beginPath();
        ctx.arc(0, -charH * 0.85, 14 * pScale, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = character.hairColor;
        if (character.gender === 'female') {
          // High Ponytail / Braids
          ctx.beginPath();
          ctx.arc(0, -charH * 0.88, 15 * pScale, Math.PI, 0);
          ctx.fill();
          // Ponytail swinging
          ctx.fillRect(-18 * pScale, -charH * 0.95, 8 * pScale, 24 * pScale);
        } else {
          // Fade / Cap
          ctx.beginPath();
          ctx.arc(0, -charH * 0.88, 15 * pScale, Math.PI * 0.9, Math.PI * 0.1);
          ctx.fill();
        }

        // Expressive Panic / Hype Eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-5 * pScale, -charH * 0.86, 2.5 * pScale, 0, Math.PI * 2);
        ctx.arc(5 * pScale, -charH * 0.86, 2.5 * pScale, 0, Math.PI * 2);
        ctx.fill();

        // Open mouth shouting "BHAG!"
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.arc(0, -charH * 0.80, 4 * pScale, 0, Math.PI);
        ctx.fill();
      }

      // POWER-UP OVERLAYS ON CHARACTER
      // 1. Gas Mask / Goggles
      if (s.activePowerUps.some(p => p.type === 'gas_mask')) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3 * pScale;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';

        // Double Goggle Lenses
        ctx.beginPath();
        ctx.arc(-6 * pScale, -charH * 0.86, 6 * pScale, 0, Math.PI * 2);
        ctx.arc(6 * pScale, -charH * 0.86, 6 * pScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Respirator Filter on mouth
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(-7 * pScale, -charH * 0.79, 14 * pScale, 8 * pScale);
      }

      // 2. Riot Shield Barrier
      if (s.activePowerUps.some(p => p.type === 'riot_shield')) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4 * pScale;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';

        // Holographic riot shield curvature
        ctx.beginPath();
        ctx.arc(0, -charH * 0.5, charW * 0.9, -0.6, 0.6);
        ctx.fill();
        ctx.stroke();

        // Shield emblem
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(10, 18 * pScale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('🛡️', 10 * pScale, -charH * 0.5);
        ctx.restore();
      }

      // 3. Viral Magnet Aura
      if (s.activePowerUps.some(p => p.type === 'viral_magnet')) {
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
        ctx.lineWidth = 2 * pScale;
        ctx.beginPath();
        ctx.arc(0, -charH * 0.5, charW * 1.1, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // 7. TEAR GAS HAZE FULLSCREEN OVERLAY
      if (s.tearGasHaze > 0) {
        ctx.fillStyle = `rgba(132, 204, 22, ${s.tearGasHaze * 0.65})`;
        ctx.fillRect(0, 0, width, height);

        // Gas warning vignette
        ctx.strokeStyle = `rgba(234, 179, 8, ${s.tearGasHaze})`;
        ctx.lineWidth = 14;
        ctx.strokeRect(0, 0, width, height);
      }

      // 8. WATER JET SPLASH EFFECT
      if (s.waterSprayFX > 0) {
        ctx.fillStyle = `rgba(186, 230, 253, ${s.waterSprayFX * 0.5})`;
        ctx.fillRect(0, 0, width, height);
      }

      // 9. RENDER MEME FLOAT POPUPS
      s.memePopups.forEach(m => {
        ctx.save();
        ctx.globalAlpha = m.opacity;
        ctx.font = '900 20px "Bricolage Grotesque", sans-serif';
        ctx.textAlign = 'center';

        // Black outline for readability
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(m.text, m.x, m.y);

        ctx.fillStyle = m.color;
        ctx.fillText(m.text, m.x, m.y);
        ctx.restore();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [district, isPaused, character, onGameOver, onStatsUpdate, onDistrictChange, spawnMeme]);

  return (
    <div 
      className="relative w-full h-full select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block bg-slate-950"
      />
    </div>
  );
};
