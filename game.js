const playerTurn = game => {
  const handleKeydownEvent = event => {
    //console.log(board);
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
      
      viewTurnBoard(game.turn(direction));
      if (game.isOver()) {
        setTimeout(_ => {
          viewGameOverBoard(game.maxScore());
          document.removeEventListener('keydown', handleKeydownEvent);
        }, 500);
      }
        
    }
  }

  document.addEventListener('keydown', handleKeydownEvent);
}

const play = _ => {
  let game2048 = game();
  viewStartBoard(game2048.start());
  playerTurn(game2048);
}

play();
document.querySelector('.btn-newgame').addEventListener('click', e => play());
