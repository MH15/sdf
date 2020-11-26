import Vector2 from "./helpers/Vector2"
/**
 * Manage the Game state between Regl and position/collision logic
 */

class Game {
    canvasSize: Vector2
    rows: number = 10
    cols: number = this.rows
    canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.canvasSize = new Vector2(this.canvas.width, this.canvas.height)

    }



    update() {
        // send state to regl
        // no draw() method as regl takes care of this

        // user input


        // collision detection


        // position update


        // send to regl
    }
}