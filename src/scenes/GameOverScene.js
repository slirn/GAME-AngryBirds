import Phaser from 'phaser';
import { STORAGE_KEYS } from '../config.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.won = data.won;
        this.score = data.score || 0;
        this.levelId = data.levelId || 1;
    }

    create() {
        const { width, height } = this.cameras.main;
        
        const bgColor = this.won ? 0x27ae60 : 0xe74c3c;
        this.add.rectangle(width / 2, height / 2, width, height, bgColor);
        
        const title = this.won ? '恭喜过关！' : '游戏失败';
        const titleColor = this.won ? '#ffffff' : '#ffff00';
        
        this.add.text(width / 2, 150, title, {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: titleColor,
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        this.add.text(width / 2, 280, `得分: ${this.score}`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        if (this.won) {
            this.drawStars(width / 2, 380);
            this.saveProgress();
        }
        
        this.createButton(width / 2 - 120, 500, '重新开始', () => {
            this.scene.start('GameScene', { levelId: this.levelId });
        });
        
        this.createButton(width / 2 + 120, 500, '关卡选择', () => {
            this.scene.start('LevelSelectScene');
        });
        
        this.createButton(width / 2, 580, '返回主菜单', () => {
            this.scene.start('MenuScene');
        });
    }

    drawStars(x, y) {
        const starCount = this.calculateStars();
        
        for (let i = 0; i < 3; i++) {
            const starX = x + (i - 1) * 80;
            const filled = i < starCount;
            
            this.add.text(starX, y, '★', {
                fontSize: '60px',
                color: filled ? '#ffd700' : '#666666'
            }).setOrigin(0.5);
        }
    }

    calculateStars() {
        if (this.score >= 3000) return 3;
        if (this.score >= 2000) return 2;
        if (this.score >= 1000) return 1;
        return 0;
    }

    saveProgress() {
        const stored = localStorage.getItem(STORAGE_KEYS.highScores);
        const highScores = stored ? JSON.parse(stored) : {};
        
        if (!highScores[this.levelId] || this.score > highScores[this.levelId]) {
            highScores[this.levelId] = this.score;
            localStorage.setItem(STORAGE_KEYS.highScores, JSON.stringify(highScores));
        }
        
        const unlockedStored = localStorage.getItem(STORAGE_KEYS.unlockedLevels);
        const unlocked = unlockedStored ? JSON.parse(unlockedStored) : [1];
        
        const nextLevel = this.levelId + 1;
        if (!unlocked.includes(nextLevel)) {
            unlocked.push(nextLevel);
            localStorage.setItem(STORAGE_KEYS.unlockedLevels, JSON.stringify(unlocked));
        }
    }

    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 180, 50, 0x3498db)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.on('pointerover', () => button.setFillStyle(0x2980b9));
        button.on('pointerout', () => button.setFillStyle(0x3498db));
        button.on('pointerdown', callback);
        
        return button;
    }
}
