const makeTurn = direction => {
    game2048.turn(direction);
    viewTurnBoard(game2048.board);
    saveToLocalStorage(game2048.board);

    if (game2048.isOver()) {
        setTimeout(() => {
            viewGameOverBoard(game2048.maxScore());
            clearLocalStorage();
            document.removeEventListener('keydown', handleKeydownEvent);
        }, 500);
    }
} 

const handleKeydownEvent = event => {
    let direction = '';
    if (event.code === 'ArrowDown'  || event.code === 'KeyS') {
        direction = 'down';
    }
    else if (event.code === 'ArrowLeft'  || event.code === 'KeyA') {
        direction = 'left';
    }
    else if (event.code === 'ArrowUp'    || event.code === 'KeyW') {
        direction = 'up';
    }
    else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        direction = 'right';
    }
    
    if (direction) {
        event.preventDefault();
        makeTurn(direction);
    }
}

let startTouch = null;
const handleTouchStartEvent = event => {
    event.preventDefault();

    if (event.changedTouches.length > 1) {
        return;
    }

    startTouch = {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
        id: event.changedTouches[0].identifier
    }
}

const handleTouchEndEvent = event => {
    event.preventDefault();

    if (!startTouch) {
        return;
    }
    if (event.changedTouches.length > 1 ||
        startTouch.id !== event.changedTouches[0].identifier) {
            startTouch = null;
            return;
    }
    
    const endTouch = {
        x: event.changedTouches[0].pageX, 
        y: event.changedTouches[0].pageY,
        id: event.changedTouches[0].identifier
    }

    const THRESHOLD = 30;
    const IS_X_THRESHOLD = Math.abs(startTouch.x - endTouch.x) < THRESHOLD;
    const IS_Y_THRESHOLD = Math.abs(startTouch.y - endTouch.y) < THRESHOLD;
    if (IS_X_THRESHOLD && IS_Y_THRESHOLD) {
        startTouch = null;
        return;
    }

    let direction = '';
    if (IS_Y_THRESHOLD) {
            direction = 'left';
            if (startTouch.x < endTouch.x) {
                direction = 'right';
            }
    } else {
        direction = 'up';
        if (startTouch.y < endTouch.y) {
            direction = 'down';
        }
    }
    if (direction) {
        makeTurn(direction);
    }
}

const handleTouchMoveEvent = event => {
    event.preventDefault();
}

const handleTouchCancelEvent = event => {
    event.preventDefault();
    startTouch = null;
}

const board = getFromLocalStorage();
let game2048 = new Game(board);

game2048.start();

viewStartBoard(game2048.board);

document.addEventListener('keydown', handleKeydownEvent);

document.querySelector('.btn-newgame').addEventListener('click', e => {
    document.removeEventListener('keydown', handleKeydownEvent);
    clearLocalStorage();
    game2048 = new Game();
    game2048.start()
    viewStartBoard(game2048.board);
    document.addEventListener('keydown', handleKeydownEvent);
});

let boardElement = document.querySelector('.board');
boardElement.addEventListener('touchstart', handleTouchStartEvent, false);
boardElement.addEventListener('touchend', handleTouchEndEvent, false);
boardElement.addEventListener('touchcancel', handleTouchCancelEvent, false);