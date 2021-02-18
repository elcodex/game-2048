# Game 2048

[Demo page](https://elcodex.github.io/game-2048/game2048.html)

Controls: touch swipe or WASD/arrow keys.

An implementation of a game [2048](https://en.wikipedia.org/wiki/2048_(video_game)).
This game is written in JavaScript and HTML+CSS, tested in Jest.

## Implementation features:
- restart button,
- invalid turns: if there are no empty tiles or no tiles are combined in chosen direction than 
new tile is not generated on the board (logic.js: game.turn), 
- two tiles with the same number are combined only one time in a turn (logic.js: game.turn),
- logic and view separation,
- Jest tests: random play, logic tests (start game, move to the different directions with and without 
combination, game over and game winning),
- CSS grid layout for game board,
- media queries for small screens,
- touch and keyboard events (game.js),
- game over screen.