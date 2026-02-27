import Phaser from 'phaser';

export class Block extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, width, height, config) {
        const textureKey = 'block_' + config.name;
        
        if (!scene.textures.exists(textureKey)) {
            const graphics = scene.make.graphics();
            graphics.fillStyle(Block.getColorForType(config.name));
            graphics.fillRect(0, 0, width, height);
            graphics.lineStyle(2, 0x000000);
            graphics.strokeRect(0, 0, width, height);
            graphics.generateTexture(textureKey, width, height);
            graphics.destroy();
        }
        
        super(scene.matter.world, x, y, textureKey);
        
        scene.add.existing(this);
        
        this.config = config;
        this.health = config.health;
        this.maxHealth = config.health;
        this.blockWidth = width;
        this.blockHeight = height;
        
        this.setRectangle(width, height);
        this.setBounce(config.restitution);
        this.setFriction(config.friction);
        this.setDensity(config.density);
        this.setStatic(false);
        
        this.setData('type', 'block');
        this.setData('material', config.name);
        
        this.setOnCollide((event) => {
            this.onCollision(event);
        });
    }

    static getColorForType(type) {
        const colors = {
            wood: 0x8B4513,
            glass: 0x87CEEB,
            stone: 0x808080
        };
        return colors[type] || 0x888888;
    }

    onCollision(event) {
        const impactForce = event.collision.depth;
        
        if (impactForce > 3) {
            this.damage(impactForce * 0.5);
        }
    }

    damage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.destroy();
        } else {
            this.showDamage();
        }
    }

    showDamage() {
        const healthPercent = this.health / this.maxHealth;
        
        if (healthPercent < 0.5) {
            this.setTint(0xff9999);
        } else if (healthPercent < 0.75) {
            this.setTint(0xffcccc);
        }
        
        this.scene.tweens.add({
            targets: this,
            alpha: 0.7,
            duration: 100,
            yoyo: true
        });
        
        this.createCrackEffect();
    }
    
    createCrackEffect() {
        const crackGraphics = this.scene.add.graphics();
        crackGraphics.setDepth(this.depth + 1);
        
        const crackCount = Phaser.Math.Between(1, 3);
        
        for (let i = 0; i < crackCount; i++) {
            const startX = this.x - this.blockWidth / 2 + Math.random() * this.blockWidth;
            const startY = this.y - this.blockHeight / 2 + Math.random() * this.blockHeight;
            const endX = startX + (Math.random() - 0.5) * this.blockWidth;
            const endY = startY + (Math.random() - 0.5) * this.blockHeight;
            
            crackGraphics.lineStyle(1, 0x000000, 0.8);
            crackGraphics.lineBetween(startX, startY, endX, endY);
        }
        
        this.scene.time.delayedCall(500, () => {
            crackGraphics.destroy();
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        if (this.y > 800) {
            this.destroy();
        }
    }
}
