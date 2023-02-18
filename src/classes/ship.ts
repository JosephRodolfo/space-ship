import { degreesToRadians, radiansToDegrees } from "../helpers/helpers";

export interface Velocities {
    velocityX: number,
    velocityY: number
}

export class Ship implements Velocities {
    radius: number = 10;
    mass: number = 100;
    position: number = 0;
    x: number = 250;
    y: number = 250;
    acceleration: number = 0;
    velocity: number = 0;
    thrusterAngle: number = 180;
    angle: number = 0;
    angularVelocity: number = 0;
    angularAcceleration: number = 0;
    spinning: boolean = false;
    accelerating: boolean = false;
    velocityX: number = 0;
    velocityY: number = 0;


    constructor() {
    }

    setAcceleration(acceleration: number) {
        if (!this.accelerating) {
            this.acceleration = 0;
        }
        this.acceleration += acceleration;
    }

    setAngularAcceleration(acceleration: number) {
        if (!this.spinning) {
            this.angularAcceleration = 0;
        }
        this.angularAcceleration += acceleration;
    }


    setAngularVelocity(time: number) {
        this.angularVelocity += this.angularAcceleration * time;
    }

    setAngle(time: number) {
        if (this.thrusterAngle > 360) this.thrusterAngle = 0;
        if (this.thrusterAngle < 0) this.thrusterAngle = 360;
        this.thrusterAngle  = this.thrusterAngle += this.angularVelocity * time + (0.5 * this.angularAcceleration * time * time);
    }

    setVelocity(time: number) {
   
        this.velocity += (this.force * time / this.mass);
    
    }

   



    get force() {
        const force = this.mass * this.acceleration;
        return force
    }

    calculateVelocity(time: number) {
        const angleInRadians = (this.angle * Math.PI) / 180;
      
        let xAcceleration = this.acceleration * Math.cos(angleInRadians);
        const yAcceleration = this.acceleration * Math.sin(angleInRadians);
        let multiplier = 1
        if (xAcceleration < 0 && this.velocity > 0) {
            multiplier = -1
            
        }
        this.velocityX = (multiplier * this.velocity) * Math.cos(angleInRadians) * multiplier + xAcceleration * time;

        // this.velocityY = this.velocity * Math.sin(angleInRadians) + yAcceleration * time;
      
        // return { x: xVelocity, y: yVelocity };
      }
      

    // setVelocityX() {

    //     if (!this.accelerating) {
    //         return;
    //     }
    //     // if (this.angle === 90 || this.angle === 270) {
    //     //     this.velocityX = 0;
    //     //     return;
    //     // }
    //     this.velocityX = Math.cos((this.angle * Math.PI) / 180) * this.velocity;
    // }
    // setVelocityY() {

    //     if (!this.accelerating) {
    //         return;
    //     }
    //     // if (this.angle === 0 || this.angle === 180) {
    //     //     this.velocityY = 0;
    //     //     return;
    //     // }
    //     this.velocityY = Math.sin((this.angle * Math.PI) / 180) * this.velocity;
    // }

    setPostion(time: number) {
        this.position += this.velocity * time
        this.x += this.velocityX * time;
        this.y += this.velocityY * time

    }


    setVelocities(time: number) {
        this.calculateVelocity(time);

        this.setVelocity(time);
    }


    
    accelerate(time: number, acceleration: number) {
        this.accelerating = true;
        this.angle = this.thrusterAngle;
        this.setAcceleration(acceleration)
        this.setVelocities(time);
        this.setPostion(time);
    }

    angularAccelerate(time: number, acceleration: number) {
        this.setAngularAcceleration(acceleration);
        this.setAngularVelocity(time);
        this.setAngle(time);

    }




}

export const ship = new Ship;