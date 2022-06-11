const app = document.getElementById('app');
// create the structure and the html elements 🟩
const ticTacTocBoard = document.createElement('div');
ticTacTocBoard.classList.add('tic-tac-toe__board');
const CELLS = 9;
const board = Array(CELLS).fill(null);
let player1Turn = true;

const cell = posNumCell => {
  return `
    <div class="tic-tac-toe__cell" data-position="${posNumCell}">
    </div>
  `;
};

const genCells = (numCells = 9) => {
  const cells = [];
  for (let i = 0; i < numCells; i += 1) cells.push(cell(i));
  return cells.join('');
};

ticTacTocBoard.innerHTML = `
  ${genCells(CELLS)}
`;

// render the cells
app.appendChild(ticTacTocBoard);

// begin the game 🟩

const attempt = (turn) => {
  return `
    <img src="./images/${turn}.svg" class="tic-tac-toe__image" alt="${turn} for tic tac toe">
  `;
};

ticTacTocBoard.addEventListener('click', (e) => {
  if (!(e.target.classList.contains('tic-tac-toe__cell'))) return;

  const cell = e.target;
  const turn = player1Turn ? 'cross' : 'circle';
  const position = +cell.dataset.position;
  cell.innerHTML = attempt(turn);
  board[position] = turn;
  player1Turn = !player1Turn;
  if (board.filter(item => item !== null).length > 4) {
    checkMove(turn, cell.dataset.position);
  }
});

function checkMove (turn, pos) {
  const WAYS_TO_WIN = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];
  const waysFiltered = WAYS_TO_WIN.filter(element => element.includes(+pos));
  const currentBoard = board.map((cell, index) => cell === turn ? index : null).filter(item => item !== null);
  const isWin = waysFiltered.some(way => {
    let times = 0;
    currentBoard.forEach(pos => {
      if (way.includes(pos)) times += 1;
    });
    return times === 3;
  });
  if (isWin) {
    console.log('El jugador ha ganado');
  }
}
