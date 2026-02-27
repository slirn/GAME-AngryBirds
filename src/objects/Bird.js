import Phaser from 'phaser';

export class Bird extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, config) {
        super(scene.matter.world, x, y, 'bird_' + config.name);
        
        scene.add.existing(this);
        
        this.config = config;
        this.isLaunched = false;
        this.special = config.special;
        this.power = config.power;
        this.specialUsed = false;
        
        this.setScale(0.5);
        this.setOrigin(0.5, 0.5);
        
        this.setCircle(15);
        this.setBounce(0.2);
        this.setFriction(0.3);
        this.setDensity(0.004);
        this.setStatic(true);
        
        this.setData('type', 'bird');
        this.setData('special', this.special);
    }

    launch(velocityX, velocityY) {
        this.isLaunched = true;
        this.setStatic(false);
        this.setVelocity(velocityX * this.power, velocityY * this.power);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        if (this.isLaunched && this.active) {
            if (this.x < -50 || this.x > 1330 || this.y < -50 || this.y > 770) {
                this.destroy();
            }
        }
    }

    onCollision() {
        if (this.special === 'explode') {
            this.explode();
        }
    }

    activateSpecial() {
        if (!this.isLaunched) return;
        
        switch (this.special) {
            case 'speed':
                this.boostSpeed();
                break;
            case 'split':
                this.split();
                break;
            case 'egg':
                this.dropEgg();
                break;
        }
    }

    boostSpeed(multiplier = 1.2) {
        if (this.specialUsed) return;
        this.specialUsed = true;
        
        const velocity = this.body.velocity;
        this.setVelocity(velocity.x * multiplier, velocity.y * multiplier);
        
        this.setTint(0xffff00);
        this.scene.time.delayedCall(100, () => {
            if (this.active) this.clearTint();
        });
    }

    split() {
        const velocity = this.body.velocity;
        const positions = [
            { x: this.x, y: this.y - 30 },
            { x: this.x, y: this.y },
            { x: this.x, y: this.y + 30 }
        ];
        
        positions.forEach((pos, index) => {
            if (index === 1) return;
            
            const miniBird = new Bird(this.scene, pos.x, pos.y, {
                name: 'blue',
                power: 0.5,
                special: null
            });
            miniBird.setStatic(false);
            miniBird.setVelocity(velocity.x, velocity.y + (index === 0 ? -5 : 5));
            miniBird.setScale(0.7);
            miniBird.isLaunched = true;
            this.scene.birds.push(miniBird);
        });
    }

    explode() {
        if (this.specialUsed) return;
        this.specialUsed = true;
        
        const explosionRadius = 120;
        const explosionForce = 25;
        
        const explosionCircle = this.scene.add.circle(this.x, this.y, 0, 0xff6600, 0.6);
        this.scene.tweens.add({
            targets: explosionCircle,
            radius: explosionRadius,
            alpha: 0,
            duration: 300,
            onComplete: () => explosionCircle.destroy()
        });
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const particle = this.scene.add.circle(
                this.x + Math.cos(angle) * 20,
                this.y + Math.sin(angle) * 20,
                8,
                0xff3300
            );
            
            this.scene.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * 60,
                y: particle.y + Math.sin(angle) * 60,
                alpha: 0,
                scale: 0,
                duration: 400,
                onComplete: () => particle.destroy()
            });
        }
        
        this.scene.pigs.forEach(pig => {
            if (!pig || !pig.active) return;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, pig.x, pig.y);
            if (distance < explosionRadius) {
                const damage = Math.max(10, 50 - distance * 0.3);
                pig.damage(damage);
            }
        });
        
        this.scene.blocks.forEach(block => {
            if (!block || !block.active) return;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, block.x, block.y);
            if (distance < explosionRadius) {
                const angle = Phaser.Math.Angle.Between(this.x, this.y, block.x, block.y);
                const force = explosionForce * (1 - distance / explosionRadius);
                block.setVelocity(
                    Math.cos(angle) * force,
                    Math.sin(angle) * force - 5
                );
                block.damage(10);
            }
        });
        
        this.scene.time.delayedCall(50, () => {
            this.destroy();
        });
    }

    dropEgg() {
        const egg = this.scene.matter.add.circle(this.x, this.y, 10, {
            label: 'egg',
            density: 0.01
        });
        
        this.setVelocity(this.body.velocity.x * -1.5, -10);
    }

    isStopped() {
        if (!this.body) return true;
        const velocity = this.body.velocity;
        return Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1;
    }
}
