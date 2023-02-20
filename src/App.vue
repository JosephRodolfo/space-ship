

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

      <p>Angular Acceleration: {{ formatNumber(ship.angularAcceleration) }}</p>

      <p>Angular Velocity: {{ formatNumber(ship.angularVelocity) }}</p>
      <button @click="flipShip">Turn</button>

    </div>
    <Gauge :label="'x velocity'" :width="100" :height="100" :value="ship.velocityX" :max="5" :gapSize="60" ></Gauge>
    <Gauge :label="'x velocity'" :width="100" :height="100" :value="ship.velocityX" :max="50" :gapSize="90" ></Gauge>
    <Gauge :label="'x velocity'" :width="100" :height="100" :value="ship.velocityX" :max="100" :gapSize="120" ></Gauge>

    <Gauge :label="'acceleration'" :width="100" :height="100" :value="ship.acceleration" :max="10" :gapSize="180" ></Gauge>

    <MainCanvas @keydown="handleAccelerate" @keyup="stopAccelerate" tabindex=-1 :circles="[ship]">
    </MainCanvas>


  </div>
</template>
<script setup lang="ts">
import { timer } from '../src/services/timer';
import { Ship } from './classes/ship';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import Gauge from './components/gauges/Gauge.vue';
import MainCanvas, { Circles } from './components/Canvas.vue';
const ship = reactive(new Ship());
const acceleration = ref(ship.acceleration);
let lock: any = ref(false);
let angularAccelerationValue = ref(0);

let thrusterLock = ref(false);
function flipShip() {
  ship.setThrusterAngle(ship.thrusterAngle + 45);
}


function move() {
  timer.start(() => {
    if (thrusterLock.value) ship.fireThruster(angularAccelerationValue.value);
    ship.calculateAngularVelocity(1);
    ship.setAngleFromAngularVelocity(1);
    if (lock.value) ship.accelerate();
    ship.calculateVelocity(1)
    ship.setPosition(1);

  }, 100)
}



function handleAccelerate(e: any) {


  if (e.key === 'w' && !lock.value) {
    lock.value = true;
    move();
  }
  if (e.key === 'a' && !thrusterLock.value) {

    move();
    thrusterLock.value = true;
    angularAccelerationValue.value = .01
  }
  if (e.key === 'd' && !thrusterLock.value) {
    thrusterLock.value = true;

    angularAccelerationValue.value = -.01
    move();


  }


}
function stopAccelerate(e: any) {
  if (e.key === 'w' && lock.value) {
    ship.stopAccelerating();
    timer.stop();
    lock.value = false;
  }

  if (e.key === 'a') {
    angularAccelerationValue.value = 0
    thrusterLock.value = false;
    timer.stop();

    ship.stopFiringThruster();
  }


  if (e.key === 'd') {
    angularAccelerationValue.value = 0
    thrusterLock.value = false;
    timer.stop();

    ship.stopFiringThruster();


  }
}




onMounted(() => {

  setInterval(() => {

    if (!lock.value && !thrusterLock.value && ship.acceleration === 0) {
      if (thrusterLock.value) ship.fireThruster(angularAccelerationValue.value);
      ship.calculateAngularVelocity(1);
      ship.setAngleFromAngularVelocity(1);
      if (lock.value) ship.accelerate();
      ship.calculateVelocity(1)
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
