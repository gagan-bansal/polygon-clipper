var SortedList = require('./sorted-linked-list.js');
// ST is sorted list of bounds along x axis for xTop of current segment.
// in ST each node data is instance of Bound (FastList) i.e. linked list of 
// polygon segments sorted bottom to top  
// edge = this.head.datum._head

var ST = function() {
  this.constructor({compare: function(a,b){
    //return a._head.data.xTop - b._head.data.xTop;  
    //TODO need to check for horizontal and vertical lines
    if (Math.round10(a._head.data.xTop,-5) ===
      Math.round10(b._head.data.xTop,-5)) {
      var xTop = a._head.data.xTop;
      var segA = a._head.data.segment;
      var segB = b._head.data.segment;
      if (Math.round10(Math.abs(segA.start.x - segB.start.x),-5) ===
          Math.round10(
            Math.abs(segB.start.x - xTop) + Math.abs(xTop - segA.start.x)
            ,-5)) 
      {
        // i.e. one end on left and another on right of xTop
        return segA.start.x - segB.start.x;
      //} else if (segA.start.x > xTop && segB.start.x > xTop) {
      //  return 1.0/b._head.data.deltaX - 1.0/a._head.data.deltaX;
      } else {
        // both end are either side of xTop
        return 1.0/a._head.data.deltaX - 1.0/b._head.data.deltaX;
      }
    } else {
      return a._head.data.xTop - b._head.data.xTop;
    }
  }});
};

ST.prototype = new SortedList();
ST.prototype.getHead = function() {
  return this.head;
};
ST.prototype.getHeadData = function() {
  return this.head.datum.getHeadData();
};
ST.prototype.getData = function(edge) {
  return edge.datum.getHeadData();
};
ST.prototype.getBound = function(edge) {
  return edge.datum;
};

module.exports = ST;
