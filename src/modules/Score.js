
// the score is going to be a private property
// using RORO pattern
import Player from './Player.js';
export default function Score ({ rounds = 3, players = [], callbackReset, callbackResetGame }) {
  const noPublic = {
    _round: 0,
    _players: players
  };
  Object.defineProperties(Score.prototype, {
    round: {
      get: () => noPublic._round,
      set: (newVal) => {
        if (typeof newVal === 'number') {
          noPublic._round = newVal;
          return;
        }
        console.warn('Your value to assign to score must be a number');
      }
    },
    players: {
      get: () => noPublic._players,
      set: (newPlayers) => {
        if (Array.isArray(newPlayers) && newPlayers.every(player => player instanceof Player)) {
          noPublic._players = newPlayers;
          return;
        }
        console.warn('The new value to set is not an array of Player');
      }
    }
  });
  this.rounds = rounds;
  this.dialogModal = document.querySelector('.dialog');
  this.scoreBoard = document.createElement('section');
  this.scoreBoard.classList.add('tic-tac-toe__score');
  this.closeBtn = document.querySelector('.dialog__btn');
  this.closeBtn.addEventListener('click', () => this.closeModal(callbackReset, callbackResetGame));
}

Score.prototype = {
  constructor: Score,
  generateScoreBoard () {
    const playersIndicators = this.players.map(player => `
      <p class="tic-tac-toe__scorePlayer" data-numPlayer=${player.numPlayer}> ${player.label} - ${player.score}</p>
    `);
    this.scoreBoard.innerHTML = `
      <div class="tic-tac-toe__score-board">
        <p class="tic-tac-toe__rounds">Round ${this.round} of  ${this.rounds}</p>
        <div class="tic-tac-toe__actions">
          ${playersIndicators.join('')}
          <figure class="tic-toc-toe__restart-wrapper" title="Restart the game">
            <img src="../images/reset.svg" alt="Restart Game" class="tic-toc-toe__restart-image">
          </figure>
        </div>
      </div>
    `;
    return this.scoreBoard;
  },

  getPlayer (numPlayer) {
    return this.players.findIndex(player => player.numPlayer === numPlayer);
  },

  updateScoreBoard (player) {
    console.log(player);
    const playerWinner = this.scoreBoard.querySelector(`.tic-tac-toe__scorePlayer:nth-child(${player.numPlayer})`);
    const roundText = this.scoreBoard.querySelector('.tic-tac-toe__rounds');
    roundText.textContent = `Round ${this.round} of  ${this.rounds}`;
    playerWinner.textContent = `${player.label} - ${player.score}`;
  },

  incrementRound () {
    this.round += 1;
  },

  resetScoreBoard () {
    this.round = 0;
    this.scoreBoard.querySelectorAll('.tic-tac-toe__scorePlayer').forEach((player, index) => {
      player.textContent = ` ${this.players[index].label} - ${this.players[index].score}`;
    });
    this.scoreBoard.querySelector('.tic-tac-toe__rounds').textContent = `Round ${this.round} of  ${this.rounds}`;
  },

  evaluateWinner ({ numPlayer }) {
    const playerIndex = this.getPlayer(numPlayer);
    if (playerIndex === -1) console.warn('Player not found');
    this.players[playerIndex].incrementScore();
    this.incrementRound();
    this.updateScoreBoard(this.players[playerIndex]);
    this.announceResult(this.players[playerIndex].label);
  },

  announceResult (namePlayer) {
    const modalMessage = this.dialogModal.querySelector('.dialog__message');
    setTimeout(() => {
      this.dialogModal.showModal();
      if (this.round === this.rounds) {
        const messages = {
          player1: `${this.players[0].label} wins!, close to restart the game`,
          player2: `${this.players[1].label} wins!, close to restart the game`,
          tie: 'No one win, it\'s a tie!, close to restart the game'
        };
        const propMessage = this.players[0].score > this.players[1].score ? 'player1' : this.players[0].score < this.players[1].score ? 'player2' : 'tie';
        modalMessage.textContent = messages[propMessage];
        return;
      }
      modalMessage.textContent = namePlayer ? `${namePlayer} wins the round ${this.round}` : 'It\'s a tie';
    }, 1000);
  },

  closeModal (callbackResetRound, callbackResetGame) {
    this.dialogModal.close();
    console.log(this.round === this.rounds);
    this.round === this.rounds ? callbackResetGame() : callbackResetRound();
  }
};
