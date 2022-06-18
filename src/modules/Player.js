
export default function Player ({ numPlayer, label, shape, color }) {
  this.numPlayer = numPlayer;
  this.label = label;
  this.shape = shape;
  this.color = color;
  const noPublic = {
    _score: 0
  };
  Object.defineProperty(this, 'score', {
    get: () => noPublic._score,
    set: (newVal) => {
      if (typeof newVal === 'number') {
        noPublic._score = newVal;
        return;
      }
      console.warn('Your value to assign to score must be a number');
    }
  });
}

Player.prototype = {
  constructor: Player,
  incrementScore () {
    this.score += 1;
  },

  resetScore () {
    this.score = 0;
  }
};
