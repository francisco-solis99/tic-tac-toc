const app = document.getElementById('app');

// create the structure and the html elements 🟩
const ticTacTocBoard = document.createElement('div');
ticTacTocBoard.classList.add('tic-tac-toe__board');
const CELLS = 9;
// const board = Array(CELLS).fill(0);
// console.log(board);

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

const attempt = () => {
  return `
    <img src="./images/cross.svg" alt="cross for tic tac toe">
  `;
};

ticTacTocBoard.addEventListener('click', (e) => {

});
