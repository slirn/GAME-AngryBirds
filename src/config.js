export const GAME_CONFIG = {
    title: '愤怒的小鸟',
    version: '1.0.0',
    
    physics: {
        gravity: 1,
        slingshot: {
            x: 200,
            y: 500,
            maxStretch: 150,
            elasticity: 0.8
        }
    },
    
    birds: {
        types: [
            { name: 'red', color: 0xff0000, power: 1, special: null },
            { name: 'yellow', color: 0xffff00, power: 1.5, special: 'speed' },
            { name: 'blue', color: 0x0000ff, power: 0.7, special: 'split' },
            { name: 'black', color: 0x333333, power: 2, special: 'explode' },
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
            { name: 'wood', density: 0.002, friction: 0.6, restitution: 0.3, health: 2 },
            { name: 'glass', density: 0.001, friction: 0.4, restitution: 0.1, health: 1 },
            { name: 'stone', density: 0.005, friction: 0.8, restitution: 0.2, health: 4 }
        ]
    },
    
    levels: [
        { 
            id: 1, 
            name: '第一关', 
            birds: ['red', 'red', 'red'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'small', x: 900, y: 640 },
                { type: 'small', x: 1000, y: 640 }
            ],
            blocks: [
                { type: 'wood', x: 850, y: 580, width: 20, height: 100 },
                { type: 'wood', x: 1050, y: 580, width: 20, height: 100 },
                { type: 'wood', x: 950, y: 520, width: 220, height: 20 }
            ]
        },
        { 
            id: 2, 
            name: '第二关', 
            birds: ['red', 'yellow', 'red'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'small', x: 800, y: 640 },
                { type: 'medium', x: 950, y: 640 },
                { type: 'small', x: 1100, y: 640 }
            ],
            blocks: [
                { type: 'wood', x: 750, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 850, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 1050, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 1150, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 800, y: 550, width: 120, height: 20 },
                { type: 'wood', x: 1100, y: 550, width: 120, height: 20 },
                { type: 'glass', x: 950, y: 580, width: 20, height: 100 }
            ]
        },
        { 
            id: 3, 
            name: '第三关', 
            birds: ['blue', 'blue', 'red'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'small', x: 800, y: 640 },
                { type: 'small', x: 950, y: 640 },
                { type: 'medium', x: 1100, y: 640 }
            ],
            blocks: [
                { type: 'glass', x: 750, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 850, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 900, y: 560, width: 120, height: 20 },
                { type: 'glass', x: 1000, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 1050, y: 560, width: 120, height: 20 },
                { type: 'glass', x: 1150, y: 600, width: 20, height: 60 }
            ]
        },
        { 
            id: 4, 
            name: '第四关', 
            birds: ['yellow', 'yellow', 'red'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'medium', x: 850, y: 640 },
                { type: 'medium', x: 1050, y: 640 }
            ],
            blocks: [
                { type: 'stone', x: 800, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 900, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 1000, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 1100, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 850, y: 550, width: 120, height: 20 },
                { type: 'stone', x: 1050, y: 550, width: 120, height: 20 },
                { type: 'wood', x: 950, y: 580, width: 20, height: 100 }
            ]
        },
        { 
            id: 5, 
            name: '第五关', 
            birds: ['red', 'blue', 'yellow'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'small', x: 800, y: 640 },
                { type: 'small', x: 950, y: 640 },
                { type: 'medium', x: 1100, y: 640 }
            ],
            blocks: [
                { type: 'glass', x: 750, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 850, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 800, y: 560, width: 120, height: 20 },
                { type: 'wood', x: 900, y: 600, width: 20, height: 60 },
                { type: 'wood', x: 1000, y: 600, width: 20, height: 60 },
                { type: 'wood', x: 950, y: 560, width: 120, height: 20 },
                { type: 'glass', x: 1050, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 1150, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 1100, y: 560, width: 120, height: 20 }
            ]
        },
        { 
            id: 6, 
            name: '第六关', 
            birds: ['black', 'red', 'red'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'large', x: 850, y: 640 },
                { type: 'medium', x: 1050, y: 640 }
            ],
            blocks: [
                { type: 'stone', x: 800, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 900, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 850, y: 520, width: 120, height: 20 },
                { type: 'wood', x: 1000, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 1100, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 1050, y: 550, width: 120, height: 20 }
            ]
        },
        { 
            id: 7, 
            name: '第七关', 
            birds: ['blue', 'yellow', 'red', 'red'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'small', x: 750, y: 640 },
                { type: 'small', x: 950, y: 640 },
                { type: 'medium', x: 1150, y: 640 }
            ],
            blocks: [
                { type: 'glass', x: 700, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 800, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 750, y: 560, width: 120, height: 20 },
                { type: 'wood', x: 900, y: 600, width: 20, height: 60 },
                { type: 'wood', x: 1000, y: 600, width: 20, height: 60 },
                { type: 'wood', x: 950, y: 560, width: 120, height: 20 },
                { type: 'glass', x: 1100, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 1200, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 1150, y: 560, width: 120, height: 20 }
            ]
        },
        { 
            id: 8, 
            name: '第八关', 
            birds: ['black', 'yellow', 'blue'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'king', x: 950, y: 640 },
                { type: 'large', x: 800, y: 640 },
                { type: 'large', x: 1100, y: 640 }
            ],
            blocks: [
                { type: 'wood', x: 750, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 850, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 800, y: 550, width: 120, height: 20 },
                { type: 'stone', x: 900, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 1000, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 950, y: 550, width: 120, height: 20 },
                { type: 'wood', x: 1050, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 1150, y: 600, width: 20, height: 80 },
                { type: 'wood', x: 1100, y: 550, width: 120, height: 20 }
            ]
        },
        { 
            id: 9, 
            name: '第九关', 
            birds: ['red', 'red', 'yellow', 'blue', 'black'], 
            stars: [1, 2, 3],
            pigs: [
                { type: 'small', x: 700, y: 640 },
                { type: 'medium', x: 850, y: 640 },
                { type: 'large', x: 1000, y: 640 },
                { type: 'medium', x: 1150, y: 640 }
            ],
            blocks: [
                { type: 'wood', x: 650, y: 600, width: 20, height: 60 },
                { type: 'wood', x: 750, y: 600, width: 20, height: 60 },
                { type: 'wood', x: 700, y: 560, width: 120, height: 20 },
                { type: 'glass', x: 800, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 900, y: 600, width: 20, height: 60 },
                { type: 'glass', x: 850, y: 560, width: 120, height: 20 },
                { type: 'stone', x: 950, y: 600, width: 20, height: 60 },
                { type: 'stone', x: 1050, y: 600, width: 20, height: 60 },
                { type: 'stone', x: 1000, y: 560, width: 120, height: 20 },
                { type: 'wood', x: 1100, y: 600, width: 20, height: 60 },
                { type: 'wood', x: 1200, y: 600, width: 20, height: 60 },
                { type: 'wood', x: 1150, y: 560, width: 120, height: 20 }
            ]
        },
        {
            id: 10,
            name: '第十关',
            birds: ['black', 'black', 'yellow', 'blue', 'red'],
            stars: [1, 2, 3],
            pigs: [
                { type: 'king', x: 950, y: 640 },
                { type: 'large', x: 800, y: 640 },
                { type: 'large', x: 1100, y: 640 }
            ],
            blocks: [
                { type: 'stone', x: 750, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 850, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 800, y: 520, width: 120, height: 20 },
                { type: 'stone', x: 900, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 1000, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 950, y: 550, width: 120, height: 20 },
                { type: 'stone', x: 1050, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 1150, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 1100, y: 520, width: 120, height: 20 }
            ]
        },
        {
            id: 11,
            name: '第十一关',
            birds: ['white', 'black', 'yellow', 'blue', 'red', 'red'],
            stars: [1, 2, 3],
            pigs: [
                { type: 'king', x: 950, y: 640 },
                { type: 'large', x: 800, y: 640 },
                { type: 'large', x: 1100, y: 640 },
                { type: 'medium', x: 700, y: 640 },
                { type: 'medium', x: 1200, y: 640 }
            ],
            blocks: [
                { type: 'stone', x: 650, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 750, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 700, y: 550, width: 120, height: 20 },
                { type: 'stone', x: 850, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 950, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 900, y: 520, width: 120, height: 20 },
                { type: 'stone', x: 1050, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 1150, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 1100, y: 520, width: 120, height: 20 },
                { type: 'stone', x: 1200, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 1300, y: 600, width: 20, height: 80 },
                { type: 'stone', x: 1250, y: 550, width: 120, height: 20 }
            ]
        },
        {
            id: 12,
            name: '第十二关',
            birds: ['white', 'black', 'black', 'yellow', 'blue', 'red', 'red'],
            stars: [1, 2, 3],
            pigs: [
                { type: 'king', x: 950, y: 640 },
                { type: 'king', x: 750, y: 640 },
                { type: 'king', x: 1150, y: 640 },
                { type: 'large', x: 850, y: 640 },
                { type: 'large', x: 1050, y: 640 }
            ],
            blocks: [
                { type: 'stone', x: 700, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 800, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 750, y: 520, width: 120, height: 20 },
                { type: 'stone', x: 900, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 1000, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 950, y: 520, width: 120, height: 20 },
                { type: 'stone', x: 1100, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 1200, y: 580, width: 20, height: 100 },
                { type: 'stone', x: 1150, y: 520, width: 120, height: 20 },
                { type: 'stone', x: 850, y: 480, width: 20, height: 80 },
                { type: 'stone', x: 1050, y: 480, width: 20, height: 80 },
                { type: 'stone', x: 950, y: 440, width: 220, height: 20 }
            ]
        }
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
