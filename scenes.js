let aprilAtTheDocks = new Scene({
    fileName: "./frames/inner-january-14/inner-january-14",
    gridScalar: 16,
    paletteName: "palette-wed-apr-04-2018-031607",
    speedModulo: 1,
    zoom: 1,
    dotPerTile: 3500 / 16,
    maxSteps: 129
});

aprilAtTheDocks.applyShapes = function() {
    for (let i = 0; i < this.grid.length; i++) {
        this.grid[i].a = 0;
        this.grid[i].b = 1;
    }
    this.setGridValue(this.gridXAmount / 2, this.gridYAmount / 2, 1);
    this.setAValue(this.gridXAmount / 2, this.gridYAmount / 2, 1);
    this.setBValue(this.gridXAmount / 2, this.gridYAmount / 2, 0);
    // for (let i = 0; i < 25; i++) {
    //     let randomX = Math.floor(random(0, this.gridXAmount));
    //     let randomY = Math.floor(random(0, this.gridYAmount));
    //     this.setGridValue(randomX, randomY, 1);
    //     this.setAValue(randomX, randomY, 1);
    // }
};

aprilAtTheDocks.setAValue = function(x, y, newA) {
    let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
    var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
    if (this.grid[oneDValue]) {
        this.grid[oneDValue].a = newA;
        this.grid[oneDValue].changed = true;
    }
};
aprilAtTheDocks.getAValue = function(x, y) {
    let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
    var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
    return this.grid[oneDValue] ? this.grid[oneDValue].a : 0;
};

aprilAtTheDocks.setBValue = function(x, y, newA) {
    let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
    var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
    if (this.grid[oneDValue]) {
        this.grid[oneDValue].b = newA;
        this.grid[oneDValue].changed = true;
    }
};
aprilAtTheDocks.getBValue = function(x, y) {
    let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
    var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
    return this.grid[oneDValue] ? this.grid[oneDValue].b : 0;
};
aprilAtTheDocks.getNeighbor = function(x, y) {
    let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
    var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
    if (this.grid[oneDValue]) {
        return this.grid[oneDValue];
    } else {
        return { state: 1, changed: false, a: 0 };
    }
}

aprilAtTheDocks.updateGrid = function() {
    let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
    let yAmount = (this.fixedGridSize) ? this.fixedGridSize.height : this.gridYAmount;
    for (var x = 0; x < xAmount; x++) {
        for (var y = 0; y < yAmount; y++) {
            var oneDValue = x + (y * xAmount);
            var presentState = this.grid[oneDValue].state;
            let presentA = this.grid[oneDValue].a;
            let neighbors = this.calculateNeighbors(x, y);
            let neighborsB = this.calculateNeighborsB(x, y);
            let neighborTopLeft = this.getNeighbor(x, y - 1);
            let neighborTop = this.getNeighbor(x, y - 1);
            let neighborTopRight = this.getNeighbor(x + 1, y - 1);
            let neighborRight = this.getNeighbor(x + 1, y);
            let neighborBottomRight = this.getNeighbor(x + 1, y + 1);
            let neighborBottom = this.getNeighbor(x, y + 1);
            let neighborBottomLeft = this.getNeighbor(x - 1, y + 1);
            let neighborLeft = this.getNeighbor(x - 1, y);
            let modif = map(this.currentState, 0, 200, 0, 0.25);
            let newA = presentA + (neighbors * 0.25);
            let presentB = this.grid[oneDValue].b;
            let newB = presentB + (neighborsB * 0.125);
            // newA = constrain(newA, 0, 2);
            // newA = Math.max(0, newA - 0.01);
            // newA *= 0.9r;
            let changed = false;
            if ((presentA !== newA) &&
                (neighborLeft.a <= 0.25 || neighborRight.a <= 0.25)
            ) {
                // let st = (newA > 3) ? 0 : 1;
                // newA = (newA > 3) ? 0 : newA;
                this.next[oneDValue] = {
                    state: 1,
                    changed: true,
                    a: newA,
                    b: newB
                };
                this.changes[oneDValue] = this.currentState;
                changed = true;
                this.incrementChanges(x, y);
            }


            // if (value == 1) {
            //     if (neighbors >= 3 || neighbors <= 2) {
            //         this.next[oneDValue] = { state: 0, changed: true };
            //         changed = true;
            //         this.incrementChanges(x, y);
            //     }
            // } else {
            //     if (neighbors == 3 || neighbors == 1) {
            //         this.next[oneDValue] = { state: 1, changed: true };
            //         changed = true;
            //         this.incrementChanges(x, y);
            //     }
            // }
            if (!changed) {
                this.next[oneDValue] = { state: presentState, changed: false, a: presentA, b: presentB };
            }
        }
    }
    for (var i = 0; i < this.grid.length; i++) {
        this.grid[i] = this.next[i];
    }
    this.currentState++;
};

