const INITIAL_BOARD = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

function Game(userBoard) {
    const PROBABILITY_OF_TWO = 90;
    const WINNING_SCORE = 2048;

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
    
    const move = ({dx, dy}) => {
        
        let makeMove = (dx, dy) => {
            let isSomethingChanged = false;
            
            const d = (dx === 0) ? dy : dx;
            let [from, to] = (d === -1) ? 
                [0, this.board.length] : 
                [this.board.length - 1, -1];
            
            let newBoard = createNewBoard(INITIAL_BOARD);
            
            const length = (dx === 0) ? this.board[0].length : this.board.length;

            for (let i = 0; i < length; i++) {
                let newLine = [];
                let lastTile = null;
                for (let j = from; j !== to; j += -d) {
                    const tile = (dx === 0) ? this.board[i][j] : this.board[j][i];
                    if (tile !== 0) {
                        if (lastTile && lastTile === tile) {
                            lastTile *= 2;
                            newLine.push(lastTile);
                            isSomethingChanged = true;
                            lastTile = null;
                        }
                        else if (lastTile && lastTile !== tile) {
                            newLine.push(lastTile);
                            lastTile = tile;
                        }
                        else if (!lastTile) {
                            lastTile = tile;
                        }
                    }
                }
                if (lastTile) {
                    newLine.push(lastTile);
                }
                while (newLine.length < length) {
                    newLine.push(0);
                }
                if (d > 0) {
                    newLine.reverse();
                }
                if (!isSomethingChanged) {
                    isSomethingChanged = newLine.some((tile, index) => {
                        const boardTile = (dx === 0) ? board[i][index] : board[index][i];
                        return tile !== boardTile;
                    });
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
        const {newBoard, isSomethingChanged} = makeMove(dx, dy);

        if (isSomethingChanged) {
            this.board = createNewBoard(newBoard);
        }

        return isSomethingChanged;
    }
    
    const DIRECTIONS = {
        'left': {dx: 0, dy: -1},
        'right': {dx: 0, dy: 1},
        'up': {dx: -1, dy: 0},
        'down': {dx: 1, dy: 0}
    }

    const isSomethingChanged = move(DIRECTIONS[direction]);
    if (isSomethingChanged) {
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