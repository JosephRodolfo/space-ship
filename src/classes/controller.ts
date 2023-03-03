import { Circles } from "../components/Canvas.vue";
 class Controller {
    detectCollision(circle1: Circles, circle2: Circles) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < circle1.radius + circle2.radius) return true;
        return false;
    }
 }

export const controller = new Controller();

