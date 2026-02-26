import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { LevelSelectScene } from './scenes/LevelSelectScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            debug: true,
            enableSleeping: false
        }
    },
    scene: [PreloadScene, MenuScene, LevelSelectScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

window.addEventListener('load', () => {
    document.getElementById('loading').style.display = 'none';
});
