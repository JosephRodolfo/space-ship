export function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}
export function radiansToDegrees(radians: number) {
    return radians * (180 / Math.PI);
}
export function round(value: number, decimals: number) {
    return Number(Math.round(parseInt(value+'e'+decimals, 10))+'e-'+decimals);
  }
  