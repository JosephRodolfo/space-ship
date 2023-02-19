

<template>
  <div class="screen-container">
    <div class="data-container">
      <p>X: {{ Math.floor(ship.x) }}</p>
      <p>Y: {{ Math.floor(ship.y) }}</p>

      <p>X Velocity: {{ formatNumber(ship.velocityX) }}</p>
      <p>Y Velocity: {{ formatNumber(ship.velocityY) }}</p>
      <!-- <p> Velocity: {{ formatNumber(ship.velocity) }}</p> -->

      <p>Accelerating: {{ ship.acceleration !== 0 }}</p>
      <p>Acceleration: {{ formatNumber(ship.acceleration) }}</p>
      <!-- <p>Angular Accelerating: {{ ship.ang }}</p> -->

      <p>Velocity Angle: {{ formatNumber(ship.angle) }}</p>
      <p>Thruster Angle: {{ formatNumber(ship.thrusterAngle) }}</p>

      <!-- <p>Angular Acceleration: {{ formatNumber(ship.angularAcceleration) }}</p> -->

      <!-- <p>Angular Velocity: {{ formatNumber(ship.angularVelocity) }}</p> -->
      <button @click="flipShip">Turn</button>

    </div>
    <MainCanvas @keydown="handleAccelerate" @keyup="stopAccelerate" tabindex=-1 :circles="[ship]">
    </MainCanvas>


  </div>
</template>
<script setup lang="ts">
import { timer } from '../src/services/timer';
import { Ship } from './classes/ship';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { degreesToRadians, radiansToDegrees, round } from './helpers/helpers';
import MainCanvas, { Circles } from './components/Canvas.vue';
const ship = reactive(new Ship());
let counter = 0;
const acceleration = ref(ship.acceleration);
let lock: any = ref(false);
function flipShip() {
  ship.setThrusterAngle(ship.thrusterAngle + 45);
}


function move() {
  timer.start(() => {

      console.log('move tiemr')

      ship.accelerate();
      ship.setVelocity(1);
      ship.calculateVelocity(1)
      ship.setPosition(1);
  
  }, 100)
}



function handleAccelerate(e: any) {


  if (e.key === 'w' && !lock.value) {
    lock.value = true;
    move();
  }
  // if (e.key === 'a' && !ship.spinning){
  //   ship.spinning = true;
  //   lock.value = true;
  //   move();
  // }

}
function stopAccelerate(e: any) {
  if (e.key === 'w' && lock.value) {
    ship.stopAccelerating();
    // ship.accelerating = false;

    timer.stop();
    lock.value = false;
  }

  // if (e.key === 'a' && lock.value) {
  //   ship.angularAcceleration = 0;
  //   ship.spinning = false;

  //   timer.stop();
  //   lock.value = false;
  // }
}




onMounted(() => {

  setInterval(() => {

    if (!lock.value && ship.acceleration === 0) {
      console.log('main tiemr')

      ship.stopAccelerating();
      ship.setVelocity(1);
      ship.calculateVelocity(1);
      ship.setPosition(1);

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
