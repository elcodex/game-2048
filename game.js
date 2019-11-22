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
      
        viewTurnBoard(game2048.turn(direction));
        if (game2048.isOver()) {
            setTimeout(() => {
                viewGameOverBoard(game2048.maxScore());
                document.removeEventListener('keydown', handleKeydownEvent);
            }, 500);
        }
        
    }
}

let game2048 = game();

viewStartBoard(game2048.start());
document.addEventListener('keydown', handleKeydownEvent);

document.querySelector('.btn-newgame').addEventListener('click', e => {
    document.removeEventListener('keydown', handleKeydownEvent);
    viewStartBoard(game2048.start());
    document.addEventListener('keydown', handleKeydownEvent);
});
