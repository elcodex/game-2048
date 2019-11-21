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
        const SOME_TURNS = 5;
        let testGame = game();
        let directions = ['left', 'up', 'right', 'down'];
        for (let turnNumber = 0; turnNumber < SOME_TURNS; turnNumber++) {
            testGame.turn(directions[Math.floor(Math.random()*directions.length)]);
        }
        
        expect(testGame.isOver()).toBeFalsy();
    });

    test("game max score is correct after some turns", () => {
        const SOME_TURNS = 5;
        let testGame = game();
        let directions = ['left', 'up', 'right', 'down'];
        let board = [];
        for (let turnNumber = 0; turnNumber < SOME_TURNS; turnNumber++) {
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
    let notEmptyValuesCount = board => 
        board.reduce((count, row) => 
            count + row.reduce((rowCount, tile) => {
            if (tile > 0)
                return rowCount + 1;
            return rowCount;     
            }, 0), 
        0); 

    let executeTest = (beforeBoard, afterBoard, direction) => {
        let testGame = game(beforeBoard);
        const turnBoard = testGame.turn(direction);

        const isMovedCorrect = turnBoard.every((row, i) => 
            row.every((tile, j) => 
                (afterBoard[i][j] !== 0 && tile === afterBoard[i][j]) ||
                (afterBoard[i][j] === 0)
            ));
        const valuesCount = notEmptyValuesCount(turnBoard);

        return {isMovedCorrect, valuesCount}
    } 

    test("move to the left with merge", () => {
        const BEFORE_BOARD = [
            [8, 4, 4, 4],
            [4, 4, 4, 4],
            [0, 0, 2, 0],
            [8, 0, 0, 8]
        ];
        const AFTER_BOARD = [
            [8, 8, 4, 0],
            [8, 8, 0, 0],
            [2, 0, 0, 0],
            [16, 0, 0, 0]
        ];
        const {isMovedCorrect, valuesCount} = executeTest(BEFORE_BOARD, AFTER_BOARD, 'left');

        expect(isMovedCorrect).toBe(true);
        expect(valuesCount).toBe(notEmptyValuesCount(AFTER_BOARD) + 1);
    });

    test("move to the right with merge", () => {
        const BEFORE_BOARD = [
            [8, 4, 4, 4],
            [4, 4, 4, 4],
            [0, 0, 2, 0],
            [8, 0, 0, 8]
        ];
        const AFTER_BOARD = [
            [0, 8, 4, 8],
            [0, 0, 8, 8],
            [0, 0, 0, 2],
            [0, 0, 0, 16]
        ];
        const {isMovedCorrect, valuesCount} = executeTest(BEFORE_BOARD, AFTER_BOARD, 'right');

        expect(isMovedCorrect).toBe(true);
        expect(valuesCount).toBe(notEmptyValuesCount(AFTER_BOARD) + 1);
    });

    test("move to the up with merge", () => {
        const BEFORE_BOARD = [
            [8, 4, 4, 4],
            [4, 4, 4, 4],
            [0, 0, 2, 0],
            [8, 0, 0, 8]
        ];
        const AFTER_BOARD = [
            [8, 8, 8, 8],
            [4, 0, 2, 8],
            [8, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        const {isMovedCorrect, valuesCount} = executeTest(BEFORE_BOARD, AFTER_BOARD, 'up');

        expect(isMovedCorrect).toBe(true);
        expect(valuesCount).toBe(notEmptyValuesCount(AFTER_BOARD) + 1);
    });

    test("move to the down with merge", () => {
        const BEFORE_BOARD = [
            [8, 4, 4, 4],
            [4, 4, 4, 4],
            [0, 0, 2, 0],
            [8, 0, 0, 8]
        ];
        const AFTER_BOARD = [
            [0, 0, 0, 0],
            [8, 0, 0, 0],
            [4, 0, 8, 8],
            [8, 8, 2, 8]
        ];
        const {isMovedCorrect, valuesCount} = executeTest(BEFORE_BOARD, AFTER_BOARD, 'down');

        expect(isMovedCorrect).toBe(true);
        expect(valuesCount).toBe(notEmptyValuesCount(AFTER_BOARD) + 1);
    });
});

describe('End game tests', () => {
    test('Game is not over. Board has empty tiles', () => {
        const BOARD = [
            [0, 2, 8, 16],
            [8, 32, 256, 2],
            [4, 8, 32, 2],
            [2, 4, 2, 4]
        ];

        expect(game(BOARD).isOver()).toBe(false);
    });

    test('Game is not over. Board has tiles to be merged', () => {
        const BOARD = [
            [2, 8, 2, 8],
            [32, 2, 8, 32],
            [2, 4, 2, 32],
            [8, 2, 8, 2]
        ];
        expect(game(BOARD).isOver()).toBe(false);
    });

    test('Game is over. There are no more empty tiles and no merge', () => {
        const BOARD = [
            [32, 2, 32, 4],
            [16, 4, 2, 256],
            [8, 2, 4, 64],
            [16, 8, 2, 4]
        ];
        expect(game(BOARD).isOver()).toBe(true);
    });

    test('Game is over. Max value tile is 2048', () => {
        const BOARD = [
            [2, 2, 4, 2],
            [2048, 0, 0, 0],
            [256, 64, 16, 0],
            [256, 0, 16, 0]
        ];
        expect(game(BOARD).isOver()).toBe(true);
    })
});