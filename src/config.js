export const GAME_CONFIG = {
    title: '愤怒的小鸟',
    version: '1.0.0',
    
    physics: {
        gravity: 1,
        slingshot: {
            x: 200,
            y: 500,
            maxStretch: 100,
            elasticity: 0.8
        }
    },
    
    birds: {
        types: [
            { name: 'red', color: 0xff0000, power: 1, special: null },
            { name: 'yellow', color: 0xffff00, power: 1.5, special: 'speed' },
            { name: 'blue', color: 0x0000ff, power: 0.7, special: 'split' },
            { name: 'black', color: 0x000000, power: 2, special: 'explode' },
            { name: 'white', color: 0xffffff, power: 1, special: 'egg' }
        ]
    },
    
    pigs: {
        types: [
            { name: 'small', health: 1, radius: 20, score: 500 },
            { name: 'medium', health: 2, radius: 30, score: 1000 },
            { name: 'large', health: 3, radius: 40, score: 2000 },
            { name: 'king', health: 5, radius: 50, score: 5000 }
        ]
    },
    
    blocks: {
        types: [
            { name: 'wood', density: 0.005, friction: 0.6, restitution: 0.3, health: 2 },
            { name: 'glass', density: 0.003, friction: 0.4, restitution: 0.1, health: 1 },
            { name: 'stone', density: 0.01, friction: 0.8, restitution: 0.2, health: 4 }
        ]
    },
    
    levels: [
        { id: 1, name: '第一关', birds: ['red', 'red', 'red'], stars: [1, 2, 3] },
        { id: 2, name: '第二关', birds: ['red', 'yellow', 'red'], stars: [1, 2, 3] },
        { id: 3, name: '第三关', birds: ['red', 'blue', 'blue'], stars: [1, 2, 3] }
    ],
    
    audio: {
        effects: ['launch', 'collision', 'destroy', 'pig_die', 'victory', 'defeat'],
        music: ['background', 'menu']
    }
};

export const STORAGE_KEYS = {
    highScores: 'angry_birds_high_scores',
    unlockedLevels: 'angry_birds_unlocked_levels',
    settings: 'angry_birds_settings'
};
