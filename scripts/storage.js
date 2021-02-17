const ROW_SEPARATOR = ";";
const TILE_SEPARATOR = ",";
const STORAGE_ITEM = "board2048";

const saveToLocalStorage = board => {
    if (localStorage) {
        const boardString = board.map(row => row.join(TILE_SEPARATOR)).join(ROW_SEPARATOR);
        localStorage.setItem(STORAGE_ITEM, boardString);
    }
}

const clearLocalStorage = () => {
    if (localStorage) {
        localStorage.removeItem(STORAGE_ITEM);
    }
}

const getFromLocalStorage = () => {
    if (localStorage) {
        const boardString = localStorage.getItem(STORAGE_ITEM);
        if (boardString) {
            return boardString
                .split(ROW_SEPARATOR)
                .map(row => row.split(TILE_SEPARATOR).map(tile => parseInt(tile, 10)));
        }
    }
    return;
}