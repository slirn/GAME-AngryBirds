import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.createLoadingBar();
        this.loadAssets();
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const percentText = this.add.text(width / 2, height / 2, '0%', {
            font: '18px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xe74c3c, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    loadAssets() {
        this.load.image('background', 'assets/images/backgrounds/bg_sky.png');
        this.load.image('slingshot', 'assets/images/ui/slingshot.png');
        
        this.load.image('bird_red', 'assets/images/birds/bird_red.png');
        this.load.image('bird_yellow', 'assets/images/birds/bird_yellow.png');
        this.load.image('bird_blue', 'assets/images/birds/bird_blue.png');
        this.load.image('bird_black', 'assets/images/birds/bird_black.png');
        this.load.image('bird_white', 'assets/images/birds/bird_white.png');
        
        this.load.image('pig_small', 'assets/images/pigs/pig_small.png');
        this.load.image('pig_medium', 'assets/images/pigs/pig_medium.png');
        this.load.image('pig_large', 'assets/images/pigs/pig_large.png');
        this.load.image('pig_king', 'assets/images/pigs/pig_king.png');
        
        this.load.image('block_wood', 'assets/images/blocks/wood.png');
        this.load.image('block_glass', 'assets/images/blocks/glass.png');
        this.load.image('block_stone', 'assets/images/blocks/stone.png');
    }

    create() {
        console.log('All assets loaded, starting game...');
        this.scene.start('MenuScene');
    }
}
