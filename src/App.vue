

<template>
  <div class="screen-container">
    <div class="data-container">
      <label>Rate</label>
      <input placeholder="Speed" v-model="rateSpeed.speed" type="number" />

      <p>X: {{ Math.floor(ship.x) }}</p>
      <p>Y: {{ Math.floor(ship.y) }}</p>

      <p>X Velocity: {{ formatNumber(ship.velocityX) }}</p>
      <p>Y Velocity: {{ formatNumber(ship.velocityY) }}</p>
      <p> Velocity: {{ formatNumber(ship.velocity) }}</p>

      <p>Accelerating: {{ ship.acceleration !== 0 }}</p>
      <p>Acceleration: {{ formatNumber(ship.acceleration) }}</p>
      <!-- <p>Angular Accelerating: {{ ship.ang }}</p> -->

      <p>Velocity Angle: {{ formatNumber(ship.angle) }}</p>
      <p>Thruster Angle: {{ formatNumber(ship.thrusterAngle) }}</p>

      <p>Angular Acceleration: {{ formatNumber(ship.angularAcceleration) }}</p>

      <p>Angular Velocity: {{ formatNumber(ship.angularVelocity) }}</p>
      <button @click="flipShip">Turn</button>
      <button @click="createExtrapolatedCoords">Extrapolate Future Position</button>


    </div>
    <div class="gauge-dashboard">
      <Gauge :label="'X Velocity'" :width="100" :height="100" :value="ship.velocityX" :max="20000" :gapSize="60">
      </Gauge>
      <Gauge :label="'Y Velocity'" :width="100" :height="100" :value="ship.velocityY" :max="20000" :gapSize="90"
        :gapOffset="90"></Gauge>
      <Gauge :label="'Velocity'" :width="100" :height="100" :value="ship.velocity" :max="20000" :gapSize="120"></Gauge>

      <Gauge :label="'Acceleration'" :width="100" :height="100" :value="ship.acceleration" :max="100" :gapSize="180"
        :gapOffset="90">

      </Gauge>
      <Gauge :label="'Thruster Angle'" :width="100" :height="100" :value="ship.thrusterAngle" :max="360" :gapSize="0"
        :gapOffset="180" :omitValues="true"></Gauge>

      <Gauge :label="'Angle'" :width="100" :height="100" :value="ship.angle" :max="360" :gapSize="0" :gapOffset="180"
        :omitValues="true"></Gauge>
        <MiniMap :circles="circles" :course="futureCourse" :scaleFactor="2000000"></MiniMap>

    </div>
    <MainCanvas @keydown="handleAccelerate" :course="futureCourse" @keyup="stopAccelerate" tabindex=-1 :circles="circles" :scaleFactor="2000">
    </MainCanvas>
  </div>
</template>
<script setup lang="ts">
import { controller } from './classes/controller';
import { timer } from '../src/services/timer';
import { Coords } from './common/constants';
import { Ship } from './classes/ship';
import { Planet } from './classes/planet';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import Gauge from './components/gauges/Gauge.vue';
import MiniMap from './components/MiniMap.vue';
import MainCanvas, { Circles } from './components/Canvas.vue';
const ship = reactive(new Ship());
// const planet = reactive(new Planet(1082000 + 6370000 * 1, 5000, 6370000,  5.972e+24)); 

const planet = reactive(new Planet(42000 + 6370000 * 1, 5000, 6370000,  5.972e+24)); //real values
// const planet = null
const rateSpeed = reactive({ speed: 100 });


const circles = computed(() => {
  let bodyArray = [];
  if (ship) bodyArray.push(ship);
  if (planet) bodyArray.push(planet);
  return bodyArray
})
let futureCourse = ref<Array<Coords>>();
let lock: any = ref(false);
let collision: any = ref(false);

let angularAccelerationValue = ref(0);

let thrusterLock = ref(false);
function flipShip() {
  ship.setThrusterAngle(ship.thrusterAngle + 45);
}


// function move() {
//   timer.start(() => {
//     if (thrusterLock.value) ship.fireThruster(angularAccelerationValue.value);
//     // ship.calculateAngularVelocity(10);
//     // ship.setAngleFromAngularVelocity(10);
//     if (lock.value) ship.accelerate();
//     ship.calculateVelocity(10, planet!);
//     ship.setPosition(10);

//   }, rateSpeed.speed)
// }



function handleAccelerate(e: any) {


  if (e.key === 'w' && !lock.value) {
    lock.value = true;
    // move();
  }
  if (e.key === 'a' && !thrusterLock.value) {

    // move();
    thrusterLock.value = true;
    angularAccelerationValue.value = .01
  }
  if (e.key === 'd' && !thrusterLock.value) {
    thrusterLock.value = true;

    angularAccelerationValue.value = -.01
    // move();


  }


}
function stopAccelerate(e: any) {
  if (e.key === 'w' && lock.value) {
    ship.stopAccelerating(planet!);
    // timer.stop();
    lock.value = false;
  }

  if (e.key === 'a') {
    angularAccelerationValue.value = 0
    thrusterLock.value = false;
    // timer.stop();

    ship.stopFiringThruster();
  }


  if (e.key === 'd') {
    angularAccelerationValue.value = 0
    thrusterLock.value = false;
    // timer.stop();

    ship.stopFiringThruster();


  }
}


watch([rateSpeed], () => {
  timer.set_interval(rateSpeed.speed)

});

function createExtrapolatedCoords() {
let x = ship.extrapolatePosition(planet, 1000) ;
  futureCourse.value = [...x];
}



onMounted(() => {

  timer.start(() => {

    if (thrusterLock.value) ship.fireThruster(angularAccelerationValue.value);
    ship.calculateAngularVelocity(10);
    ship.setAngleFromAngularVelocity(10);
    if (lock.value) ship.accelerate();
    if (planet) {
      const collision = controller.detectCollision(ship, planet!);
      if (collision) {
        ship.collision = true;
      } else {
        ship.collision = false;
      }
    }
      ship.moveShip(planet, 10);

  }, rateSpeed.speed)
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

.gauge-dashboard {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: fit-content;
}
</style>
