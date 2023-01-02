

<template>
  <div class="screen-container">
    <div class="data-container">
      <p>X: {{ Math.floor(circleProps[0].x) }}</p>
      <p>X Velocity: {{ circleProps[0].velocityX * -1 }}</p>
      <p>Y Velocity: {{ circleProps[0].velocityY * -1 }}</p>

      <p>Accelerating: {{ accelerating }}</p>
      <p>Acceleration: {{ circleProps[0].acceleration }}</p>
      <p>Angular Accelerating: {{ spinning }}</p>

      <p>Angle: {{ Math.floor(circleProps[0].angle) }}</p>
      <p>Angular Acceleration: {{ circleProps[0].angularAcceleration }}</p>

      <p>Angular Velocity: {{ circleProps[0].angularVelocity * 1000 }}</p>

      <button @click="flipXdirection">Flip x direction</button>
    </div>
    <MainCanvas tabindex=-1 @keydown="accelerate" @keyup="keyup" :circles="circleProps">
    </MainCanvas>


  </div>
</template>
<script setup lang="ts">
import { timer } from '../src/services/timer';
import { onMounted, reactive, Ref, ref, watch } from 'vue';
import { degreesToRadians, radiansToDegrees, round } from './helpers/helpers';
import MainCanvas, { Circles } from './components/Canvas.vue';
let debounce = ref(false);
let debounceAngle = ref(false);

function flipXdirection(){
  if (circleProps.value[0].angle === 0)circleProps.value[0].angle = 180;
  else circleProps.value[0].angle = 0;

}
function accelerate(e: any) {
  if (e.key === 'w') {
    accelerating.value = true;
    if (!debounce.value) {
      debounce.value = true;
      setTimeout(() => {
        if (accelerating.value) handleAccelerate(.001, 'x')
        debounce.value = false;
      }, 200)
    }
  }
  if (e.key === 'a') {
    spinning.value = true;
    if (!debounceAngle.value) {
      debounceAngle.value = true;
      setTimeout(() => {
        if (spinning.value) handleSpin(.000001);
        debounceAngle.value = false;
      }, 200)
    }
  }
  if (e.key === 'd') {
    spinning.value = true;
    if (!debounceAngle.value) {
      debounceAngle.value = true;
      setTimeout(() => {
        if (spinning.value) handleSpin(-.000001);
        debounceAngle.value = false;
      }, 200)
    }
  }

}

function handleSpin(value: number) {
  if (spinning.value) {
    circleProps.value[0].angularAcceleration += value;
    angularAccelerationRef.value = circleProps.value[0].angularAcceleration;

  }
}

function calculateAngularVelocity(originalAngularVelocity: number, acceleration: number, time: number) {
  return originalAngularVelocity + (acceleration);
}


function handleAccelerate(value: number, direction: string) {
  if (accelerating && direction === 'x') {
    circleProps.value[0].acceleration += value;
    accelerationRef.value = circleProps.value[0].acceleration;

  }


}
let accelerationRef = ref(0);
let angularAccelerationRef = ref(0);

const circleProps: Ref<Circles[]> = ref([{
  radius: 10,
  x: 250,
  y: 250,
  scaleMultiplier: 1,
  acceleration: 0,
  velocity: 0,
  angle: 0,
  velocityX: 1,
  velocityY: 0,
  angularVelocity: 0,
  angularAcceleration: 0,


}])
let accelerating = ref(false);
let spinning = ref(false);



let time = ref(0);

function keyup() {
  circleProps.value[0].acceleration = 0;
  circleProps.value[0].angularAcceleration = 0;
  accelerationRef.value = 0;
  angularAccelerationRef.value = 0;

  accelerating.value = false;
  spinning.value = false;
}
onMounted(() => {

  timer.start(() => {
    const { position, newVelocity, newVelocityX, newVelocityY } = startMovingVector(time.value, circleProps.value[0].velocity, circleProps.value[0].x, circleProps.value[0].y, circleProps.value[0].angularVelocity, circleProps.value[0].angle, circleProps.value[0].acceleration);
    circleProps.value[0].x = position.x;
    circleProps.value[0].y = position.y;
    circleProps.value[0].velocity = newVelocity;
    circleProps.value[0].angle = 0;
    circleProps.value[0].angularVelocity = 0;
    circleProps.value[0].velocityX = newVelocityX;
    circleProps.value[0].velocityY = newVelocityY;
    time.value++
  })
})

// watch(angularAccelerationRef, (newTime, oldTime) => {

//   const dTime = 1;
//   const { newAngularVelocity, newAngle } = startRotating(dTime, circleProps.value[0].angularVelocity, circleProps.value[0].angle, circleProps.value[0].angularAcceleration)

//   circleProps.value[0].angularVelocity = newAngularVelocity;
//   circleProps.value[0].angle = newAngle;
//   time.value++;
//   if (!accelerating.value && !spinning.value) {
//     timer.start(() => {
//       const { newAngularVelocity, newAngle } = startRotating(dTime, circleProps.value[0].angularVelocity, circleProps.value[0].angle, circleProps.value[0].angularAcceleration)

//       circleProps.value[0].angularVelocity = newAngularVelocity;
//       circleProps.value[0].angle = newAngle;

//       time.value++
//     })
//   }

//   })



