
<template>
    <div>
        <canvas ref="canvasRef" class="main-canvas" height="500" width="500"></canvas>
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
    collision: boolean,

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
        default: []
    }
});
const canvasRef = ref<HTMLCanvasElement>();
const background: string | any = ref('');
const currentBackGroundPosition = reactive({ x: 0, y: 0 });
const ship: string | any = ref('');


onMounted(() => {
    const myContext = canvasRef.value?.getContext('2d');
    background.value = canvasDrawer.clipCanvas(0, myContext!, 'black');
    ship.value = canvasDrawer.clipShip(myContext!, 20, 20);

    drawSequence(myContext!)
})

watch([props], () => {


    const myContext = canvasRef.value?.getContext('2d');

    let xVelocity = props.circles![0].velocityX;
    let yVelocity = props.circles![0].velocityY;

    if (xVelocity > 499) {
        xVelocity = 498;
    };
    if (xVelocity < -499) {
        xVelocity = -498
    };
    if (yVelocity > 499) {
        yVelocity = 498;
    };
    if (yVelocity < -499) {
        yVelocity = -498
    };

    currentBackGroundPosition.x += xVelocity / 1000;
    currentBackGroundPosition.y += yVelocity / 1000;

    drawSequence(myContext!);
    // canvasDrawer.drawCircle(250, 260, 100, myContext!, false, 'green')

    // drawFutureCourse(props.course, myContext!);
})

// function drawFutureCourse(course: Coords[], context: CanvasRenderingContext2D): void {
//     if (course.length === 0) return;
//     for (let i = 0; i < 10 - 1; i++) {
//         let two = i + 1;
//         let x1 = course[i].x /// props.scaleFactor + 50
//         let y1 = course[i].y /// props.scaleFactor + 50
//         let x2 = course[two].x /// props.scaleFactor + 50
//         let y2 = course[two].y /// props.scaleFactor + 50



//         // Reset the current path
//         console.log((x1 - props.circles![0].x)  / props.scaleFactor + 250)
//         context.beginPath();
//         context.moveTo((x1 - props.circles![0].x) / props.scaleFactor + 250, (y1 - props.circles![0].y)  / props.scaleFactor + 250);
//         context.moveTo((x2 - props.circles![0].x) / props.scaleFactor + 250, (y2 - props.circles![0].y)  / props.scaleFactor + 250);
//                 context.lineWidth = 100;

//         context.strokeStyle = 'white';

//         // Make the line visible
//         context.stroke();


//     }

// }
const color = computed(() => {
    const color = props.circles[0].collision ? 'red' : 'white';
    return color;
})
const planetCoords = computed(() => {
    if (!props.circles![1]) {
        return { x: 0, y: 0, radius: 0 };
    }

    const x = (props.circles![0].x - props.circles![1].x || 0) / props.scaleFactor + 250;
    const y = (props.circles![0].y - props.circles![1].y || 0) / props.scaleFactor + 250;
    const radius = props.circles[1].radius / props.scaleFactor;
    return { x, y, radius }
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

        if (props.background) context.drawImage(background.value, -500 + currentBackGroundPosition.x, -500 + currentBackGroundPosition.y, 1500, 1500);
        context.save()
        context.translate(250, 250);
        context.rotate(props.circles![0].thrusterAngle * Math.PI / 180);
        context.translate(-250, -250);
        if (props.circles![1]) canvasDrawer.drawCircle(250, 250, 10, context, true, color.value)

        // context.drawImage(ship.value, 0, 0, 20, 20, 240, 240, 20, 20);
        context.restore();
        // drawFutureCourse(props.course, context!);

        if (props.circles![1]) canvasDrawer.drawCircle(planetCoords.value.x, planetCoords.value.y, planetCoords.value.radius, context, true, color.value)
    })

}

</script>


<style scoped>
.main-canvas {
    background-color: lightgray;
}
</style>