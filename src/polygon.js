var Polygon = function(id) {
  this.id = id;
  this.left = [];
  this.right = [];
  this.isHole = false;
  this.holeIds = [];
};

// assuming always append edge1 polygon to edge2 and 'this' is edge2 polygon 
// 'side' is side of edge1 
Polygon.prototype.appendPolygon = function(polygon,side) {
  if (side === 'right' ) {
    var left = this.left
      .concat(polygon.right.reverse().slice(0,polygon.right.length - 1))
      .concat(polygon.left);
    this.left = left;
  } else { 
    var right = this.right
      .concat(polygon.left.reverse().slice(0,polygon.left.length - 1))
      .concat(polygon.right);
    this.right = right;
  }
  polygon.left = null;
  polygon.right = null;
  return this;
};

Polygon.prototype.addLeft = function(point) {
  this.left.push(point);
  return this;
};
Polygon.prototype.addRight = function(point) {
  this.right.push(point);
  return this;
};
Polygon.prototype.extend = function(polygon) {
  //this.id = polygon.id;
  this.left = polygon.left;
  this.right = polygon.right;
  return this;
};

Polygon.prototype.isEqual = function(polygon) {
  //return this.id === polygon.id;
  return this.left === polygon.left && this.right === polygon.right;
};
Polygon.prototype.getCoordinates = function() {
  return this.right.concat(this.left.reverse())
    .map(function(pt) {
      return [pt.x, pt.y];
    });
};
module.exports = Polygon;
