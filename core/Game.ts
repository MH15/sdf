import Grid from "./Grid"
import Vector2 from "./helpers/Vector2"
import REGL = require('regl')
import {readFileSync} from 'fs'
/**
 * Manage the Game state between Regl and position/collision logic
 */

export default class Game {
    canvas: HTMLCanvasElement
    canvasSize: Vector2
    rows: number = 10
    cols: number = this.rows
    regl: REGL.Regl

    blockSize: Vector2
    grid: Grid
    draw: any

    fragShader: string

    lastTime = 0.0
    currentTime = 0.0
    deltaTime = 0.0

    positions: Vector2[] = []

    constructor(canvasID: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasID)
        this.canvasSize = new Vector2(this.canvas.width, this.canvas.height)
        this.blockSize = this.canvasSize.divide(new Vector2(this.rows, this.cols))
        this.grid = new Grid(this.rows, this.cols)

        this.grid.generate(4)
        this.grid.expand()

        this.regl = REGL(this.canvas)

        this.regl.clear({
            color: [0, 0, 0, 1],
            depth: 1
        })

        this.fragShader = readFileSync('./core/shaders/frag.glsl','utf8')

        this.positions = [
            new Vector2(0,0),
            new Vector2(1,0),
            new Vector2(1,1),
            new Vector2(3,3),
            new Vector2(4,3),
            new Vector2(5,5),
            new Vector2(6,6),
            new Vector2(7,7),
            new Vector2(8,8),
            new Vector2(9,9),
            new Vector2(10,10),

        ]
    }

    start() {
        this.draw = this.regl({
            frag: this.fragShader,
            vert: `
                attribute vec2 position;
                void main() {
                    gl_Position = vec4(position, 0, 1);
                }
            `,
            // enough vertices to cover the canvas
            count: 4,
            // two triangles
            primitive: 'triangle fan',

            // pass screen space resolution to fragment shader
            uniforms: {
                // @ts-ignore
                u_resolution: this.regl.prop('resolution'),
                // @ts-ignore
                u_test: this.regl.prop('test'),
                // Dynamic properties can be functions.  Each function gets passed:
                //
                //  * context: which contains data about the current regl environment
                //  * props: which are user specified arguments
                //  * batchId: which is the index of the draw command in the batch
                //
                // @ts-ignore
                // u_coords: this.regl.prop('coords'),
                
                // u_coords: {
                //     data: [[0,0],[0,0],[0,0],[0,0]],
                //     length: 2
                // },
                ...[...new Array(10)].reduce((acc, val, index) => {
                    let vec = this.positions[index]
                    // @ts-ignore
                    acc[`u_coords[${index}]`] = [vec.x, vec.y]
                    console.log([vec.x, vec.y])
                    return acc;
                 }, {}),
                // @ts-ignore
                u_smooth_factor: this.regl.prop("smooth_factor")
            },



            attributes: {
                // the positions of our four corners in world psace
                position: [
                    [-1, -1], [-1, 1], [1, 1], [1, -1]
                ]
            }
        })

        this.regl.frame(() => {
            this.update()
        })
    }


    private getCoords() {
        let buf = this.regl.buffer(Float32Array.from([
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
        ]))
        return buf;
    }

    private update() {
        let resolution = [this.canvas.width, this.canvas.height]
        let test = 0.5
        // console.log(this.regl.context("time"))

        let coords = this.getCoords()

        let smooth = +(<HTMLInputElement>document.querySelector("#scale-input")).value
        // 0.16 is good

        this.draw({
            resolution,
            test,
            coords,
            smooth_factor: smooth
        })
        // send state to regl
        // no draw() method as regl takes care of this

        // user input


        // collision detection


        // position update


        // send to regl
    }
}