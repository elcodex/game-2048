const game = userBoard => {
    const PROBABILITY_OF_TWO = 90;
    const WINNING_SCORE = 2048;
    const initialBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    let board = userBoard ? 
        userBoard.map(row => row.map(tile => tile)) : 
        initialBoard.map(row => row.map(tile => tile));
    
    const setNewTile = () => {
        let emptyTiles = [];
        board.forEach((row, i) => {
            row.forEach((tile, j) => {
            if (tile === 0) 
                emptyTiles.push([i, j]);
            });
        });

        if (emptyTiles.length > 0) {
            const tileNumber = Math.floor(Math.random() * emptyTiles.length);
            if (Math.random() * 100 <= PROBABILITY_OF_TWO)
                board[emptyTiles[tileNumber][0]][emptyTiles[tileNumber][1]] = 2;
            else
                board[emptyTiles[tileNumber][0]][emptyTiles[tileNumber][1]] = 4;
        }
    }

    const start = () => {  
        board = initialBoard.map(row => row.map(tile => tile));
        setNewTile();
        return board;
    }

    const turn = direction => {
        const move = ({dx, dy}) => {
            let makeMove = (dx, dy) => {
                let isSomethingChanged = false;
                
                const d = (dx === 0) ? dy : dx;
                let [from, to] = (d === -1) ? 
                    [0, board.length] : 
                    [board.length - 1, -1];
                
                let newBoard = initialBoard.map(row => row.map(tile => tile));
                
                const length = (dx === 0) ? board[0].length : board.length;
                for (let i = 0; i < length; i++) {
                    let newLine = [];
                    let lastTile = undefined;
                    for (let j = from; j !== to; j += -d) {
                        const tile = (dx === 0) ? board[i][j] : board[j][i];
                        if (tile !== 0) {
                            if (lastTile && lastTile === tile) {
                                lastTile *= 2;
                                newLine.push(lastTile);
                                isSomethingChanged = true;
                                lastTile = undefined;
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
                board = newBoard.map(row => row.map(tile => tile));
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
            setNewTile();
        }
        return board;
    }

    const isOver = () => {
        const doesTurnExist = () => {
            return board.some((row, i) => row.some((tile, j) => {
                return [{di: 0, dj: -1}, {di: -1, dj: 0}, 
                 {di: 0, dj: 1}, {di: 1, dj: 0}].some(({di, dj}) => {
                    if (i + di >= 0 && i + di < board.length &&
                        j + dj >= 0 && j + dj < row.length) {
                            return tile === board[i+di][j+dj];
                    }
                    return false;
                });
            }));
        }

        const noEmptyTiles = board.every(row => row.every(tile => tile > 0));
        const hasWinningScore = board.some(row => row.includes(WINNING_SCORE));
        return (noEmptyTiles && !doesTurnExist()) || hasWinningScore;
    }
    
    const maxScore = () => {
        return board.reduce(
            (maxScore, row) => Math.max(maxScore, ...row),
            0);
    }

    return {
        start,
        turn,
        isOver,
        maxScore
    }
}

module.exports = game; // for tests