aprilAtTheDocks.calculateNeighbors = function(x, y) {
    var sum = 0;
    sum += this.getAValue(x - 1, y - 1);
    sum += this.getAValue(x, y - 1);
    sum += this.getAValue(x + 1, y - 1);
    sum += this.getAValue(x - 1, y);
    sum += this.getAValue(x + 1, y);
    sum += this.getAValue(x - 1, y + 1);
    sum += this.getAValue(x, y + 1);
    sum += this.getAValue(x + 1, y + 1);
    return sum;
};

aprilAtTheDocks.calculateNeighborsB = function(x, y) {
    var sum = 0;
    sum += this.getBValue(x - 1, y - 1);
    sum += this.getBValue(x, y - 1);
    sum += this.getBValue(x + 1, y - 1);
    sum += this.getBValue(x - 1, y);
    sum += this.getBValue(x + 1, y);
    sum += this.getBValue(x - 1, y + 1);
    sum += this.getBValue(x, y + 1);
    sum += this.getBValue(x + 1, y + 1);
    return sum;
};

aprilAtTheDocks.getColor = function(oneDValue, optionalArray) {
    let p = this.palette.data;
    let c;
    if (optionalArray) {
        c = optionalArray[oneDValue];
    } else {
        c = this.changes[oneDValue];
    }
    c = this.grid[oneDValue].a;
    // let col = map(c, 0, 1, 0, 255);
    // let r = map(c, 0, 1, 0, 255);
    // let g = map(c, 0, 1, 0, 70);
    // let b = map(c, 0, 1, 0, 155);
    let red, green, blue;
    if (c) {
        red = map(sin(c / p.redOsc), -1, 1, p.redMin, p.redMax);
        green = map(sin(c / p.greenOsc), -1, 1, p.greenMin, p.greenMax);
        blue = map(sin(c / p.blueOsc), 1, -1, p.blueMin, p.blueMax);
    } else {
        red = 0;
        green = 0;
        blue = 0;
    }

    let a = adjustLevels(-30, 0, 150, { r: red, g: green, b: blue });
    // let a = adjustLevels(0, 0, 150, { r: red, g: green, b: blue });
    return color(a.r, a.g, a.b);
};

