import { Rotation } from './rotation';
import { Planet } from './planet';
import { G } from '../common/constants';
export class Ship extends Rotation {
    x: number;
    y: number;
    velocity: number;
    velocityX: number;
    velocityY: number;
    acceleration: number;
    thrusterAcceleration: number;
    mass: number;
    angle: number;
    radius: number;
    thrusterAngle: number;
    force: number;
    angularVelocity: number;
    angularAcceleration: number;

    constructor() {
        super();
        this.x = 250;
        this.y = 250;
        this.radius = 10;
        this.velocity = 0;
        this.velocityX = 0;
        this.velocityY = 7900;
        // this.velocityY = 0;
        this.thrusterAcceleration = 0.0;
        this.acceleration = 0.0;
        this.mass = 420000;
        this.angle = 0;
        this.thrusterAngle = 0;
        this.force = 0.01;
        this.angularAcceleration = 0;
        this.angularVelocity = 0;

        
    }


    applyGravity(planet: Planet, time: number) {
        if (!planet) return;
        // Calculate the distance between the ship and the planet
        const distanceX = planet.x - this.x;
        const distanceY = planet.y - this.y;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
        // Calculate the gravitational force between the ship and the planet
        const force = (G * planet.mass * this.mass) / (distance ** 2);
    
        // Calculate the angle between the ship and the planet
        const angle = Math.atan2(distanceY, distanceX);
    
        // Calculate the acceleration due to the gravitational force
        const gravitationalAcceleration = force / this.mass;
    
        // Calculate the x and y components of the gravitational acceleration
        const gravitationalAccelerationX = gravitationalAcceleration * Math.cos(angle);
        const gravitationalAccelerationY = gravitationalAcceleration * Math.sin(angle);
    
        // Calculate the thrust acceleration if the thrusters are firing
        let thrustAccelerationX = 0;
        let thrustAccelerationY = 0;
        if (this.thrusterAcceleration > 0) {
            const thrustAcceleration = this.thrusterAcceleration/// this.mass;
            const thrusterAngleInRadians = (this.thrusterAngle * Math.PI) / 180;
            thrustAccelerationX = thrustAcceleration * Math.cos(thrusterAngleInRadians);
            thrustAccelerationY = thrustAcceleration * Math.sin(thrusterAngleInRadians);
        }
    
        // Calculate the total acceleration
        const accelerationX = gravitationalAccelerationX + thrustAccelerationX;
        const accelerationY = gravitationalAccelerationY + thrustAccelerationY;

        // Update the x and y components of the velocity based on the total acceleration
        this.velocityX += accelerationX * time;
        this.velocityY += accelerationY * time;
    
        // Calculate the angle of the new velocity vector
        const totalVelocityAngle = Math.atan2(this.velocityY, this.velocityX);
    
        // Update the ship's acceleration and total velocity angle
        this.acceleration = Math.sqrt(accelerationX ** 2 + accelerationY ** 2);
        this.angle = totalVelocityAngle;
    }
    
      
      
      
    calculateVelocity(time: number, planet?: Planet) {

        if (planet) {
          this.applyGravity(planet, time);
        } else {
            this.acceleration = this.thrusterAcceleration;
            if (this.thrusterAcceleration === 0 || this.acceleration === 0) return;
          const angleInRadians = (this.thrusterAngle * Math.PI) / 180;
          const deltaVx = this.thrusterAcceleration * time * Math.cos(angleInRadians);
          const deltaVy = this.thrusterAcceleration * time * Math.sin(angleInRadians);
          this.velocityX += deltaVx;
          this.velocityY += deltaVy;
        }
      
        const totalVelocityMagnitude = Math.sqrt(
          this.velocityX ** 2 + this.velocityY ** 2
        );
        const totalVelocityAngle = Math.atan2(this.velocityY, this.velocityX);
        this.velocity = totalVelocityMagnitude;
        this.angle = (totalVelocityAngle * 180) / Math.PI;
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

    stopAccelerating(planet: Planet) {
        this.thrusterAcceleration = 0;
        this.calculateVelocity(10, planet);
    }
    accelerate() {
        this.setAngle();
        this.thrusterAcceleration += 100;
    }

      

      
      

}


