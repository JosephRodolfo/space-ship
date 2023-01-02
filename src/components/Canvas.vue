
<template>
    <div>
        <canvas ref="canvasRef" class="main-canvas" height="500" width="500"></canvas>
    </div>
</template>

<script setup lang="ts">

import { canvasDrawer } from '../services/CanvasDrawing';
import { onMounted, ref, watch } from 'vue';
export interface Circles {
    x: number,
    y: number,
    radius: number,
    scaleMultiplier: number,
    velocity: number,
    angle: number
}

const props = defineProps({
    circles: { type: Array<Circles> },
});
const canvasRef = ref<HTMLCanvasElement>();
const background: string | any = ref('');
const currentBackGroundPosition = ref(0);
const ship: string | any = ref('');

onMounted(() => {
    const myContext = canvasRef.value?.getContext('2d');
    background.value = canvasDrawer.clipCanvas(0, myContext!, 'black');
     ship.value = canvasDrawer.clipShip(myContext!);

    drawSequence(myContext!)
})

watch([props], () => {
    const myContext = canvasRef.value?.getContext('2d');
    let velocity = props.circles![0].velocity

    if (velocity > 499) {
        velocity = 500;
    };
    if (velocity < -499) {
        velocity = -500
    };

    currentBackGroundPosition.value += velocity;

    drawSequence(myContext!);
})

function drawSequence(context: CanvasRenderingContext2D) {
    if (currentBackGroundPosition.value < -500) {
        currentBackGroundPosition.value += 1000;
    }
    if (currentBackGroundPosition.value > 500) {
        currentBackGroundPosition.value += -1000;
    }
    requestAnimationFrame(() => {

        context.drawImage(background.value, -500 + currentBackGroundPosition.value, -500, 1500, 1500);
        context.save()
        context.translate(250, 250);
        context.rotate(props.circles![0].angle * Math.PI / 180);
        context.translate(-250,-250);
        context.drawImage(ship.value, 0, 0, 20, 20, 240, 240, 20, 20);
        context.restore();
        // canvasDrawer.drawCircle(250, 250, props.circles![0].radius, context);
        // context.fillStyle = 'green';
        // context.beginPath();
        // context.moveTo(250, 250);
        // context.lineTo(255, 250);
        // context.stroke();
    })

}

</script>


<style scoped>
.main-canvas {
    background-color: lightgray;
}
</style>