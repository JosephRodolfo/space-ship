import { Rotation } from './rotation';
import { Planet } from './planet';
import { G, Coords, Velocities } from '../common/constants';
import { radiansToDegrees, calculateDistance } from '../common/helpers';
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


    // applyGravity(planet: Planet, time: number, thrusterAcceleration: number, thrusterAngle: number) {
    //     // Calculate the distance between the ship and the planet
    //     const { distance, distanceX, distanceY } = calculateDistance({ x: this.x, y: this.y }, { x: planet.x, y: planet.y })

    //     // Calculate the gravitational force between the ship and the planet
    //     const force = (G * planet.mass * this.mass) / (distance ** 2);

    //     // Calculate the angle between the ship and the planet
    //     const angle = Math.atan2(distanceY, distanceX);

    //     // Calculate the acceleration due to the gravitational force
    //     const gravitationalAcceleration = force / this.mass;

    //     // Calculate the x and y components of the gravitational acceleration
    //     const gravitationalAccelerationX = gravitationalAcceleration * Math.cos(angle);
    //     const gravitationalAccelerationY = gravitationalAcceleration * Math.sin(angle);

    //     // Calculate the thrust acceleration if the thrusters are firing
    //     let thrustAccelerationX = 0;
    //     let thrustAccelerationY = 0;
    //     if (thrusterAcceleration > 0) {
    //         const thrustAcceleration = thrusterAcceleration/// this.mass;
    //         const thrusterAngleInRadians = (thrusterAngle * Math.PI) / 180;
    //         thrustAccelerationX = thrustAcceleration * Math.cos(thrusterAngleInRadians);
    //         thrustAccelerationY = thrustAcceleration * Math.sin(thrusterAngleInRadians);
    //     }

    //     // Calculate the total acceleration
    //     const accelerationX = gravitationalAccelerationX + thrustAccelerationX;
    //     const accelerationY = gravitationalAccelerationY + thrustAccelerationY;

    //     // Update the x and y components of the velocity based on the total acceleration
    //     this.velocityX += accelerationX * time;
    //     this.velocityY += accelerationY * time;

    //     // Calculate the angle of the new velocity vector
    //     const totalVelocityAngle = Math.atan2(this.velocityY, this.velocityX);

    //     // Update the ship's acceleration and total velocity angle
    //     this.acceleration = Math.sqrt(accelerationX ** 2 + accelerationY ** 2);
    //     this.angle = totalVelocityAngle;
    // }

    calculateXYAcceleration(planet: Planet, time: number, thrusterAcceleration: number, thrusterAngle: number) {
        // Calculate the distance between the ship and the planet
        const { distance, distanceX, distanceY } = calculateDistance({ x: this.x, y: this.y }, { x: planet.x, y: planet.y })

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
        if (thrusterAcceleration > 0) {
            const thrustAcceleration = thrusterAcceleration/// this.mass;
            const thrusterAngleInRadians = (thrusterAngle * Math.PI) / 180;
            thrustAccelerationX = thrustAcceleration * Math.cos(thrusterAngleInRadians);
            thrustAccelerationY = thrustAcceleration * Math.sin(thrusterAngleInRadians);
        }

        // Calculate the total acceleration
        const accelerationX = gravitationalAccelerationX + thrustAccelerationX;
        const accelerationY = gravitationalAccelerationY + thrustAccelerationY;
        return { accelerationX, accelerationY };
    }
    calculateXYVelocityFromAccelerations(accelerations: Velocities, time: number, velocities: Velocities) {
        return {
            x: this.velocityX + accelerations.x * time,
            y: this.velocityY + accelerations.y * time,
        }
    }


    // calculateVelocity(time: number, planet?: Planet) {

    //     if (planet) {
    //         this.applyGravity(planet, time);
    //     } else {
    //         this.acceleration = this.thrusterAcceleration;
    //         if (this.thrusterAcceleration === 0 || this.acceleration === 0) return;
    //         const angleInRadians = (this.thrusterAngle * Math.PI) / 180;
    //         const deltaVx = this.thrusterAcceleration * time * Math.cos(angleInRadians);
    //         const deltaVy = this.thrusterAcceleration * time * Math.sin(angleInRadians);
    //         this.velocityX += deltaVx;
    //         this.velocityY += deltaVy;
    //     }

    //     const totalVelocityMagnitude = Math.sqrt(
    //         this.velocityX ** 2 + this.velocityY ** 2
    //     );
    //     this.velocity = totalVelocityMagnitude;


    //     const totalVelocityAngle = Math.atan2(this.velocityY, this.velocityX);
    //     this.angle = (totalVelocityAngle * 180) / Math.PI;
    // }

    moveShip(planet: Planet, time: number) {

        if (planet) {
            const { accelerationX, accelerationY } = this.calculateXYAcceleration(planet, time, this.thrusterAcceleration, this.thrusterAngle);
            this.acceleration = Math.sqrt(accelerationX ** 2 + accelerationY ** 2);
            const velocities = this.calculateXYVelocityFromAccelerations({ x: accelerationX, y: accelerationY }, time, { x: this.velocityX, y: this.velocityY });
            this.setXYVelocity(velocities);
        } else if (this.thrusterAcceleration !== 0) {
            this.acceleration = this.thrusterAcceleration;
            const velocities = this.calculateXYVelocity({ x: this.velocityX, y: this.velocityY }, this.thrusterAngle, time, this.acceleration);
            this.setXYVelocity(velocities);
        }
        const velocities = { x: this.velocityX, y: this.velocityY }
        if (planet || this.thrusterAcceleration! == 0) {
            const totalVelocityMagnitude = this.calculateTotalVelocity(velocities);
            this.setTotalVelocity(totalVelocityMagnitude);
            const newAngle = this.calculateAngle(velocities);
            this.setVelocityAngle(newAngle);
        }

        const coords = this.calculatePosition({ x: this.x, y: this.y }, velocities, time);
        this.setPosition(coords);
    }

    extrapolatePosition(planet: Planet, time: number, initialVelocities: Velocities, initialVelocity: number, initialAcceleration: number, initialAngle: number, initialPosition: Coords) {
        let velocities = initialVelocities
        let acceleration = initialAcceleration;
        let angle = initialAngle;
        let position = initialPosition;
        let velocity = initialVelocity
                if (planet) {
            const { accelerationX, accelerationY } = this.calculateXYAcceleration(planet, time, acceleration, angle);
            acceleration = Math.sqrt(accelerationX ** 2 + accelerationY ** 2);
             velocities = this.calculateXYVelocityFromAccelerations({ x: accelerationX, y: accelerationY }, time, velocities);
        } else if (initialAcceleration !== 0) {
             velocities = this.calculateXYVelocity(velocities, angle, time, initialAcceleration);
        }
        // const velocities = { x: this.velocityX, y: this.velocityY }
        if (planet || acceleration! == 0) {
            velocity = this.calculateTotalVelocity(velocities);
            angle = this.calculateAngle(velocities);
        }

        const coords = this.calculatePosition(position, velocities, time);
        return { coords, velocities, position, angle, acceleration, velocity };
    }

    calculateAngle(velocities: Velocities) {
        const totalVelocityAngle = Math.atan2(velocities.y, velocities.x);
        return radiansToDegrees(totalVelocityAngle);
    }

    setVelocityAngle(newAngle: number) {
        this.angle = newAngle
    }

    calculateXYVelocity(velocities: Velocities, thrusterAngle: number, time: number, thrusterAcceleration: number) {
        const angleInRadians = (thrusterAngle * Math.PI) / 180;
        const deltaVx = thrusterAcceleration * time * Math.cos(angleInRadians);
        const deltaVy = thrusterAcceleration * time * Math.sin(angleInRadians);
        return { x: velocities.y + deltaVx, y: velocities.x + deltaVy }
    }

    setXYVelocity(velocities: Velocities) {
        this.velocityX = velocities.x;
        this.velocityY = velocities.y;
    }

    calculateTotalVelocity(velocities: Velocities) {
        const totalVelocityMagnitude = Math.sqrt(
            velocities.x ** 2 + velocities.y ** 2
        );
        return totalVelocityMagnitude;



    }

    setTotalVelocity(totalVelocityMagnitude: number) {
        this.velocity = totalVelocityMagnitude;
    }

    calculatePosition(coords: Coords, velocities: Velocities, time: number) {
        return {
            x: coords.x + velocities.x * time,
            y: coords.y + velocities.y * time,
        }
    }


    setPosition(coords: Coords) {
        this.x = coords.x;
        this.y = coords.y;
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
        // this.calculateVelocity(10, planet);
    }
    accelerate() {
        this.setAngle();
        this.thrusterAcceleration += 10;
    }






}


