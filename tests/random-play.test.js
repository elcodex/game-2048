const config = require('../scripts/config.js');
const Game = require('../scripts/logic.js');

const DIRECTIONS = config.DIRECTIONS;

describe('play the game', () => {
    const randomGameTest = () => {
        const directions = [DIRECTIONS.LEFT, DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN];
        let randomGame = new Game();
        randomGame.start();
        while (!randomGame.isOver()) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
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