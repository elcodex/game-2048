
const game = (userBoard) => {
    const probabilityOfTwo = 90;
    const initialBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const winScore = 2048;

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
            if (Math.random() * 100 <= probabilityOfTwo)
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
        const move = (dx, dy) => {
            let moveHorizontally = (dy) => {
                let isSomethingChanged = false;
                let [from, to] = (dy === -1) ? 
                    [0, board.length] : 
                    [board.length - 1, -1];
          
                let newBoard = board.map(row => {
                    let newRow = [];
                    let lastTile = undefined;
                    for (let j = from; j !== to; j += -dy) {
                        const tile = row[j];
                        if (tile !== 0) {
                            if (lastTile && lastTile === tile) {
                                lastTile *= 2;
                                newRow.push(lastTile);
                                isSomethingChanged = true;
                                lastTile = undefined;
                            } 
                            else if (lastTile && lastTile !== tile) {
                                newRow.push(lastTile);
                                lastTile = tile;
                            }
                            else if (!lastTile) {
                                lastTile = tile;
                            }
                        }
                    }
                    if (lastTile) {
                        newRow.push(lastTile);
                    }
                    while (newRow.length < row.length) {
                        newRow.push(0);
                    }
                    if (dy === 1) {
                        newRow.reverse();
                    }
                    if (!isSomethingChanged) {
                        isSomethingChanged = newRow.some((tile, i) => tile !== row[i]);
                    }
                
                    return newRow;
                });
                return {newBoard, isSomethingChanged};
            }
            
            const moveVertically = (dx) => {
                let isSomethingChanged = false;
                let [from, to] = (dx === -1) ? 
                    [0, board.length] : 
                    [board.length - 1, -1];
                let newBoard = initialBoard.map(row => row.map(tile => tile));;
                for (let j = 0; j < board.length; j++) {
                    let newColumn = [];
                    let lastTile = undefined;
                    for (let i = from; i !== to; i += -dx) {
                        const tile = board[i][j];
                        if (tile !== 0) {
                            if (lastTile && lastTile === tile) {
                                lastTile *= 2;
                                newColumn.push(lastTile);
                                isSomethingChanged = true;
                                lastTile = undefined;
                            } 
                            else if (lastTile && lastTile !== tile) {
                                newColumn.push(lastTile);
                                lastTile = tile;
                            }
                            else if (!lastTile) {
                                lastTile = tile;
                            }
                        }
                    }
                    if (lastTile) {
                        newColumn.push(lastTile);
                    }
                    while (newColumn.length < board.length) {
                        newColumn.push(0);
                    }
                    if (dx === 1) {
                        newColumn.reverse();
                    }
                    if (!isSomethingChanged) {
                        isSomethingChanged = newColumn.some((tile, i) => tile !== board[i][j]); 
                    }
                    
                    for (let i = 0; i < newColumn.length; i++) {
                        newBoard[i][j] = newColumn[i];
                    }
                }
                return {newBoard, isSomethingChanged};
            }
            
            let results = {};
            if (dx !== 0) {
                results = moveVertically(dx);   
            }
            if (dy !== 0) {
                results = moveHorizontally(dy);
            }

            let isSomethingChanged = results.isSomethingChanged;
            let newBoard = results.newBoard;
            if (isSomethingChanged) {
                board = newBoard.map(row => row.map(tile => tile));
            }

            return isSomethingChanged;
        }
        
        let isSomethingChanged = false;
        if (direction === 'left') {
            isSomethingChanged = move(0, -1);
        }
        if (direction === 'right') {
            isSomethingChanged = move(0, 1);
        }
        if (direction === 'up') {
            isSomethingChanged = move(-1, 0);
        }
        if (direction === 'down') {
            isSomethingChanged = move(1, 0);  
        }

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
        const hasWinScore = board.some(row => row.includes(winScore));
        return (noEmptyTiles && !doesTurnExist()) || hasWinScore;
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

module.exports = game;