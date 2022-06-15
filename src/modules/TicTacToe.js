const WAYS_TO_WIN = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]];

function isRequiered (param) {
  throw new Error('You must pass the ' + param + ' parameter');
}

export function TicTacToe ({ mode = isRequiered('mode') } = {}) {
  this.mode = mode;
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
    if (this.mode === 'single' && !this.player1Turn) this.pcMovement();
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
    if (this.mode === 'single') this.pcMovement();
  },

  pcMovement () {
    // get the info positions
    const rivalPositions = this.board.flatMap((item, index) => item !== 'cross' ? [] : index);
    const availablePositions = this.board.flatMap((item, index) => item !== null ? [] : index);
    const myPositions = this.board.flatMap((item, index) => item !== 'circle' ? [] : index);
    // try the next pc's move
    const pcNextPosition = this.getNextPcPositionMove(availablePositions, rivalPositions, myPositions);

    // get the cell from the dom and make the move
    const cell = this.ticTacTocBoard.querySelector(`.tic-tac-toe__cell[data-position="${pcNextPosition}"]`);
    setTimeout(() => {
      this.makeMove(cell, pcNextPosition);
    }, 1000);
  },

  getNextPcPositionMove (availablePositions, enemyPositions, myPositions) {
    const detectedWaysToLose = this.getWaysToMove(enemyPositions);
    const detectedWaysToWin = this.getWaysToMove(myPositions);
    console.log(detectedWaysToLose);
    console.log(detectedWaysToWin);
    const optionsToBlock = [...new Set(detectedWaysToLose.flat())].filter(pos => availablePositions.includes(pos));
    const optionsToWin = [...new Set(detectedWaysToWin.flat())].filter(pos => availablePositions.includes(pos));
    console.log({ optionsToWin, optionsToBlock });
    return optionsToWin[0] ?? optionsToBlock[0] ?? availablePositions[Math.floor(Math.random() * availablePositions.length)];
  },

  getWaysToMove (positions) {
    const detectedWays = WAYS_TO_WIN.filter(way => {
      let times = 0;
      for (const number of way) {
        if (positions.includes(number)) times += 1;
      }
      return times >= 2;
    });
    return detectedWays;
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
    const isWin = waysFiltered.some(way => {
      let times = 0;
      currentBoard.forEach(pos => {
        if (way.includes(pos)) times += 1;
      });
      return times === 3;
    });
    if (isWin) {
      console.log(`El jugador ${!this.player1Turn ? '1' : '2'} - ${turn} ha ganado`);
      this.restart();
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
