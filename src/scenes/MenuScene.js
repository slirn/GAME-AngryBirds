import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);
        
        this.add.text(width / 2, 150, '愤怒的小鸟', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        this.add.text(width / 2, 250, 'Angry Birds', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        const playButton = this.createButton(width / 2, 400, '开始游戏', () => {
            this.scene.start('LevelSelectScene');
        });
        
        this.createButton(width / 2, 500, '设置', () => {
            this.scene.start('SettingsScene');
        });
        
        this.add.text(width / 2, height - 50, 'Phaser 3 + Matter.js', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
    }

    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 200, 60, 0xe74c3c)
            .setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(x, y, text, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setFillStyle(0xc0392b);
        });
        
        button.on('pointerout', () => {
            button.setFillStyle(0xe74c3c);
        });
        
        button.on('pointerdown', callback);
        
        return button;
    }
}
