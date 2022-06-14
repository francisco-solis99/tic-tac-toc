import { TicTacToe } from './modules/TicTacToe';

const app = document.getElementById('app');
// create the structure and the html elements 🟩

const ticTacToeGame = new TicTacToe();
ticTacToeGame.renderBoard(app);
