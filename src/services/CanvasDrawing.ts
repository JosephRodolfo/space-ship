import { Circles } from "../components/Canvas.vue";

interface Star {
    x: number,
    y: number
}

class CanvasDrawing {
    constructor() {

    }
    drawCircle(x: number, y: number, radius: number, context: CanvasRenderingContext2D): void {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = 'green';
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - 10, y);
        context.stroke();
    }
    // clearBackground(context: CanvasRenderingContext2D): void {
    //     const { width, height } = context.canvas;
    //     context.rect(0, 0, width, height);
    //     context.fillStyle = 'b';
    //     context.fill();
    // }

    clipCanvas(
        xOffset: number,
        canvasToClip: CanvasRenderingContext2D,
        backgroundColor: string
    ) {
        const newCanvas: HTMLCanvasElement | null = document.createElement("canvas");
        const h = 1500;
        const w = 1500;
        newCanvas.width = w;
        newCanvas.height = h;
        const newContext = newCanvas.getContext("2d");
        if (!newContext) {
            return;
        }
        newContext.fillStyle = backgroundColor;
        newContext.fillRect(0, 0, newContext.canvas.width, newContext.canvas.height);
        const stars = this.createStars();
        newContext.drawImage(canvasToClip.canvas, xOffset, 0, w, h, 0, 0, w, h);
        this.drawStars(newContext, stars)
        const newImage = newContext.canvas.toDataURL("image/jpeg", 1.0);
        const img = new Image();
        img.src = newImage;
        return img;
    };

    clipShip(
        canvasToClip: CanvasRenderingContext2D,
    ) {
        const newCanvas: HTMLCanvasElement | null = document.createElement("canvas");
        const h = 20;
        const w = 20;
        newCanvas.width = w;
        newCanvas.height = h;
        const newContext = newCanvas.getContext("2d");
        if (!newContext) {
            return;
        }


        this.drawCircle(10, 10, 10, newContext)

        // newContext.fillStyle = 'white';

        // newContext.beginPath();
        // newContext.arc(0, 0, 10, 0, 2 * Math.PI);
        // newContext.fill();
        newContext.drawImage(canvasToClip.canvas, 0, 0, w, h, 0, 0, 0, 0);
        const newImage = newContext.canvas.toDataURL("image/jpeg", 1.0);
        const img = new Image();
        img.src = newImage;
        return img;
    };

    createStars() {
        let array = [];
        function randomNumber() {
            let random = Math.round(Math.random()) * 2 - 1
            return Math.floor(Math.random() * 1500) * random;
        }
        for (let x = 0; x < 2000; x++) {
            array.push({
                x: randomNumber(),
                y: randomNumber()
            });
        }
        return array;


    }
    drawStars(context: CanvasRenderingContext2D, stars: Array<Star>) {
        stars.forEach((star: any) => {
            context.fillStyle = 'white';
            context.fillRect(star.x, star.y, 1, 1)
        })
    }


    clipGauge({ height, width, canvasToClip, logarithmic = false, max = 100, gapSize = 30, gapOffset = 0, }: ClipGaugeOpts) {
        const newCanvas: HTMLCanvasElement | null = document.createElement("canvas");
        const h = height;
        const w = width;
        newCanvas.width = w;
        newCanvas.height = h;
        const newContext = newCanvas.getContext("2d");
        if (!newContext) {
            return;
        }

        const gapSizeRadians = (gapSize) * Math.PI / 180; // default to 30 degrees gap size, convert to radians

        newContext.fillStyle = "#242424"
        newContext.fillRect(0, 0, w, h);

        newContext.fillStyle = '#0e1740';
        newContext.beginPath();
        newContext.arc(height / 2, width / 2, height / 2 * .90, 0, 2 * Math.PI);
        newContext.fill();

        newContext.beginPath();
        newContext.arc(width! / 2, height! / 2, width! / 2 * .95, 0, 2 * Math.PI, false);
        // newContext.fill();
        newContext.lineWidth = 5;
        newContext.strokeStyle = '#3e5ee6';
        newContext.stroke();


        function radiansToFraction(radians: number, gapSizeRadians: number = 0) {
            return radians / ((2 * Math.PI) - gapSizeRadians);
        }

        function degreesToRadians(degrees: number) {
            return degrees * (Math.PI / 180);
        }

        const offsetRadians = degreesToRadians(gapOffset);


        const numDashes = 12; // 360 degrees divided by 5
        const dashLength = 16;
        const angleIncrement = (2 * Math.PI - gapSizeRadians) / numDashes; // subtract gap size from total angle range

        for (let i = 0; i <= numDashes; i++) {
            const angle = i * angleIncrement + offsetRadians;
            const x1 = width / 2 + (width / 2 - dashLength) * Math.cos(angle);
            const y1 = height / 2 + (width / 2 - dashLength) * Math.sin(angle);
            const x2 = width / 2 + width / 2 * Math.cos(angle);
            const y2 = height / 2 + width / 2 * Math.sin(angle);

            newContext.beginPath();
            newContext.moveTo(x1, y1);
            newContext.lineTo(x2, y2);
            newContext.lineWidth = 2;
            newContext.stroke();

            if (i === numDashes || i === 0) {
                const labelX = width / 2 + (width / 2 - 25) * Math.cos(angle);
                const labelY = height / 2 + (width / 2 - 25) * Math.sin(angle);
                const percentage = radiansToFraction(angle - offsetRadians, gapSizeRadians);
                const labelText = Math.round(percentage * max).toString();

                newContext.fillStyle = 'white'
                newContext.font = "8px sans-serif";
                newContext.textAlign = "center";
                newContext.textBaseline = "middle";
                newContext.fillText(labelText, labelX, labelY + 2);
            }
        }

        newContext.drawImage(canvasToClip.canvas, 0, 0, w, h, 0, 0, 0, 0);
        const newImage = newContext.canvas.toDataURL("image/jpeg", 1.0);
        const img = new Image();
        img.src = newImage;
        return img;
    }

}

interface ClipGaugeOpts {
    canvasToClip: CanvasRenderingContext2D;
    height: number;
    width: number;
    max?: number;
    logarithmic?: boolean;
    gapSize?: number;
    gapOffset?: number;
}

export const canvasDrawer = new CanvasDrawing;