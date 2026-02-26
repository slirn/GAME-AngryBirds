import Phaser from 'phaser';

export function generatePlaceholderAssets(scene) {
    generateBirdTextures(scene);
    generatePigTextures(scene);
    generateUITextures(scene);
    generateBackgroundTextures(scene);
}

function generateBirdTextures(scene) {
    const birdColors = {
        red: 0xff0000,
        yellow: 0xffff00,
        blue: 0x0000ff,
        black: 0x000000,
        white: 0xffffff
    };
    
    Object.entries(birdColors).forEach(([name, color]) => {
        const graphics = scene.make.graphics();
        
        graphics.fillStyle(color);
        graphics.fillCircle(20, 20, 18);
        graphics.lineStyle(2, 0x000000);
        graphics.strokeCircle(20, 20, 18);
        
        graphics.fillStyle(0x000000);
        graphics.fillCircle(14, 16, 3);
        graphics.fillCircle(26, 16, 3);
        
        graphics.fillStyle(0xffa500);
        graphics.fillTriangle(30, 20, 38, 18, 38, 22);
        
        graphics.generateTexture('bird_' + name, 40, 40);
        graphics.destroy();
        
        console.log('Generated bird texture: bird_' + name);
    });
}

function generatePigTextures(scene) {
    const pigSizes = {
        small: { radius: 15, key: 'pig_small' },
        medium: { radius: 22, key: 'pig_medium' },
        large: { radius: 30, key: 'pig_large' },
        king: { radius: 40, key: 'pig_king' }
    };
    
    Object.entries(pigSizes).forEach(([name, config]) => {
        const graphics = scene.make.graphics();
        const size = config.radius * 2 + 10;
        const center = size / 2;
        
        graphics.fillStyle(0x90EE90);
        graphics.fillCircle(center, center, config.radius);
        graphics.lineStyle(2, 0x228B22);
        graphics.strokeCircle(center, center, config.radius);
        
        graphics.fillStyle(0x000000);
        graphics.fillCircle(center - 5, center - 3, 3);
        graphics.fillCircle(center + 5, center - 3, 3);
        
        graphics.lineStyle(2, 0x228B22);
        graphics.beginPath();
        graphics.arc(center, center + 5, 5, 0, Math.PI);
        graphics.strokePath();
        
        if (name === 'king') {
            graphics.fillStyle(0xffd700);
            graphics.fillTriangle(center, center - config.radius - 10, 
                                  center - 8, center - config.radius,
                                  center + 8, center - config.radius);
        }
        
        graphics.generateTexture(config.key, size, size);
        graphics.destroy();
    });
}

function generateUITextures(scene) {
    const playBtn = scene.make.graphics();
    playBtn.fillStyle(0x27ae60);
    playBtn.fillRoundedRect(0, 0, 150, 60, 10);
    playBtn.lineStyle(3, 0x1e8449);
    playBtn.strokeRoundedRect(0, 0, 150, 60, 10);
    playBtn.fillStyle(0xffffff);
    playBtn.fillTriangle(55, 20, 55, 40, 85, 30);
    playBtn.generateTexture('btn_play', 150, 60);
    playBtn.destroy();
    
    const restartBtn = scene.make.graphics();
    restartBtn.fillStyle(0xe74c3c);
    restartBtn.fillRoundedRect(0, 0, 150, 60, 10);
    restartBtn.lineStyle(3, 0xc0392b);
    restartBtn.strokeRoundedRect(0, 0, 150, 60, 10);
    restartBtn.lineStyle(4, 0xffffff);
    restartBtn.strokeCircle(75, 30, 18);
    restartBtn.generateTexture('btn_restart', 150, 60);
    restartBtn.destroy();
    
    const menuBtn = scene.make.graphics();
    menuBtn.fillStyle(0x3498db);
    menuBtn.fillRoundedRect(0, 0, 150, 60, 10);
    menuBtn.lineStyle(3, 0x2980b9);
    menuBtn.strokeRoundedRect(0, 0, 150, 60, 10);
    menuBtn.fillStyle(0xffffff);
    menuBtn.fillRect(50, 20, 50, 5);
    menuBtn.fillRect(50, 30, 50, 5);
    menuBtn.fillRect(50, 40, 50, 5);
    menuBtn.generateTexture('btn_menu', 150, 60);
    menuBtn.destroy();
    
    const slingshot = scene.make.graphics();
    slingshot.fillStyle(0x8B4513);
    slingshot.fillRect(0, 0, 10, 80);
    slingshot.fillRect(30, 0, 10, 80);
    slingshot.fillRect(0, 70, 40, 10);
    slingshot.generateTexture('slingshot', 40, 80);
    slingshot.destroy();
}

function generateBackgroundTextures(scene) {
    const bg = scene.make.graphics();
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4a90d9, 0x4a90d9);
    bg.fillRect(0, 0, 1280, 720);
    
    bg.fillStyle(0xffffff, 0.8);
    bg.fillEllipse(200, 100, 120, 60);
    bg.fillEllipse(600, 150, 150, 70);
    bg.fillEllipse(1000, 80, 100, 50);
    
    bg.generateTexture('background', 1280, 720);
    bg.destroy();
    
    const ground = scene.make.graphics();
    ground.fillStyle(0x8B4513);
    ground.fillRect(0, 0, 1280, 40);
    ground.fillStyle(0x228B22);
    ground.fillRect(0, 0, 1280, 10);
    ground.generateTexture('ground', 1280, 40);
    ground.destroy();
}
