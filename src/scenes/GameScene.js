import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';
import { Bird } from '../objects/Bird.js';
import { Pig } from '../objects/Pig.js';
import { Block } from '../objects/Block.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.levelId = data.levelId || 1;
        this.score = 0;
        this.currentBird = null;
        this.birds = [];
        this.pigs = [];
        this.blocks = [];
        this.birdTypes = [];
        this.isDragging = false;
        this.launchPosition = { x: 200, y: 500 };
        this.birdsRemaining = 0;
        this.launchIndicator = null;
        this.scoreText = null;
        this.birdsText = null;
    }

    create() {
        try {
            this.setupWorld();
            this.createBackground();
            this.createSlingshot();
            this.createUI();
            this.loadLevel(this.levelId);
            this.setupInput();
            
            this.matter.world.on('collisionstart', this.handleCollision, this);
        } catch (error) {
            console.error('GameScene create error:', error);
            this.add.text(400, 300, '加载关卡失败: ' + error.message, {
                fontSize: '24px',
                color: '#ff0000'
            }).setOrigin(0.5);
        }
    }

    setupWorld() {
        this.matter.world.setBounds(0, 0, 1280, 720);
        this.matter.world.setGravity(0, 1);
        
        const ground = this.matter.add.rectangle(640, 710, 1280, 40, {
            isStatic: true,
            label: 'ground'
        });
    }

    createBackground() {
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4a90d9, 0x4a90d9);
        graphics.fillRect(0, 0, 1280, 720);
        
        this.add.rectangle(640, 700, 1280, 40, 0x8B4513);
        
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.ellipse(
                Phaser.Math.Between(100, 1180),
                Phaser.Math.Between(50, 200),
                Phaser.Math.Between(80, 150),
                Phaser.Math.Between(40, 80),
                0xffffff,
                0.8
            );
        }
    }

    createSlingshot() {
        this.add.rectangle(this.launchPosition.x - 10, this.launchPosition.y + 50, 15, 100, 0x8B4513);
        this.add.rectangle(this.launchPosition.x + 10, this.launchPosition.y + 50, 15, 100, 0x8B4513);
        
        this.launchIndicator = this.add.graphics();
    }

    loadLevel(levelId) {
        const level = GAME_CONFIG.levels.find(l => l.id === levelId);
        if (!level) return;
        
        this.birdsRemaining = level.birds.length;
        this.birdTypes = [...level.birds];
        
        this.createDemoLevel();
        
        this.spawnNextBird();
    }

    createDemoLevel() {
        try {
            const pigConfig = GAME_CONFIG.pigs.types[0];
            const pig1 = new Pig(this, 900, 600, pigConfig);
            const pig2 = new Pig(this, 1000, 600, pigConfig);
            const pig3 = new Pig(this, 950, 500, pigConfig);
            this.pigs.push(pig1, pig2, pig3);
            
            const woodConfig = GAME_CONFIG.blocks.types[0];
            const block1 = new Block(this, 850, 600, 20, 100, woodConfig);
            const block2 = new Block(this, 1050, 600, 20, 100, woodConfig);
            const block3 = new Block(this, 950, 520, 220, 20, woodConfig);
            this.blocks.push(block1, block2, block3);
        } catch (error) {
            console.error('Failed to create demo level:', error);
        }
    }

    spawnNextBird() {
        if (this.birdTypes.length === 0) {
            this.time.delayedCall(2000, () => this.checkGameEnd());
            return;
        }
        
        const birdType = this.birdTypes.shift();
        const birdConfig = GAME_CONFIG.birds.types.find(b => b.name === birdType);
        
        if (!birdConfig) {
            console.error('Bird config not found for type:', birdType);
            return;
        }
        
        console.log('Spawning bird:', birdType, 'at', this.launchPosition.x, this.launchPosition.y);
        
        try {
            this.currentBird = new Bird(
                this,
                this.launchPosition.x,
                this.launchPosition.y,
                birdConfig
            );
            
            this.currentBird.setDepth(100);
            this.currentBird.setAlpha(1);
            
            console.log('Bird spawned successfully:', this.currentBird.x, this.currentBird.y);
            console.log('Bird visible:', this.currentBird.visible, 'Bird active:', this.currentBird.active);
            
            this.birds.push(this.currentBird);
            this.updateBirdsUI();
        } catch (error) {
            console.error('Failed to create bird:', error);
        }
    }

    setupInput() {
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);
    }

    onPointerDown(pointer) {
        console.log('Pointer down at:', pointer.x, pointer.y);
        
        if (!this.currentBird) {
            console.log('No current bird');
            return;
        }
        
        if (this.currentBird.isLaunched) {
            console.log('Bird already launched');
            return;
        }
        
        const birdBounds = this.currentBird.getBounds();
        const isInside = Phaser.Geom.Rectangle.Contains(birdBounds, pointer.x, pointer.y);
        
        console.log('Bird bounds:', birdBounds.x, birdBounds.y, birdBounds.width, birdBounds.height);
        console.log('Is inside bird:', isInside);
        
        if (isInside) {
            this.isDragging = true;
            this.currentBird.setStatic(true);
            console.log('Started dragging');
        }
    }

    onPointerMove(pointer) {
        if (!this.isDragging || !this.currentBird) return;
        
        let newX = pointer.x;
        let newY = pointer.y;
        
        const dx = newX - this.launchPosition.x;
        const dy = newY - this.launchPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxStretch = GAME_CONFIG.physics.slingshot.maxStretch;
        
        if (distance > maxStretch) {
            const angle = Math.atan2(dy, dx);
            newX = this.launchPosition.x + Math.cos(angle) * maxStretch;
            newY = this.launchPosition.y + Math.sin(angle) * maxStretch;
        }
        
        if (newX > this.launchPosition.x) {
            newX = this.launchPosition.x - Math.abs(newX - this.launchPosition.x);
        }
        
        this.currentBird.setPosition(newX, newY);
        this.drawLaunchTrajectory();
    }

    onPointerUp(pointer) {
        console.log('Pointer up, isDragging:', this.isDragging);
        
        if (!this.isDragging || !this.currentBird) return;
        
        this.isDragging = false;
        this.launchIndicator.clear();
        
        const dx = this.launchPosition.x - this.currentBird.x;
        const dy = this.launchPosition.y - this.currentBird.y;
        
        console.log('Launch delta:', dx, dy);
        
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
            this.currentBird.setPosition(this.launchPosition.x, this.launchPosition.y);
            console.log('Not enough pull, resetting');
            return;
        }
        
        console.log('Launching bird with velocity:', dx * 15, dy * 15);
        this.currentBird.launch(dx * 15, dy * 15);
        this.birdsRemaining--;
        this.updateBirdsUI();
        
        this.time.delayedCall(3000, () => {
            if (!this.checkGameEnd()) {
                this.spawnNextBird();
            }
        });
    }

    drawLaunchTrajectory() {
        if (!this.currentBird) return;
        
        this.launchIndicator.clear();
        this.launchIndicator.lineStyle(2, 0x000000, 0.5);
        
        const dx = this.launchPosition.x - this.currentBird.x;
        const dy = this.launchPosition.y - this.currentBird.y;
        
        for (let i = 0; i < 30; i++) {
            const t = i * 0.1;
            const x = this.launchPosition.x + dx * t * 2;
            const y = this.launchPosition.y + dy * t * 2 + 0.5 * 9.8 * t * t * 10;
            
            if (y > 700) break;
            
            this.launchIndicator.fillStyle(0x000000, 0.3);
            this.launchIndicator.fillCircle(x, y, 3);
        }
    }

    handleCollision(event) {
        event.pairs.forEach(pair => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            
            const gameObjectA = bodyA.gameObject;
            const gameObjectB = bodyB.gameObject;
            
            if (gameObjectA && gameObjectA.getData('type') === 'pig') {
                const impactForce = pair.collision.depth;
                if (impactForce > 5) {
                    gameObjectA.damage(impactForce);
                }
            }
            
            if (gameObjectB && gameObjectB.getData('type') === 'pig') {
                const impactForce = pair.collision.depth;
                if (impactForce > 5) {
                    gameObjectB.damage(impactForce);
                }
            }
        });
    }

    createUI() {
        this.scoreText = this.add.text(20, 20, '分数: 0', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);
        
        this.birdsText = this.add.text(20, 50, `剩余小鸟: ${this.birdsRemaining}`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setScrollFactor(0);
        
        const menuButton = this.add.rectangle(1200, 40, 100, 40, 0xe74c3c)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);
        
        this.add.text(1200, 40, '菜单', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    updateBirdsUI() {
        if (this.birdsText) {
            this.birdsText.setText(`剩余小鸟: ${this.birdsRemaining}`);
        }
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(`分数: ${this.score}`);
    }

    checkGameEnd() {
        const alivePigs = this.pigs.filter(p => p && p.active);
        
        if (alivePigs.length === 0) {
            this.scene.start('GameOverScene', { 
                won: true, 
                score: this.score,
                levelId: this.levelId 
            });
            return true;
        }
        
        if (this.birdsRemaining === 0 && this.birdTypes.length === 0) {
            const allBirdsStopped = this.birds.every(b => !b || !b.active || b.isStopped());
            if (allBirdsStopped) {
                this.scene.start('GameOverScene', { 
                    won: false, 
                    score: this.score,
                    levelId: this.levelId 
                });
                return true;
            }
        }
        
        return false;
    }
}
