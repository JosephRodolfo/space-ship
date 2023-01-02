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
        context.lineTo(x +10, y);
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
          let random =  Math.round(Math.random()) * 2 - 1
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



}
export const canvasDrawer = new CanvasDrawing;