import { WAYS_TO_WIN } from '../data.js';

export default function PC () {
  this.enemyPositions = [];
  this.availablePositions = [];
  this.myPositions = [];
}

PC.prototype = {
  constructor: PC,

  movement (currentBoard, callback) {
    // get the info positions
    this.enemyPositions = currentBoard.flatMap((item, index) => item !== 'cross' ? [] : index);
    this.availablePositions = currentBoard.flatMap((item, index) => item !== null ? [] : index);
    this.myPositions = currentBoard.flatMap((item, index) => item !== 'circle' ? [] : index);
    // try the next pc's move
    const pcNextPosition = this.getNextPcPositionMove();

    // get the cell from the dom and make the move
    const cell = document.querySelector(`.tic-tac-toe__cell[data-position="${pcNextPosition}"]`);
    setTimeout(() => {
      callback(cell, pcNextPosition);
    }, 1000);
  },

  getNextPcPositionMove () {
    // detect way to win and to lose
    const detectedWaysToLose = this.getWaysToMove(this.enemyPositions);
    const detectedWaysToWin = this.getWaysToMove(this.myPositions);
    // console.log(detectedWaysToLose);
    // console.log(detectedWaysToWin);

    // get the option to win, option to lose or an a random position in the available positions and return it
    const optionsToBlock = [...new Set(detectedWaysToLose.flat())].filter(pos => this.availablePositions.includes(pos));
    const optionsToWin = [...new Set(detectedWaysToWin.flat())].filter(pos => this.availablePositions.includes(pos));
    // console.log({ optionsToWin, optionsToBlock });
    return optionsToWin[0] ?? optionsToBlock[0] ?? this.availablePositions[Math.floor(Math.random() * this.availablePositions.length)];
  },

  getWaysToMove (positions) {
    // get the possible ways to make a move according the positions paased
    const detectedWays = WAYS_TO_WIN.filter(way => {
      let times = 0;
      for (const number of way) {
        if (positions.includes(number)) times += 1;
      }
      return times >= 2;
    });
    return detectedWays;
  }
};
