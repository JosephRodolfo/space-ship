<template>
    <div class="gauge-container">
        <div class="canvasHolder">
            <canvas ref="canvasRef" class="canvas" :height="props.height" :width="props.width"> </canvas>

            <canvas ref="canvasRefNeedle" class="canvas" :height="props.height" :width="props.width"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { canvasDrawer } from '../../services/CanvasDrawing';
const canvasRef = ref<HTMLCanvasElement>();
const canvasRefNeedle = ref<HTMLCanvasElement>();

const gauge: string | any = ref('');

const props = defineProps({
    height: { type: Number },

    width: { type: Number, },
    label: { type: String },
    value: { type: Number },
    initialValue: {
        type: Number,
        default: 0
    },

    max: { type: Number },
    gapSize: { type: Number },
    gapOffset: {
        type: Number,
        default: 0,
    },
    omitValues: {
        type: Boolean,
        default: false
    }


});

const width = props.width || 50;
// let radius = props.width! / 2;

const height = props.width || 50;
const xMidpoint = width / 2;
const yMidpoint = height / 2;

let needleContext: any = null
onMounted(() => {
    needleContext = canvasRefNeedle.value?.getContext('2d');


    const context = canvasRef.value?.getContext('2d');


    if (!context) return;


    gauge.value = canvasDrawer.clipGauge({ canvasToClip: context, height, width, max: props.max, logarithmic: false, gapSize: props.gapSize, gapOffset: props.gapOffset, label: props.label, omitValues: props.omitValues });
    context.drawImage(gauge.value, 0, 0);
    // context.translate(xMidpoint, yMidpoint);

    // context.rotate((props.value! + props.gapSize!) * (Math.PI / 180));
    // context.translate(-xMidpoint, -yMidpoint);

    // context.moveTo(xMidpoint, yMidpoint);
    // context.lineTo(xMidpoint, yMidpoint + width / 3);
    // context.strokeStyle = '#91ff00';


    // context.stroke();

    // context.closePath();

    const percent = Math.abs(props.value!) / props.max!;
    const radians = decimalToRadian(percent, (360 - props.gapSize!));
    // let gapSizeRadians = degreesToRadians(props.gapSize!);
    const offset = degreesToRadians(90) - degreesToRadians(props.gapOffset);

    needleContext.save();

    needleContext.translate(xMidpoint, yMidpoint);
    needleContext.rotate(radians - offset);
    needleContext.translate(-xMidpoint, -yMidpoint);

    needleContext.clearRect(0, 0, width, height);
    needleContext.beginPath();

    needleContext.moveTo(xMidpoint, yMidpoint);
    needleContext.lineTo(xMidpoint, yMidpoint + width / 3);
    needleContext.strokeStyle = '#91ff00';

    needleContext.stroke();
    needleContext.closePath();
    needleContext.restore();


})

function decimalToRadian(decimal: number, remainingDegrees: number) {
    const degrees = decimal * remainingDegrees;
    return degrees * Math.PI / 180;
}
function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}

watch([props], () => {
    let offset = degreesToRadians(90) - degreesToRadians(props.gapOffset);;

    needleContext = canvasRefNeedle.value?.getContext('2d');

    needleContext.clearRect(0, 0, 1000, 1000)

    requestAnimationFrame(() => {

        const percent = Math.abs(props.value!) / props.max!;
        const radians = decimalToRadian(percent, (360 - props.gapSize!));
        // let gapSizeRadians = degreesToRadians(props.gapSize!);

        if (!needleContext) return;
        needleContext.save();

        needleContext.translate(xMidpoint, yMidpoint);
        needleContext.rotate((radians - offset));
        needleContext.translate(-xMidpoint, -yMidpoint);
        needleContext.clearRect(0, 0, width, height);

        needleContext.beginPath();

        needleContext.moveTo(xMidpoint, yMidpoint);
        needleContext.lineTo(xMidpoint, yMidpoint + width / 3);
        needleContext.strokeStyle = '#91ff00';

        needleContext.stroke();
        needleContext.closePath();
        needleContext.restore();
    })



})



</script>

<style scoped>
.gauge-container {
    width: 100px;
    height: 100px;
}

.canvasHolder {
    position: relative;
    z-index: -1;
}

.canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}
</style>