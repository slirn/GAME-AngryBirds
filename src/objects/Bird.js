import Phaser from 'phaser';

export class Bird extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, config) {
        super(scene.matter.world, x, y, 'bird_' + config.name);
        
        scene.add.existing(this);
        
        this.config = config;
        this.isLaunched = false;
        this.special = config.special;
        this.power = config.power;
        
        this.setCircle(20);
        this.setBounce(0.6);
        this.setFriction(0.05);
        this.setDensity(0.004);
        this.setStatic(true);
        
        this.setData('type', 'bird');
        this.setData('special', this.special);
        
        this.setOnCollide(() => {
            if (this.isLaunched) {
                this.onCollision();
            }
        });
    }

    launch(velocityX, velocityY) {
        this.setStatic(false);
        this.setVelocity(velocityX * this.power, velocityY * this.power);
        this.isLaunched = true;
        
        if (this.scene.sound.get('launch')) {
            this.scene.sound.play('launch');
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

    boostSpeed() {
        const velocity = this.body.velocity;
        this.setVelocity(velocity.x * 2, velocity.y * 2);
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
        const explosionRadius = 100;
        const explosionForce = 30;
        
        this.scene.add.circle(this.x, this.y, explosionRadius, 0xff6600, 0.5);
        
        this.scene.pigs.forEach(pig => {
            if (!pig || !pig.active) return;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, pig.x, pig.y);
            if (distance < explosionRadius) {
                pig.damage(50);
            }
        });
        
        this.scene.blocks.forEach(block => {
            if (!block || !block.active) return;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, block.x, block.y);
            if (distance < explosionRadius) {
                const angle = Phaser.Math.Angle.Between(this.x, this.y, block.x, block.y);
                block.setVelocity(
                    Math.cos(angle) * explosionForce,
                    Math.sin(angle) * explosionForce
                );
            }
        });
        
        this.destroy();
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
