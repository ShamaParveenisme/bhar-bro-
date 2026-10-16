export type CharacterGender = 'male' | 'female';

export interface CharacterConfig {
  id: string;
  name: string;
  gender: CharacterGender;
  role: string;
  bio: string;
  outfit: string;
  outfitColor: string;
  hairStyle: string;
  hairColor: string;
  placardText: string;
  unlocked: boolean;
  cost: number;
}

export type DistrictId = 'jantar_mantar' | 'india_gate' | 'lal_qila';

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  subtitle: string;
  inspiredBy: string;
  desc: string;
  lanes: number;
  roadColor: string;
  laneColor: string;
  curbColor: string;
  skyColorTop: string;
  skyColorBottom: string;
  accentColor: string;
  backgroundImage: string;
  baseSpeed: number;
  obstacleRate: number;
  hazards: ('barricade' | 'cannon' | 'teargas' | 'roadblock')[];
}

export type ObstacleType = 
  | 'barricade'      // Standard Delhi police steel barricade
  | 'cannon'         // Water/foam cannon vehicle spraying jet
  | 'teargas'        // Spreading tear-gas smoke cloud
  | 'roadblock';     // Low concrete/cone road block to jump or dodge

export interface Obstacle {
  id: number;
  type: ObstacleType;
  lane: number;      // 0: left, 1: center, 2: right (or 0-3 for 4 lanes)
  z: number;         // Distance along road (e.g. 1000 down to 0)
  width: number;
  height: number;
  active: boolean;
  // Specific properties
  cannonSpraying?: boolean;
  cannonSprayTimer?: number;
  gasRadius?: number;
}

export type PowerUpType = 
  | 'gas_mask'       // Protects against tear gas + clear vision
  | 'riot_shield'    // Blocks water cannon hits & roadblocks
  | 'chai_boost'     // Slow motion matrix reflex & 2x score
  | 'viral_magnet';  // Pulls in all coins and protest flyers

export interface PowerUpItem {
  id: number;
  type: PowerUpType;
  lane: number;
  z: number;
  collected: boolean;
}

export interface CoinItem {
  id: number;
  lane: number;
  z: number;
  collected: boolean;
  value: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number; // in seconds
  maxTime: number;
}

export interface MemePopup {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
  opacity: number;
  lifespan: number;
}

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LOCKER' | 'UPLOAD_KIT' | 'HOW_TO_PLAY';

export interface GameStats {
  score: number;
  distance: number; // in meters
  coinsCollected: number;
  barricadesDodged: number;
  cannonsBlocked: number;
  gasSurvived: number;
  currentDistrictIndex: number;
  highScore: number;
  totalCoins: number;
  revivesUsed: number;
}
