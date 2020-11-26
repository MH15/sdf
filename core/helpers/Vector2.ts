export default class Vector2 {
    public x: number
    public y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    /**
     * Check if a Vector is inside a 2d range
     * @param start the (0,0) of the range
     * @param end the (width, height) of the range
     */
    inside(start: Vector2, end: Vector2): boolean {
        if (this.x > start.x && this.x < end.x) {
            if (this.y > start.y && this.y < end.y) {
                return true
            }
        }
        return false
    }

}