
export function Player ({ numpLayer, label, shape, color }) {
  this.numpLayer = numpLayer;
  this.label = label;
  this.shape = shape;
  this.color = color;
}

Player.prototype = {
  constructor: Player

};
