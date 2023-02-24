import { Ship } from "./ship";
import { G, EARTH_MASS } from "../common/constants";
export class Planet {
    x: number;
    y: number;
    mass: number;
    radius!: number;
    velocity!: number;
    angle!: number;
    velocityX!: number;
    velocityY!: number;
    angularVelocity!: number;
    angularAcceleration!: number;
    acceleration!: number;
    thrusterAngle!: number;
  
    constructor(x: number, y: number, radius: number, mass: number) {
      this.x = x;
      this.y = y;
        this.mass = mass;
        this.radius = radius;
    }
  
    // calculateGravity(ship: Ship): [number, number] {
    //   const distanceX = this.x - ship.x;
    //   const distanceY = this.y - ship.y;
    //   const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    //   const force = (G * this.mass * ship.mass) / (distance ** 2);
    //   const angle = Math.atan2(distanceY, distanceX);
    //   const forceX = force * Math.cos(angle);
    //   const forceY = force * Math.sin(angle);
    //   return [forceX, forceY];
    // }
  }
  

//   function calculateGravity(ship: Ship, planet: Planet) {
//     const distance = Math.sqrt((planet.x - ship.x) ** 2 + (planet.y - ship.y) ** 2);
//     const gravityMagnitude = planet.calculateGravity(distance, ship.mass);
//     const gravityAngle = Math.atan2(planet.y - ship.y, planet.x - ship.x);
//     const gravityX = gravityMagnitude * Math.cos(gravityAngle);
//     const gravityY = gravityMagnitude * Math.sin(gravityAngle);
//     return { gravityX, gravityY };
//   }
  
//   function applyGravity(ship: Ship, planet: Planet, time: number) {
//     const { gravityX, gravityY } = calculateGravity(ship, planet);
//     ship.velocityX += gravityX / ship.mass * time;
//     ship.velocityY += gravityY / ship.mass * time;
//   }
  