const probabilityOfTwo = 90;
let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; /*start*/

const playerTurn = _ => {
  const handleKeydownEvent = (event) => {
    console.log('listener');
    let direction = '';
    if (event.code === 'ArrowDown'  || event.code === 'KeyS') {
      //console.log('down');
      direction = 'down';
    }
    if (event.code === 'ArrowLeft'  || event.code === 'KeyA') {
      //console.log('left');
      direction = 'left';
    }
    if (event.code === 'ArrowUp'    || event.code === 'KeyW') {
      //console.log('up');
      direction = 'up';
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      //console.log('right');
      direction = 'right';
    }
    
    if (direction !== '') {
      event.preventDefault();
      const {success, moves} = moveTiles(direction); 
      if (success) {
        console.log(success);
        viewNewBoard(moves);
        let newTile = setNewTile();
        viewNewTile(newTile);
        if (isGameOver()) { 
          console.log('game is over');
          document.removeEventListener('keydown', handleKeydownEvent);
        }
      }  
    }
  }
  document.addEventListener('keydown', handleKeydownEvent);
}

const isGameOver = _ => {
  return !board.some((row, i) => row.some((tile, j) => {
    return tile === 0 || 
           (i > 0 && board[i-1][j] === tile) ||
           (i < board.length - 1 && board[i+1][j] === tile) ||
           (j > 0 && board[i][j-1] === tile) ||
           (j < board[i].length-1 && board[i][j+1] === tile);
  }));
}

const moveTiles = direction => {
  let success = false;
  let moves = [];
  for (let i = 0; i < board.length; i++) {
    moves.push([]);
    for (let j = 0; j < board.length; j++) {
      moves[i].push({moveTo: 0, tileScore: 0});
    }
  }
  if (direction === 'up' || direction === 'down') {
    for (let j = 0; j < board.length; j++) {
      let from = (direction === 'up') ? 0 : board.length - 1;
      let to = (direction === 'up') ? board.length : -1;
      let step = (direction === 'up') ? 1 : -1;

      let lastUsedTile = (direction === 'up') ? -1 : board.length;
      let lastTileScore = 0;
      for (let i = from; i !== to; i += step) {
        let moveTo = [];
        let score = board[i][j];
        if (board[i][j] !== 0) {  
          //let us move
          moveTo = [lastUsedTile + step, j];
          lastUsedTile = lastUsedTile + step;
          //let us merge
          if (lastTileScore === board[i][j]) {
            lastTileScore = 0;
            moveTo = [moveTo[0] - step, j];
            lastUsedTile = lastUsedTile - step;
            score *= 2;
          } else {
            lastTileScore = board[i][j];
          }
        }
        if (!success &&
            ((moveTo.length > 0 && (moveTo[0] !== i || moveTo[1] !== j)) || 
             score !== board[i][j])) {
          success = true;
        }
        moves[i][j] = {moveTo, score};
      }  
    }
  }
  if (direction === 'left' || direction === 'right') {
    for (let i = 0; i < board.length; i++) {
      const from = (direction === 'left') ? 0 : board.length - 1;
      const to =   (direction === 'left') ? board.length : -1;
      const step = (direction === 'left') ? 1 : -1;
      
      let lastUsedTile = from - step;
      let lastTileScore = 0;
      for (let j = from; j !== to; j += step) {
        let moveTo = [];
        let score = board[i][j];
        if (board[i][j] !== 0) {  
          //let us move
          moveTo = [i, lastUsedTile + step];
          lastUsedTile = lastUsedTile + step;
          //let us merge
          if (lastTileScore === board[i][j]) {
            lastTileScore = 0;
            moveTo = [i, moveTo[1] - step];
            lastUsedTile = lastUsedTile - step;
            score *= 2;
          } else {
            lastTileScore = board[i][j];
          }
        }
        if (!success && 
            ((moveTo.length > 0 && (moveTo[0] !== i || moveTo[1] !== j)) ||
             score !== board[i][j])) {
          success = true;
        }  
        moves[i][j] = {moveTo, score};
      }
    }
  }
//  console.log(moves);
  board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  moves.forEach(row => row.forEach(({moveTo, score}) => {
  //  console.log(moveTo);
    if (moveTo.length > 0 && board[moveTo[0]][moveTo[1]] < score) {
      board[moveTo[0]][moveTo[1]] = score;
    }
  }));
  
  return {success, moves};
}

const setNewTile = _ => {
  let emptyTiles = [];
  board.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile === 0) 
        emptyTiles.push([i, j]);
    });
  });
  if (emptyTiles.length === 0) return {};
  const tileNumber = Math.floor(Math.random() * emptyTiles.length);
  if (Math.random() * 100 <= probabilityOfTwo)
    board[emptyTiles[tileNumber][0]][emptyTiles[tileNumber][1]] = 2;
  else
    board[emptyTiles[tileNumber][0]][emptyTiles[tileNumber][1]] = 4;   

  return {
    position: emptyTiles[tileNumber], 
    score: board[emptyTiles[tileNumber][0]][emptyTiles[tileNumber][1]] 
  };
}

const viewNewTile = ({position, score}) => {
  const selector = `.board__tile[data-position="${position[0].toString() + position[1].toString()}"]`;
  let tile = document.querySelector(selector);
  tile.innerText = score;
  tile.classList.add(`tile-${score}`);
}
const viewNewBoard = moves => {
  [...document.getElementsByClassName('board__tile')].forEach(tile => {
    const score = tile.innerText;
    tile.classList.remove(`tile-${score}`);
    tile.innerText = '';
  });
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves[i].length; j++) {
      if (moves[i][j].moveTo.length > 0) {
        const selector = 
          `.board__tile[data-position="${moves[i][j].moveTo[0].toString() + moves[i][j].moveTo[1].toString()}"]`;
        const tile = document.querySelector(selector);
        const tileScore = tile.innerText*1;
        if (tileScore < moves[i][j].score) {
          tile.classList.remove(`tile-${tileScore}`);
          tile.classList.add(`tile-${moves[i][j].score}`);
          tile.innerText = moves[i][j].score;
        }
      }
    }
  }
}

const play = _ => {
  let newTile = setNewTile();
  viewNewTile(newTile);
  playerTurn();
}

play();

//tests

const testTileColors = _ => {
  board = [[2, 4, 8, 16], [32, 64, 128, 256], [512, 1024, 2048, 0], [0, 0, 0, 0]];
  let i = 0;
  let j = 0;
  [...document.getElementsByClassName('board__tile')].forEach(tile => {
    if (j === 4) {
      j = 0;
      i++;
    }
    if (board[i][j] > 0) {
      tile.innerText = board[i][j];
      tile.classList.add(`tile-${board[i][j]}`);
    }
    j++;
  });
}

//testTileColors();
