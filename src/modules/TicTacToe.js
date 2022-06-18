import { WAYS_TO_WIN } from '../data.js';
import PC from './PC.js';
import Score from './Score.js';
import Player from './Player.js';

function isRequiered (param) {
  throw new Error('You must pass the ' + param + ' parameter');
}

const MODES = {
  multiplayer: {
    players: [
      new Player(
        {
          numPlayer: 1,
          label: 'Player1',
          shape: 'cross',
          color: '#B69EFF'
        }),
      new Player(
        {
          numPlayer: 2,
          label: 'Player2',
          shape: 'circle',
          color: '#FFD803'
        })
    ]
  },

  single: {
    players: [
      new Player(
        {
          numPlayer: 1,
          label: 'Player',
          shape: 'cross',
          color: '#B69EFF'
        }),
      new Player(
        {
          numPlayer: 2,
          label: 'PC',
          shape: 'circle',
          color: '#FFD803'
        })
    ]
  }
};

export function TicTacToe ({ mode = isRequiered('mode') } = {}) {
  this.mode = mode;
  this.players = MODES[mode].players;
  if (this.mode === 'single') {
    this.pc = new PC();
  }
  this.scoreBoard = new Score({ rounds: 3, players: this.players, callbackReset: this.restart.bind(this), callbackResetGame: this.restartGame.bind(this) });
  console.log(this.scoreBoard);
  this.board = Array(9).fill(null);
  this.ticTacTocBoard = document.createElement('div');
  this.ticTacTocBoard.classList.add('tic-tac-toe__board');
  this.playerIndicator = document.querySelector('.player');
  this.player1Turn = Boolean(Math.floor(Math.random() * 2));
  this.isRoundOver = false;
}

TicTacToe.prototype = {
  constructor: TicTacToe,

  renderGame (app) {
    this.ticTacTocBoard.innerHTML = `
      ${this.genCells(this.board.length)}
    `;
    app.appendChild(this.ticTacTocBoard);
    this.renderTurn();
    const scoreBoard = this.scoreBoard.generateScoreBoard();
    app.appendChild(scoreBoard);
    this.ticTacTocBoard.addEventListener('click', (e) => this.movement(e));
    app.querySelector('.tic-toc-toe__restart-wrapper').addEventListener('click', () => this.restartGame());
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
    this.playerIndicator.textContent = ` ${this.player1Turn ? this.players[0].label : this.players[1].label} - ${shape} turns`;
  },

  getTurn () {
    return this.player1Turn ? this.players[0].shape : this.players[1].shape;
  },

  movement (e) {
    const conditionTarget = !(e.target.classList.contains('tic-tac-toe__cell'));
    const conditionModePlayer = (this.mode === 'single' && this.player1Turn === false);
    if (conditionTarget || conditionModePlayer) return;

    const cell = e.target;
    const position = +cell.dataset.position;
    this.makeMove(cell, position);

    // PC's move
    if (this.mode === 'single' && !this.isRoundOver) this.pc.movement(this.board, this.makeMove.bind(this));
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

    // if there is a winner
    if (positionsWinner) {
      this.isRoundOver = true;
      const numPlayer = this.player1Turn ? this.players[0].numPlayer : this.players[1].numPlayer;
      this.scoreBoard.evaluateWinner({ numPlayer });
      positionsWinner.forEach(position => {
        const cell = this.ticTacTocBoard.querySelector(`.tic-tac-toe__cell[data-position="${position}"]`);
        cell.classList.add('cell__winner');
      });
      // setTimeout(() => {
      //   this.restart();
      // }, 1000);
      return;
    }

    // if there is a draw
    if (this.board.every(item => item !== null)) {
      console.log('empate');
      this.isRoundOver = true;
      this.scoreBoard.announceResult();
      // setTimeout(() => {
      //   this.restart();
      // }, 1000);
    }
  },

  restart () {
    this.ticTacTocBoard.querySelectorAll('.tic-tac-toe__cell').forEach(cell => {
      cell.innerHTML = '';
      cell.classList.remove('cell__winner');
    });
    this.board = Array(9).fill(null);
    this.isRoundOver = false;
    if (this.mode === 'single' && !this.player1Turn) this.pc.movement(this.board, this.makeMove.bind(this));
  },

  restartGame () {
    this.restart();
    this.players.forEach(player => {
      player.resetScore();
    });
    this.scoreBoard.resetScoreBoard();
  }
};
