
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
}

const props = defineProps({
    circles: { type: Array<Circles> },
});
const canvasRef = ref<HTMLCanvasElement>();
const background: string | any = ref('');
const currentBackGroundPosition = ref(0);

onMounted(() => {
    const myContext = canvasRef.value?.getContext('2d');
    background.value = canvasDrawer.clipCanvas(0, myContext!, 'black');
    drawSequence(myContext!)
})

watch([props], () => {
    const myContext = canvasRef.value?.getContext('2d');
    let velocity = props.circles![0].velocity

    if (velocity > 500) {
        velocity = 500;
    };
    if (velocity < -500) {
        velocity = -500
    };

    currentBackGroundPosition.value += velocity;

    drawSequence(myContext!);
})

function drawSequence(context: CanvasRenderingContext2D) {
    if (currentBackGroundPosition.value < -500) {
        currentBackGroundPosition.value += 500;
    }
    if (currentBackGroundPosition.value > 500) {
        currentBackGroundPosition.value += -500;
    }

    context.drawImage(background.value, -500 + currentBackGroundPosition.value, -500, 1500, 1500);
    canvasDrawer.drawCircle(250, 250, props.circles![0].radius, context)
}

</script>


<style scoped>
.main-canvas {
    background-color: lightgray;
}
</style>