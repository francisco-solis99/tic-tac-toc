import { WAYS_TO_WIN } from '../data.js';
import PC from './PC.js';
import Score from './Score.js';
console.log(WAYS_TO_WIN);

function isRequiered (param) {
  throw new Error('You must pass the ' + param + ' parameter');
}

export function TicTacToe ({ mode = isRequiered('mode') } = {}) {
  this.mode = mode;
  if (this.mode === 'single') {
    this.pc = new PC();
  }
  this.scoreBaord = new Score({ rounds: 3, player1: 'Player', player2: 'PC' });
  this.board = Array(9).fill(null);
  this.ticTacTocBoard = document.createElement('div');
  this.ticTacTocBoard.classList.add('tic-tac-toe__board');
  this.playerIndicator = document.querySelector('.player');
  this.player1Turn = Boolean(Math.floor(Math.random() * 2));
}

TicTacToe.prototype = {
  constructor: TicTacToe,

  renderGame (app) {
    this.ticTacTocBoard.innerHTML = `
      ${this.genCells(this.board.length)}
    `;
    app.appendChild(this.ticTacTocBoard);
    this.renderTurn();
    const scoreBoard = this.scoreBaord.generateScoreBoard();
    app.appendChild(scoreBoard);
    this.ticTacTocBoard.addEventListener('click', (e) => this.movement(e));
    if (this.mode === 'single' && !this.player1Turn) this.pc.movement(this.board, this.makeMove.bind(this));
  },

  cell (posNumCell) {
    return `
      <div class="tic-tac-toe__cell" data-position="${posNumCell}">
      </div>
    `;
  },

  genCells (numCells = 9) {
    const cells = [];
    for (let i = 0; i < numCells; i += 1) cells.push(this.cell(i));
    return cells.join('');
  },

  renderTurn () {
    const shape = this.getTurn();
    if (this.mode === 'single') {
      this.playerIndicator.textContent = ` ${this.player1Turn ? 'Player' : 'PC'} - ${shape} turns`;
      return;
    }
    this.playerIndicator.textContent = `Player ${this.player1Turn ? '1' : '2'} - ${shape} turns`;
  },

  getTurn () {
    return this.player1Turn ? 'cross' : 'circle';
  },

  movement (e) {
    const conditionTarget = !(e.target.classList.contains('tic-tac-toe__cell'));
    const conditionModePlayer = (this.mode === 'single' && this.player1Turn === false);
    if (conditionTarget || conditionModePlayer) return;

    const cell = e.target;
    const position = +cell.dataset.position;
    this.makeMove(cell, position);

    // PC's move
    if (this.mode === 'single') this.pc.movement(this.board, this.makeMove.bind(this));
  },

  makeMove (cell, position) {
    const turn = this.getTurn();
    cell.innerHTML = this.attempt(turn);
    this.board[position] = turn;
    if (this.board.filter(item => item !== null).length > 4) {
      this.checkMove(turn, cell.dataset.position);
    }
    this.player1Turn = !this.player1Turn;
    this.renderTurn();
  },

  attempt (turn) {
    return `
      <img src="./images/${turn}.svg" class="tic-tac-toe__image" alt="${turn} for tic tac toe">
    `;
  },

  checkMove (turn, pos) {
    const waysFiltered = WAYS_TO_WIN.filter(element => element.includes(+pos));
    const currentBoard = this.board.map((cell, index) => cell === turn ? index : null).filter(item => item !== null);
    const positionsWinner = waysFiltered.find(way => {
      let times = 0;
      currentBoard.forEach(pos => {
        if (way.includes(pos)) times += 1;
      });
      return times === 3;
    });
    if (positionsWinner) {
      console.log(`El jugador ${!this.player1Turn ? '1' : '2'} - ${turn} ha ganado`);
      positionsWinner.forEach(position => {
        const cell = this.ticTacTocBoard.querySelector(`.tic-tac-toe__cell[data-position="${position}"]`);
        cell.classList.add('cell__winner');
      });
      return;
    }
    if (this.board.filter(item => item !== null).length === 9) {
      console.log('empate');
      this.restart();
    }
  },

  restart () {
    this.ticTacTocBoard.querySelectorAll('.tic-tac-toe__cell').forEach(cell => {
      cell.innerHTML = '';
    });
    this.board = Array(9).fill(null);
  }

};
