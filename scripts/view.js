
const viewStartBoard = board => {
    [...document.getElementsByClassName('board__tile')].forEach(tile => {
        let tileText = tile.querySelector('.tile__text');
        tile.classList.remove(`tile-${tileText.innerText}`);
        
        let [i, j] = tile.getAttribute('data-position').split('').map(s => parseInt(s));
        if (board[i][j] > 0) {
            tileText.innerText = board[i][j].toString();
            tile.classList.add(`tile-${board[i][j]}`);
        }
        else {
            tileText.innerText = '';
        }
      });
}

const viewTurnBoard = board => {
    [...document.getElementsByClassName('board__tile')].forEach(tile => {
        let tileText = tile.querySelector('.tile__text');
        let [i, j] = tile.getAttribute('data-position').split('').map(s => parseInt(s));
        
        if (tileText.innerText === board[i][j].toString()) {
            return;
        }

        tile.classList.remove(`tile-${tileText.innerText}`);
        
        if (board[i][j] > 0) {
            tileText.innerText = board[i][j].toString();
            tile.classList.add(`tile-${board[i][j]}`);
        }
        else {
            tileText.innerText = '';
        }
      });
}

const viewGameOverBoard = maxScore => {
    [...document.getElementsByClassName('board__tile')].forEach(tile => {
        let tileText = tile.querySelector('.tile__text');
        if (tileText.innerText !== maxScore.toString()) {
            tile.classList.remove(`tile-${tileText.innerText}`);
            tileText.innerText = maxScore.toString();
            tile.classList.add(`tile-${maxScore}`);
        }
    });
}
