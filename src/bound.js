var FastList = require('fast-list');

// bound(left/right) is linked list of polygon semgents. Polygon segments are
// pushed from local minima to maxima in bound's linked-list. So head of bound
// (linked list) is always at lowermost segment while we keep on removing 
// (shifing) the items in linked list during the scaning from bottom to top.

var Bound = function() {};
Bound.prototype = new FastList();

Bound.prototype.getHeadData = function() {
  return this._head.data;
};
Bound.prototype.getHead = function() {
  return this._head;
};

module.exports = Bound;

