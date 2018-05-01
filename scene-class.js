class Scene {
    constructor(input) {
        this.fileName = input.fileName;
        // gridScalar = 1 means that the grid is 16 * 9.
        if (input.gridScalar) {
            this.gridScalar = input.gridScalar;
        }
        if (input.gridSeedName) {
            this.gridSeedName = input.gridSeedName;
        }
        if (input.animatedColors) {
            this.animatedColors = input.animatedColors;
        }
        this.horizontalScalar = input.horizontalScalar || 16;
        this.verticalScalar = input.verticalScalar || 9;
        this.paletteName = input.paletteName || null;
        this.speedModulo = input.speedModulo || 1;
        this.dotPerTile = input.dotPerTile || 3500 / 4;
        if (input.zoom) {
            this.zoom = input.zoom;
            this.dotPerTile *= (Math.pow(input.zoom, 2));
        }
        this.grid = [];
        this.offset = input.offset || { x: 0, y: 0 };
        this.fixedGridSize = input.fixedGridSize ||  null;
        this.next = [];
        this.changes = [];
        this.currentState = 0;
        this.initialized = false;
    }
    initialize() {
        this.gridSeed = [];
        if (this.gridSeedName) {
            let seed = this.fetchGridSeed(this.gridSeedName);
            this.gridScalar = seed.data.gridScalar;
            this.gridXAmount = (this.horizontalScalar * this.gridScalar) + 1;
            this.gridYAmount = (this.verticalScalar * this.gridScalar) + 1;
            this.tileWidth = width / this.gridXAmount - 1 / this.gridXAmount;
            for (var i = 0; i < seed.data.gridSeed.length; i++) {
                this.gridSeed.push(seed.data.gridSeed[i]);
                this.grid.push({ state: seed.data.gridSeed[i], changed: false });
                this.changes.push(0);
                // This is only there for some experimental, inconclusive scenes.
                this.next.push({ state: 0, changed: false });
            }
        } else {
            if (this.fixedGridSize) {
                this.gridXAmount = (this.horizontalScalar * this.gridScalar) + 1;
                this.gridYAmount = (this.verticalScalar * this.gridScalar) + 1;
                this.tileWidth = width / this.gridXAmount - 1 / this.gridXAmount;
                // Fill the grid with 0 values and the changes array with 0 values.
                for (var i = 0; i < this.fixedGridSize.width * this.fixedGridSize.height; i++) {
                    this.grid.push({ state: 0, changed: false });
                    this.changes.push(0);
                    // This is only there for some experimental, inconclusive scenes.
                    this.next.push({ state: 0, changed: false });
                }
            } else {
                this.gridXAmount = (this.horizontalScalar * this.gridScalar) + 1;
                this.gridYAmount = (this.verticalScalar * this.gridScalar) + 1;
                this.tileWidth = width / this.gridXAmount - 1 / this.gridXAmount;
                // Fill the grid with 0 values and the changes array with 0 values.
                for (var i = 0; i < this.gridXAmount * this.gridYAmount; i++) {
                    this.grid.push({ state: 0, changed: false });
                    this.changes.push(0);
                    // This is only there for some experimental, inconclusive scenes.
                    this.next.push({ state: 0, changed: false });
                }
            }

        }

        // initialize() is only called when the palettes are loaded,
        // so we can now define the scene's palette.
        this.palette = this.fetchPalette(this.paletteName);

        if (this.applyShapes) {
            this.applyShapes();
            //Once the shapes are applied, the grid is copied to gridSeed for archiving.
            for (var i = 0; i < this.grid.length; i++) {
                this.gridSeed[i] = this.grid[i].state;
            }
        }
        // This counter is incremented each time the Scene is hit by the x-sheet,
        // and a modulo function controls at what frequency the scene upgrades its grid.
        this.counter = 1;
        this.initialized = true;
    }
    update() {
        if (!exporting && this.currentState == 0) {
            this.currentState++;
        } else {
            if (!printing) {
                this.updateGrid();
            } else if (printing) {
                if (this.counter % this.speedModulo == 0) {
                    this.updateGrid();
                }
                this.counter++;
            }
        }
    }
    updateGrid() {
        let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
        let yAmount = (this.fixedGridSize) ? this.fixedGridSize.height : this.gridYAmount;
        for (var x = 0; x < xAmount; x++) {
            for (var y = 0; y < yAmount; y++) {
                var oneDValue = x + (y * xAmount);
                var value = this.grid[oneDValue].state;
                var neighbors = this.calculateNeighbors(x, y);
                let changed = false;
                if (value == 1) {
                    if (neighbors >= 3 || neighbors <= 2) {
                        this.next[oneDValue] = { state: 0, changed: true };
                        changed = true;
                        this.incrementChanges(x, y);
                    }
                } else {
                    if (neighbors == 3 || neighbors == 1) {
                        this.next[oneDValue] = { state: 1, changed: true };
                        changed = true;
                        this.incrementChanges(x, y);
                    }
                }
                if (!changed) {
                    this.next[oneDValue] = { state: value, changed: false };
                }
            }
        }
        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i] = this.next[i];
        }
        this.currentState++;
    }
    calculateNeighbors(x, y) {
        var sum = 0;
        var n1 = this.getGridValue(x - 1, y - 1);
        sum += n1;
        var n2 = this.getGridValue(x, y - 1);
        sum += n2;
        var n3 = this.getGridValue(x + 1, y - 1);
        sum += n3;
        var n4 = this.getGridValue(x - 1, y);
        sum += n4;
        if (sum >= 4) {
            return sum;
        }
        var n5 = this.getGridValue(x + 1, y);
        sum += n5;
        if (sum >= 4) {
            return sum;
        }
        var n6 = this.getGridValue(x - 1, y + 1);
        sum += n6;
        if (sum >= 4) {
            return sum;
        }
        var n7 = this.getGridValue(x, y + 1);
        sum += n7;
        if (sum >= 4) {
            return sum;
        }
        var n8 = this.getGridValue(x + 1, y + 1);
        sum += n8;
        return sum;
    }
    getGridValue(x, y) {
        let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
        var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
        return this.grid[oneDValue] ? this.grid[oneDValue].state : 0;
    }
    getGridCell(x, y) {
        let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
        var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
        return this.grid[oneDValue] ? this.grid[oneDValue] : null;
    }
    setGridValue(x, y, newState) {
        let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
        var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
        if (this.grid[oneDValue]) {
            this.grid[oneDValue].state = newState;
            this.grid[oneDValue].changed = true;
        }
    }
    setNextValue(x, y, newState) {
        let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
        var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
        if (this.next[oneDValue]) {
            this.next[oneDValue] = newState;
        }
    }
    setGridSeedValue(x, y, newState) {
        let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
        var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
        if (this.gridSeed[oneDValue] !== null) {
            this.gridSeed[oneDValue] = newState;
        }
    }
    incrementChanges(x, y) {
        let xAmount = (this.fixedGridSize) ? this.fixedGridSize.width : this.gridXAmount;
        var oneDValue = Math.floor(x) + (Math.floor(y) * xAmount);
        if (this.changes[oneDValue] !== null) {
            this.changes[oneDValue]++;
        }
    }
    fetchPalette(paletteName) {
        let palette;
        for (let i = 0; i < JSONs.length; i++) {
            if (JSONs[i].name == paletteName) {
                palette = JSONs[i];
            }
        }
        if (palette) {
            return palette;
        } else {
            console.log(`Palette ${paletteName} not found`);
        }
    }
    fetchGridSeed(gridSeedName) {
        let seed;
        for (let i = 0; i < JSONs.length; i++) {
            if (JSONs[i].name == gridSeedName) {
                seed = JSONs[i];
            }
        }
        if (seed) {
            return seed;
        } else {
            console.log(`gridSeed ${gridSeedName} not found`);
        }
    }
    getColor(oneDValue, optionalArray) {
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
        return color(red, green, blue);
    }
    applyPalette() {
        for (var x = 0; x < this.gridXAmount; x++) {
            for (var y = 0; y < this.gridYAmount; y++) {
                let oneDValue;
                if (this.fixedGridSize) {
                    oneDValue = (x + this.offset.x) + ((y + this.offset.y) * this.fixedGridSize.width);
                } else {
                    oneDValue = x + (y * this.gridXAmount);
                }
                var value = this.grid[oneDValue].state;
                var change = this.changes[oneDValue];
                if (change !== 0) {
                    if (value) {
                        var light = this.getColor(oneDValue);
                        fill(light);
                        var tW = this.tileWidth;
                        rect(x * tW, y * tW, tW, tW);
                    }
                }
            }
        }
    }
}