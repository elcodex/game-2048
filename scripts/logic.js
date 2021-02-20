//const DIRECTIONS = require('../scripts/config.js').DIRECTIONS;

const INITIAL_BOARD = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const PROBABILITY_OF_TWO = 90;
const WINNING_SCORE = 2048;

function Game(userBoard) {
    this.board = userBoard
        ? createNewBoard(userBoard)
        : createNewBoard(INITIAL_BOARD);
}

Game.prototype.setNewTile = function() {
    const emptyTiles = this.board.reduce((tiles, row, i) => {
        tiles.push(...row.reduce((rowTiles, tile, j) => {
            if (tile === 0) {
                rowTiles.push([i, j]);
            }   
            return rowTiles; 
        }, []));
        return tiles;
    }, []);

    if (emptyTiles.length > 0) {
        const tileIndex = Math.floor(Math.random() * emptyTiles.length);
        const [i, j] = emptyTiles[tileIndex];
        if (Math.random() * 100 <= PROBABILITY_OF_TWO) {
            this.board[i][j] = 2;
        } else {
            this.board[i][j] = 4;
        }
    }
}

Game.prototype.start = function() {
    this.board = createNewBoard(INITIAL_BOARD);
    this.setNewTile();
}

Game.prototype.turn = function(direction) {

    const needToTranspose = direction === DIRECTIONS.UP || direction === DIRECTIONS.DOWN;
    const needToReverse = direction === DIRECTIONS.RIGHT || direction === DIRECTIONS.DOWN;

    function transposeBoard(board) {
        let transposedBoard = createNewBoard(board);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                transposedBoard[i][j] = board[j][i];
            }
        }

        return transposedBoard;
    }

    let board = needToTranspose 
        ? transposeBoard(this.board) 
        : createNewBoard(this.board);

    const shiftedRows = board.reduce((shifted, row) => {
        shifted.push(row.filter(n => n !== 0));
        return shifted;
    }, []);

    const mergedBoard = shiftedRows.reduce((merged, row) => {
        const _row = needToReverse ? row.reverse() : [...row];
        let isMerged = false;
        const mergedRow = _row.reduce((mergedRow, n, i) => {
            if (mergedRow.length && mergedRow[mergedRow.length - 1] === n && !isMerged) {
                mergedRow[mergedRow.length - 1] += n;
                isMerged = true;
            } else {
                mergedRow.push(n);
                isMerged = false;
            }
            return mergedRow;
        }, []);

        const zerosArray = new Array(board.length - mergedRow.length).fill(0);
        merged.push(needToReverse 
            ? zerosArray.concat(mergedRow.reverse()) 
            : mergedRow.concat(zerosArray)
        );
        
        return merged;
    }, [])

    board = needToTranspose 
        ? transposeBoard(mergedBoard) 
        : createNewBoard(mergedBoard);
    
    const isSomethingChanged = board.some((row, i) =>
        row.some((n, j) => n !== this.board[i][j])
    );

    // do this turn
    if (isSomethingChanged) {
        this.board = board;
        this.setNewTile();
    }
}

Game.prototype.isOver = function() {
    const doesTurnExist = () => {
        return this.board.some((row, i) => row.some((tile, j) => {
            return [{di: 0, dj: -1}, {di: -1, dj: 0}, {di: 0, dj: 1}, {di: 1, dj: 0}]
                .some(({di, dj}) => {
                    if (i + di >= 0 && i + di < this.board.length &&
                        j + dj >= 0 && j + dj < row.length) {
                            return tile === this.board[i+di][j+dj];
                    }
                    return false;
                });
        }));
    }

    const hasEmptyTiles = this.board.some(row => row.some(tile => tile === 0));
    const hasWinningScore = this.board.some(row => row.includes(WINNING_SCORE));

    return !(doesTurnExist() || hasEmptyTiles) || hasWinningScore;
}
    
Game.prototype.maxScore = function() {
    return this.board.reduce((maxScore, row) => Math.max(maxScore, ...row), 0);
}

function createNewBoard(board) {
    return board.map(row => [...row]);
}

module.exports = Game; // for tests