
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
    myContext!.fillStyle = 'black'
        myContext?.fillRect(0, 0, 100, 100);
    drawSequence(myContext!, props.course);
    drawFutureCourse(props.course, myContext!);
})
function drawCircle(x: number, y: number, radius: number, context: CanvasRenderingContext2D): void {
    context.fillStyle = 'orange';
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}
function drawFutureCourse(course: Coords[], context: CanvasRenderingContext2D): void {
    if (course.length === 0) return;
    for (let i = 0; i < course.length - 1; i++) {
        let two = i + 1;
        let x1 = course[i].x /// props.scaleFactor + 50
        let y1 = course[i].y /// props.scaleFactor + 50
        let x2 = course[two].x /// props.scaleFactor + 50
        let y2 = course[two].y /// props.scaleFactor + 50



        // Reset the current path
        let offset = 50
        context.beginPath();
        // console.log((x1 - props.circles![0].x) / props.scaleFactor + offset, (y1 - props.circles![0].y) / props.scaleFactor + offset)
        // console.log((x2 - props.circles![0].x) / props.scaleFactor + offset, (y2 - props.circles![0].y) / props.scaleFactor + offset);

        context.moveTo( (x1 - props.circles![0].x) / props.scaleFactor + offset, (y1 - props.circles![0].y) / props.scaleFactor + offset,);
        context.lineTo((x2 - props.circles![0].x) / props.scaleFactor + offset, (y2 - props.circles![0].y) / props.scaleFactor + offset);
                context.lineWidth = 1;

        context.strokeStyle = 'white';

        // Make the line visible
        context.stroke();


    }

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

function drawSequence(context: CanvasRenderingContext2D, course: Coords[]) {

    requestAnimationFrame(() => {
        drawCircle(50, 50, 1, context!);
        // if (props.circles![1]) canvasDrawer.drawCircle(planetCoords.value.x, planetCoords.value.y, planetCoords.value.radius, context, false, 'blue');
    })

}

</script>


<style scoped>
.mini-map {
    background-color: orange;
}
</style>