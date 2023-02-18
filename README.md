# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

const mass = 10; // mass of the object in kilograms
const initialVelocity = 5; // initial velocity in meters/second
const initialPosition = 0; // initial position in meters
const timeStep = 0.1; // time step in seconds
let angle = 45; // initial angle in degrees
let thrusterAngle = 0; // angle of the thruster in degrees
let acceleration = 0; // acceleration in meters/second^2

let velocity = initialVelocity; // current velocity of the object
let xVelocity = Math.cos(angle * (Math.PI / 180)) * velocity; // x velocity in meters/second
let yVelocity = Math.sin(angle * (Math.PI / 180)) * velocity; // y velocity in meters/second
let position = initialPosition; // current position in meters
let xPosition = initialPosition; // current x position in meters
let yPosition = initialPosition; // current y position in meters

function updatePosition() {
  // calculate the force acting on the object based on the angle of the thruster
  const force = mass * acceleration * Math.cos((thrusterAngle - angle) * (Math.PI / 180));

  // update the velocity based on the force and the time step
  velocity += force * timeStep / mass;
  if (velocity < 0) {
    velocity = -velocity;
    angle += 180;
  }

  // update the angle of the object's motion based on the velocity
  angle += Math.atan2(yVelocity, xVelocity) * 180 / Math.PI;

  // recalculate the x and y velocities based on the new angle
  xVelocity = Math.cos(angle * (Math.PI / 180)) * velocity;
  yVelocity = Math.sin(angle * (Math.PI / 180)) * velocity;

  // update the position based on the velocity and the time step
  position += velocity * timeStep;
  xPosition += xVelocity * timeStep;
  yPosition += yVelocity * timeStep;

  console.log(`Position: (${xPosition}, ${yPosition}) meters`);
}

// update the position of the object every time step
setInterval(updatePosition, timeStep * 1000);
