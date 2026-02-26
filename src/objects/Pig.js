import Phaser from 'phaser';

export class Pig extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, config) {
        super(scene.matter.world, x, y, 'pig_' + config.name);
        
        scene.add.existing(this);
        
        this.config = config;
        this.health = config.health;
        this.maxHealth = config.health;
        this.score = config.score;
        
        this.setOrigin(0.5, 0.5);
        this.setScale(0.8);
        this.setCircle(config.radius);
        this.setBounce(0.3);
        this.setFriction(0.5);
        this.setDensity(0.002);
        this.setStatic(false);
        
        this.setData('type', 'pig');
        this.setData('health', this.health);
        
        this.createHealthBar();
        
        console.log('Pig created:', config.name, 'at', x, y);
    }

    createHealthBar() {
        this.healthBarBg = this.scene.add.rectangle(this.x, this.y - 40, 40, 6, 0x333333);
        this.healthBar = this.scene.add.rectangle(this.x, this.y - 40, 40, 6, 0x27ae60);
    }

    damage(amount) {
        this.health -= amount;
        this.setData('health', this.health);
        
        this.updateHealthBar();
        
        if (this.health <= 0) {
            this.die();
        } else {
            this.flash();
        }
    }

    updateHealthBar() {
        if (!this.healthBar) return;
        
        const healthPercent = Math.max(0, this.health / this.maxHealth);
        const width = 40 * healthPercent;
        
        this.healthBar.setSize(width, 6);
        this.healthBar.setPosition(
            this.x - (40 - width) / 2,
            this.y - 40
        );
        
        if (healthPercent > 0.5) {
            this.healthBar.setFillStyle(0x27ae60);
        } else if (healthPercent > 0.25) {
            this.healthBar.setFillStyle(0xf39c12);
        } else {
            this.healthBar.setFillStyle(0xe74c3c);
        }
    }

    flash() {
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
    }

    die() {
        this.scene.updateScore(this.score);
        
        if (this.scene.sound.get('pig_die')) {
            this.scene.sound.play('pig_die');
        }
        
        this.createDeathEffect();
        
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        
        this.destroy();
    }

    createDeathEffect() {
        const particles = this.scene.add.particles(this.x, this.y, null, {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            quantity: 10
        });
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const particle = this.scene.add.circle(
                this.x + Math.cos(angle) * 20,
                this.y + Math.sin(angle) * 20,
                5,
                0x00ff00
            );
            
            this.scene.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * 30,
                y: particle.y + Math.sin(angle) * 30,
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => particle.destroy()
            });
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        if (this.healthBar) {
            this.healthBarBg.setPosition(this.x, this.y - 40);
            this.healthBar.setPosition(this.x - (40 - this.healthBar.width) / 2, this.y - 40);
        }
    }
}
