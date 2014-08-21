var SortedList = require('./sorted-linked-list.js');

var IT = function() {
  this.constructor({compare: function(a,b) {
    //TODO -5 should be variable
    return Math.round10(a.y,-5) - Math.round10(b.y,-5);
  }});
};
IT.prototype = new SortedList();
IT.prototype.getHead = function() {
  return this.head;
};
IT.prototype.getHeadData = function() {
  return this.head.datum.headData();
};
IT.prototype.getData = function(intersection) {
  return intersection.datum;
};
module.exports = IT;
