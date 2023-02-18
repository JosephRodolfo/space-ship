

<template>
  <div class="screen-container">
    <div class="data-container">
      <p>X: {{ Math.floor(ship.x) }}</p>
      <p>Y: {{ Math.floor(ship.y) }}</p>

      <p>X Velocity: {{ formatNumber(ship.velocityX) }}</p>
      <p>Y Velocity: {{ formatNumber(ship.velocityY) }}</p>
      <p> Velocity: {{ formatNumber(ship.velocity) }}</p>

      <p>Accelerating: {{ ship.accelerating }}</p>
      <p>Acceleration: {{formatNumber(ship.acceleration) }}</p>
      <p>Angular Accelerating: {{ ship.spinning }}</p>

      <p>Velocity Angle: {{ formatNumber(ship.angle) }}</p>
      <p>Thruster Angle: {{ formatNumber(ship.thrusterAngle) }}</p>

      <p>Angular Acceleration: {{ formatNumber(ship.angularAcceleration) }}</p>

      <p>Angular Velocity: {{ formatNumber(ship.angularVelocity) }}</p>
      <button @click="flipShip">Turn</button>

    </div>
    <MainCanvas @keydown="handleAccelerate" @keyup="stopAccelerate" tabindex=-1 :circles="[ship]">
    </MainCanvas>


  </div>
</template>
<script setup lang="ts">
import { timer } from '../src/services/timer';
import { Ship, Velocities } from './classes/ship';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { degreesToRadians, radiansToDegrees, round } from './helpers/helpers';
import MainCanvas, { Circles } from './components/Canvas.vue';
const ship = reactive(new Ship());
let counter = 0;
const acceleration = ref(ship.acceleration);
let lock: any = ref(false);
function flipShip() {
  ship.thrusterAngle += 180;
}


function move(accelValue: number) {
  timer.start(() => {
    // console.log('acceleration timer')
    if (ship.spinning) {
      let value = ship.thrusterAngle > 180 || ship.thrusterAngle <360 ? .001 : -.001
      ship.angularAccelerate(1, value)
      ship.setPostion(1);
    }
    if (ship.accelerating) {

      let value = ship.thrusterAngle > 270 || ship.thrusterAngle < 90 ? -.01 : .01

      ship.accelerate(1, value);
      ship.setAngle(1);

    };
  }, 100)
}



function handleAccelerate(e: any) {


  if (e.key === 'w' && !ship.accelerating) {
    ship.accelerating = true;
    lock.value = true;
    move(-.01);
  }
  if (e.key === 'a' && !ship.spinning){
    ship.spinning = true;
    lock.value = true;
    move(-.01);
  }

}
function stopAccelerate(e: any) {
  if (e.key === 'w' && lock.value) {
    ship.acceleration = 0;
    ship.accelerating = false;

    timer.stop();
    lock.value = false;
  }

  if (e.key === 'a' && lock.value) {
    ship.angularAcceleration = 0;
    ship.spinning = false;

    timer.stop();
    lock.value = false;
  }
}




onMounted(() => {

  setInterval(() => {

    if (!lock.value && !ship.accelerating && !ship.spinning) {
      // console.log('main timer')
      ship.setAngle(1);
      ship.setPostion(1);
    }

  }, 100)
})

function formatNumber(number: number) {

  return number.toFixed(2);

}

</script>



<style scoped>
.screen-container {
  display: flex;
  width: 1000px;
  flex-direction: row;
  justify-content: space-between;

}
</style>
