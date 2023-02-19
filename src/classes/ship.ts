

export class Ship {
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


    setVelocity(time: number) {

   
    }
    calculateVelocity(time: number) {
        if (this.acceleration === 0) return;
        const angleInRadians = (this.angle * Math.PI) / 180;
        let velocityX = this.velocityX + (this.force * time / this.mass) * Math.cos(angleInRadians);
        let velocityY = this.velocityY + (this.force * time / this.mass) * Math.sin(angleInRadians);
    
        const accelerationMagnitude = this.acceleration * time;
        const accelerationAngle = angleInRadians; // use ship's orientation angle directly as acceleration angle
        const accelerationX = accelerationMagnitude * Math.cos(accelerationAngle);
        const accelerationY = accelerationMagnitude * Math.sin(accelerationAngle);
    
        // calculate x velocity
        if (accelerationX !== 0) {
            velocityX += accelerationX;
        }
        
        // calculate y velocity
        if (accelerationY !== 0) {
            velocityY += accelerationY;
        }
        
        // update velocity
        this.velocityX = velocityX;
        this.velocityY = velocityY;
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


