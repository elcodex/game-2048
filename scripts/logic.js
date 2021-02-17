const INITIAL_BOARD = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const PROBABILITY_OF_TWO = 90;
const WINNING_SCORE = 2048;

function Game(userBoard) {
    this.board = userBoard
        ? createNewBoard(userBoard)
        : createNewBoard(INITIAL_BOARD);
}

Game.prototype.setNewTile = function() {
    const emptyTiles = board.reduce((tiles, row, i) => {
        tiles.push(...row.reduce((rowTiles, tile, j) => {
            if (tile === 0) {
                rowTiles.push([i, j]);
            }    
        }, []));
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
    ths.board = createNewBoard(INITIAL_BOARD);
    this.setNewTile();
}

Game.prototype.turn = function(direction) {

    const move = () => {
        
        const makeMove = () => {
            let isSomethingChanged = false;
            
            let [from, to] = [0, this.board.length],
                dj = 1;

            if (direction === 'left' || direction === 'up') {
                [from, to] = [this.board.length - 1, -1];
                dj = -1;
            }
            
            let newBoard = createNewBoard(INITIAL_BOARD);
            
            const length = this.board.length;

            for (let i = 0; i < length; i++) {
                // create new row or column with the direction's shift
                let newLine = [];
                let lastTile = null;
                for (let j = from; j !== to; j += dj) {
                    const tile = (direction === 'left' || direction === 'right')
                        ? this.board[i][j] 
                        : this.board[j][i];

                    if (tile !== 0) {
                        if (lastTile) {
                            if (lastTile === tile) {
                                newLine.push(lastTile * 2);
                                isSomethingChanged = true;
                                lastTile = null;
                            }
                            else {
                                newLine.push(lastTile);
                                if (j !== newLine.length) {
                                    isSomethingChanged = true;
                                }
                                lastTile = tile;
                            }
                        }
                        else {
                            lastTile = tile;
                        }
                    }
                }

                if (lastTile) {
                    newLine.push(lastTile);
                    if (length !== newLine.length) {
                        isSomethingChanged = true;
                    }
                }

                newLine.push(...new Array(Math.max(0, length - newLine.length)).fill(0));

                if (direction === 'left' || direction === 'up') {
                    newLine.reverse();
                }
                
                newLine.forEach((tile, index) => {
                    if (dx === 0) {
                        newBoard[i][index] = tile;
                    } else {
                        newBoard[index][i] = tile;
                    }
                });
            }
            return {newBoard, isSomethingChanged};
        }

        const {newBoard, isSomethingChanged} = makeMove();

        if (isSomethingChanged) {
            this.board = createNewBoard(newBoard);
        }

        return isSomethingChanged;
    }

    if (move()) {
        this.setNewTile();
    }
}

Game.prototype.isOver = function() {
    const doesTurnExist = () => {
        return this.board.some((row, i) => row.some((tile, j) => {
            return [{di: 0, dj: -1}, {di: -1, dj: 0}, 
                {di: 0, dj: 1}, {di: 1, dj: 0}].some(({di, dj}) => {
                if (i + di >= 0 && i + di < this.board.length &&
                    j + dj >= 0 && j + dj < row.length) {
                        return tile === this.board[i+di][j+dj];
                }
                return false;
            });
        }));
    }

    const noEmptyTiles = this.board.every(row => row.every(tile => tile > 0));
    const hasWinningScore = this.board.some(row => row.includes(WINNING_SCORE));
    return (noEmptyTiles && !doesTurnExist()) || hasWinningScore;
}
    
Game.prototype.maxScore = function() {
    return this.board.reduce((maxScore, row) => Math.max(maxScore, ...row), 0);
}

function createNewBoard(board) {
    return board.map(row => [...row]);
}

module.exports = Game; // for tests