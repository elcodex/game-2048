const Game = require('../scripts/logic.js');

describe('play the game', () => {
    const randomGameTest = () => {
        const DIRECTIONS = ['left', 'right', 'up', 'down'];
        let randomGame = new Game();
        randomGame.start();
        while (!randomGame.isOver()) {
            const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            randomGame.turn(direction);
        }
        
        expect(randomGame.board.every(row => row.every(tile => tile > 0))).toBe(true);
        
        const maxScore = randomGame.maxScore();
        expect(randomGame.board.every(row => row.every(tile => tile <= maxScore))).toBe(true);
        expect(randomGame.board.some(row => row.some(tile => tile === maxScore))).toBe(true);
    }

    for (let i = 1; i <= 5; i++) {
        test('play the random games some times' + ` (${i})`, () => {
                randomGameTest();
        });
    }
});