const game = require('../scripts/logic.js');

describe("start game tests", () => {
    test("start game contains only one value", () => {
        const board = game().start();
        let valuesCount = 0;    
        board.forEach(row => row.forEach(tile => {
            if (tile > 0) valuesCount++;
        }));
        expect(valuesCount).toBe(1);
    });

    test("start game contains value 2 or 4", () => {
        const board = game().start();
        let contains = board.some(row => 
            row.some(tile => tile === 2 || tile ===4));
        expect(contains).toBeTruthy();
    });
});

describe("first move tests", () => {
    test("move to the left direction", () => {
        let testGame = game();
        const startBoard = testGame.start();
        const movedBoard = testGame.turn('left');

        let rowIndex = startBoard.findIndex(row => 
            row.includes(2) || row.includes(4));
        
        expect(movedBoard[rowIndex][0] > 0).toBeTruthy();
    });

    test("move to the right direction", () => {
        let testGame = game();
        const startBoard = testGame.start();
        const movedBoard = testGame.turn('right');

        let rowIndex = startBoard.findIndex(row => 
            row.includes(2) || row.includes(4));
        
        expect(movedBoard[rowIndex][movedBoard[rowIndex].length-1] > 0)
            .toBeTruthy();
    });

    test("move to the up direction", () => {
        let testGame = game();
        const startBoard = testGame.start();
        const movedBoard = testGame.turn('up');

        let columnIndex = undefined;
        for (let i = 0; i < startBoard.length && !columnIndex; i++) {
            for (let j = 0; j < startBoard[i].length && !columnIndex; j++) {
                if (startBoard[i][j] > 0) {
                    columnIndex = j;
                }
            }
        }

        expect(movedBoard[0][columnIndex] > 0).toBeTruthy();
    });

    test("move to the down direction", () => {
        let testGame = game();
        const startBoard = testGame.start();
        const movedBoard = testGame.turn('down');

        let columnIndex = undefined;
        for (let i = 0; i < startBoard.length && !columnIndex; i++) {
            for (let j = 0; j < startBoard[i].length && !columnIndex; j++) {
                if (startBoard[i][j] > 0) {
                    columnIndex = j;
                }
            }
        }
        
        expect(movedBoard[movedBoard.length-1][columnIndex] > 0).toBeTruthy();
    });
});

describe("some turns tests", () => {
    test("game is not over after some turns", () => {
        let testGame = game();
        let directions = ['left', 'up', 'right', 'down'];
        for (let turnNumber = 0; turnNumber < 5; turnNumber++) {
            testGame.turn(directions[Math.floor(Math.random()*directions.length)]);
        }
        
        expect(testGame.isOver()).toBeFalsy();
    });

    test("game max score is correct after some turns", () => {
        let testGame = game();
        let directions = ['left', 'up', 'right', 'down'];
        let board = [];
        for (let turnNumber = 0; turnNumber < 5; turnNumber++) {
            board = testGame.turn(directions[Math.floor(Math.random()*directions.length)]);
        }

        let maxScore = 0;
        board.forEach(row => row.forEach(tile => {
            if (tile > maxScore)
                maxScore = tile;
        }));

        expect(testGame.maxScore()).toBe(maxScore);
    });
});

describe("custom board tests", () => {
    test("move to the left with merge", () => {
        const testBoard = [
            [8, 4, 4, 4],
            [4, 4, 4, 4],
            [0, 0, 2, 0],
            [8, 0, 0, 8]
        ];
        const board = [
            [8, 8, 4, 0],
            [8, 8, 0, 0],
            [2, 0, 0, 0],
            [16, 0, 0, 0]
        ];
        let testGame = game(testBoard);
        const turnBoard = testGame.turn('left');

        const movedCorrect = turnBoard.every((row, i) => 
            row.every((tile, j) => 
                (board[i][j] !== 0 && tile === board[i][j]) ||
                (board[i][j] === 0)
            ));
        expect(movedCorrect).toBe(true);

        const valuesCount = turnBoard.reduce((count, row) => 
            count + 
            row.reduce((rowCount, tile) => {
                if (tile > 0)
                    return rowCount + 1;
                return rowCount;     
            }, 0), 0);
        expect(valuesCount).toBe(8);
    });
});