import { CharacterConfig, DistrictInfo } from '../types/game';

// Official Generated Image Assets
export const GAME_ICON_PATH = '/src/assets/images/bro_bhag_app_icon_1792154322567.jpg';
export const JANTAR_MANTAR_BG = '/src/assets/images/district_jantar_mantar_1792154322989.jpg';
export const INDIA_GATE_BG = '/src/assets/images/district_india_gate_1792154324237.jpg';
export const RED_FORT_BG = '/src/assets/images/district_red_fort_1792154323688.jpg';

export const PLAYABLE_CHARACTERS: CharacterConfig[] = [
  {
    id: 'kabir_streetwear',
    name: 'Kabir',
    gender: 'male',
    role: 'Streetwear Sprint King',
    bio: 'Fast on his feet, equipped with reflective neon sneakers and an unshakeable sense of humor.',
    outfit: 'Cyber Neon Hoodie & Shorts',
    outfitColor: '#10b981', // emerald neon
    hairStyle: 'Textured Fade',
    hairColor: '#1e293b',
    placardText: 'WIFI > PROMISES',
    unlocked: true,
    cost: 0,
  },
  {
    id: 'ananya_cyber',
    name: 'Ananya',
    gender: 'female',
    role: 'Cyber Rally Specialist',
    bio: 'Equipped with protective neon specs and a tactical cropped windbreaker. Never misses a dodge.',
    outfit: 'Acrobat Windbreaker & Cargo',
    outfitColor: '#ec4899', // hot pink
    hairStyle: 'High Braided Ponytail',
    hairColor: '#475569',
    placardText: 'WHERE IS THE CHAOS?',
    unlocked: true,
    cost: 0,
  },
  {
    id: 'vivaan_desi',
    name: 'Vivaan',
    gender: 'male',
    role: 'Desi Streetwear Maestro',
    bio: 'Runs in an iconic rolled-sleeve kurta with hype sneakers. Chai enthusiast and barricade skipper.',
    outfit: 'Rolled-Sleeve Kurta & Sneakers',
    outfitColor: '#f59e0b', // amber gold
    hairStyle: 'Messy Side Quiff',
    hairColor: '#0f172a',
    placardText: 'MORE CHAI, LESS LIES',
    unlocked: false,
    cost: 150,
  },
  {
    id: 'riya_oversized',
    name: 'Riya',
    gender: 'female',
    role: 'Gen Z Meme Activist',
    bio: 'Armed with camera rolling and oversized graphic hoodie. Expert at ducking water streams.',
    outfit: 'Oversized Purple Crewneck',
    outfitColor: '#8b5cf6', // purple
    hairStyle: 'Messy Top Bun',
    hairColor: '#334155',
    placardText: 'RUNNING FROM COMMITMENT',
    unlocked: false,
    cost: 250,
  },
];

export const DISTRICTS: DistrictInfo[] = [
  {
    id: 'jantar_mantar',
    name: 'District 1: Jantar Mantar',
    subtitle: 'The Historic Alleyway Sprint',
    inspiredBy: 'Jantar Mantar Historic Heritage District',
    desc: 'Narrower street layout, colorful meme placards, funny crowd reactions, and wooden & yellow police barricades.',
    lanes: 3,
    roadColor: '#2b2d42',
    laneColor: '#facc15',
    curbColor: '#ef233c',
    skyColorTop: '#1e1b4b',
    skyColorBottom: '#c2410c',
    accentColor: '#f59e0b',
    backgroundImage: JANTAR_MANTAR_BG,
    baseSpeed: 5.5,
    obstacleRate: 1.2,
    hazards: ['barricade', 'roadblock'],
  },
  {
    id: 'india_gate',
    name: 'District 2: India Gate Avenue',
    subtitle: 'The Grand Boulevard Pursuit',
    inspiredBy: 'Rajpath & India Gate Ceremonial Avenue',
    desc: 'Wider multi-lane boulevard, dusk atmosphere, faster sprint speeds, water/foam cannon trucks, and roadblock barriers.',
    lanes: 3,
    roadColor: '#1e293b',
    laneColor: '#ffffff',
    curbColor: '#f97316',
    skyColorTop: '#0f172a',
    skyColorBottom: '#ea580c',
    accentColor: '#38bdf8',
    backgroundImage: INDIA_GATE_BG,
    baseSpeed: 7.2,
    obstacleRate: 1.6,
    hazards: ['barricade', 'cannon', 'roadblock'],
  },
  {
    id: 'lal_qila',
    name: 'District 3: Lal Qila Fortress',
    subtitle: 'The Midnight Rampart Trial',
    inspiredBy: 'Lal Qila (Red Fort) Historic Battlements',
    desc: 'Sandstone fortress routes under night skies, dense barricades, combined tear-gas smoke clouds and high-pressure water streams.',
    lanes: 3,
    roadColor: '#18181b',
    laneColor: '#e11d48',
    curbColor: '#fbbf24',
    skyColorTop: '#09090b',
    skyColorBottom: '#7f1d1d',
    accentColor: '#f43f5e',
    backgroundImage: RED_FORT_BG,
    baseSpeed: 9.0,
    obstacleRate: 2.1,
    hazards: ['barricade', 'cannon', 'teargas', 'roadblock'],
  },
];

export const MEME_QUIPS = [
  'BRO BHAG!',
  'MOYE MOYE!',
  'SYSTUMMM!',
  'CAMERA ROLL KARO!',
  'AREE BHAI BHAI!',
  'NO CAP 100%',
  'CHAI BREAK RUN!',
  'DODGED IT CLEAN!',
  'BRO SAID NOT TODAY!',
  'SHEESH THAT SPEED!',
  'PEAK DELHI MOMENT!',
  'W ESCAPE ROUTE!',
];

export const PLACARD_MEMES = [
  'WIFI > PROMISES',
  'PLANETS ARE ALIGNED, MY WIFI ISN’T',
  'WHERE IS THE CHAOS??',
  'MORE CHAI, LESS LIES',
  'JUST HERE FOR THE VLOG',
  'BRO PLEASE DONT SLOW DOWN',
  'MY BACKPACK HAS 3 WATER BOTTLES',
  'NOT TODAY CANNON JETS',
];
