
// the score is going to be a private property
// using RORO pattern
export default function Score ({ rounds, player1 = {}, player2 = {} }) {
  const noPublic = {
    _round: 0,
    _player1: {
      score: 0,
      ...player1
    },
    _player2: {
      score: 0,
      ...player2
    }
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
    player1: {
      get: () => noPublic._player1,
      set: (prop, newVal) => {
        // validate prop
        console.log(this);
        noPublic._player1[prop] = newVal;
      }
    },
    player2: {
      get: () => noPublic._player2,
      set: (prop, newVal) => {
        // validate prop
        noPublic._player2[prop] = newVal;
      }
    }
  });
  this.rounds = rounds;
  this.scoreBoard = document.createElement('section');
  this.scoreBoard.classList.add('tic-tac-toe__score');
}

Score.prototype = {
  constructor: Score,
  sayHI () {
    console.log('Hello 😀');
  },
  generateScoreBoard () {
    this.scoreBoard.innerHTML = `
      <div class="tic-tac-toe__score-board">
        <p class="tic-tac-toe__rounds">Round ${this.round} of  ${this.rounds}</p>
        <div class="tic-tac-toe__actions">
          <p class="tic-tac-toe__scorePlayer"> ${this.labelPlayer1} - ${this.scorePlayer1}</p>
          <p class="tic-tac-toe__scorePlayer"> ${this.labelPlayer2} - ${this.scorePlayer2}</p>
          <figure class="tic-toc-toe__restart-wrapper">
            <img src="../images/reset.svg" alt="Restart Game" class="tic-toc-toe__restart-image">
          </figure>
        </div>
      </div>
    `;
    return this.scoreBoard;
  },

  updateScoreBoard (num) {
    const playerWinner = this.scoreBoard.querySelector(`.tic-tac-toe__scorePlayer:nth-child(${num})`);
    const roundText = this.scoreBoard.querySelector('.tic-tac-toe__rounds');
    roundText.textContent = `Round ${this.round} of  ${this.rounds}`;
    playerWinner.textContent = `${this.labelPlayer1} - ${this.scorePlayer1}`;
  },

  incrementRound () {
    this.round += 1;
  },

  incrementScore ({ numPlayer }) {
    this.incrementRound();
    (numPlayer === 1) ? this.scorePlayer1 += 1 : this.scorePlayer2 += 1;
    this.updateScoreBoard(numPlayer);
  },

  announceWinner (numPlayer) {

  }
};
