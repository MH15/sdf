import Cell, { CellType } from "./cells/Cell"
import { randIntRange } from "./helpers/random"
import Vector2 from "./helpers/Vector2"

export default class Grid {
    public store: Cell[][]
    private width: number
    private height: number


    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.store = []
        for (var y: number = 0; y < height; y++) {
            this.store[y] = []
            for (var x: number = 0; x < width; x++) {
                this.store[y][x] = new Cell(y, x)
            }
        }
    }

    private getRandomIndex() {
        var x = randIntRange(0, this.width)
        var y = randIntRange(0, this.height)
        return new Vector2(x, y)
    }

    public addNode(): Vector2 {
        var pos = this.getRandomIndex()
        // console.log(pos)
        return pos

    }

    public generate(count: number): void {
        /**
         * Steps:
         * - find a set of `n` points inside the Grid
         * - move 1-3 cells randomly from each point, adding new points to the set
         */

        var points: Vector2[] = []
        for (let i = 0; i < count; i++) {
            points.push(this.addNode())
        }
        console.log(points)


        points.forEach(point => {
            // let c = new Cell(point.x, point.y)
            // c.cellType = CellType.Full
            this.store[point.y][point.x].cellType = CellType.Full
        })

    }

    public expand(): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let c = this.store[y][x]
                // choose a direction to expand in
            }
        }
    }

    public print(): void {
        let s = ""
        this.store.forEach((row) => {
            row.forEach(col => {
                s += col.cellType + ", "
            })
            s += "\n"
        })
        console.log(s)
    }
}