import { Rotation } from './rotation';

export class Ship extends Rotation {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    acceleration: number;
    mass: number;
    angle: number;
    thrusterAngle: number;
    force: number;
    angularVelocity: number;
    angularAcceleration: number;

    constructor() {
        super();
        this.x = 250;
        this.y = 250;
        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = 0.0;
        this.mass = 1000;
        this.angle = 180;
        this.thrusterAngle = 180;
        this.force = 0.01;
        this.angularAcceleration = 0;
        this.angularVelocity = 0;
    }


    calculateVelocity(time: number) {
        if (this.acceleration === 0) return;
        const angleInRadians = (this.angle * Math.PI) / 180;
    
        // Calculate the velocity change due to the acceleration.
        const deltaVx = (this.acceleration * time) * Math.cos(angleInRadians);
        const deltaVy = (this.acceleration * time) * Math.sin(angleInRadians);
    
        // Update the velocity.
        this.velocityX += deltaVx;
        this.velocityY += deltaVy;
    
        // Calculate the total velocity magnitude and direction.
        const totalVelocityMagnitude = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
        // const totalVelocityAngle = Math.atan2(this.velocityY, this.velocityX);
    
        // If the total velocity magnitude exceeds the speed of light, scale it back.
        if (totalVelocityMagnitude > 299792458) {
            const scaleFactor = 299792458 / totalVelocityMagnitude;
            this.velocityX *= scaleFactor;
            this.velocityY *= scaleFactor;
        }
    }
    

    setPosition(time: number) {
        this.x += this.velocityX * time;
        this.y += this.velocityY * time;
    }


    setAngle() {
        this.angle = this.thrusterAngle;
    }

    setThrusterAngle(angle: number) {
        let newAngle = angle
        if (newAngle > 360) {
            newAngle = 0;
        }
        if (newAngle < 0) {
            newAngle = 360;
        }
        this.thrusterAngle = newAngle;
    }

    stopAccelerating() {
        this.acceleration = 0;
        this.calculateVelocity(0);
    }
    accelerate() {
        this.setAngle();
        this.acceleration += 0.01;
    }

}


