

<template>
  <div class="screen-container">
    <div class="data-container">
      <p>X: {{ Math.floor(circleProps[0].x) }}</p>
      <p>Velocity: {{ circleProps[0].velocity * -1 }}</p>
      <p>Accelerating: {{ accelerating }}</p>
      <p>Acceleration: {{ acceleration }}</p>
    </div>
    <MainCanvas tabindex=-1  @keydown="accelerate" @keyup="keyup" :circles="circleProps">
    </MainCanvas>


  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import MainCanvas, { Circles } from './components/Canvas.vue';

function accelerate(e: any) {
    if  (e.key === 'd') {
      handleAccelerate(-.001)
    }
    if  (e.key === 'a') {
      handleAccelerate(.001);

        }    

}

function handleAccelerate(direction: number) {
  accelerating.value = true;
  if (accelerating) {
    acceleration.value += direction;

  }

}

const circleProps: Circles[] | any = ref([{
  radius: 10,
  x: 250,
  y: 250,
  scaleMultiplier: 1,
  velocity: 0

}])
let accelerating = ref(false);
let acceleration = ref(0);


function logPress() {
  accelerating.value = true;

  if (accelerating) {
    acceleration.value -= .001;

  }

}
function keyup() {
  acceleration.value = 0;
  accelerating.value = false;
}
onMounted(() => {
  let time = 0;
  let velocity = -1;

  setInterval(() => {
    const { position, newVelocity } = startMoving(time, velocity, circleProps.value[0].x);
    velocity = newVelocity;
    circleProps.value[0].x = position;
    circleProps.value[0].velocity = newVelocity;
    time++
  }, 100)
})

function startMoving(time: number, velocity: number, startingPosition: number) {
  // const force = calculateForce(10, 0);
  const position = calculatePosition(startingPosition, velocity, time, acceleration.value);
  const newVelocity = calculateVelocity(velocity, acceleration.value, time);
  return { position, newVelocity }
}

function calculateForce(mass: number, acceleration: number) {
  return mass * acceleration;
}

function calculatePosition(originalPosition: number, velocity: number, time: number, acceleration: number) {
  return originalPosition + (velocity * time) + (acceleration * ((time ^ time) / 2));
}

function calculateVelocity(originalVelocity: number, acceleration: number, time: number) {
  return originalVelocity + (acceleration * time);
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