let aprilAtTheDocks2 = new Scene({
    fileName: "./frames/april-at-the-docks-02b/april-at-the-docks-02b",
    gridScalar: 16,
    // Gros S italique
    // gridSeedName: "gridseed-wed-apr-04-2018-174600",
    // Gros S italique peaufiné
    gridSeedName: "gridseed-thu-apr-05-2018-140942",
    // gridSeedName: "gridseed-wed-apr-04-2018-183131",
    // gridSeedName: "gridseed-wed-apr-04-2018-200014",
    // gridSeedName: "gridseed-wed-apr-04-2018-203428",
    // gridSeedName: "gridseed-thu-apr-05-2018-013601",

    // With fixedGridSize
    // gridSeedName: "gridseed-thu-apr-05-2018-015411",
    // Le plus beau "s"
    // gridSeedName: "gridseed-thu-apr-05-2018-144628",
    // gridSeedName: "gridseed-fri-apr-06-2018-161736",
    // gridSeedName: "gridseed-fri-apr-06-2018-175747",
    // fixedGridSize: { width: 145, height: 145 },
    // gridSeedName: "gridseed-sat-apr-07-2018-130357",
    // gridSeedName: "gridseed-sat-apr-07-2018-131303",
    // gridSeedName: "gridseed-sat-apr-07-2018-132011",
    // gridSeedName: "gridseed-sat-apr-07-2018-134126",
    // gridSeedName: "gridseed-sat-apr-07-2018-134439",
    // gridSeedName: "gridseed-sat-apr-07-2018-135146",
    // gridSeedName: "gridseed-sat-apr-07-2018-143624",
    // gridSeedName: "gridseed-sat-apr-07-2018-144154",
    // gridSeedName: "gridseed-sat-apr-07-2018-144459",
    // gridSeedName: "gridseed-sat-apr-07-2018-145202",
    // gridSeedName: "gridseed-sat-apr-07-2018-231422",
    // gridSeedName: "gridseed-sat-apr-07-2018-232009",
    // C
    // gridSeedName: "gridseed-sat-apr-07-2018-232948",

    // gridScalar: 8,
    // horizontalScalar: 16,
    // verticalScalar: 16,
    paletteName: "palette-thu-dec-21-2017-163412",
    paletteName: "palette-mon-dec-18-2017-010316",
    paletteName: "palette-fri-jan-12-2018-024639",
    paletteName: "palette-thu-apr-05-2018-143158",
    paletteName: "palette-thu-apr-05-2018-143252",
    paletteName: "palette-tue-dec-12-2017-141143",
    // paletteName: "palette-sun-mar-04-2018-163620",
    speedModulo: 1,
    zoom: 1,
    dotPerTile: 3500 / 16,
    maxSteps: 129
});

aprilAtTheDocks2.applyShapes = function() {
    this.ant = new Ant();
    this.setGridValue(this.gridXAmount / 2, this.gridYAmount / 2, 1);
    // for (let i = 0; i < 25; i++) {
    //     let randomX = Math.floor(random(0, this.gridXAmount));
    //     let randomY = Math.floor(random(0, this.gridYAmount));
    //     this.setGridValue(randomX, randomY, 1);
    //     this.setAValue(randomX, randomY, 1);
    // }
    let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
    let yAmount = (this.fixedGridSize) ? this.fixedGridSize.height : this.gridYAmount;
    for (var x = 0; x < xAmount; x++) {
        for (var y = 0; y < yAmount; y++) {
            var oneDValue = x + (y * xAmount);
            var value = this.grid[oneDValue].state;
            if (value == 1) {
                scene.changes[oneDValue] = Math.random() * 10;
                scene.grid[oneDValue].changed = true;
            }
        }
    }
};

aprilAtTheDocks2.updateGrid = function() {
    for (let i = 0; i < 100000; i++) {
        this.ant.walk();
    }
    // let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
    // let yAmount = (this.fixedGridSize) ? this.fixedGridSize.height : this.gridYAmount;
    // for (var x = 0; x < xAmount; x++) {
    //     for (var y = 0; y < yAmount; y++) {
    //         var oneDValue = x + (y * xAmount);
    //         var value = this.grid[oneDValue].state;
    //         var previousChanged = this.grid[oneDValue].changed;
    //         var neighbors = this.calculateNeighbors(x, y);
    //         let changed = false;
    //         if ((value == 0) && (neighbors == 4)) {
    //             this.next[oneDValue] = { state: 1, changed: true, noAnt:  1};
    //             scene.changes[oneDValue] = scene.currentState * 0.5;
    //             changed = true;
    //         }
    //         // if (value == 1) {
    //         //     if (neighbors >= 3 || neighbors <= 2) {
    //         //         this.next[oneDValue] = { state: 0, changed: true };
    //         //         changed = true;
    //         //         this.incrementChanges(x, y);
    //         //     }
    //         // } else {
    //         //     if (neighbors == 3 || neighbors == 1) {
    //         //         this.next[oneDValue] = { state: 1, changed: true };
    //         //         changed = true;
    //         //         this.incrementChanges(x, y);
    //         //     }
    //         // }
    //         if (!changed) {
    //             this.next[oneDValue] = { state: value, changed: previousChanged };
    //         }
    //     }
    // }
    // for (var i = 0; i < this.grid.length; i++) {
    //     this.grid[i] = this.next[i];
    // }
    this.currentState++;
};

