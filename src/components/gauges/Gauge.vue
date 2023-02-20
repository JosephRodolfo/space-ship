<template>
    <div>
        <h1>Test</h1>
        <canvas ref="canvasRef" id="gauge" :height="props.height" :width="props.width"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { canvasDrawer } from '../../services/CanvasDrawing';
const canvasRef = ref<HTMLCanvasElement>();
const gauge: string | any = ref('');


const props = defineProps({
    height: { type: Number },

    width: { type: Number },
    label: { type: String },
    value: { type: Number },
    max: { type: Number },
    gapSize: { type: Number },


});

onMounted(() => {


    const context = canvasRef.value?.getContext('2d');
    if (!context) return;

    let radius = props.width;
    let width = props?.width;
    let height = props?.width;


    gauge.value = canvasDrawer.clipGauge({canvasToClip: context, height: height!, width: width!,  max: props.max, logarithmic: false, gapSize: props.gapSize });
    context.drawImage(gauge.value, 0, 0);


    context.translate(width! / 2, height! / 2);

    context.rotate(180 * Math.PI / 180); 
    context.translate(-width! / 2, -height! / 2);

    context.moveTo(width! / 2, height! / 2);
    context.lineTo(width! / 2, height! / 2 + width! / 3);
    context.strokeStyle = '#91ff00';


    context.stroke();
    context.closePath();

})



</script>

<style scoped>

</style>