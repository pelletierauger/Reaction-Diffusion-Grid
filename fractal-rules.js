function updateGrid() {
    for (var x = 0; x < gridXAmount; x++) {
        for (var y = 0; y < gridYAmount; y++) {
            var oneDValue = x + (y * gridXAmount);
            var value = grid[oneDValue].state;
            var neighbors = calculateNeighbors(x, y);
            let changed = false;
            if (value == 1) {
                if (neighbors >= 3 || neighbors <= 2) {
                    next[oneDValue] = { state: 0, changed: true };
                    changed = true;
                    incrementChanges(x, y);
                }
            } else {
                if (neighbors == 3 || neighbors == 1) {
                    next[oneDValue] = { state: 1, changed: true };
                    changed = true;
                    incrementChanges(x, y);
                }
            }
            if (!changed) {
                next[oneDValue] = { state: value, changed: false };
            }
        }
    }
    for (var i = 0; i < grid.length; i++) {
        grid[i] = next[i];
    }
}