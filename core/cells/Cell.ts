export default class Cell {
    public cellType: CellType = CellType.Empty
    constructor(x: number, y: number) {

    }
}

export enum CellType {
    Empty,
    Full,
    Expanded,
    Bump
}