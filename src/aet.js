var SortedList = require('./sorted-linked-list.js');
// AET is sorted list of bounds along x axis for xBot of current segment.
// in AET each node data is bound linked list instance of FastList 
// edge = this.head.datum._head

var AET = function(options) {
  var precision = options && options.precistion ? options.precision : -5;
  this.constructor({compare: function(a,b){
    //TODO need to check for horizontal and vertical lines
    //TODO apply precision in ST compare function
    if (Math.round10(a._head.data.xBot,precision) ===
      Math.round10(b._head.data.xBot,precision)) {
      var xBot = a._head.data.xBot;
      var segA = a._head.data.segment;
      var segB = b._head.data.segment;
      var d1 = Math.round10(Math.abs(segA.end.x - segB.end.x),precision);
      var d2 = Math.round10(
        Math.abs(segB.end.x - xBot) + Math.abs(xBot - segA.end.x)
        , precision);
      if ( d1 === d2) {
        // i.e. one edn on left and another on right of xBot
        return segA.end.x - segB.end.x;
      //} else if (segA.end.x > xBot && segB.end.x > xBot) {
      //  return 1.0/b._head.data.deltaX - 1.0/a._head.data.deltaX;
      } else {
        // both end are either side of xbot
        return 1.0/b._head.data.deltaX - 1.0/a._head.data.deltaX;
      }
    } else {
      return a._head.data.xBot - b._head.data.xBot;
    }
  }});
};

AET.prototype = new SortedList();
AET.prototype.getHead = function() {
  return this.head;
};
AET.prototype.getHeadData = function() {
  return this.head.datum.getHeadData();
};
AET.prototype.getData = function(edge) {
  return edge.datum.getHeadData();
};
AET.prototype.getBound = function(edge) {
  return edge.datum;
};
AET.prototype.isContributing = function(bound) {
  //check if edge is contributing by even/odd rule
  var leftCount = this.lowerBound(bound)
    .filter(function(bound) {
      return bound.getHeadData().type === this[0];
    },[opposite(bound.getHeadData().type)]);
  return leftCount.length % 2 !== 0;
};
AET.prototype.getSide = function(bound) {
  var leftCount = this.lowerBound(bound)
    .filter(function(bound) {
      return bound.getHeadData().type === this[0];
    },[bound.getHeadData().type]);
    return leftCount.length % 2 == 0 ? 'left' : 'right';
};

AET.prototype.succ = function(edge) {
  var bound = edge.datum;
  //this.remove(bound);
  bound.shift();
  //return this.insert(bound);
  return edge;
};

AET.prototype.swap = function(bound1,bound2) {
  //considering bound1 and bound2 are consicutive and boound2 would never be head 
  // consider oreder a,b,c,d and replacing b,c will result a,c,b,d
  var b = this.find(bound1);
  var c = this.find(bound2);
  if (b == this.head && c == this.tail) {
    this.tail = b;
    this.head = c;
    return this;      
  } else if (b == this.head) {
    this.head = c;
  } else if (c == this.tail) {
    this.tail = b;
  }
  var a = b.prev;
  var d = c.next;

  b.prev = c;
  b.next = d;
  d.prev = b;

  c.next = b;
  c.prev = a;
  a.next = c;
  return this;
};
AET.prototype.insertAfter = function(a, b) {
  if (b === this.tail) {
    a.next = this.head;
    this.tail = a;
    this.head.prev = this.tail;
  } else {
    a.next = b.next;
    b.next.prev = a;
  }
  a.prev = b;
  return b.next = a;
};

function opposite(type) {
  return type === 'subject' ? 'clip' : 'subject';
}
module.exports = AET;
