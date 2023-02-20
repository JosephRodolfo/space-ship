
<template>
    <div>
        <canvas ref="canvasRef" class="main-canvas" height="500" width="500"></canvas>
    </div>
</template>

<script setup lang="ts">

import { canvasDrawer } from '../services/CanvasDrawing';
import { onMounted, reactive, ref, watch } from 'vue';
import { timer } from '../services/timer';
export interface Circles {
    x: number,
    y: number,
    // radius: number,
    // velocity: number,
    angle: number
    velocityX: number,
    velocityY: number
    angularVelocity: number,
    angularAcceleration: number,
    acceleration: number,
    thrusterAngle: number,

}

const props = defineProps({
    circles: { type: Array<Circles> },
});
const canvasRef = ref<HTMLCanvasElement>();
const background: string | any = ref('');
const currentBackGroundPosition = reactive({x:0, y:0});
const ship: string | any = ref('');

onMounted(() => {
    const myContext = canvasRef.value?.getContext('2d');
    background.value = canvasDrawer.clipCanvas(0, myContext!, 'black');
     ship.value = canvasDrawer.clipShip(myContext!);

    drawSequence(myContext!)
})

watch([props], () => {
    const myContext = canvasRef.value?.getContext('2d');
    let xVelocity = props.circles![0].velocityX;
    let yVelocity = props.circles![0].velocityY;

    if (xVelocity > 499) {
        xVelocity = 500;
    };
    if (xVelocity < -499) {
        xVelocity = -500
    };
    if (yVelocity > 499) {
        yVelocity = 500;
    };
    if (yVelocity < -499) {
        yVelocity = -500
    };

    currentBackGroundPosition.x += xVelocity;
    currentBackGroundPosition.y += yVelocity;

    drawSequence(myContext!);
})

function drawSequence(context: CanvasRenderingContext2D) {
    if (currentBackGroundPosition.x < -500) {
        currentBackGroundPosition.x += 1000;
    }
    if (currentBackGroundPosition.x > 500) {
        currentBackGroundPosition.x += -1000;
    }
    if (currentBackGroundPosition.y < -500) {
        currentBackGroundPosition.y += 1000;
    }
    if (currentBackGroundPosition.y > 500) {
        currentBackGroundPosition.y += -1000;
    }
    requestAnimationFrame(() => {

        context.drawImage(background.value, -500 + currentBackGroundPosition.x, -500 + currentBackGroundPosition.y, 1500, 1500);
        context.save()
        context.translate(250, 250);
        context.rotate(props.circles![0].thrusterAngle * Math.PI / 180);
        context.translate(-250,-250);
        context.drawImage(ship.value, 0, 0, 20, 20, 240, 240, 20, 20);
        context.restore();
    })

}

</script>


<style scoped>
.main-canvas {
    background-color: lightgray;
}
</style>