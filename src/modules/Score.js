
// the score is going to be a private property
// using RORO pattern
export default function Score ({ rounds, player1 = 'Player1', player2 = 'Player2' }) {
  const noPublic = {
    _round: 0,
    _player1: {
      score: 0,
      label: player1
    },
    _player2: {
      score: 0,
      label: player2
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
    scorePlayer1: {
      get: () => noPublic._player1.score,
      set: (newVal) => {
        if (typeof newVal === 'number') {
          noPublic._player1.score = newVal;
          return;
        }
        console.warn('Your value to assign to score must be a number');
      }
    },
    scorePlayer2: {
      get: () => noPublic._player2.score,
      set: (newVal) => {
        if (typeof newVal === 'number') {
          noPublic._player2.score = newVal;
          return;
        }
        console.warn('Your value to assign to score must be a number');
      }
    },

    labelPlayer1: {
      get: () => noPublic._player1.label
    },

    labelPlayer2: {
      get: () => noPublic._player2.label
    }
  });
  this.rounds = rounds;
  this.scoreBoard = document.createElement('section');
  this.scoreBoard.classList.add('tic-tac-toe__score');
}

Score.prototype = {
  constructor: Score,

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

  incrementRound () {
    this.round += 1;
  },

  incrementScore ({ numplayer }) {
    (numplayer === 1) ? this.scorePlayer1 += 1 : this.scorePlayer2 += 1;
  }
};
