
<template>
    <div>
        <canvas ref="canvasRef" class="mini-map" height="100" width="100"></canvas>
    </div>
</template>

<script setup lang="ts">

import { canvasDrawer } from '../services/CanvasDrawing';
import { onMounted, reactive, ref, watch, computed } from 'vue';
export interface Circles {
    x: number,
    y: number,
    radius: number,
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
    circles: {
        type: Array<Circles>,
        default: [],
    },
    scaleFactor: {
        type: Number,
        default: 1
    },
    background: {
        type: Boolean,
        default: true,
    },
});
const canvasRef = ref<HTMLCanvasElement>();
const background: string | any = ref('');
const currentBackGroundPosition = reactive({ x: 0, y: 0 });
const ship: string | any = ref('');


onMounted(() => {
    const myContext = canvasRef.value?.getContext('2d');
    myContext!.fillStyle = 'black'
    myContext?.fillRect(0, 0, 100, 100);
    drawCircle(50, 50, 1, myContext!);
})



watch([props], () => {


    const myContext = canvasRef.value?.getContext('2d');

    drawSequence(myContext!);
})
function drawCircle(x: number, y: number, radius: number, context: CanvasRenderingContext2D): void {
    context.fillStyle = 'orange';
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}


const planetCoords = computed(() => {
    if (!props.circles![1]) {
        return { x: 0, y: 0, radius: 0 };
    }

    const x = (props.circles![0].x - props.circles![1].x || 0) / props.scaleFactor + 50;
    const y = (props.circles![0].y - props.circles![1].y || 0) / props.scaleFactor + 50;
    const radius = props.circles[1].radius / props.scaleFactor;
    return { x, y, radius }
})

function drawSequence(context: CanvasRenderingContext2D) {

    requestAnimationFrame(() => {
        context!.fillStyle = 'black'
        context?.fillRect(0, 0, 100, 100);
        drawCircle(50, 50, 1, context!);
        if (props.circles![1]) canvasDrawer.drawCircle(planetCoords.value.x, planetCoords.value.y, planetCoords.value.radius, context, false, 'blue');
    })

}

</script>


<style scoped>
.mini-map {
    background-color: orange;
}
</style>