const WAYS_TO_WIN = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]];

export function TicTacToe () {
  this.board = Array(9).fill(null);
  this.ticTacTocBoard = document.createElement('div');
  this.ticTacTocBoard.classList.add('tic-tac-toe__board');
  this.playerIndicator = document.querySelector('.player');
  this.player1Turn = Boolean(Math.floor(Math.random() * 2));
}

TicTacToe.prototype = {
  constructor: TicTacToe,

  renderBoard (app) {
    this.ticTacTocBoard.innerHTML = `
      ${this.genCells(this.board.length)}
    `;
    app.appendChild(this.ticTacTocBoard);
    this.renderTurn();
    this.ticTacTocBoard.addEventListener('click', (e) => this.movement(e));
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
    this.playerIndicator.textContent = `Player Turn ${this.player1Turn ? '1' : '2'}`;
  },

  movement (e) {
    if (!(e.target.classList.contains('tic-tac-toe__cell'))) return;
    console.log(this.player1Turn);
    const cell = e.target;
    const turn = this.player1Turn ? 'cross' : 'circle';

    const position = +cell.dataset.position;
    cell.innerHTML = this.attempt(turn);
    this.board[position] = turn;
    this.player1Turn = !this.player1Turn;
    this.renderTurn();
    if (this.board.filter(item => item !== null).length > 4) {
      this.checkMove(turn, cell.dataset.position);
    }
  },

  attempt (turn) {
    return `
      <img src="./images/${turn}.svg" class="tic-tac-toe__image" alt="${turn} for tic tac toe">
    `;
  },

  checkMove (turn, pos) {
    const waysFiltered = WAYS_TO_WIN.filter(element => element.includes(+pos));
    const currentBoard = this.board.map((cell, index) => cell === turn ? index : null).filter(item => item !== null);
    const isWin = waysFiltered.some(way => {
      let times = 0;
      currentBoard.forEach(pos => {
        if (way.includes(pos)) times += 1;
      });
      return times === 3;
    });
    if (isWin) {
      console.log('El jugador ha ganado');
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