aprilAtTheDocks2.getColor = function(oneDValue, optionalArray) {
    let c;
    if (optionalArray) {
        c = optionalArray[oneDValue];
    } else {
        c = this.changes[oneDValue];
    }
    let p = this.palette.data;
    let red = map(sin(c / p.redOsc), -1, 1, p.redMin, p.redMax);
    let green = map(sin(c / p.greenOsc), -1, 1, p.greenMin, p.greenMax);
    let blue = map(sin(c / p.blueOsc), 1, -1, p.blueMin, p.blueMax);
    let a = adjustLevels(0, 0, 50, { r: red, g: green, b: blue });
    return color(a.r, a.g, a.b);
};


let Ant = function() {
    let xAmount = (scene.fixedGridSize) ? scene.fixedGridSize.width : scene.gridXAmount;
    this.x = 0;
    this.y = 0;
    this.walk = function() {
        let oldNeighbors = scene.calculateNeighbors(this.x, this.y);
        if (scene.getGridCell(this.x, this.y).state == 1 || oldNeighbors) {
            let newStart = this.pickNewStart();
            this.x = newStart.x;
            this.y = newStart.y;
        } else {
            let newX = this.x + Math.round((Math.random() * 2) - 1);
            let newY = this.y + Math.round((Math.random() * 2) - 1);
            if (scene.getGridCell(newX, newY)) {
                this.x = newX;
                this.y = newY;
            }
            let neighbors = scene.calculateNeighbors(newX, newY);
            if (neighbors) {
                scene.setGridValue(newX, newY, 1);
                // scene.setGridValue(newX, newY + 1, 1);
                var oneDValue = newX + (newY * xAmount);
                scene.changes[oneDValue] = scene.currentState * 0.1;
                // scene.incrementChanges(newX, newY);
                let n = this.pickNewStart();
                // let tries = 0;
                // let newNeighbors = scene.calculateNeighbors(n.x, n.y);
                // while (newNeighbors) {
                //     n = this.pickNewStart();
                //     newNeighbors = scene.calculateNeighbors(n.x, n.y);
                // }
                // while (scene.getGridCell(n.x, n.y).state == 1) {
                //     console.log(scene.currentState + ", picking");
                //     n = this.pickNewStart();
                //     tries++;
                //     if (tries > 10000) {
                //         noLoop();
                //     }
                // }
                this.x = n.x;
                this.y = n.y;
            }
        }
    };
    this.pickNewStart = function() {
        let xAmount = (scene.fixedGridSize) ? scene.fixedGridSize.width : scene.gridXAmount;
        let yAmount = (scene.fixedGridSize) ? scene.fixedGridSize.height : scene.gridYAmount;
        let x, y;
        let horizontal = (random() <  0.5) ? true : false;
        if (horizontal) {
            x = Math.floor(random() * xAmount);
            y = (random() < 0.5) ? 0 : yAmount - 1;
        } else {
            x = (random() < 0.5) ? 0 : xAmount - 1;
            y = Math.floor(random() * yAmount);
        }
        // y = 0;
        // x = Math.floor(random() * scene.gridXAmount);
        // x = Math.floor(random() * xAmount);
        // y = Math.floor(random() * yAmount);
        return { x: x, y: y };
    };
};

let scene = aprilAtTheDocks2;