
<template>
    <div>
        <canvas ref="canvasRef" class="mini-map" height="100" width="100"></canvas>
    </div>
</template>

<script setup lang="ts">

import { canvasDrawer } from '../services/CanvasDrawing';
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { Coords } from '../common/constants';
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
    extrapolatePosition?: Function

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
    course: {
        type: Array<Coords>,
        default: [],
    }
});
const canvasRef = ref<HTMLCanvasElement>();
const shipTrajectory = ref<HTMLImageElement>();


onMounted(() => {
    const myContext = canvasRef.value?.getContext('2d');
    myContext!.fillStyle = 'black'
    myContext?.fillRect(0, 0, 100, 100);
    drawCircle(50, 50, 1, myContext!);
})

watch(() => props.course, () => {
    const myContext = canvasRef.value?.getContext('2d');


    shipTrajectory.value = drawFutureCourse(props.course);
})

watch([props], () => {
    const myContext = canvasRef.value?.getContext('2d');
    myContext!.fillStyle = 'black'
    myContext?.fillRect(0, 0, 100, 100);
    drawSequence(myContext!, props.course);
    // drawFutureCourse(props.course);
    // if (shipTrajectory.value) {
    // }
})
function drawCircle(x: number, y: number, radius: number, context: CanvasRenderingContext2D): void {
    context.fillStyle = 'orange';
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}
function drawFutureCourse(course: Coords[]): HTMLImageElement | undefined {
    console.log('drwaing future course')
    const newCanvas: HTMLCanvasElement | null = document.createElement("canvas");

    const context: CanvasRenderingContext2D | null = newCanvas.getContext("2d");
    if (!context) return;
    for (let i = 0; i < course.length - 1; i++) {
        let two = i + 1;

        let x1 = course[i].x
        let y1 = course[i].y
        let x2 = course[two].x
        let y2 = course[two].y
        let offset = 50
        context.beginPath();
        context.moveTo((props.circles![0].x - x1) / props.scaleFactor + offset, (props.circles![0].y - y1) / props.scaleFactor + offset);
        context.lineTo((props.circles![0].x - x2) / props.scaleFactor + offset, (props.circles![0].y - y2) / props.scaleFactor + offset);
        context.lineWidth = 1;
        context.strokeStyle = 'red';
        context.stroke();
    }
    const newImage = context.canvas.toDataURL("image/jpeg", 1.0);
    const img = new Image();
    img.src = newImage;
    return img;
}

const planetCoords = computed(() => {
    if (!props.circles![1]) return { x: 0, y: 0, radius: 0 };
    const x = (props.circles![0].x - props.circles![1].x || 0) / props.scaleFactor + 50;
    const y = (props.circles![0].y - props.circles![1].y || 0) / props.scaleFactor + 50;
    const radius = props.circles[1].radius / props.scaleFactor;
    return { x, y, radius }
})

function drawFutureTrajectory(context: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    context.drawImage(shipTrajectory.value!, 0, 0, 100, 100, offsetX, offsetY, 100, 100);
}

function drawSequence(context: CanvasRenderingContext2D, course: Coords[]) {
    requestAnimationFrame(() => {
        if (shipTrajectory.value) {

            let z = (props.circles![0].x - props.course![0].x) / props.scaleFactor;
            let y = (props.circles![0].y - props.course![0].y) / props.scaleFactor;

            drawFutureTrajectory(context, z, y);
        }
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