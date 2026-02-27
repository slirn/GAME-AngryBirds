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
        this.levelId = (data && data.levelId) ? data.levelId : 1;
        this.score = 0;
        this.currentBird = null;
        this.birds = [];
        this.pigs = [];
        this.blocks = [];
        this.birdTypes = [];
        this.isDragging = false;
        this.launchPosition = { x: 200, y: 540 };
        this.birdsRemaining = 0;
        this.birdQueue = [];
        this.currentLevel = null;
        this.launchIndicator = null;
        this.scoreText = null;
        this.birdsText = null;
        this.velocityMultiplier = 0.5;
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
        this.matter.world.disableGravity();
        this.matter.world.setGravity(0, 1);
        
        const ground = this.matter.add.rectangle(640, 710, 1280, 40, {
            isStatic: true,
            label: 'ground',
            friction: 0.8
        });
        
        const leftWall = this.matter.add.rectangle(-10, 360, 20, 720, {
            isStatic: true,
            label: 'wall'
        });
        
        const rightWall = this.matter.add.rectangle(1290, 360, 20, 720, {
            isStatic: true,
            label: 'wall'
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
        const groundY = 680;
        const slingshotHeight = 120;
        const slingshotY = groundY - slingshotHeight / 2;
        
        this.add.rectangle(this.launchPosition.x - 15, slingshotY, 12, slingshotHeight, 0x5D3A1A);
        this.add.rectangle(this.launchPosition.x + 15, slingshotY, 12, slingshotHeight, 0x5D3A1A);
        
        this.add.rectangle(this.launchPosition.x, groundY - 5, 50, 10, 0x4A2A0A);
        
        this.launchPosition.y = groundY - slingshotHeight - 20;
        
        this.launchIndicator = this.add.graphics();
    }

    loadLevel(levelId) {
        console.log('Loading level:', levelId);
        
        const level = GAME_CONFIG.levels.find(l => l.id === levelId);
        if (!level) {
            console.error('Level not found:', levelId);
            return;
        }
        
        this.currentLevel = level;
        
        try {
            const layoutData = this.generateRandomLayout(levelId);
            console.log('Layout data:', layoutData);
            
            if (!layoutData || !layoutData.birdTypes || layoutData.birdTypes.length === 0) {
                console.error('Invalid layout data');
                return;
            }
            
            this.birdsRemaining = layoutData.birdCount;
            this.birdTypes = [...layoutData.birdTypes];
            
            this.spawnNextBird();
        } catch (error) {
            console.error('Error generating layout:', error);
        }
    }

    generateRandomLayout(levelId) {
        const difficulty = Math.min(levelId, 10);
        
        const minPigs = 2 + Math.floor(difficulty / 3);
        const maxPigs = 3 + Math.floor(difficulty / 2);
        const pigCount = minPigs + Math.floor(Math.random() * (maxPigs - minPigs + 1));
        
        const minBlocks = 6 + difficulty;
        const maxBlocks = 12 + difficulty * 2;
        const blockCount = minBlocks + Math.floor(Math.random() * (maxBlocks - minBlocks + 1));
        
        const birdCount = Math.max(2, Math.ceil(pigCount * 0.8 + blockCount * 0.15));
        
        const birdTypes = this.generateBirdTypes(birdCount, difficulty);
        
        const pigTypes = ['small', 'small', 'medium', 'medium', 'large'];
        if (difficulty >= 7) pigTypes.push('king');
        const blockTypes = ['wood', 'wood', 'glass'];
        if (difficulty >= 3) blockTypes.push('stone');
        
        const pigPositions = this.generatePigPositions(pigCount);
        pigPositions.forEach((pos, index) => {
            let pigTypeName;
            if (difficulty <= 2) {
                pigTypeName = index < pigCount / 2 ? 'small' : 'medium';
            } else if (difficulty <= 5) {
                pigTypeName = pigTypes[Math.floor(Math.random() * 3)];
            } else {
                pigTypeName = pigTypes[Math.floor(Math.random() * pigTypes.length)];
            }
            
            const pigConfig = GAME_CONFIG.pigs.types.find(p => p.name === pigTypeName);
            if (pigConfig) {
                const pig = new Pig(this, pos.x, pos.y, pigConfig);
                this.pigs.push(pig);
            }
        });
        
        const blockPositions = this.generateComplexBlockPositions(blockCount, pigPositions, difficulty);
        blockPositions.forEach(pos => {
            const blockTypeName = difficulty <= 2 ? 'wood' : blockTypes[Math.floor(Math.random() * blockTypes.length)];
            const blockConfig = GAME_CONFIG.blocks.types.find(b => b.name === blockTypeName);
            if (blockConfig) {
                const block = new Block(this, pos.x, pos.y, pos.width, pos.height, blockConfig);
                this.blocks.push(block);
            }
        });
        
        return { birdCount, birdTypes };
    }

    generateBirdTypes(count, difficulty) {
        const types = [];
        const availableBirds = ['red'];
        
        if (difficulty >= 2) availableBirds.push('yellow');
        if (difficulty >= 3) availableBirds.push('blue');
        if (difficulty >= 5) availableBirds.push('black');
        if (difficulty >= 8) availableBirds.push('white');
        
        for (let i = 0; i < count; i++) {
            const birdType = availableBirds[Math.floor(Math.random() * availableBirds.length)];
            types.push(birdType);
        }
        
        return types;
    }

    generateComplexBlockPositions(count, pigPositions, difficulty) {
        const positions = [];
        const baseX = 700;
        const maxX = 1200;
        const groundY = 640;
        
        const structureCount = Math.min(2 + Math.floor(difficulty / 3), 4);
        const blocksPerStructure = Math.floor(count / structureCount);
        
        for (let s = 0; s < structureCount; s++) {
            const structureX = baseX + (s * (maxX - baseX) / structureCount) + 30;
            const structureBlocks = s === structureCount - 1 ? count - positions.length : blocksPerStructure;
            
            const nearPig = pigPositions.find(p => Math.abs(p.x - structureX) < 100);
            if (nearPig) {
                structureX = nearPig.x > structureX ? structureX - 80 : structureX + 80;
            }
            
            this.generateStableStructure(positions, structureX, structureBlocks, groundY, pigPositions, difficulty);
        }
        
        return positions;
    }

    generateStableStructure(positions, baseX, blockCount, groundY, pigPositions, difficulty) {
        const maxLayers = Math.min(2 + Math.floor(difficulty / 2), 5);
        const pillarWidth = 20;
        const pillarHeight = 60;
        const platformHeight = 20;
        const platformWidth = 80;
        
        let currentY = groundY;
        let layer = 0;
        let usedBlocks = 0;
        
        while (usedBlocks < blockCount && layer < maxLayers) {
            const pillar1X = baseX - 40;
            const pillar2X = baseX + 40;
            
            if (!this.isNearPig(pillar1X, currentY - pillarHeight / 2, pigPositions, 70)) {
                positions.push({ x: pillar1X, y: currentY - pillarHeight / 2, width: pillarWidth, height: pillarHeight });
                usedBlocks++;
            }
            
            if (usedBlocks < blockCount && !this.isNearPig(pillar2X, currentY - pillarHeight / 2, pigPositions, 70)) {
                positions.push({ x: pillar2X, y: currentY - pillarHeight / 2, width: pillarWidth, height: pillarHeight });
                usedBlocks++;
            }
            
            currentY -= pillarHeight;
            
            if (usedBlocks < blockCount) {
                const platformX = baseX;
                const platformY = currentY - platformHeight / 2;
                
                if (!this.isNearPig(platformX, platformY, pigPositions, 60)) {
                    positions.push({ x: platformX, y: platformY, width: platformWidth, height: platformHeight });
                    usedBlocks++;
                }
            }
            
            currentY -= platformHeight;
            layer++;
        }
        
        while (usedBlocks < blockCount) {
            const offsetX = (Math.random() - 0.5) * 200;
            const x = baseX + offsetX;
            const y = groundY - 30 - Math.random() * 100;
            
            if (x < 650 || x > 1250) continue;
            if (this.isNearPig(x, y, pigPositions, 80)) continue;
            
            const isVertical = Math.random() > 0.5;
            const width = isVertical ? 20 : 60;
            const height = isVertical ? 60 : 20;
            
            positions.push({ x, y, width, height });
            usedBlocks++;
        }
    }

    isNearPig(x, y, pigPositions, minDistance) {
        for (const pigPos of pigPositions) {
            const distance = Math.sqrt((x - pigPos.x) ** 2 + (y - pigPos.y) ** 2);
            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    }

    generatePigPositions(count) {
        const positions = [];
        const minX = 700;
        const maxX = 1200;
        const groundY = 640;
        const minDistance = 80;
        
        for (let i = 0; i < count; i++) {
            let attempts = 0;
            let validPosition = false;
            let x, y;
            
            while (!validPosition && attempts < 50) {
                x = minX + Math.random() * (maxX - minX);
                y = groundY;
                
                validPosition = true;
                for (const pos of positions) {
                    const distance = Math.abs(x - pos.x);
                    if (distance < minDistance) {
                        validPosition = false;
                        break;
                    }
                }
                attempts++;
            }
            
            if (validPosition) {
                positions.push({ x, y });
            }
        }
        
        return positions;
    }

    generateBlockPositions(count, pigPositions) {
        const positions = [];
        const minX = 650;
        const maxX = 1250;
        const minY = 500;
        const maxY = 650;
        const minDistance = 50;
        const pigSafeDistance = 60;
        
        for (let i = 0; i < count; i++) {
            let attempts = 0;
            let validPosition = false;
            let x, y;
            
            while (!validPosition && attempts < 100) {
                x = minX + Math.random() * (maxX - minX);
                y = minY + Math.random() * (maxY - minY);
                
                validPosition = true;
                
                for (const pos of positions) {
                    const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                    if (distance < minDistance) {
                        validPosition = false;
                        break;
                    }
                }
                
                if (validPosition) {
                    for (const pigPos of pigPositions) {
                        const distance = Math.sqrt((x - pigPos.x) ** 2 + (y - pigPos.y) ** 2);
                        if (distance < pigSafeDistance && y > pigPos.y - 50) {
                            validPosition = false;
                            break;
                        }
                    }
                }
                
                attempts++;
            }
            
            if (validPosition) {
                positions.push({ x, y });
            }
        }
        
        return positions;
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
            this.updateBirdQueue();
        } catch (error) {
            console.error('Failed to create bird:', error);
        }
    }

    updateBirdQueue() {
        if (this.birdQueue) {
            this.birdQueue.forEach(bird => bird.destroy());
        }
        this.birdQueue = [];
        
        const startX = 80;
        const startY = 665;
        const spacing = 45;
        
        this.birdTypes.forEach((birdType, index) => {
            const birdConfig = GAME_CONFIG.birds.types.find(b => b.name === birdType);
            if (birdConfig) {
                const queueBird = this.add.image(
                    startX + index * spacing,
                    startY,
                    'bird_' + birdType
                );
                queueBird.setScale(0.4);
                queueBird.setDepth(50);
                this.birdQueue.push(queueBird);
            }
        });
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
            if (this.currentBird.special === 'speed' && !this.currentBird.specialUsed) {
                this.currentBird.boostSpeed(1.2);
                this.currentBird.specialUsed = true;
                console.log('Yellow bird speed boost activated!');
            } else if (this.currentBird.special === 'split' && !this.currentBird.specialUsed) {
                this.splitBird(this.currentBird);
                this.currentBird.specialUsed = true;
                console.log('Blue bird split activated!');
            } else if (this.currentBird.special === 'explode' && !this.currentBird.specialUsed) {
                const isOnGround = this.currentBird.y >= 620;
                const birdBounds = this.currentBird.getBounds();
                const isInsideBird = Phaser.Geom.Rectangle.Contains(birdBounds, pointer.x, pointer.y);
                
                if (!isOnGround || isInsideBird) {
                    this.currentBird.explode();
                    this.currentBird.specialUsed = true;
                    console.log('Black bird explode activated!');
                }
            }
            return;
        }
        
        const birdBounds = this.currentBird.getBounds();
        const isInside = Phaser.Geom.Rectangle.Contains(birdBounds, pointer.x, pointer.y);
        
        console.log('Bird bounds:', birdBounds.x, birdBounds.y, birdBounds.width, birdBounds.height);
        console.log('Is inside bird:', isInside);
        
        if (isInside) {
            this.isDragging = true;
            console.log('Started dragging');
        }
    }

    splitBird(bird) {
        const velocity = bird.body.velocity;
        const x = bird.x;
        const y = bird.y;
        
        bird.destroy();
        
        const angles = [-20, 0, 20];
        angles.forEach((angleOffset, index) => {
            const angle = Math.atan2(velocity.y, velocity.x) + (angleOffset * Math.PI / 180);
            const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            
            const miniBird = new Bird(this, x, y - 20 + index * 20, {
                name: 'blue',
                power: 1,
                special: null
            });
            
            miniBird.setScale(0.4);
            miniBird.setStatic(false);
            miniBird.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            miniBird.isLaunched = true;
            miniBird.setBounce(0.2);
            miniBird.setFriction(0.3);
            
            this.birds.push(miniBird);
        });
        
        this.currentBird = null;
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
        
        this.currentBird.x = newX;
        this.currentBird.y = newY;
        this.currentBird.body.position.x = newX;
        this.currentBird.body.position.y = newY;
        
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
            this.currentBird.x = this.launchPosition.x;
            this.currentBird.y = this.launchPosition.y;
            this.currentBird.body.position.x = this.launchPosition.x;
            this.currentBird.body.position.y = this.launchPosition.y;
            console.log('Not enough pull, resetting');
            return;
        }
        
        console.log('Launching bird with velocity:', dx * this.velocityMultiplier, dy * this.velocityMultiplier);
        this.currentBird.launch(dx * this.velocityMultiplier, dy * this.velocityMultiplier);
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
        
        const dx = this.launchPosition.x - this.currentBird.x;
        const dy = this.launchPosition.y - this.currentBird.y;
        
        const vx = dx * this.velocityMultiplier * this.currentBird.power;
        const vy = dy * this.velocityMultiplier * this.currentBird.power;
        
        let x = this.launchPosition.x;
        let y = this.launchPosition.y;
        let velX = vx;
        let velY = vy;
        const gravity = 0.1;
        const timeStep = 3;
        
        for (let i = 0; i < 60; i++) {
            velY += gravity * timeStep;
            x += velX * timeStep;
            y += velY * timeStep;
            
            if (y > 700 || x > 1300 || x < 0) break;
            
            this.launchIndicator.fillStyle(0xffffff, 0.5);
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
