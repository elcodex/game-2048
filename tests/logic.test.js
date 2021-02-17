const config = require('../scripts/config.js');
const Game = require('../scripts/logic.js');

const DIRECTIONS = config.DIRECTIONS;

describe("start game tests", () => {
    test("start game contains only one value", () => {
        const testGame = new Game();
        testGame.start();
        const valuesCount = testGame.board
            .reduce((count, row) => 
                count + row.reduce((rowCount, tile) =>
                    (tile > 0) ? rowCount + 1 : rowCount
                , 0)
            , 0);
        expect(valuesCount).toBe(1);
    });

    test("start game contains value 2 or 4", () => {
        const testGame = new Game();
        testGame.start();
        const contains = testGame.board.some(row => 
            row.some(tile => tile === 2 || tile === 4
        ));
        expect(contains).toBeTruthy();
    });
});

describe("first move tests", () => {
    test("move to the left direction", () => {
        let testGame = new Game();
        testGame.start();

        const rowIndex = testGame.board.findIndex(row => 
            row.includes(2) || row.includes(4)
        );

        testGame.turn(DIRECTIONS.LEFT);
        
        expect(testGame.board[rowIndex][0] > 0).toBeTruthy();
    });

    test("move to the right direction", () => {
        let testGame = new Game();
        testGame.start();

        const rowIndex = testGame.board.findIndex(row => 
            row.includes(2) || row.includes(4)
        );
        
        testGame.turn(DIRECTIONS.RIGHT);
        
        expect(testGame.board[rowIndex][testGame.board[rowIndex].length-1] > 0)
            .toBeTruthy();
    });

    test("move to the up direction", () => {
        let testGame = new Game();
        
        testGame.start();
        
        let columnIndex;
        for (let i = 0; i < testGame.board.length && !columnIndex; i++) {
            for (let j = 0; j < testGame.board[i].length && !columnIndex; j++) {
                if (testGame.board[i][j] > 0) {
                    columnIndex = j;
                }
            }
        }

        testGame.turn(DIRECTIONS.UP);

        expect(testGame.board[0][columnIndex] > 0).toBeTruthy();
    });

    test("move to the down direction", () => {
        let testGame = new Game();
        testGame.start();
        let columnIndex;
        for (let i = 0; i < testGame.board.length && !columnIndex; i++) {
            for (let j = 0; j < testGame.board[i].length && !columnIndex; j++) {
                if (testGame.board[i][j] > 0) {
                    columnIndex = j;
                }
            }
        }
        
        testGame.turn(DIRECTIONS.DOWN);
        
        expect(testGame.board[testGame.board.length-1][columnIndex] > 0).toBeTruthy();
    });
    
});

describe("some turns tests", () => {
    test("game is not over after some turns", () => {
        const SOME_TURNS = 5;
        let testGame = new Game();
        
        const directions = [[DIRECTIONS.LEFT, DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN]];
        for (let turnNumber = 0; turnNumber < SOME_TURNS; turnNumber++) {
            testGame.turn(directions[Math.floor(Math.random() * directions.length)]);
        }
        
        expect(testGame.isOver()).toBeFalsy();
    });

    test("game max score is correct after some turns", () => {
        const SOME_TURNS = 5;
        let testGame = new Game();
        let directions = [DIRECTIONS.LEFT, DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN];
        
        for (let turnNumber = 0; turnNumber < SOME_TURNS; turnNumber++) {
            testGame.turn(directions[Math.floor(Math.random() * directions.length)]);
        }

        let maxScore = 0;
        testGame.board.forEach(row => row.forEach(tile => {
            if (tile > maxScore)
                maxScore = tile;
        }));

        expect(testGame.maxScore()).toBe(maxScore);
    });
});

describe("custom board tests", () => {
    const notEmptyValuesCount = board => 
        board.reduce((count, row) => 
            count + row.reduce((rowCount, tile) =>
                (tile > 0) ? rowCount + 1 : rowCount     
            , 0), 
        0); 

    const executeTest = (beforeBoard, afterBoard, direction) => {
        let testGame = new Game(beforeBoard);
        testGame.turn(direction);

        const isMovedCorrect = testGame.board.every((row, i) => 
            row.every((tile, j) => 
                (afterBoard[i][j] !== 0 && tile === afterBoard[i][j]) ||
                (afterBoard[i][j] === 0)
            ));

        const valuesCount = notEmptyValuesCount(testGame.board);

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
        const {isMovedCorrect, valuesCount} = executeTest(BEFORE_BOARD, AFTER_BOARD, DIRECTIONS.LEFT);

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
        const {isMovedCorrect, valuesCount} = executeTest(BEFORE_BOARD, AFTER_BOARD, DIRECTIONS.RIGHT);

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
        const {isMovedCorrect, valuesCount} = executeTest(BEFORE_BOARD, AFTER_BOARD, DIRECTIONS.UP);

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
        const {isMovedCorrect, valuesCount} = executeTest(BEFORE_BOARD, AFTER_BOARD, DIRECTIONS.DOWN);

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

        expect(new Game(BOARD).isOver()).toBe(false);
    });

    test('Game is not over. Board has tiles to be merged, but no empty tiles', () => {
        const BOARD = [
            [2, 8, 2, 8],
            [32, 2, 8, 32],
            [2, 4, 2, 32],
            [8, 2, 8, 2]
        ];
        expect(new Game(BOARD).isOver()).toBe(false);
    });

    test('Game is over. There are no more empty tiles and no merge', () => {
        const BOARD = [
            [32, 2, 32, 4],
            [16, 4, 2, 256],
            [8, 2, 4, 64],
            [16, 8, 2, 4]
        ];
        expect(new Game(BOARD).isOver()).toBe(true);
    });

    test('Game is over. Max value tile is 2048', () => {
        const BOARD = [
            [2, 2, 4, 2],
            [2048, 0, 0, 0],
            [256, 64, 16, 0],
            [256, 0, 16, 0]
        ];
        expect(new Game(BOARD).isOver()).toBe(true);
    })
    
});
