import Phaser from 'phaser';
import { GAME_CONFIG, STORAGE_KEYS } from '../config.js';

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    init(data) {
        this.chapterId = data && data.chapterId ? data.chapterId : 1;
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
        
        this.currentPage = this.chapterId;
        this.levelsPerPage = 12;
        this.totalPages = 4;
        
        this.unlockedLevels = this.getUnlockedLevels();
        
        this.cols = 4;
        this.rows = 3;
        this.startX = width / 2 - (this.cols - 1) * 100;
        this.startY = 180;
        
        this.levelButtons = [];
        this.pageIndicators = [];
        
        this.createLevelButtons();
        this.createNavigationButtons();
        this.createPageIndicators();
        
        this.createButton(width / 2, height - 80, '返回', () => {
            this.scene.start('MenuScene');
        });
    }
    
    createLevelButtons() {
        console.log('Creating level buttons for page:', this.currentPage);
        this.levelButtons.forEach(button => button.destroy());
        this.levelButtons = [];
        
        const startIndex = (this.currentPage - 1) * this.levelsPerPage + 1;
        const endIndex = startIndex + this.levelsPerPage - 1;
        console.log('Level range:', startIndex, 'to', endIndex);
        
        for (let i = startIndex; i <= endIndex; i++) {
            const level = {
                id: i,
                name: `第 ${i} 关`,
                birds: ['red', 'red', 'red'],
                stars: [1, 2, 3],
                pigs: [],
                blocks: []
            };
            
            const index = i - startIndex;
            const col = index % this.cols;
            const row = Math.floor(index / this.cols);
            const x = this.startX + col * 200;
            const y = this.startY + row * 120;
            
            const isUnlocked = this.unlockedLevels.includes(level.id);
            const button = this.createLevelButton(x, y, level, isUnlocked);
            this.levelButtons.push(button);
        }
        console.log('Level buttons created:', this.levelButtons.length);
    }
    
    createNavigationButtons() {
        const { width, height } = this.cameras.main;
        
        // 销毁之前的导航按钮
        if (this.leftButton) this.leftButton.destroy();
        if (this.rightButton) this.rightButton.destroy();
        
        // 左按钮
        if (this.currentPage > 1) {
            const leftButton = this.add.rectangle(width / 2 - 200, height - 150, 80, 50, 0x3498db)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(width / 2 - 200, height - 150, '←', {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            leftButton.on('pointerover', () => leftButton.setFillStyle(0x2980b9));
            leftButton.on('pointerout', () => leftButton.setFillStyle(0x3498db));
            leftButton.on('pointerdown', () => {
                console.log('Left button clicked, current page:', this.currentPage);
                this.currentPage--;
                this.updatePage();
            });
            
            this.leftButton = leftButton;
        }
        
        // 右按钮
        if (this.currentPage < this.totalPages) {
            const rightButton = this.add.rectangle(width / 2 + 200, height - 150, 80, 50, 0x3498db)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(width / 2 + 200, height - 150, '→', {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            rightButton.on('pointerover', () => rightButton.setFillStyle(0x2980b9));
            rightButton.on('pointerout', () => rightButton.setFillStyle(0x3498db));
            rightButton.on('pointerdown', () => {
                console.log('Right button clicked, current page:', this.currentPage);
                this.currentPage++;
                this.updatePage();
            });
            
            this.rightButton = rightButton;
        }
    }
    
    createPageIndicators() {
        const { width, height } = this.cameras.main;
        const indicatorY = height - 150;
        
        this.pageIndicators.forEach(indicator => indicator.destroy());
        this.pageIndicators = [];
        
        for (let i = 0; i < this.totalPages; i++) {
            const indicatorX = width / 2 - (this.totalPages - 1) * 20 + i * 40;
            const isActive = i + 1 === this.currentPage;
            
            const indicator = this.add.circle(indicatorX, indicatorY, isActive ? 10 : 6, isActive ? 0x27ae60 : 0x7f8c8d);
            this.pageIndicators.push(indicator);
        }
    }
    
    updatePage() {
        console.log('Updating page to:', this.currentPage);
        this.createLevelButtons();
        this.createNavigationButtons();
        this.createPageIndicators();
        console.log('Page updated successfully');
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
                console.log('Starting level:', level.id);
                this.scene.start('GameScene', { levelId: level.id });
            });
        } else {
            this.add.text(x + 50, y - 30, '🔒', { fontSize: '20px' });
        }
        
        return button;
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
