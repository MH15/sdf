export default class Vector2 {
    public x: number
    public y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    /**
     * Returns (this.x/other.x, this.y/other.y)
     * @param other another Vector2
     */
    divide(other: Vector2): Vector2 {
        return new Vector2(this.x / other.x, this.y / other.y)
    }

    /**
     * Returns (this.x/scalar, this.y/scalar)
     * @param scalar factor
     */
    // divide(scalar: number): Vector2 {
    //     return new Vector2(this.x / scalar, this.y / scalar)
    // }

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