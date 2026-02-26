import Phaser from 'phaser';
import { generatePlaceholderAssets } from '../utils/placeholderAssets.js';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.createLoadingBar();
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
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 0.1;
            if (progress > 1) progress = 1;
            progressBar.clear();
            progressBar.fillStyle(0xe74c3c, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * progress, 30);
            percentText.setText(parseInt(progress * 100) + '%');
        }, 100);
        
        this.load.on('complete', () => {
            clearInterval(progressInterval);
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    create() {
        generatePlaceholderAssets(this);
        this.scene.start('MenuScene');
    }
}
