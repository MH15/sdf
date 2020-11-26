// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"core/cells/Cell.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CellType = void 0;

var Cell =
/** @class */
function () {
  function Cell(x, y) {
    this.cellType = CellType.Empty;
  }

  return Cell;
}();

exports.default = Cell;
var CellType;

(function (CellType) {
  CellType[CellType["Empty"] = 0] = "Empty";
  CellType[CellType["Full"] = 1] = "Full";
  CellType[CellType["Expanded"] = 2] = "Expanded";
  CellType[CellType["Bump"] = 3] = "Bump";
})(CellType = exports.CellType || (exports.CellType = {}));
},{}],"core/helpers/random.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randIntRange = void 0;

function randIntRange(start, count) {
  return Math.floor(Math.random() * count) + start;
}

exports.randIntRange = randIntRange;
},{}],"core/helpers/Vector2.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector2 =
/** @class */
function () {
  function Vector2(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Check if a Vector is inside a 2d range
   * @param start the (0,0) of the range
   * @param end the (width, height) of the range
   */


  Vector2.prototype.inside = function (start, end) {
    if (this.x > start.x && this.x < end.x) {
      if (this.y > start.y && this.y < end.y) {
        return true;
      }
    }

    return false;
  };

  return Vector2;
}();

exports.default = Vector2;
},{}],"core/Grid.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Cell_1 = __importStar(require("./cells/Cell"));

var random_1 = require("./helpers/random");

var Vector2_1 = __importDefault(require("./helpers/Vector2"));

var Grid =
/** @class */
function () {
  function Grid(width, height) {
    this.width = width;
    this.height = height;
    this.store = [];

    for (var y = 0; y < height; y++) {
      this.store[y] = [];

      for (var x = 0; x < width; x++) {
        this.store[y][x] = new Cell_1.default(y, x);
      }
    }
  }

  Grid.prototype.getRandomIndex = function () {
    var x = random_1.randIntRange(0, this.width);
    var y = random_1.randIntRange(0, this.height);
    return new Vector2_1.default(x, y);
  };

  Grid.prototype.addNode = function () {
    var pos = this.getRandomIndex(); // console.log(pos)

    return pos;
  };

  Grid.prototype.generate = function (count) {
    /**
     * Steps:
     * - find a set of `n` points inside the Grid
     * - move 1-3 cells randomly from each point, adding new points to the set
     */
    var _this = this;

    var points = [];

    for (var i = 0; i < count; i++) {
      points.push(this.addNode());
    }

    console.log(points);
    points.forEach(function (point) {
      // let c = new Cell(point.x, point.y)
      // c.cellType = CellType.Full
      _this.store[point.y][point.x].cellType = Cell_1.CellType.Full;
    });
  };

  Grid.prototype.getAdjacentPosition = function (pos) {
    var next = new Vector2_1.default(pos.x, pos.y);
    var dir = random_1.randIntRange(0, 3); // 0: Left, 1: Up, 2: Right, 3: Down

    switch (dir) {
      case 0:
        // Left
        next.x -= 1;
        break;

      case 1:
        // Up
        next.y -= 1;
        break;

      case 2:
        // Right
        next.x += 1;
        break;

      case 3:
        // Down
        next.y += 1;
        break;
    } // check if next is inside the Grid bounds
    // if not, recurse until it is


    if (next.inside(new Vector2_1.default(0, 0), new Vector2_1.default(this.width, this.height))) {
      console.log("reee");
      return next;
    } else {
      console.log("yer");
      return false;
    }
  };

  Grid.prototype.expand = function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var c = this.store[y][x];

        if (c.cellType == Cell_1.CellType.Full) {
          // choose a direction to expand in
          var nextCell = this.getAdjacentPosition(new Vector2_1.default(x, y));

          if (nextCell == false) {
            c.cellType = Cell_1.CellType.Bump;
          } else {
            this.store[nextCell.y][nextCell.x].cellType = Cell_1.CellType.Expanded;
          }
        }
      }
    }
  };

  Grid.prototype.print = function () {
    var s = "";
    this.store.forEach(function (row) {
      row.forEach(function (col) {
        s += col.cellType + ", ";
      });
      s += "\n";
    });
    console.log(s);
  };

  return Grid;
}();

exports.default = Grid;
},{"./cells/Cell":"core/cells/Cell.ts","./helpers/random":"core/helpers/random.ts","./helpers/Vector2":"core/helpers/Vector2.ts"}],"core/core.ts":[function(require,module,exports) {
"use strict";
/**
 * Steps:
 * - Generate a grid data structure
 * - Fill with classes of "Cell" type
 * - Each `Cell` can be extended
 */

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Grid_1 = __importDefault(require("./Grid"));

var a = new Grid_1.default(10, 10); // console.log(a.store)

a.generate(4); // console.log(a.store)
// a.print()

a.expand();
a.print(); // require('ntk').createClient((err, app) => {
//     var mainWnd = app.createWindow({ width: 500, height: 300, title: 'Hello' })
//     mainWnd.on('mousedown', (ev) => { mainWnd.setTitle('click: ' + [ev.x, ev.y].join(',')) })
//     mainWnd.map()
// })
},{"./Grid":"core/Grid.ts"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50807" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","core/core.ts"], null)
//# sourceMappingURL=/core.dc9e120f.js.map