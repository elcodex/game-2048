const game = require('../scripts/logic.js');

describe('play the game', () => {
    const randomGameTest = (randomGame) => {
        const DIRECTIONS = ['left', 'right', 'up', 'down'];
        //let randomGame = game();
        let board = randomGame.start();
        while (!randomGame.isOver()) {
            const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            board = randomGame.turn(direction);
        }
        
        expect(board.every(row => row.every(tile => tile > 0))).toBe(true);
        
        const maxScore = randomGame.maxScore();
        expect(board.every(row => row.every(tile => tile <= maxScore))).toBe(true);
    }

    test('play the random games some times', () => {
        let randomGame = game();
        for (let i = 0; i < 5; i++) {
            randomGameTest(randomGame);
        }
    });
});