const game = require('../scripts/logic.js');

test("start game contains only one value", () => {
    const board = game().start();
    let valuesCount = 0;    
    board.forEach(row => row.forEach(tile => {
        if (tile > 0) valuesCount++;
    }));
    expect(valuesCount).toBe(1);
})