watch([accelerationRef, angularAccelerationRef], ([newAccleration, oldAcceleration], [newAngularAccleration, oldAngularAcceleration]) => {

  const dTime = 1;
  let accelerationChanged = newAccleration !== oldAcceleration;
  let angularAccelerationChanged = newAngularAccleration !== oldAngularAcceleration;

  const { position, newVelocity, newVelocityX, newVelocityY } = startMovingVector(dTime, circleProps.value[0].velocity, circleProps.value[0].x, circleProps.value[0].y, circleProps.value[0].angularVelocity, circleProps.value[0].angle, circleProps.value[0].acceleration);

  const { newAngularVelocity, newAngle } = startRotating(dTime, circleProps.value[0].angularVelocity, circleProps.value[0].angle, circleProps.value[0].angularAcceleration)

  circleProps.value[0].x = position.x;
  circleProps.value[0].y = position.y;
  circleProps.value[0].velocity = accelerating.value ? newVelocity : circleProps.value[0].velocity
  circleProps.value[0].angle = newAngle
  circleProps.value[0].angularVelocity = newAngularVelocity
  circleProps.value[0].velocityX = accelerating.value ? newVelocityX : circleProps.value[0].velocityX
  circleProps.value[0].velocityY = accelerating.value ? newVelocityY : circleProps.value[0].velocityY
  time.value++

  if (!accelerating.value && !spinning.value) {
    timer.start(() => {
      const { position, newVelocity, newVelocityX, newVelocityY } = startMovingVector(dTime, circleProps.value[0].velocity, circleProps.value[0].x, circleProps.value[0].y, circleProps.value[0].angularVelocity, circleProps.value[0].angle, circleProps.value[0].acceleration);
      const { newAngularVelocity, newAngle } = startRotating(dTime, circleProps.value[0].angularVelocity, circleProps.value[0].angle, circleProps.value[0].angularAcceleration)
      circleProps.value[0].x = position.x;
      circleProps.value[0].y = position.y;
      circleProps.value[0].velocity = accelerating.value ? newVelocity : circleProps.value[0].velocity
      circleProps.value[0].angle = newAngle
      circleProps.value[0].angularVelocity = newAngularVelocity
      circleProps.value[0].velocityX = accelerating.value ? newVelocityX : circleProps.value[0].velocityX
      circleProps.value[0].velocityY = accelerating.value ? newVelocityY : circleProps.value[0].velocityY
      time.value++
    })
  }


})

// function startMoving(time: number, velocity: number, startingPosition: number, angularVelocity: number, originalAngle: number, acceleration: number) {
//   // const force = calculateForce(10, 0);
//   const position = calculatePosition(startingPosition, velocity, time, acceleration);
//   const newVelocity = calculateVelocity(velocity, acceleration, time);
//   const newAngle = calculateAngle(originalAngle, angularVelocity, time, angularAcceleration.value)
//   const newAngularVelocity = calculateAngularVelocity(angularVelocity, angularAcceleration.value, time);
//   return { position, newVelocity, newAngularVelocity, newAngle }
// }

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

function startRotating(time: number, angularVelocity: number, originalAngle: number, angularAcceleration: number) {
  const newAngle = calculateAngle(originalAngle, angularVelocity, time, angularAcceleration)
  const newAngularVelocity = calculateAngularVelocity(angularVelocity, angularAcceleration, time);
  return { newAngle, newAngularVelocity };
}
function startMovingVector(time: number, velocity: number, positionX: number, positionY: number, angularVelocity: number, originalAngle: number, acceleration: number) {
  let radians = degreesToRadians(originalAngle)
  const position = calculatePositionVector(positionX, positionY, velocity, time, acceleration, radians)
  const newVelocity = calculateVelocity(velocity, acceleration, time);
  const newVelocityX = calculateVelocityX(velocity, acceleration, time, radians);
  const newVelocityY = calculateVelocityY(velocity, acceleration, time, radians)
  return { position, newVelocity, newVelocityX, newVelocityY };


}





function calculatePosition(originalPosition: number, velocity: number, time: number, acceleration: number) {
  return originalPosition + (velocity * time) + (acceleration * ((time ^ time) / 2));
}

function calculatePositionVector(originalX: number, originalY: number, velocity: number, time: number, acceleration: number, angle: number) {
  const x = originalX + (velocity * time * Math.cos(angle)) + ((1 / 2) * acceleration * (time * time));
  const y = originalY + (velocity * time * Math.sin(angle)) + ((1 / 2) * acceleration * (time * time));
  return { x, y }
}

function calculateVelocityX(velocity: number, acceleration: number, time: number, angle: number) {
  console.log(velocity);
  return (velocity * Math.cos(angle)) + (acceleration * time);
}
function calculateVelocityY(velocity: number, acceleration: number, time: number, angle: number) {
  if (angle === 0 || angle == Math.PI) {
    return 0;
  }
  return (velocity * Math.sin(angle)) + (acceleration * time);
}

function calculateAngle(originalAngle: number, angularVelocity: number, time: number, angularAcceleration: number) {
  const originalRadians = degreesToRadians(originalAngle);
  let finalRadians = originalRadians + (angularVelocity * time) + (angularAcceleration * ((time ^ time) / 2));
  while (finalRadians >= 2 * Math.PI) {
    finalRadians -= 2 * Math.PI;
  }
  while (finalRadians < 0) {
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
