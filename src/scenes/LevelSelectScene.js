import Phaser from 'phaser';
import { GAME_CONFIG, STORAGE_KEYS } from '../config.js';

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);
        
        this.add.text(width / 2, 80, '选择关卡', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        const unlockedLevels = this.getUnlockedLevels();
        
        const levels = GAME_CONFIG.levels;
        const cols = 3;
        const startX = width / 2 - (cols - 1) * 100;
        const startY = 200;
        
        levels.forEach((level, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * 200;
            const y = startY + row * 120;
            
            const isUnlocked = unlockedLevels.includes(level.id);
            this.createLevelButton(x, y, level, isUnlocked);
        });
        
        this.createButton(width / 2, height - 80, '返回', () => {
            this.scene.start('MenuScene');
        });
    }

    getUnlockedLevels() {
        const stored = localStorage.getItem(STORAGE_KEYS.unlockedLevels);
        return stored ? JSON.parse(stored) : [1];
    }

    createLevelButton(x, y, level, isUnlocked) {
        const bgColor = isUnlocked ? 0x27ae60 : 0x7f8c8d;
        const button = this.add.rectangle(x, y, 150, 80, bgColor)
            .setInteractive({ useHandCursor: isUnlocked });
        
        this.add.text(x, y - 10, level.name, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(x, y + 20, `第 ${level.id} 关`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#cccccc'
        }).setOrigin(0.5);
        
        if (isUnlocked) {
            button.on('pointerover', () => button.setFillStyle(0x2ecc71));
            button.on('pointerout', () => button.setFillStyle(0x27ae60));
            button.on('pointerdown', () => {
                this.scene.start('GameScene', { levelId: level.id });
            });
        } else {
            this.add.text(x + 50, y - 30, '🔒', { fontSize: '20px' });
        }
    }

    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 150, 50, 0xe74c3c)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.on('pointerover', () => button.setFillStyle(0xc0392b));
        button.on('pointerout', () => button.setFillStyle(0xe74c3c));
        button.on('pointerdown', callback);
        
        return button;
    }
}
