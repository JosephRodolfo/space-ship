

<template>
  <div class="screen-container">
    <div class="data-container">
      <p>X: {{ Math.floor(circleProps[0].x) }}</p>
      <p>Velocity: {{ circleProps[0].velocity * -1 }}</p>
      <p>Accelerating: {{ accelerating }}</p>
      <p>Acceleration: {{ xyAcceleration.x }}</p>
      <p>Angular Accelerating: {{ spinning }}</p>

      <p>Angle: {{ Math.floor(circleProps[0].angle) }}</p>
      <p>Angular Acceleration: {{ angularAcceleration }}</p>

      <p>Angular Velocity: {{ circleProps[0].angularVelocity * 1000 }}</p>


    </div>
    <MainCanvas tabindex=-1 @keydown="accelerate" @keyup="keyup" :circles="circleProps">
    </MainCanvas>


  </div>
</template>
<script setup lang="ts">
import { timer } from '../src/services/timer';
import { onMounted, reactive, ref, watch } from 'vue';
import { degreesToRadians, radiansToDegrees, round } from './helpers/helpers';
import MainCanvas, { Circles } from './components/Canvas.vue';

function accelerate(e: any) {
  if (e.key === 'w') {
    handleAccelerate(-.001, 'x')
  }
  // if (e.key === 'a') {
  //   handleAccelerate(.001, 'x');
  // }
  if (e.key === 'a') {
    handleSpin(.000001, 'positive')
  }
  if (e.key === 'd') {
    handleSpin(-.000001, 'negative')
  }

}

function handleSpin(value: number, direction: string) {
  spinning.value = true;
  if (spinning && direction === 'positive') {
    angularAcceleration.value += value;
  }
  if (spinning && direction === 'negative') {
    angularAcceleration.value += value;
  }
}

function calculateAngularVelocity(originalAngularVelocity: number, acceleration: number, time: number) {
  return originalAngularVelocity + (acceleration);
}


function handleAccelerate(value: number, direction: string) {
  accelerating.value = true;
  if (accelerating && direction === 'x') {
    xyAcceleration.x += value;

  }
  if (accelerating && direction === 'y') {
    xyAcceleration.y += value;

  }

}

const circleProps: Circles[] | any = ref([{
  radius: 10,
  x: 250,
  y: 250,
  scaleMultiplier: 1,
  velocity: 0,
  angle: 0,

}])
let accelerating = ref(false);
let spinning = ref(false);

let xyAcceleration = reactive({
  x: 0,
  y: 0,
})

let angularAcceleration = ref(0);
let time = ref(0);

function keyup() {
  xyAcceleration.x = 0;
  xyAcceleration.y = 0;
  accelerating.value = false;
  spinning.value = false;
  angularAcceleration.value = 0;
}
onMounted(() => {
  let velocity = -1;
  let angularVelocity = 0;
  let angle = 0;

  timer.start(() => {

    const { position, newVelocity, newAngularVelocity, newAngle } = startMoving(time.value, velocity, circleProps.value[0].x, angularVelocity, angle);
    velocity = newVelocity;
    angle = newAngle;
    angularVelocity = newAngularVelocity;
    circleProps.value[0].x = position;
    circleProps.value[0].velocity = newVelocity;
    circleProps.value[0].angle = newAngle;
    circleProps.value[0].angularVelocity = newAngularVelocity;
    time.value++
  })
  // setInterval(() => {
  //   const { position, newVelocity, newAngularVelocity, newAngle } = startMoving(time, velocity, circleProps.value[0].x, angularVelocity, angle);
  //   velocity = newVelocity;
  //   angle = newAngle;
  //   angularVelocity = newAngularVelocity;
  //   circleProps.value[0].x = position;
  //   circleProps.value[0].velocity = newVelocity;
  //   circleProps.value[0].angle = newAngle;
  //   circleProps.value[0].angularVelocity = newAngularVelocity;
  //   time++
  // }, 100)
})

watch(time, (newTime, oldTime) => {
  let dTime =  newTime - oldTime;
  const { position, newVelocity, newAngularVelocity, newAngle } = startMoving(dTime, circleProps.value[0].velocity, circleProps.value[0].x, circleProps.value[0].angularVelocity, circleProps.value[0].angle);
  circleProps.value[0].x = position;
  circleProps.value[0].velocity = newVelocity;
  circleProps.value[0].angle = newAngle;
  circleProps.value[0].angularVelocity = newAngularVelocity;

  if (!accelerating.value && !spinning.value) {
    timer.start(() => {
      const { position, newVelocity, newAngularVelocity, newAngle } = startMoving(dTime, circleProps.value[0].velocity, circleProps.value[0].x, circleProps.value[0].angularVelocity, circleProps.value[0].angle);
      circleProps.value[0].x = position;
      circleProps.value[0].velocity = newVelocity;
      circleProps.value[0].angle = newAngle;
      circleProps.value[0].angularVelocity = newAngularVelocity;
      time.value++
    })
  }


})

function startMoving(time: number, velocity: number, startingPosition: number, angularVelocity: number, originalAngle: number) {
  // const force = calculateForce(10, 0);
  const position = calculatePosition(startingPosition, velocity, time, xyAcceleration.x);
  const newVelocity = calculateVelocity(velocity, xyAcceleration.x, time);
  const newAngle = calculateAngle(originalAngle, angularVelocity, time, angularAcceleration.value)
  const newAngularVelocity = calculateAngularVelocity(angularVelocity, angularAcceleration.value, time);
  return { position, newVelocity, newAngularVelocity, newAngle }
}

// function calculateForce(mass: number, acceleration: number) {
//   return mass * acceleration;
// }


// s_x = s_o_x + v_x * t + a_x * t^2 / 2
// s_y = s_o_y + v_y * t + a_y * t^2 / 2
// v_x = v_o_x + a_x * t
// v_y = v_o_y + a_y * t

// function calculatePositionXy(xStarting: any, xVelocity: any, xAcceleration: any, yStarting: any, yVelocity: any, yAcceleration: any, time: any) {
//   let x;
//   let y;

//   function calculatePosition(originalPosition: number, velocity: number, time: number, acceleration: number) {
//     return originalPosition + (velocity * time) + (acceleration * ((time ^ time) / 2));


//   }
//   return {
//     x,
//     y,
//   }
// }



function calculatePosition(originalPosition: number, velocity: number, time: number, acceleration: number) {
  return originalPosition + (velocity * time) + (acceleration * ((time ^ time) / 2));
}

function calculateAngle(originalAngle: number, angularVelocity: number, time: number, angularAcceleration: number) {

  const originalRadians = degreesToRadians(originalAngle);

  let finalRadians = originalRadians + (angularVelocity * time) + (angularAcceleration * ((time ^ time) / 2));
// let finalDegrees = radiansToDegrees(finalRadians);
// finalDegrees = finalDegrees % 360;
// return finalDegrees;
  while (finalRadians >= 2 * Math.PI){
    finalRadians -= 2 * Math.PI;
  }
  while (finalRadians < 0){
    finalRadians += 2 * Math.PI;
  }
  let angle = radiansToDegrees(finalRadians)

  return angle;
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
