
const game = _ => {
    const probabilityOfTwo = 90;
    const initialBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const winScore = 2048;

    let board = initialBoard;
    
    const setNewTile = _ => {
        let emptyTiles = [];
        board.forEach((row, i) => {
            row.forEach((tile, j) => {
            if (tile === 0) 
                emptyTiles.push([i, j]);
            });
        });
        
        console.log(emptyTiles.length);

        if (emptyTiles.length > 0) {
            const tileNumber = Math.floor(Math.random() * emptyTiles.length);
            if (Math.random() * 100 <= probabilityOfTwo)
                board[emptyTiles[tileNumber][0]][emptyTiles[tileNumber][1]] = 2;
            else
                board[emptyTiles[tileNumber][0]][emptyTiles[tileNumber][1]] = 4;
        }
    }

    const start = _ => {
        board = initialBoard;
        setNewTile();
        return board;
    }

    const turn = direction => {
        const toLeft = _ => {
            let isSomethingChanged = false;
            let newBoard = board.map(row => {
                let newRow = [];
                let lastTile = undefined;
                row.forEach(tile => {
                    if (tile !== 0) {
                        //console.log(tile);
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
                });
                if (lastTile) {
                    newRow.push(lastTile);
                }
                while (newRow.length < row.length) {
                    newRow.push(0);
                }
                if (!isSomethingChanged) {
                    isSomethingChanged = newRow.some((tile, i) => tile !== row[i]); 
                }
                
                return newRow;
            });
            if (isSomethingChanged) {
                board = newBoard.map(row => row.map(tile => tile));
            }
            console.log(isSomethingChanged);
            return isSomethingChanged;
        }
        
        const reverseRows = _ => {
            board = board.map(row => row.reverse());
        }

        const transposeBoard = _ => {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < i; j++) {
                    [board[i][j], board[j][i]] = [board[j][i], board[i][j]];
                }
            }
        }
        let isSomethingChanged = false;
        if (direction === 'left') {
            isSomethingChanged = toLeft();
        }
        if (direction === 'right') {
            reverseRows();
            isSomethingChanged = toLeft();
            reverseRows();
        }
        if (direction === 'up') {
            transposeBoard();
            isSomethingChanged = toLeft();
            transposeBoard();
        }
        if (direction === 'down') {
            transposeBoard();
            reverseRows();
            isSomethingChanged = toLeft();
            reverseRows();
            transposeBoard();        
        }

        if (isSomethingChanged) {
            setNewTile();
        }
        //console.log(board);
        return board;
    }

    const isOver = _ => {
        return board.every(row => row.every(tile => tile > 0)) ||
               board.some(row => row.includes(winScore));
    }
    
    const maxScore = _ => {
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
