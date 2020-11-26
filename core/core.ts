/**
 * Steps:
 * - Generate a grid data structure
 * - Fill with classes of "Cell" type
 * - Each `Cell` can be extended
 */

import Grid from "./Grid"

var a = new Grid(10, 10)
// console.log(a.store)

a.generate(4)
// console.log(a.store)
// a.print()


a.expand()
a.print()

// require('ntk').createClient((err, app) => {
//     var mainWnd = app.createWindow({ width: 500, height: 300, title: 'Hello' })
//     mainWnd.on('mousedown', (ev) => { mainWnd.setTitle('click: ' + [ev.x, ev.y].join(',')) })
//     mainWnd.map()
// })