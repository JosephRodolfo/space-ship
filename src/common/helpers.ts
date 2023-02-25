import { Coords } from "./constants";

export function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}
export function radiansToDegrees(radians: number) {
    return radians * (180 / Math.PI);
}
export function round(value: number, decimals: number) {
    return Number(Math.round(parseInt(value + 'e' + decimals, 10)) + 'e-' + decimals);
}
//planet comes second
export function calculateDistance(point1: Coords, point2: Coords) {
    const distanceX = point2.x - point1.x;
    const distanceY = point2.y - point1.y;
    return { distance: Math.sqrt(distanceX ** 2 + distanceY ** 2), distanceX, distanceY };
}

