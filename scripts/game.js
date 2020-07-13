const makeTurn = direction => {
    const board = game2048.turn(direction);
    viewTurnBoard(board);
    saveToLocalStorage(board);

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
        makeTurn(direction);
    }
}

let startTouch = undefined;
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
            startTouch = undefined;
            return;
    }
    
    const endTouch = {
        x: event.changedTouches[0].pageX, 
        y: event.changedTouches[0].pageY,
        id: event.changedTouches[0].identifier
    }

    const MIN_DISTANCE = 30;
    const X_DISTANCE = Math.abs(startTouch.x - endTouch.x);
    const Y_DISTANCE = Math.abs(startTouch.y - endTouch.y);
    if ((X_DISTANCE < MIN_DISTANCE && Y_DISTANCE < MIN_DISTANCE) ||
         (Math.abs(X_DISTANCE - Y_DISTANCE) < MIN_DISTANCE * 0.7)) {
            startTouch = undefined;
            return;
        }

    let direction = '';
    if (Math.abs(startTouch.x - endTouch.x) > 
        Math.abs(startTouch.y - endTouch.y)) {
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
    if (direction !== '') {
        makeTurn(direction);
    }
}

const handleTouchMoveEvent = event => {
    event.preventDefault();
}

const handleTouchCancelEvent = event => {
    event.preventDefault();
    startTouch =- undefined;
}

let board = getFromLocalStorage();
let game2048 = game(board);

if (!board) {
    board = game2048.start();
}

viewStartBoard(board);

document.addEventListener('keydown', handleKeydownEvent);

document.querySelector('.btn-newgame').addEventListener('click', e => {
    document.removeEventListener('keydown', handleKeydownEvent);
    clearLocalStorage();
    viewStartBoard(game2048.start());
    document.addEventListener('keydown', handleKeydownEvent);
});

let boardElement = document.querySelector('.board');
boardElement.addEventListener('touchstart', handleTouchStartEvent, false);
boardElement.addEventListener('touchend', handleTouchEndEvent, false);
//boardElement.addEventListener('touchmove', handleTouchMoveEvent, false);
boardElement.addEventListener('touchcancel', handleTouchCancelEvent, false);