!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.PolygonBoolean=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

var Dequeue = exports = module.exports = function Dequeue() {
  this.head = new Node()
  this.length = 0
}

Dequeue.prototype.push = function(d){
  var n = new Node(d)
  this.head.prepend(n)
  this.length += 1
  return this
}

Dequeue.prototype.unshift = function(d){
  var n = new Node(d)
  this.head.append(n)
  this.length += 1
  return this
}

Dequeue.prototype.pop = function(){
  if (this.head.prev === this.head) return
  var n = this.head.prev.remove()
  this.length -= 1
  return n.data
}

Dequeue.prototype.shift = function(){
  if (this.head.next === this.head) return
  var n = this.head.next.remove()
  this.length -= 1
  return n.data
}

Dequeue.prototype.last = function(){
  if (this.head.prev === this.head) return
  return this.head.prev.data
}

Dequeue.prototype.first = function(){
  if (this.head.next === this.head) return
  return this.head.next.data
}

Dequeue.prototype.empty = function(){
  if (this.length === 0 ) return

  //no node points to head; not necessary for GC, but it makes me feel better.
  this.head.next.prev = null
  this.head.prev.next = null

  //head only points to itself; as a fresh node would
  this.head.next = this.head
  this.head.prev = this.head
  
  this.length = 0

  return
}
function Node(d) {
  this.data = d
  this.next = this
  this.prev = this
}

Node.prototype.append = function(n) {
  n.next = this.next
  n.prev = this
  this.next.prev = n
  this.next = n
  return n
}

Node.prototype.prepend = function(n) {
  n.prev = this.prev
  n.next = this
  this.prev.next = n
  this.prev = n
  return n
}

Node.prototype.remove = function() {
  this.next.prev = this.prev
  this.prev.next = this.next
  return this
}
},{}],2:[function(_dereq_,module,exports){
exports = module.exports = _dereq_("./dequeue")
},{"./dequeue":1}],3:[function(_dereq_,module,exports){
;(function() { // closure for web browsers

function Item (data, prev, next) {
  this.next = next
  if (next) next.prev = this
  this.prev = prev
  if (prev) prev.next = this
  this.data = data
}

function FastList () {
  if (!(this instanceof FastList)) return new FastList
  this._head = null
  this._tail = null
  this.length = 0
}

FastList.prototype =
{ push: function (data) {
    this._tail = new Item(data, this._tail, null)
    if (!this._head) this._head = this._tail
    this.length ++
  }

, pop: function () {
    if (this.length === 0) return undefined
    var t = this._tail
    this._tail = t.prev
    if (t.prev) {
      t.prev = this._tail.next = null
    }
    this.length --
    if (this.length === 1) this._head = this._tail
    else if (this.length === 0) this._head = this._tail = null
    return t.data
  }

, unshift: function (data) {
    this._head = new Item(data, null, this._head)
    if (!this._tail) this._tail = this._head
    this.length ++
  }

, shift: function () {
    if (this.length === 0) return undefined
    var h = this._head
    this._head = h.next
    if (h.next) {
      h.next = this._head.prev = null
    }
    this.length --
    if (this.length === 1) this._tail = this._head
    else if (this.length === 0) this._head = this._tail = null
    return h.data
  }

, item: function (n) {
    if (n < 0) n = this.length + n
    var h = this._head
    while (n-- > 0 && h) h = h.next
    return h ? h.data : undefined
  }

, slice: function (n, m) {
    if (!n) n = 0
    if (!m) m = this.length
    if (m < 0) m = this.length + m
    if (n < 0) n = this.length + n

    if (m === n) {
      return []
    }

    if (m < n) {
      throw new Error("invalid offset: "+n+","+m+" (length="+this.length+")")
    }

    var len = m - n
      , ret = new Array(len)
      , i = 0
      , h = this._head
    while (n-- > 0 && h) h = h.next
    while (i < len && h) {
      ret[i++] = h.data
      h = h.next
    }
    return ret
  }

, drop: function () {
    FastList.call(this)
  }

, forEach: function (fn, thisp) {
    var p = this._head
      , i = 0
      , len = this.length
    while (i < len && p) {
      fn.call(thisp || this, p.data, i, this)
      p = p.next
      i ++
    }
  }

, map: function (fn, thisp) {
    var n = new FastList()
    this.forEach(function (v, i, me) {
      n.push(fn.call(thisp || me, v, i, me))
    })
    return n
  }

, filter: function (fn, thisp) {
    var n = new FastList()
    this.forEach(function (v, i, me) {
      if (fn.call(thisp || me, v, i, me)) n.push(v)
    })
    return n
  }

, reduce: function (fn, val, thisp) {
    var i = 0
      , p = this._head
      , len = this.length
    if (!val) {
      i = 1
      val = p && p.data
      p = p && p.next
    }
    while (i < len && p) {
      val = fn.call(thisp || this, val, p.data, this)
      i ++
      p = p.next
    }
    return val
  }
}

if ("undefined" !== typeof(exports)) module.exports = FastList
else if ("function" === typeof(define) && define.amd) {
  define("FastList", function() { return FastList })
} else (function () { return this })().FastList = FastList

})()

},{}],4:[function(_dereq_,module,exports){
var intersection = function() {
    var vector = {};
    vector.oA = function(segment) {
        return segment.start;
    };
    vector.AB = function(segment) {
        var start = segment.start;
        var end = segment.end;
        return {x:end.x - start.x, y: end.y - start.y};
    };
    vector.add = function(v1,v2) {
        return {x: v1.x + v2.x, y: v1.y + v2.y};
    }
    vector.sub = function(v1,v2) {
        return {x:v1.x - v2.x, y: v1.y - v2.y};
    }
    vector.scalarMult = function(s, v) {
        return {x: s * v.x, y: s * v.y};
    }
    vector.crossProduct = function(v1,v2) {
        return (v1.x * v2.y) - (v2.x * v1.y);
    };
    var self = {};
    self.vector = function(segment) {
        return vector.AB(segment);
    };
    self.intersectSegments = function(a,b) {
        // turn a = p + t*r where 0<=t<=1 (parameter)
        // b = q + u*s where 0<=u<=1 (parameter) 
        var p = vector.oA(a);
        var r = vector.AB(a);

        var q = vector.oA(b);
        var s = vector.AB(b);
    
        var cross = vector.crossProduct(r,s); 
        var qmp = vector.sub(q,p);
        var numerator = vector.crossProduct(qmp, s);
        var t = numerator / cross;
        var intersection = vector.add(p,vector.scalarMult(t,r));
        return intersection;
    };
    self.isParallel = function(a,b) {
        // a and b are line segments. 
        // returns true if a and b are parallel (or co-linear)
        var r = vector.AB(a);
        var s = vector.AB(b);
        return (vector.crossProduct(r,s) === 0);
    };
    self.isCollinear = function(a,b) {
        // a and b are line segments. 
        // returns true if a and b are co-linear
        var p = vector.oA(a);
        var r = vector.AB(a);

        var q = vector.oA(b);
        var s = vector.AB(b);
        return (vector.crossProduct(vector.sub(p,q), r) === 0);
    };
    self.safeIntersect = function(a,b) {
        if (self.isParallel(a,b) === false) {
            return self.intersectSegments(a,b);
        } else {
            return false;
        }
    };
    return self;
};
intersection.intersectSegments = intersection().intersectSegments;
intersection.intersect = intersection().safeIntersect;
intersection.isParallel = intersection().isParallel;
intersection.isCollinear = intersection().isCollinear;
intersection.describe = function(a,b) {
    var isCollinear = intersection().isCollinear(a,b);
    var isParallel = intersection().isParallel(a,b);
    var pointOfIntersection = undefined;
    if (isParallel === false) {
        pointOfIntersection = intersection().intersectSegments(a,b);
    }
    return {collinear: isCollinear,parallel: isParallel,intersection:pointOfIntersection};
};
exports = module.exports = intersection;

},{}],5:[function(_dereq_,module,exports){
var SortedList = _dereq_('./sorted-linked-list.js');
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

},{"./sorted-linked-list.js":12}],6:[function(_dereq_,module,exports){
var FastList = _dereq_('fast-list');

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


},{"fast-list":3}],7:[function(_dereq_,module,exports){
var SortedList = _dereq_('./sorted-linked-list.js');

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

},{"./sorted-linked-list.js":12}],8:[function(_dereq_,module,exports){
// local-min-max.js
// input close path i.e. first point and last point are equal
// return array of tags local minima, maxima and intermediate at each point
var Bound = _dereq_('./bound.js');
var List = _dereq_('./sorted-linked-list.js');
function getBounds(path,polygonType) {
  console.log('polygonType: ' + polygonType);
  console.log('path: ' + JSON.stringify(path));  
  var bounds = [],
    partBound = [],
    totalDet = 0,
    bound = [],
    vertex = {},type;
  //vertex.coord = path[0];
  //vertex.type = getNodeType(path[path.length-2],path[0],path[1]);
  //bound.push(vertex);
  //bound.det = getDet(path[0],path[1]);
  bound.det = 0;
  for(var i= 0; i < path.length; i++) {
    if (i < path.length -1 || (i == path.length - 1 && partBound.length == 0)) {
      type = getNodeType(i,path);
      vertex = {x: path[i][0],y: path[i][1], type: type };
      bound.push(vertex);
      bound.det += i=== path.length -1 ? 
        getDet({x:path[i][0], y:path[i][1]}, {x:path[1][0], y:path[1][1]})
        : getDet({x:path[i][0],y:path[i][1]}, {x:path[i+1][0],y:path[i+1][1]});
      if(vertex.type === 'maxima') {
        totalDet += bound.det;
        if(bound[0].type === 'maxima') {
          if (i !== 0) bound.det += getDet(vertex,bound[0]);
          if (bound.length > 1) bounds.push(bound);
        } else {
          partBound = bound;  
        }
        bound = [], bound.det = 0;
        bound.push(vertex);
      } else if (vertex.type === 'minima') {
        bound.minPos = bound.length - 1;
      }
    }
  }
  if (partBound.length > 0) {
    //join with part bound
    var det = bound.det + partBound.det 
      + getDet(partBound[partBound.length-1],bound[0]);
    var minPos = bound.minPos ? bound.minPos 
      : partBound.minPos + bound.length; 
    bound = bound.concat(partBound);
    bound.minPos = minPos;
    bound.det = det;
    totalDet += bound.det;
    bounds.push(bound);
  }
  var LML = [],left,right;
  for (var i=0;i< bounds.length; i++) {
    //check orientation(+ve/-ve) of path and bounds convex/concave
    //if (totalDet * bounds[i].det > 0) { //so indiv bound doesn't matter
      // TODO so can use signed area insteade of calculating the totalDet
    if (totalDet > 0) { 
        leftBound = bounds[i].slice(0,bounds[i].minPos+1).reverse();
        rightBound = bounds[i].slice(bounds[i].minPos,bounds[i].length);
    } else {
        rightBound = bounds[i].slice(0,bounds[i].minPos+1).reverse();
        leftBound = bounds[i].slice(bounds[i].minPos,bounds[i].length);
    }
    console.log('lefBound: '+ JSON.stringify(leftBound));
    console.log('righBound: '+ JSON.stringify(rightBound));
    LML.push({
      left: initiateEdges(leftBound,'left',polygonType),
      right: initiateEdges(rightBound,'right',polygonType),
      yBot: leftBound[0].y});   
  }
  return LML; 
}
function sign(val) {
  return val > 0 ? 1 : -1;
}
function getDet(cur,next) {
  //return cur[0]*next[1] - cur[1]*next[0];
  return cur.x * next.y - cur.y * next.x;
}
function getNodeType(ind,path) {
  var prev, cur = path[ind], next; 
  if (ind === 0) {
    prev = path[path.length - 2];
    next = path[ind + 1];
  } else if (ind === path.length - 1) {
    prev = path[ind -1];
    next = path[1]; 
  } else {
    prev = path[ind - 1];
    next = path[ind + 1];
  }
  if(cur[1] > prev[1] && cur[1] > next[1]) {
    return 'maxima';
  } else if(cur[1] < prev[1] && cur[1] < next[1]) {
    return 'minima';
  } else {
    return 'intermediate';
  }
}

function _initiateEdges(points,side,type) {
  var list = new List({compare: function(a,b) {
    return a.segment.start.y - b.segment.start.y; 
  }});
  var edge = {side: side,type: type};
  for(var i=0; i<points.length - 1; i++) {
    edge.segment = { start: points[i], end: points[i+1] };
    edge.xBot = points[i].x;
    edge.yTop = points[i+1].y;
    edge.deltaX = (points[i+1].x - points[i].x)
      / (points[i+1].y - points[i].y);
    list.insert(edge);
  }
  return list;
}

function initiateEdges(points,side,type) {
  //TODO-vatti remove side its assigned based on position in polygon(can check in AET)
  //console.log('bound points: ' + JSON.stringify(points));
  //console.log('bound type: ' + type + ', bound side: ' + side);
  var list = new Bound();
  var edge;
  for(var i=0; i<points.length - 1; i++) {
    edge = {side: side,type: type};
    edge.segment = { start: points[i], end: points[i+1] };
    edge.xBot = points[i].x;
    edge.yTop = points[i+1].y;
    edge.deltaX = (points[i+1].x - points[i].x)
      / (points[i+1].y - points[i].y);
    list.push(edge);
    //console.log('bound edge i: ' + i);
    //console.log('bound edge: ' + JSON.stringify(edge));
  }
  return list;
}
module.exports = getBounds;

},{"./bound.js":6,"./sorted-linked-list.js":12}],9:[function(_dereq_,module,exports){
var Dequeue = _dereq_('dequeue');
var intersection = _dereq_('intersection');
var FastList = _dereq_('fast-list'); 

var getLocalMinimaList = _dereq_('./local-minima-list.js');
var List = _dereq_('./sorted-linked-list.js');
var AETClass = _dereq_('./aet.js');
var STClass = _dereq_('./st.js');
var ITClass = _dereq_('./it.js');
var Polygon = _dereq_('./polygon.js');
//TODO check how to include closure / or one time execution of function
var Precision = _dereq_('./precision.js');
// AET is sorted list of bounds along x axis.
// each data item in AET is bound(left/right) i.e. linked list of polygon semgents
// polygon segments are pushed from local minima to maxima in bound's linked-list
// so head is always at lowermost segment while we keep on removing(shifing) 
// the items in linked list during the scaning from down to top.
// So this way actualy I am able to sort first edge of bound in AET, while also
// have access to next pointer in the bound linked list.
var AET, 
 PT,
 SBT,
 LMT;
function initGlobal() {
  AET = new AETClass();
  PT = [];
  SBT = new List();
  LMT = new List({compare: function(a,b) {
    return a.yBot - b.yBot;
  }});
}
function intersect(poly1,poly2) {
  initGlobal();
  // insert local minima node i.e. object of left and  right bound and yBot
  var updateLMTandSBT = function(node) { 
    LMT.insert(node);
    //TODO finding node in sorted list is expensive
    if (!SBT.find(node.yBot)) SBT.insert(node.yBot);
  };
  getLocalMinimaList(poly1,'subject').forEach(updateLMTandSBT); 
  getLocalMinimaList(poly2,'clip').forEach(updateLMTandSBT);
  var yBot = SBT.pop(),yTop;
  while (SBT.head) {
    while (LMT.head && Math.round10(LMT.head.datum.yBot,-5) ===
      Math.round10(yBot,-5)) {
      addEdgesOfLMT(LMT.pop());
    }
    yTop = SBT.pop();
    console.log('yBot: '+ yBot + ' ,yTop: '+ yTop);
    buildIntersections(yBot,yTop);
    processIntersections();
    processAETedges(yBot,yTop);
    yBot = yTop;
  }
  var output = PT
    .filter(function (poly,i) {
      //remove merged polygon to another polygon 
      return poly.left && poly.right;})
    .map(function (poly) {
      return poly.toCoordinates();
    });
  return output;
}
function extractPolygons(PT) {
  var uniquePT = PT.filter(function(elem, pos, self) {
    var ind=0;
    while ( self[ind].coordinates !== self[pos].coordinates) {
      ind++;
    }
    return ind == pos;
  });
  return uniquePT.map(function(poly) {
    var points= [];
    var cur = poly.coordinates._head;
    while(cur) {
      points.push([cur.data.x, cur.data.y]);
      cur = cur.next;
    }
    points.push([points[0][0], points[0][1]]);
    return points;
  });
}
//NOTE: every where edge means head of bound 
// always insert/attach in AET, ST, intersection point, polygon edge etc
function addEdgesOfLMT(node) {
  //TODO-vatti first insert in AET then addLocalMin if edges are cotributing
  AET.insert(node.left);
  AET.insert(node.right);
  node.left.getHeadData().side = AET.getSide(node.left);
  node.right.getHeadData().side = AET.getSide(node.right);
  // left is not necessary edge1
  if(AET.isContributing(node.left)) {
    addLocalMin(
      node.left.getHeadData().segment.start,
      node.left,
      node.right);
  }
  //TODO finding node in sorted list is expensive
  if (!SBT.find(node.left.getHeadData().yTop)) {
    SBT.insert(node.left.getHeadData().yTop);
  }
  if (!SBT.find(node.right.getHeadData().yTop)) {  
    SBT.insert(node.right.getHeadData().yTop);
  }
}
// each polygon is linked list (not sroted linked list) of left side edges 
// and right side edges.
function addLocalMin(point,edge1,edge2) {
  var isRightRight = AET.getData(AET.tail) === edge2.getHeadData();

  var poly = new Polygon(PT.length,isRightRight);
  poly.addLeft(point);
  poly.addRight(point);
  edge1.getHeadData().polygon = poly;
  edge2.getHeadData().polygon = poly;
  PT.push(poly);
  return poly;
}

function addLocalMax(point,edge1,edge2) {
  if(edge1.getHeadData().side === 'left') {
    addLeft(point,edge1);
  } else {
    addRight(point,edge1);
  }
  var poly1 = edge1.getHeadData().polygon,
    poly2 = edge2.getHeadData().polygon;
   
  if(!poly1.isEqual(poly2)) {
    poly2.appendPolygon(poly1,edge1.getHeadData().side);
    // change ref to edge2->polygon from edge1->polygon for all active edges 
    // that have edge1->polygon
    var curPoly, cur = AET.head;
    do {
      curPoly = AET.getData(cur).polygon;
      if (curPoly && curPoly.id === poly1.id) {
        AET.getData(cur).polygon = poly2;
      }
      cur = cur.next;
    } while (cur !== AET.head);
  }
}

//its not O(log(n)) but O(n)
function removePolygon(poly) {
  var ind = PT.indexOf(poly);
  if(ind > -1) {
    PT.splice(ind,1);
    return true;
  } else {
    return false;
  }
}

function buildIntersections(yBot,yTop) {
  var dY = yTop - yBot;
  ST = new STClass();
  IT = new ITClass(); 
  var intPoint;
  //initiate the first edge in ST
  var AETedge = AET.getHead(); 
  var xTop = AET.getData(AETedge).xBot + AET.getData(AETedge).deltaX * dY;
  AET.getData(AETedge).xTop = xTop;
  AET.getData(AETedge).isProcessed = false; //used in processAETedges
  var STedge = ST.insert(AET.getBound(AETedge)); //return the ref to inserted data

  AETedge = AETedge.next;
  while( AETedge !== AET.head) {
    AET.getData(AETedge).isProcessed = false; //used in processAETedges
    xTop = AET.getData(AETedge).xBot + AET.getData(AETedge).deltaX * dY;
    //check intersections
    //TODO what if xTop == STedge.xTop
    while(Math.round10(xTop,-5) < Math.round10(ST.getData(STedge).xTop,-5)) {
      intPoint = intersection.intersect(ST.getData(STedge).segment,
        AET.getData(AETedge).segment);
      //attaching head of the bound to int point
      intPoint.leftEdge = ST.getBound(STedge); // considering the bottom x
      intPoint.rightEdge = AET.getBound(AETedge);
      IT.insert(intPoint);
      if(STedge === ST.head) break;
      STedge = STedge.prev;
    }
    AET.getData(AETedge).xTop = xTop;
    ST.insert(AET.getBound(AETedge)); //TODO is should be insert before STedge
    STedge= ST.tail;
    AETedge = AETedge.next;
  }
}

function processIntersections() {
  var intPoint = IT.getHead();
  if (intPoint) {
    var intPointType,edge1,edge2, temp, isContributing;
    do {
      edge1 = IT.getData(intPoint).leftEdge;
      edge2 = IT.getData(intPoint).rightEdge;
      intPointType = classifyIntersection(edge1.getHeadData(), edge2.getHeadData());
      if (edge1.getHeadData().type === edge2.getHeadData().type) {
        //&& edge1.getHeadData().side !== edge2.getHeadData().side) {
        // like edges
        // TODO test case need to be checked
        if(AET.isContributing(edge1)) {
          addLeft(IT.getData(intPoint),edge1);
          addRight(IT.getData(intPoint),edge2);
        }
        temp = edge1.getHeadData().side;
        edge1.getHeadData().side = edge2.getHeadData().side;
        edge2.getHeadData().side = temp;
      } else {
        //TODO checking edge polygon is not part fo vatii algo
        if (intPointType === 'maxima' && edge1.getHeadData().polygon 
          && edge2.getHeadData().polygon) {
          addLocalMax(IT.getData(intPoint),edge1,edge2);
        } else if (intPointType === 'left-intermediate' 
          && edge2.getHeadData().polygon) {
          addLeft(IT.getData(intPoint),edge2);
        } else if (intPointType === 'right-intermediate' 
          && edge1.getHeadData().polygon) {
          addRight(IT.getData(intPoint),edge1);
        } else if (intPointType === 'minima') {
          addLocalMin(IT.getData(intPoint),edge1,edge2);
        }
      }
      //Swap edge1 and edge2 positions in the AET;
      //TODO there should be some other way xBot is modified. If there is
      // another intersection on same line it may be problem 
      // TODO it should be swap ONLY
      /*AET.remove(edge1);
      edge1.getHeadData().xBot = edge1.getHeadData().xTop;
      AET.insert(edge1);
      AET.remove(edge2);
      edge2.getHeadData().xBot = edge2.getHeadData().xTop;
      AET.insert(edge2);*/
      AET.swap(edge1,edge2);
      //TODO can be done in if intPointType accordingly 
      //swap polygons
      temp = edge1.getHeadData().polygon;
      edge1.getHeadData().polygon = edge2.getHeadData().polygon;
      edge2.getHeadData().polygon = temp;
      //TODO why not recalculate side of edges
      intPoint = intPoint.next;
    } while (intPoint !== IT.head );
  }
}

function processAETedges(yBot,yTop) {
  var cur = AET.getHead(),
    vertexType,data,isContributing,prev;
  if (cur) {
    do { 
      AET.getData(cur).isProcessed = true;
      isContributing = AET.isContributing(AET.getBound(cur));
      //isContributing = AET.getData(cur).polygon ? true : false;
      //TODO vatti algo doesnt cal isContributing, can we carry forward like
        // side
      if (Math.round10(AET.getData(cur).yTop,-5) === Math.round10(yTop,-5)) {
        vertexType = AET.getData(cur).segment.end.type;
        if (vertexType === 'maxima') {
          if(isContributing) { 
            addLocalMax(AET.getData(cur).segment.end,AET.getBound(cur),
              AET.getBound(cur.next));
            //remove the cur edge and next also (being removed outside if)
            /*prev = cur;
            cur = cur.next;
            AET.remove(prev.datum);*/
          }
          /*prev = cur;
          cur = cur.next;
          AET.remove(prev.datum);*/
          var e1 = cur;
          var e2 = cur.next;
          cur = cur.next.next;
          AET.remove(e1.datum);
          AET.remove(e2.datum);
        } else {
          vertexType = AET.getData(cur).side + '-' + vertexType;
          if (vertexType === 'left-intermediate') {
            if(isContributing) {
              addLeft(AET.getData(cur).segment.end,AET.getBound(cur));
            }
          } else if (vertexType === 'right-intermediate') {
            if(isContributing) {
              addRight(AET.getData(cur).segment.end,AET.getBound(cur));
            }
          }
          data = AET.getData(cur);
          cur = AET.succ(cur); //returns ref to same bound but moved to 
            // upper edge
          AET.getData(cur).side = data.side;
          //AET.getData(cur).isContributing = data.isContributing;
          AET.getData(cur).polygon = data.polygon;
          AET.getData(cur).isProcessed = true; //TODO sort-'circular'-linked-list
            // is creating so many issue in while loop
          //TODO finding node in sorted list is expensive
          if (!SBT.find(AET.getData(cur).yTop)) 
            SBT.insert(AET.getData(cur).yTop);
          cur = cur.next;
        }
      } else {
        AET.getData(cur).xBot = AET.getData(cur).xTop; 
        cur = cur.next;
      }
    //} while (cur !== AET.head && AET.length > 0);
    } while (!AET.getData(cur).isProcessed)
  }
}

function addLeft(point,bound) {
  bound.getHeadData().polygon.addLeft(point);
}
function addRight(point,bound) {
  bound.getHeadData().polygon.addRight(point);
}

function classifyIntersection(edge1,edge2) {
  var rules = { 
    'left-clip-x-left-subject': 'left-intermediate',
    'left-subject-x-left-clip': 'left-intermediate',
    'right-clip-x-right-subject': 'right-intermediate',
    'right-subject-x-right-clip': 'right-intermediate',
    'left-subject-x-right-clip': 'maxima',
    'left-clip-x-right-subject': 'maxima',
    'right-subject-x-left-clip': 'minima',
    'right-clip-x-left-subject': 'minima'
    /*'left-clip-x-right-clip': ['left-intermediate','right-intermediate'],
    'right-clip-x-left-clip': ['left-intermediate','right-intermediate'],
    'left-subject-x-right-subject': ['left-intermediate','right-intermediate'],
    'right-subject-x-left-subject': ['left-intermediate','right-intermediate']*/
  };
  return rules[edge1.side + '-' + edge1.type +'-x-' + edge2.side + '-'+ edge2.type];
}

module.exports = intersect;

//var cur = AET.head; do { console.log(JSON.stringify(AET.getData(cur).segment)); var cur = cur.next;} while (cur !== AET.head);

},{"./aet.js":5,"./it.js":7,"./local-minima-list.js":8,"./polygon.js":10,"./precision.js":11,"./sorted-linked-list.js":12,"./st.js":13,"dequeue":2,"fast-list":3,"intersection":4}],10:[function(_dereq_,module,exports){
var Polygon = function(id,isRightRight) {
  this.id = id;
  this.left = [];
  this.right = [];
  this.isRightRight = isRightRight || true; // false for hole
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
  //polygon.extend(this);
  polygon.left = null;
  polygon.right = null;
  /*this.lastMergedPolygon = polygon;
  var cur = polygon;
  while (cur) {
    cur.extend(this);
    cur = cur.lastMergedPolygon;
  }*/
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
  //this.isRinghtRight = polygon.isRightRight;
  return this;
};

Polygon.prototype.isEqual = function(polygon) {
  //return this.id === polygon.id;
  return this.left === polygon.left && this.right === polygon.right;
};
Polygon.prototype.toCoordinates = function() {
  return this.right.concat(this.left.reverse())
    .map(function(pt) {
      return [pt.x, pt.y];
    });
};
module.exports = Polygon;

},{}],11:[function(_dereq_,module,exports){
//taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
// Closure
(function(){

  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number}      The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }

})();

},{}],12:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.4.0
var Node, SortedCircularDoublyLinkedList;

Node = (function() {

  function Node(datum, prev, next) {
    this.datum = datum;
    this.prev = prev;
    this.next = next;
  }

  return Node;

})();

SortedCircularDoublyLinkedList = (function() {

  function SortedCircularDoublyLinkedList(options) {
    var opt = options || {};
    this.head = opt.head;
    this.tail = opt.tail;
    this.length = 0;
    if( opt.compare) 
      this.compare = opt.compare; 
  }

  SortedCircularDoublyLinkedList.prototype.compare = function(datum1, datum2) {
    return datum1 - datum2;
  };

  SortedCircularDoublyLinkedList.prototype.insertAll = function(list) {
    var x, _i, _len;
    if (list == null) {
      list = [];
    }
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      x = list[_i];
      this.insert(x);
    }
    return this.head;
  };

  SortedCircularDoublyLinkedList.prototype.insert = function(datum) {
    var current, insertAfter, insertBefore, next, node;
    node = new Node(datum);
    insertBefore = function(a, b) {
      if (b === this.head) {
        a.prev = this.tail;
        this.head = a;
        this.tail.next = this.head;
      } else {
        a.prev = b.prev;
        b.prev.next = a;
      }
      a.next = b;
      return b.prev = a;
    };
    insertAfter = function(a, b) {
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
    this.length++; //TODO it should be before return statement
    if (this.head == null) {
      this.head = node;
      this.head.next = node;
      this.head.prev = node;
      this.tail = this.head;
      return node;
    }
    if (this.compare(this.head.datum, node.datum) > 0) {
      insertBefore(node, this.head);
      this.head = node;
    } else {
      current = this.head;
      while (current !== this.tail) {
        next = current.next;
        if (this.compare(next.datum, node.datum) > 0) {
          break;
        }
        current = current.next;
      }
      insertAfter(node, current);
      if (current === this.tail) {
        this.tail = node;
      }
    }
    /*if (this.compare(node.datum, this.head.datum) < 0) {
      this.head = node;
    }
    if (this.compare(node.datum, this.tail.datum) > 0) {
      this.tail = node;
    }*/
    return node;
  };

  SortedCircularDoublyLinkedList.prototype.remove = function(datum) {
    var current;
    current = this.head;
    //TODO can be current.datum !== datum
    //while (this.compare(current.datum, datum) !== 0) {
    while (current.datum !== datum) {
      current = current.next;
      if (current === this.head) {
        break;
      }
    }
    this.length--;
    if(current === this.head && current === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      if (current === this.head) {
        this.head = current.next;
        this.tail.next = this.head;
        this.head.prev = this.tail;
      } else {
        current.prev.next = current.next;
      }
      if (current === this.tail) {
        this.tail = current.prev;
        this.head.prev = this.tail;
        return this.tail.next = this.head;
      } else {
        return current.next.prev = current.prev;
      }
    }
  };

  SortedCircularDoublyLinkedList.prototype.contains = function(datum) {
    return this.find(datum) != null;
  };

  SortedCircularDoublyLinkedList.prototype.find = function(datum) {
    var current;
    if (!this.head) {
      return null;
    } else {
      current = this.head;
      do {
        if (this.compare(current.datum, datum) === 0) {
          return current;
        }
        current = current.next;
      } while (current !== this.head);
      return null;
    }
  };

  SortedCircularDoublyLinkedList.prototype.print = function() {
    var current, output;
    output = "";
    if (!(this.head != null)) {
      return;
    }
    current = this.head;
    output += "" + current.datum;
    while (current.next !== this.head) {
      current = current.next;
      output += ", " + current.datum;
    }
    return output;
  };
  
  SortedCircularDoublyLinkedList.prototype.pop = function() {
    var datum = this.head.datum;
    this.remove(datum);
    return datum;
  };

  SortedCircularDoublyLinkedList.prototype.upperBound = function(datum) {
    var upper = [];
    var cur = this.find(datum);
    if (cur && cur !== this.tail) {
      do {
        upper.push(cur.next.datum);
        cur = cur.next;
      } while (cur !== this.tail);
    }
    return upper;
  };

  SortedCircularDoublyLinkedList.prototype.lowerBound = function(datum) {
    var lower = [];
    var cur = this.find(datum);
    if (cur && cur !== this.head) {
      do {
        lower.push(cur.prev.datum);
        cur = cur.prev;
      } while (cur !== this.head);
    }
    return lower;
  };
  SortedCircularDoublyLinkedList.prototype.lowerCount = function(datum) {
    var count = 0;
    var cur = this.find(datum);
    if (cur && cur !== this.head) {
      do {
        count++;
        cur = cur.prev;
      } while (cur !== this.head);
    }
    return count;
  };

  SortedCircularDoublyLinkedList.prototype.upperCount = function(datum) {
    var count = 0;
    var cur = this.find(datum);
    if (cur && cur !== this.tail) {
      do {
        count++;
        cur = cur.next;
      } while (cur !== this.tail);
    }
    return count;
  };

  return SortedCircularDoublyLinkedList;

})();

module.exports = SortedCircularDoublyLinkedList;

},{}],13:[function(_dereq_,module,exports){
var SortedList = _dereq_('./sorted-linked-list.js');
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

},{"./sorted-linked-list.js":12}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3VidW50dS9wcm9qZWN0cy9wb2x5Z29uLWJvb2xlYW4vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1ib29sZWFuL25vZGVfbW9kdWxlcy9kZXF1ZXVlL2xpYi9kZXF1ZXVlLmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tYm9vbGVhbi9ub2RlX21vZHVsZXMvZGVxdWV1ZS9saWIvaW5kZXguanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1ib29sZWFuL25vZGVfbW9kdWxlcy9mYXN0LWxpc3QvZmFzdC1saXN0LmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tYm9vbGVhbi9ub2RlX21vZHVsZXMvaW50ZXJzZWN0aW9uL2luZGV4LmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tYm9vbGVhbi9zcmMvYWV0LmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tYm9vbGVhbi9zcmMvYm91bmQuanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1ib29sZWFuL3NyYy9pdC5qcyIsIi9ob21lL3VidW50dS9wcm9qZWN0cy9wb2x5Z29uLWJvb2xlYW4vc3JjL2xvY2FsLW1pbmltYS1saXN0LmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tYm9vbGVhbi9zcmMvbWFpbi5qcyIsIi9ob21lL3VidW50dS9wcm9qZWN0cy9wb2x5Z29uLWJvb2xlYW4vc3JjL3BvbHlnb24uanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1ib29sZWFuL3NyYy9wcmVjaXNpb24uanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1ib29sZWFuL3NyYy9zb3J0ZWQtbGlua2VkLWxpc3QuanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1ib29sZWFuL3NyYy9zdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyIERlcXVldWUgPSBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBEZXF1ZXVlKCkge1xuICB0aGlzLmhlYWQgPSBuZXcgTm9kZSgpXG4gIHRoaXMubGVuZ3RoID0gMFxufVxuXG5EZXF1ZXVlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oZCl7XG4gIHZhciBuID0gbmV3IE5vZGUoZClcbiAgdGhpcy5oZWFkLnByZXBlbmQobilcbiAgdGhpcy5sZW5ndGggKz0gMVxuICByZXR1cm4gdGhpc1xufVxuXG5EZXF1ZXVlLnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oZCl7XG4gIHZhciBuID0gbmV3IE5vZGUoZClcbiAgdGhpcy5oZWFkLmFwcGVuZChuKVxuICB0aGlzLmxlbmd0aCArPSAxXG4gIHJldHVybiB0aGlzXG59XG5cbkRlcXVldWUucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCl7XG4gIGlmICh0aGlzLmhlYWQucHJldiA9PT0gdGhpcy5oZWFkKSByZXR1cm5cbiAgdmFyIG4gPSB0aGlzLmhlYWQucHJldi5yZW1vdmUoKVxuICB0aGlzLmxlbmd0aCAtPSAxXG4gIHJldHVybiBuLmRhdGFcbn1cblxuRGVxdWV1ZS5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5oZWFkLm5leHQgPT09IHRoaXMuaGVhZCkgcmV0dXJuXG4gIHZhciBuID0gdGhpcy5oZWFkLm5leHQucmVtb3ZlKClcbiAgdGhpcy5sZW5ndGggLT0gMVxuICByZXR1cm4gbi5kYXRhXG59XG5cbkRlcXVldWUucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5oZWFkLnByZXYgPT09IHRoaXMuaGVhZCkgcmV0dXJuXG4gIHJldHVybiB0aGlzLmhlYWQucHJldi5kYXRhXG59XG5cbkRlcXVldWUucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuaGVhZC5uZXh0ID09PSB0aGlzLmhlYWQpIHJldHVyblxuICByZXR1cm4gdGhpcy5oZWFkLm5leHQuZGF0YVxufVxuXG5EZXF1ZXVlLnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uKCl7XG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCApIHJldHVyblxuXG4gIC8vbm8gbm9kZSBwb2ludHMgdG8gaGVhZDsgbm90IG5lY2Vzc2FyeSBmb3IgR0MsIGJ1dCBpdCBtYWtlcyBtZSBmZWVsIGJldHRlci5cbiAgdGhpcy5oZWFkLm5leHQucHJldiA9IG51bGxcbiAgdGhpcy5oZWFkLnByZXYubmV4dCA9IG51bGxcblxuICAvL2hlYWQgb25seSBwb2ludHMgdG8gaXRzZWxmOyBhcyBhIGZyZXNoIG5vZGUgd291bGRcbiAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWRcbiAgdGhpcy5oZWFkLnByZXYgPSB0aGlzLmhlYWRcbiAgXG4gIHRoaXMubGVuZ3RoID0gMFxuXG4gIHJldHVyblxufVxuZnVuY3Rpb24gTm9kZShkKSB7XG4gIHRoaXMuZGF0YSA9IGRcbiAgdGhpcy5uZXh0ID0gdGhpc1xuICB0aGlzLnByZXYgPSB0aGlzXG59XG5cbk5vZGUucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG4pIHtcbiAgbi5uZXh0ID0gdGhpcy5uZXh0XG4gIG4ucHJldiA9IHRoaXNcbiAgdGhpcy5uZXh0LnByZXYgPSBuXG4gIHRoaXMubmV4dCA9IG5cbiAgcmV0dXJuIG5cbn1cblxuTm9kZS5wcm90b3R5cGUucHJlcGVuZCA9IGZ1bmN0aW9uKG4pIHtcbiAgbi5wcmV2ID0gdGhpcy5wcmV2XG4gIG4ubmV4dCA9IHRoaXNcbiAgdGhpcy5wcmV2Lm5leHQgPSBuXG4gIHRoaXMucHJldiA9IG5cbiAgcmV0dXJuIG5cbn1cblxuTm9kZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubmV4dC5wcmV2ID0gdGhpcy5wcmV2XG4gIHRoaXMucHJldi5uZXh0ID0gdGhpcy5uZXh0XG4gIHJldHVybiB0aGlzXG59IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vZGVxdWV1ZVwiKSIsIjsoZnVuY3Rpb24oKSB7IC8vIGNsb3N1cmUgZm9yIHdlYiBicm93c2Vyc1xuXG5mdW5jdGlvbiBJdGVtIChkYXRhLCBwcmV2LCBuZXh0KSB7XG4gIHRoaXMubmV4dCA9IG5leHRcbiAgaWYgKG5leHQpIG5leHQucHJldiA9IHRoaXNcbiAgdGhpcy5wcmV2ID0gcHJldlxuICBpZiAocHJldikgcHJldi5uZXh0ID0gdGhpc1xuICB0aGlzLmRhdGEgPSBkYXRhXG59XG5cbmZ1bmN0aW9uIEZhc3RMaXN0ICgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEZhc3RMaXN0KSkgcmV0dXJuIG5ldyBGYXN0TGlzdFxuICB0aGlzLl9oZWFkID0gbnVsbFxuICB0aGlzLl90YWlsID0gbnVsbFxuICB0aGlzLmxlbmd0aCA9IDBcbn1cblxuRmFzdExpc3QucHJvdG90eXBlID1cbnsgcHVzaDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLl90YWlsID0gbmV3IEl0ZW0oZGF0YSwgdGhpcy5fdGFpbCwgbnVsbClcbiAgICBpZiAoIXRoaXMuX2hlYWQpIHRoaXMuX2hlYWQgPSB0aGlzLl90YWlsXG4gICAgdGhpcy5sZW5ndGggKytcbiAgfVxuXG4sIHBvcDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHZhciB0ID0gdGhpcy5fdGFpbFxuICAgIHRoaXMuX3RhaWwgPSB0LnByZXZcbiAgICBpZiAodC5wcmV2KSB7XG4gICAgICB0LnByZXYgPSB0aGlzLl90YWlsLm5leHQgPSBudWxsXG4gICAgfVxuICAgIHRoaXMubGVuZ3RoIC0tXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAxKSB0aGlzLl9oZWFkID0gdGhpcy5fdGFpbFxuICAgIGVsc2UgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB0aGlzLl9oZWFkID0gdGhpcy5fdGFpbCA9IG51bGxcbiAgICByZXR1cm4gdC5kYXRhXG4gIH1cblxuLCB1bnNoaWZ0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuX2hlYWQgPSBuZXcgSXRlbShkYXRhLCBudWxsLCB0aGlzLl9oZWFkKVxuICAgIGlmICghdGhpcy5fdGFpbCkgdGhpcy5fdGFpbCA9IHRoaXMuX2hlYWRcbiAgICB0aGlzLmxlbmd0aCArK1xuICB9XG5cbiwgc2hpZnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiB1bmRlZmluZWRcbiAgICB2YXIgaCA9IHRoaXMuX2hlYWRcbiAgICB0aGlzLl9oZWFkID0gaC5uZXh0XG4gICAgaWYgKGgubmV4dCkge1xuICAgICAgaC5uZXh0ID0gdGhpcy5faGVhZC5wcmV2ID0gbnVsbFxuICAgIH1cbiAgICB0aGlzLmxlbmd0aCAtLVxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkgdGhpcy5fdGFpbCA9IHRoaXMuX2hlYWRcbiAgICBlbHNlIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgdGhpcy5faGVhZCA9IHRoaXMuX3RhaWwgPSBudWxsXG4gICAgcmV0dXJuIGguZGF0YVxuICB9XG5cbiwgaXRlbTogZnVuY3Rpb24gKG4pIHtcbiAgICBpZiAobiA8IDApIG4gPSB0aGlzLmxlbmd0aCArIG5cbiAgICB2YXIgaCA9IHRoaXMuX2hlYWRcbiAgICB3aGlsZSAobi0tID4gMCAmJiBoKSBoID0gaC5uZXh0XG4gICAgcmV0dXJuIGggPyBoLmRhdGEgOiB1bmRlZmluZWRcbiAgfVxuXG4sIHNsaWNlOiBmdW5jdGlvbiAobiwgbSkge1xuICAgIGlmICghbikgbiA9IDBcbiAgICBpZiAoIW0pIG0gPSB0aGlzLmxlbmd0aFxuICAgIGlmIChtIDwgMCkgbSA9IHRoaXMubGVuZ3RoICsgbVxuICAgIGlmIChuIDwgMCkgbiA9IHRoaXMubGVuZ3RoICsgblxuXG4gICAgaWYgKG0gPT09IG4pIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGlmIChtIDwgbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBvZmZzZXQ6IFwiK24rXCIsXCIrbStcIiAobGVuZ3RoPVwiK3RoaXMubGVuZ3RoK1wiKVwiKVxuICAgIH1cblxuICAgIHZhciBsZW4gPSBtIC0gblxuICAgICAgLCByZXQgPSBuZXcgQXJyYXkobGVuKVxuICAgICAgLCBpID0gMFxuICAgICAgLCBoID0gdGhpcy5faGVhZFxuICAgIHdoaWxlIChuLS0gPiAwICYmIGgpIGggPSBoLm5leHRcbiAgICB3aGlsZSAoaSA8IGxlbiAmJiBoKSB7XG4gICAgICByZXRbaSsrXSA9IGguZGF0YVxuICAgICAgaCA9IGgubmV4dFxuICAgIH1cbiAgICByZXR1cm4gcmV0XG4gIH1cblxuLCBkcm9wOiBmdW5jdGlvbiAoKSB7XG4gICAgRmFzdExpc3QuY2FsbCh0aGlzKVxuICB9XG5cbiwgZm9yRWFjaDogZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICAgIHZhciBwID0gdGhpcy5faGVhZFxuICAgICAgLCBpID0gMFxuICAgICAgLCBsZW4gPSB0aGlzLmxlbmd0aFxuICAgIHdoaWxlIChpIDwgbGVuICYmIHApIHtcbiAgICAgIGZuLmNhbGwodGhpc3AgfHwgdGhpcywgcC5kYXRhLCBpLCB0aGlzKVxuICAgICAgcCA9IHAubmV4dFxuICAgICAgaSArK1xuICAgIH1cbiAgfVxuXG4sIG1hcDogZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICAgIHZhciBuID0gbmV3IEZhc3RMaXN0KClcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHYsIGksIG1lKSB7XG4gICAgICBuLnB1c2goZm4uY2FsbCh0aGlzcCB8fCBtZSwgdiwgaSwgbWUpKVxuICAgIH0pXG4gICAgcmV0dXJuIG5cbiAgfVxuXG4sIGZpbHRlcjogZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICAgIHZhciBuID0gbmV3IEZhc3RMaXN0KClcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHYsIGksIG1lKSB7XG4gICAgICBpZiAoZm4uY2FsbCh0aGlzcCB8fCBtZSwgdiwgaSwgbWUpKSBuLnB1c2godilcbiAgICB9KVxuICAgIHJldHVybiBuXG4gIH1cblxuLCByZWR1Y2U6IGZ1bmN0aW9uIChmbiwgdmFsLCB0aGlzcCkge1xuICAgIHZhciBpID0gMFxuICAgICAgLCBwID0gdGhpcy5faGVhZFxuICAgICAgLCBsZW4gPSB0aGlzLmxlbmd0aFxuICAgIGlmICghdmFsKSB7XG4gICAgICBpID0gMVxuICAgICAgdmFsID0gcCAmJiBwLmRhdGFcbiAgICAgIHAgPSBwICYmIHAubmV4dFxuICAgIH1cbiAgICB3aGlsZSAoaSA8IGxlbiAmJiBwKSB7XG4gICAgICB2YWwgPSBmbi5jYWxsKHRoaXNwIHx8IHRoaXMsIHZhbCwgcC5kYXRhLCB0aGlzKVxuICAgICAgaSArK1xuICAgICAgcCA9IHAubmV4dFxuICAgIH1cbiAgICByZXR1cm4gdmFsXG4gIH1cbn1cblxuaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZihleHBvcnRzKSkgbW9kdWxlLmV4cG9ydHMgPSBGYXN0TGlzdFxuZWxzZSBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YoZGVmaW5lKSAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShcIkZhc3RMaXN0XCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gRmFzdExpc3QgfSlcbn0gZWxzZSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcyB9KSgpLkZhc3RMaXN0ID0gRmFzdExpc3RcblxufSkoKVxuIiwidmFyIGludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ZWN0b3IgPSB7fTtcbiAgICB2ZWN0b3Iub0EgPSBmdW5jdGlvbihzZWdtZW50KSB7XG4gICAgICAgIHJldHVybiBzZWdtZW50LnN0YXJ0O1xuICAgIH07XG4gICAgdmVjdG9yLkFCID0gZnVuY3Rpb24oc2VnbWVudCkge1xuICAgICAgICB2YXIgc3RhcnQgPSBzZWdtZW50LnN0YXJ0O1xuICAgICAgICB2YXIgZW5kID0gc2VnbWVudC5lbmQ7XG4gICAgICAgIHJldHVybiB7eDplbmQueCAtIHN0YXJ0LngsIHk6IGVuZC55IC0gc3RhcnQueX07XG4gICAgfTtcbiAgICB2ZWN0b3IuYWRkID0gZnVuY3Rpb24odjEsdjIpIHtcbiAgICAgICAgcmV0dXJuIHt4OiB2MS54ICsgdjIueCwgeTogdjEueSArIHYyLnl9O1xuICAgIH1cbiAgICB2ZWN0b3Iuc3ViID0gZnVuY3Rpb24odjEsdjIpIHtcbiAgICAgICAgcmV0dXJuIHt4OnYxLnggLSB2Mi54LCB5OiB2MS55IC0gdjIueX07XG4gICAgfVxuICAgIHZlY3Rvci5zY2FsYXJNdWx0ID0gZnVuY3Rpb24ocywgdikge1xuICAgICAgICByZXR1cm4ge3g6IHMgKiB2LngsIHk6IHMgKiB2Lnl9O1xuICAgIH1cbiAgICB2ZWN0b3IuY3Jvc3NQcm9kdWN0ID0gZnVuY3Rpb24odjEsdjIpIHtcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueSkgLSAodjIueCAqIHYxLnkpO1xuICAgIH07XG4gICAgdmFyIHNlbGYgPSB7fTtcbiAgICBzZWxmLnZlY3RvciA9IGZ1bmN0aW9uKHNlZ21lbnQpIHtcbiAgICAgICAgcmV0dXJuIHZlY3Rvci5BQihzZWdtZW50KTtcbiAgICB9O1xuICAgIHNlbGYuaW50ZXJzZWN0U2VnbWVudHMgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgLy8gdHVybiBhID0gcCArIHQqciB3aGVyZSAwPD10PD0xIChwYXJhbWV0ZXIpXG4gICAgICAgIC8vIGIgPSBxICsgdSpzIHdoZXJlIDA8PXU8PTEgKHBhcmFtZXRlcikgXG4gICAgICAgIHZhciBwID0gdmVjdG9yLm9BKGEpO1xuICAgICAgICB2YXIgciA9IHZlY3Rvci5BQihhKTtcblxuICAgICAgICB2YXIgcSA9IHZlY3Rvci5vQShiKTtcbiAgICAgICAgdmFyIHMgPSB2ZWN0b3IuQUIoYik7XG4gICAgXG4gICAgICAgIHZhciBjcm9zcyA9IHZlY3Rvci5jcm9zc1Byb2R1Y3QocixzKTsgXG4gICAgICAgIHZhciBxbXAgPSB2ZWN0b3Iuc3ViKHEscCk7XG4gICAgICAgIHZhciBudW1lcmF0b3IgPSB2ZWN0b3IuY3Jvc3NQcm9kdWN0KHFtcCwgcyk7XG4gICAgICAgIHZhciB0ID0gbnVtZXJhdG9yIC8gY3Jvc3M7XG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSB2ZWN0b3IuYWRkKHAsdmVjdG9yLnNjYWxhck11bHQodCxyKSk7XG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG4gICAgfTtcbiAgICBzZWxmLmlzUGFyYWxsZWwgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgLy8gYSBhbmQgYiBhcmUgbGluZSBzZWdtZW50cy4gXG4gICAgICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBhIGFuZCBiIGFyZSBwYXJhbGxlbCAob3IgY28tbGluZWFyKVxuICAgICAgICB2YXIgciA9IHZlY3Rvci5BQihhKTtcbiAgICAgICAgdmFyIHMgPSB2ZWN0b3IuQUIoYik7XG4gICAgICAgIHJldHVybiAodmVjdG9yLmNyb3NzUHJvZHVjdChyLHMpID09PSAwKTtcbiAgICB9O1xuICAgIHNlbGYuaXNDb2xsaW5lYXIgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgLy8gYSBhbmQgYiBhcmUgbGluZSBzZWdtZW50cy4gXG4gICAgICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBhIGFuZCBiIGFyZSBjby1saW5lYXJcbiAgICAgICAgdmFyIHAgPSB2ZWN0b3Iub0EoYSk7XG4gICAgICAgIHZhciByID0gdmVjdG9yLkFCKGEpO1xuXG4gICAgICAgIHZhciBxID0gdmVjdG9yLm9BKGIpO1xuICAgICAgICB2YXIgcyA9IHZlY3Rvci5BQihiKTtcbiAgICAgICAgcmV0dXJuICh2ZWN0b3IuY3Jvc3NQcm9kdWN0KHZlY3Rvci5zdWIocCxxKSwgcikgPT09IDApO1xuICAgIH07XG4gICAgc2VsZi5zYWZlSW50ZXJzZWN0ID0gZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgIGlmIChzZWxmLmlzUGFyYWxsZWwoYSxiKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmludGVyc2VjdFNlZ21lbnRzKGEsYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBzZWxmO1xufTtcbmludGVyc2VjdGlvbi5pbnRlcnNlY3RTZWdtZW50cyA9IGludGVyc2VjdGlvbigpLmludGVyc2VjdFNlZ21lbnRzO1xuaW50ZXJzZWN0aW9uLmludGVyc2VjdCA9IGludGVyc2VjdGlvbigpLnNhZmVJbnRlcnNlY3Q7XG5pbnRlcnNlY3Rpb24uaXNQYXJhbGxlbCA9IGludGVyc2VjdGlvbigpLmlzUGFyYWxsZWw7XG5pbnRlcnNlY3Rpb24uaXNDb2xsaW5lYXIgPSBpbnRlcnNlY3Rpb24oKS5pc0NvbGxpbmVhcjtcbmludGVyc2VjdGlvbi5kZXNjcmliZSA9IGZ1bmN0aW9uKGEsYikge1xuICAgIHZhciBpc0NvbGxpbmVhciA9IGludGVyc2VjdGlvbigpLmlzQ29sbGluZWFyKGEsYik7XG4gICAgdmFyIGlzUGFyYWxsZWwgPSBpbnRlcnNlY3Rpb24oKS5pc1BhcmFsbGVsKGEsYik7XG4gICAgdmFyIHBvaW50T2ZJbnRlcnNlY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzUGFyYWxsZWwgPT09IGZhbHNlKSB7XG4gICAgICAgIHBvaW50T2ZJbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3Rpb24oKS5pbnRlcnNlY3RTZWdtZW50cyhhLGIpO1xuICAgIH1cbiAgICByZXR1cm4ge2NvbGxpbmVhcjogaXNDb2xsaW5lYXIscGFyYWxsZWw6IGlzUGFyYWxsZWwsaW50ZXJzZWN0aW9uOnBvaW50T2ZJbnRlcnNlY3Rpb259O1xufTtcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGludGVyc2VjdGlvbjtcbiIsInZhciBTb3J0ZWRMaXN0ID0gcmVxdWlyZSgnLi9zb3J0ZWQtbGlua2VkLWxpc3QuanMnKTtcbi8vIEFFVCBpcyBzb3J0ZWQgbGlzdCBvZiBib3VuZHMgYWxvbmcgeCBheGlzIGZvciB4Qm90IG9mIGN1cnJlbnQgc2VnbWVudC5cbi8vIGluIEFFVCBlYWNoIG5vZGUgZGF0YSBpcyBib3VuZCBsaW5rZWQgbGlzdCBpbnN0YW5jZSBvZiBGYXN0TGlzdCBcbi8vIGVkZ2UgPSB0aGlzLmhlYWQuZGF0dW0uX2hlYWRcblxudmFyIEFFVCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIHByZWNpc2lvbiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wcmVjaXN0aW9uID8gb3B0aW9ucy5wcmVjaXNpb24gOiAtNTtcbiAgdGhpcy5jb25zdHJ1Y3Rvcih7Y29tcGFyZTogZnVuY3Rpb24oYSxiKXtcbiAgICAvL1RPRE8gbmVlZCB0byBjaGVjayBmb3IgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgbGluZXNcbiAgICAvL1RPRE8gYXBwbHkgcHJlY2lzaW9uIGluIFNUIGNvbXBhcmUgZnVuY3Rpb25cbiAgICBpZiAoTWF0aC5yb3VuZDEwKGEuX2hlYWQuZGF0YS54Qm90LHByZWNpc2lvbikgPT09XG4gICAgICBNYXRoLnJvdW5kMTAoYi5faGVhZC5kYXRhLnhCb3QscHJlY2lzaW9uKSkge1xuICAgICAgdmFyIHhCb3QgPSBhLl9oZWFkLmRhdGEueEJvdDtcbiAgICAgIHZhciBzZWdBID0gYS5faGVhZC5kYXRhLnNlZ21lbnQ7XG4gICAgICB2YXIgc2VnQiA9IGIuX2hlYWQuZGF0YS5zZWdtZW50O1xuICAgICAgdmFyIGQxID0gTWF0aC5yb3VuZDEwKE1hdGguYWJzKHNlZ0EuZW5kLnggLSBzZWdCLmVuZC54KSxwcmVjaXNpb24pO1xuICAgICAgdmFyIGQyID0gTWF0aC5yb3VuZDEwKFxuICAgICAgICBNYXRoLmFicyhzZWdCLmVuZC54IC0geEJvdCkgKyBNYXRoLmFicyh4Qm90IC0gc2VnQS5lbmQueClcbiAgICAgICAgLCBwcmVjaXNpb24pO1xuICAgICAgaWYgKCBkMSA9PT0gZDIpIHtcbiAgICAgICAgLy8gaS5lLiBvbmUgZWRuIG9uIGxlZnQgYW5kIGFub3RoZXIgb24gcmlnaHQgb2YgeEJvdFxuICAgICAgICByZXR1cm4gc2VnQS5lbmQueCAtIHNlZ0IuZW5kLng7XG4gICAgICAvL30gZWxzZSBpZiAoc2VnQS5lbmQueCA+IHhCb3QgJiYgc2VnQi5lbmQueCA+IHhCb3QpIHtcbiAgICAgIC8vICByZXR1cm4gMS4wL2IuX2hlYWQuZGF0YS5kZWx0YVggLSAxLjAvYS5faGVhZC5kYXRhLmRlbHRhWDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGJvdGggZW5kIGFyZSBlaXRoZXIgc2lkZSBvZiB4Ym90XG4gICAgICAgIHJldHVybiAxLjAvYi5faGVhZC5kYXRhLmRlbHRhWCAtIDEuMC9hLl9oZWFkLmRhdGEuZGVsdGFYO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYS5faGVhZC5kYXRhLnhCb3QgLSBiLl9oZWFkLmRhdGEueEJvdDtcbiAgICB9XG4gIH19KTtcbn07XG5cbkFFVC5wcm90b3R5cGUgPSBuZXcgU29ydGVkTGlzdCgpO1xuQUVULnByb3RvdHlwZS5nZXRIZWFkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmhlYWQ7XG59O1xuQUVULnByb3RvdHlwZS5nZXRIZWFkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5oZWFkLmRhdHVtLmdldEhlYWREYXRhKCk7XG59O1xuQUVULnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oZWRnZSkge1xuICByZXR1cm4gZWRnZS5kYXR1bS5nZXRIZWFkRGF0YSgpO1xufTtcbkFFVC5wcm90b3R5cGUuZ2V0Qm91bmQgPSBmdW5jdGlvbihlZGdlKSB7XG4gIHJldHVybiBlZGdlLmRhdHVtO1xufTtcbkFFVC5wcm90b3R5cGUuaXNDb250cmlidXRpbmcgPSBmdW5jdGlvbihib3VuZCkge1xuICAvL2NoZWNrIGlmIGVkZ2UgaXMgY29udHJpYnV0aW5nIGJ5IGV2ZW4vb2RkIHJ1bGVcbiAgdmFyIGxlZnRDb3VudCA9IHRoaXMubG93ZXJCb3VuZChib3VuZClcbiAgICAuZmlsdGVyKGZ1bmN0aW9uKGJvdW5kKSB7XG4gICAgICByZXR1cm4gYm91bmQuZ2V0SGVhZERhdGEoKS50eXBlID09PSB0aGlzWzBdO1xuICAgIH0sW29wcG9zaXRlKGJvdW5kLmdldEhlYWREYXRhKCkudHlwZSldKTtcbiAgcmV0dXJuIGxlZnRDb3VudC5sZW5ndGggJSAyICE9PSAwO1xufTtcbkFFVC5wcm90b3R5cGUuZ2V0U2lkZSA9IGZ1bmN0aW9uKGJvdW5kKSB7XG4gIHZhciBsZWZ0Q291bnQgPSB0aGlzLmxvd2VyQm91bmQoYm91bmQpXG4gICAgLmZpbHRlcihmdW5jdGlvbihib3VuZCkge1xuICAgICAgcmV0dXJuIGJvdW5kLmdldEhlYWREYXRhKCkudHlwZSA9PT0gdGhpc1swXTtcbiAgICB9LFtib3VuZC5nZXRIZWFkRGF0YSgpLnR5cGVdKTtcbiAgICByZXR1cm4gbGVmdENvdW50Lmxlbmd0aCAlIDIgPT0gMCA/ICdsZWZ0JyA6ICdyaWdodCc7XG59O1xuXG5BRVQucHJvdG90eXBlLnN1Y2MgPSBmdW5jdGlvbihlZGdlKSB7XG4gIHZhciBib3VuZCA9IGVkZ2UuZGF0dW07XG4gIC8vdGhpcy5yZW1vdmUoYm91bmQpO1xuICBib3VuZC5zaGlmdCgpO1xuICAvL3JldHVybiB0aGlzLmluc2VydChib3VuZCk7XG4gIHJldHVybiBlZGdlO1xufTtcblxuQUVULnByb3RvdHlwZS5zd2FwID0gZnVuY3Rpb24oYm91bmQxLGJvdW5kMikge1xuICAvL2NvbnNpZGVyaW5nIGJvdW5kMSBhbmQgYm91bmQyIGFyZSBjb25zaWN1dGl2ZSBhbmQgYm9vdW5kMiB3b3VsZCBuZXZlciBiZSBoZWFkIFxuICAvLyBjb25zaWRlciBvcmVkZXIgYSxiLGMsZCBhbmQgcmVwbGFjaW5nIGIsYyB3aWxsIHJlc3VsdCBhLGMsYixkXG4gIHZhciBiID0gdGhpcy5maW5kKGJvdW5kMSk7XG4gIHZhciBjID0gdGhpcy5maW5kKGJvdW5kMik7XG4gIGlmIChiID09IHRoaXMuaGVhZCAmJiBjID09IHRoaXMudGFpbCkge1xuICAgIHRoaXMudGFpbCA9IGI7XG4gICAgdGhpcy5oZWFkID0gYztcbiAgICByZXR1cm4gdGhpczsgICAgICBcbiAgfSBlbHNlIGlmIChiID09IHRoaXMuaGVhZCkge1xuICAgIHRoaXMuaGVhZCA9IGM7XG4gIH0gZWxzZSBpZiAoYyA9PSB0aGlzLnRhaWwpIHtcbiAgICB0aGlzLnRhaWwgPSBiO1xuICB9XG4gIHZhciBhID0gYi5wcmV2O1xuICB2YXIgZCA9IGMubmV4dDtcblxuICBiLnByZXYgPSBjO1xuICBiLm5leHQgPSBkO1xuICBkLnByZXYgPSBiO1xuXG4gIGMubmV4dCA9IGI7XG4gIGMucHJldiA9IGE7XG4gIGEubmV4dCA9IGM7XG4gIHJldHVybiB0aGlzO1xufTtcbkFFVC5wcm90b3R5cGUuaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbihhLCBiKSB7XG4gIGlmIChiID09PSB0aGlzLnRhaWwpIHtcbiAgICBhLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgdGhpcy50YWlsID0gYTtcbiAgICB0aGlzLmhlYWQucHJldiA9IHRoaXMudGFpbDtcbiAgfSBlbHNlIHtcbiAgICBhLm5leHQgPSBiLm5leHQ7XG4gICAgYi5uZXh0LnByZXYgPSBhO1xuICB9XG4gIGEucHJldiA9IGI7XG4gIHJldHVybiBiLm5leHQgPSBhO1xufTtcblxuZnVuY3Rpb24gb3Bwb3NpdGUodHlwZSkge1xuICByZXR1cm4gdHlwZSA9PT0gJ3N1YmplY3QnID8gJ2NsaXAnIDogJ3N1YmplY3QnO1xufVxubW9kdWxlLmV4cG9ydHMgPSBBRVQ7XG4iLCJ2YXIgRmFzdExpc3QgPSByZXF1aXJlKCdmYXN0LWxpc3QnKTtcblxuLy8gYm91bmQobGVmdC9yaWdodCkgaXMgbGlua2VkIGxpc3Qgb2YgcG9seWdvbiBzZW1nZW50cy4gUG9seWdvbiBzZWdtZW50cyBhcmVcbi8vIHB1c2hlZCBmcm9tIGxvY2FsIG1pbmltYSB0byBtYXhpbWEgaW4gYm91bmQncyBsaW5rZWQtbGlzdC4gU28gaGVhZCBvZiBib3VuZFxuLy8gKGxpbmtlZCBsaXN0KSBpcyBhbHdheXMgYXQgbG93ZXJtb3N0IHNlZ21lbnQgd2hpbGUgd2Uga2VlcCBvbiByZW1vdmluZyBcbi8vIChzaGlmaW5nKSB0aGUgaXRlbXMgaW4gbGlua2VkIGxpc3QgZHVyaW5nIHRoZSBzY2FuaW5nIGZyb20gYm90dG9tIHRvIHRvcC5cblxudmFyIEJvdW5kID0gZnVuY3Rpb24oKSB7fTtcbkJvdW5kLnByb3RvdHlwZSA9IG5ldyBGYXN0TGlzdCgpO1xuXG5Cb3VuZC5wcm90b3R5cGUuZ2V0SGVhZERhdGEgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX2hlYWQuZGF0YTtcbn07XG5Cb3VuZC5wcm90b3R5cGUuZ2V0SGVhZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5faGVhZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQm91bmQ7XG5cbiIsInZhciBTb3J0ZWRMaXN0ID0gcmVxdWlyZSgnLi9zb3J0ZWQtbGlua2VkLWxpc3QuanMnKTtcblxudmFyIElUID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY29uc3RydWN0b3Ioe2NvbXBhcmU6IGZ1bmN0aW9uKGEsYikge1xuICAgIC8vVE9ETyAtNSBzaG91bGQgYmUgdmFyaWFibGVcbiAgICByZXR1cm4gTWF0aC5yb3VuZDEwKGEueSwtNSkgLSBNYXRoLnJvdW5kMTAoYi55LC01KTtcbiAgfX0pO1xufTtcbklULnByb3RvdHlwZSA9IG5ldyBTb3J0ZWRMaXN0KCk7XG5JVC5wcm90b3R5cGUuZ2V0SGVhZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5oZWFkO1xufTtcbklULnByb3RvdHlwZS5nZXRIZWFkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5oZWFkLmRhdHVtLmhlYWREYXRhKCk7XG59O1xuSVQucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbihpbnRlcnNlY3Rpb24pIHtcbiAgcmV0dXJuIGludGVyc2VjdGlvbi5kYXR1bTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IElUO1xuIiwiLy8gbG9jYWwtbWluLW1heC5qc1xuLy8gaW5wdXQgY2xvc2UgcGF0aCBpLmUuIGZpcnN0IHBvaW50IGFuZCBsYXN0IHBvaW50IGFyZSBlcXVhbFxuLy8gcmV0dXJuIGFycmF5IG9mIHRhZ3MgbG9jYWwgbWluaW1hLCBtYXhpbWEgYW5kIGludGVybWVkaWF0ZSBhdCBlYWNoIHBvaW50XG52YXIgQm91bmQgPSByZXF1aXJlKCcuL2JvdW5kLmpzJyk7XG52YXIgTGlzdCA9IHJlcXVpcmUoJy4vc29ydGVkLWxpbmtlZC1saXN0LmpzJyk7XG5mdW5jdGlvbiBnZXRCb3VuZHMocGF0aCxwb2x5Z29uVHlwZSkge1xuICBjb25zb2xlLmxvZygncG9seWdvblR5cGU6ICcgKyBwb2x5Z29uVHlwZSk7XG4gIGNvbnNvbGUubG9nKCdwYXRoOiAnICsgSlNPTi5zdHJpbmdpZnkocGF0aCkpOyAgXG4gIHZhciBib3VuZHMgPSBbXSxcbiAgICBwYXJ0Qm91bmQgPSBbXSxcbiAgICB0b3RhbERldCA9IDAsXG4gICAgYm91bmQgPSBbXSxcbiAgICB2ZXJ0ZXggPSB7fSx0eXBlO1xuICAvL3ZlcnRleC5jb29yZCA9IHBhdGhbMF07XG4gIC8vdmVydGV4LnR5cGUgPSBnZXROb2RlVHlwZShwYXRoW3BhdGgubGVuZ3RoLTJdLHBhdGhbMF0scGF0aFsxXSk7XG4gIC8vYm91bmQucHVzaCh2ZXJ0ZXgpO1xuICAvL2JvdW5kLmRldCA9IGdldERldChwYXRoWzBdLHBhdGhbMV0pO1xuICBib3VuZC5kZXQgPSAwO1xuICBmb3IodmFyIGk9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGkgPCBwYXRoLmxlbmd0aCAtMSB8fCAoaSA9PSBwYXRoLmxlbmd0aCAtIDEgJiYgcGFydEJvdW5kLmxlbmd0aCA9PSAwKSkge1xuICAgICAgdHlwZSA9IGdldE5vZGVUeXBlKGkscGF0aCk7XG4gICAgICB2ZXJ0ZXggPSB7eDogcGF0aFtpXVswXSx5OiBwYXRoW2ldWzFdLCB0eXBlOiB0eXBlIH07XG4gICAgICBib3VuZC5wdXNoKHZlcnRleCk7XG4gICAgICBib3VuZC5kZXQgKz0gaT09PSBwYXRoLmxlbmd0aCAtMSA/IFxuICAgICAgICBnZXREZXQoe3g6cGF0aFtpXVswXSwgeTpwYXRoW2ldWzFdfSwge3g6cGF0aFsxXVswXSwgeTpwYXRoWzFdWzFdfSlcbiAgICAgICAgOiBnZXREZXQoe3g6cGF0aFtpXVswXSx5OnBhdGhbaV1bMV19LCB7eDpwYXRoW2krMV1bMF0seTpwYXRoW2krMV1bMV19KTtcbiAgICAgIGlmKHZlcnRleC50eXBlID09PSAnbWF4aW1hJykge1xuICAgICAgICB0b3RhbERldCArPSBib3VuZC5kZXQ7XG4gICAgICAgIGlmKGJvdW5kWzBdLnR5cGUgPT09ICdtYXhpbWEnKSB7XG4gICAgICAgICAgaWYgKGkgIT09IDApIGJvdW5kLmRldCArPSBnZXREZXQodmVydGV4LGJvdW5kWzBdKTtcbiAgICAgICAgICBpZiAoYm91bmQubGVuZ3RoID4gMSkgYm91bmRzLnB1c2goYm91bmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcnRCb3VuZCA9IGJvdW5kOyAgXG4gICAgICAgIH1cbiAgICAgICAgYm91bmQgPSBbXSwgYm91bmQuZGV0ID0gMDtcbiAgICAgICAgYm91bmQucHVzaCh2ZXJ0ZXgpO1xuICAgICAgfSBlbHNlIGlmICh2ZXJ0ZXgudHlwZSA9PT0gJ21pbmltYScpIHtcbiAgICAgICAgYm91bmQubWluUG9zID0gYm91bmQubGVuZ3RoIC0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHBhcnRCb3VuZC5sZW5ndGggPiAwKSB7XG4gICAgLy9qb2luIHdpdGggcGFydCBib3VuZFxuICAgIHZhciBkZXQgPSBib3VuZC5kZXQgKyBwYXJ0Qm91bmQuZGV0IFxuICAgICAgKyBnZXREZXQocGFydEJvdW5kW3BhcnRCb3VuZC5sZW5ndGgtMV0sYm91bmRbMF0pO1xuICAgIHZhciBtaW5Qb3MgPSBib3VuZC5taW5Qb3MgPyBib3VuZC5taW5Qb3MgXG4gICAgICA6IHBhcnRCb3VuZC5taW5Qb3MgKyBib3VuZC5sZW5ndGg7IFxuICAgIGJvdW5kID0gYm91bmQuY29uY2F0KHBhcnRCb3VuZCk7XG4gICAgYm91bmQubWluUG9zID0gbWluUG9zO1xuICAgIGJvdW5kLmRldCA9IGRldDtcbiAgICB0b3RhbERldCArPSBib3VuZC5kZXQ7XG4gICAgYm91bmRzLnB1c2goYm91bmQpO1xuICB9XG4gIHZhciBMTUwgPSBbXSxsZWZ0LHJpZ2h0O1xuICBmb3IgKHZhciBpPTA7aTwgYm91bmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy9jaGVjayBvcmllbnRhdGlvbigrdmUvLXZlKSBvZiBwYXRoIGFuZCBib3VuZHMgY29udmV4L2NvbmNhdmVcbiAgICAvL2lmICh0b3RhbERldCAqIGJvdW5kc1tpXS5kZXQgPiAwKSB7IC8vc28gaW5kaXYgYm91bmQgZG9lc24ndCBtYXR0ZXJcbiAgICAgIC8vIFRPRE8gc28gY2FuIHVzZSBzaWduZWQgYXJlYSBpbnN0ZWFkZSBvZiBjYWxjdWxhdGluZyB0aGUgdG90YWxEZXRcbiAgICBpZiAodG90YWxEZXQgPiAwKSB7IFxuICAgICAgICBsZWZ0Qm91bmQgPSBib3VuZHNbaV0uc2xpY2UoMCxib3VuZHNbaV0ubWluUG9zKzEpLnJldmVyc2UoKTtcbiAgICAgICAgcmlnaHRCb3VuZCA9IGJvdW5kc1tpXS5zbGljZShib3VuZHNbaV0ubWluUG9zLGJvdW5kc1tpXS5sZW5ndGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJpZ2h0Qm91bmQgPSBib3VuZHNbaV0uc2xpY2UoMCxib3VuZHNbaV0ubWluUG9zKzEpLnJldmVyc2UoKTtcbiAgICAgICAgbGVmdEJvdW5kID0gYm91bmRzW2ldLnNsaWNlKGJvdW5kc1tpXS5taW5Qb3MsYm91bmRzW2ldLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdsZWZCb3VuZDogJysgSlNPTi5zdHJpbmdpZnkobGVmdEJvdW5kKSk7XG4gICAgY29uc29sZS5sb2coJ3JpZ2hCb3VuZDogJysgSlNPTi5zdHJpbmdpZnkocmlnaHRCb3VuZCkpO1xuICAgIExNTC5wdXNoKHtcbiAgICAgIGxlZnQ6IGluaXRpYXRlRWRnZXMobGVmdEJvdW5kLCdsZWZ0Jyxwb2x5Z29uVHlwZSksXG4gICAgICByaWdodDogaW5pdGlhdGVFZGdlcyhyaWdodEJvdW5kLCdyaWdodCcscG9seWdvblR5cGUpLFxuICAgICAgeUJvdDogbGVmdEJvdW5kWzBdLnl9KTsgICBcbiAgfVxuICByZXR1cm4gTE1MOyBcbn1cbmZ1bmN0aW9uIHNpZ24odmFsKSB7XG4gIHJldHVybiB2YWwgPiAwID8gMSA6IC0xO1xufVxuZnVuY3Rpb24gZ2V0RGV0KGN1cixuZXh0KSB7XG4gIC8vcmV0dXJuIGN1clswXSpuZXh0WzFdIC0gY3VyWzFdKm5leHRbMF07XG4gIHJldHVybiBjdXIueCAqIG5leHQueSAtIGN1ci55ICogbmV4dC54O1xufVxuZnVuY3Rpb24gZ2V0Tm9kZVR5cGUoaW5kLHBhdGgpIHtcbiAgdmFyIHByZXYsIGN1ciA9IHBhdGhbaW5kXSwgbmV4dDsgXG4gIGlmIChpbmQgPT09IDApIHtcbiAgICBwcmV2ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDJdO1xuICAgIG5leHQgPSBwYXRoW2luZCArIDFdO1xuICB9IGVsc2UgaWYgKGluZCA9PT0gcGF0aC5sZW5ndGggLSAxKSB7XG4gICAgcHJldiA9IHBhdGhbaW5kIC0xXTtcbiAgICBuZXh0ID0gcGF0aFsxXTsgXG4gIH0gZWxzZSB7XG4gICAgcHJldiA9IHBhdGhbaW5kIC0gMV07XG4gICAgbmV4dCA9IHBhdGhbaW5kICsgMV07XG4gIH1cbiAgaWYoY3VyWzFdID4gcHJldlsxXSAmJiBjdXJbMV0gPiBuZXh0WzFdKSB7XG4gICAgcmV0dXJuICdtYXhpbWEnO1xuICB9IGVsc2UgaWYoY3VyWzFdIDwgcHJldlsxXSAmJiBjdXJbMV0gPCBuZXh0WzFdKSB7XG4gICAgcmV0dXJuICdtaW5pbWEnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnaW50ZXJtZWRpYXRlJztcbiAgfVxufVxuXG5mdW5jdGlvbiBfaW5pdGlhdGVFZGdlcyhwb2ludHMsc2lkZSx0eXBlKSB7XG4gIHZhciBsaXN0ID0gbmV3IExpc3Qoe2NvbXBhcmU6IGZ1bmN0aW9uKGEsYikge1xuICAgIHJldHVybiBhLnNlZ21lbnQuc3RhcnQueSAtIGIuc2VnbWVudC5zdGFydC55OyBcbiAgfX0pO1xuICB2YXIgZWRnZSA9IHtzaWRlOiBzaWRlLHR5cGU6IHR5cGV9O1xuICBmb3IodmFyIGk9MDsgaTxwb2ludHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgZWRnZS5zZWdtZW50ID0geyBzdGFydDogcG9pbnRzW2ldLCBlbmQ6IHBvaW50c1tpKzFdIH07XG4gICAgZWRnZS54Qm90ID0gcG9pbnRzW2ldLng7XG4gICAgZWRnZS55VG9wID0gcG9pbnRzW2krMV0ueTtcbiAgICBlZGdlLmRlbHRhWCA9IChwb2ludHNbaSsxXS54IC0gcG9pbnRzW2ldLngpXG4gICAgICAvIChwb2ludHNbaSsxXS55IC0gcG9pbnRzW2ldLnkpO1xuICAgIGxpc3QuaW5zZXJ0KGVkZ2UpO1xuICB9XG4gIHJldHVybiBsaXN0O1xufVxuXG5mdW5jdGlvbiBpbml0aWF0ZUVkZ2VzKHBvaW50cyxzaWRlLHR5cGUpIHtcbiAgLy9UT0RPLXZhdHRpIHJlbW92ZSBzaWRlIGl0cyBhc3NpZ25lZCBiYXNlZCBvbiBwb3NpdGlvbiBpbiBwb2x5Z29uKGNhbiBjaGVjayBpbiBBRVQpXG4gIC8vY29uc29sZS5sb2coJ2JvdW5kIHBvaW50czogJyArIEpTT04uc3RyaW5naWZ5KHBvaW50cykpO1xuICAvL2NvbnNvbGUubG9nKCdib3VuZCB0eXBlOiAnICsgdHlwZSArICcsIGJvdW5kIHNpZGU6ICcgKyBzaWRlKTtcbiAgdmFyIGxpc3QgPSBuZXcgQm91bmQoKTtcbiAgdmFyIGVkZ2U7XG4gIGZvcih2YXIgaT0wOyBpPHBvaW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBlZGdlID0ge3NpZGU6IHNpZGUsdHlwZTogdHlwZX07XG4gICAgZWRnZS5zZWdtZW50ID0geyBzdGFydDogcG9pbnRzW2ldLCBlbmQ6IHBvaW50c1tpKzFdIH07XG4gICAgZWRnZS54Qm90ID0gcG9pbnRzW2ldLng7XG4gICAgZWRnZS55VG9wID0gcG9pbnRzW2krMV0ueTtcbiAgICBlZGdlLmRlbHRhWCA9IChwb2ludHNbaSsxXS54IC0gcG9pbnRzW2ldLngpXG4gICAgICAvIChwb2ludHNbaSsxXS55IC0gcG9pbnRzW2ldLnkpO1xuICAgIGxpc3QucHVzaChlZGdlKTtcbiAgICAvL2NvbnNvbGUubG9nKCdib3VuZCBlZGdlIGk6ICcgKyBpKTtcbiAgICAvL2NvbnNvbGUubG9nKCdib3VuZCBlZGdlOiAnICsgSlNPTi5zdHJpbmdpZnkoZWRnZSkpO1xuICB9XG4gIHJldHVybiBsaXN0O1xufVxubW9kdWxlLmV4cG9ydHMgPSBnZXRCb3VuZHM7XG4iLCJ2YXIgRGVxdWV1ZSA9IHJlcXVpcmUoJ2RlcXVldWUnKTtcbnZhciBpbnRlcnNlY3Rpb24gPSByZXF1aXJlKCdpbnRlcnNlY3Rpb24nKTtcbnZhciBGYXN0TGlzdCA9IHJlcXVpcmUoJ2Zhc3QtbGlzdCcpOyBcblxudmFyIGdldExvY2FsTWluaW1hTGlzdCA9IHJlcXVpcmUoJy4vbG9jYWwtbWluaW1hLWxpc3QuanMnKTtcbnZhciBMaXN0ID0gcmVxdWlyZSgnLi9zb3J0ZWQtbGlua2VkLWxpc3QuanMnKTtcbnZhciBBRVRDbGFzcyA9IHJlcXVpcmUoJy4vYWV0LmpzJyk7XG52YXIgU1RDbGFzcyA9IHJlcXVpcmUoJy4vc3QuanMnKTtcbnZhciBJVENsYXNzID0gcmVxdWlyZSgnLi9pdC5qcycpO1xudmFyIFBvbHlnb24gPSByZXF1aXJlKCcuL3BvbHlnb24uanMnKTtcbi8vVE9ETyBjaGVjayBob3cgdG8gaW5jbHVkZSBjbG9zdXJlIC8gb3Igb25lIHRpbWUgZXhlY3V0aW9uIG9mIGZ1bmN0aW9uXG52YXIgUHJlY2lzaW9uID0gcmVxdWlyZSgnLi9wcmVjaXNpb24uanMnKTtcbi8vIEFFVCBpcyBzb3J0ZWQgbGlzdCBvZiBib3VuZHMgYWxvbmcgeCBheGlzLlxuLy8gZWFjaCBkYXRhIGl0ZW0gaW4gQUVUIGlzIGJvdW5kKGxlZnQvcmlnaHQpIGkuZS4gbGlua2VkIGxpc3Qgb2YgcG9seWdvbiBzZW1nZW50c1xuLy8gcG9seWdvbiBzZWdtZW50cyBhcmUgcHVzaGVkIGZyb20gbG9jYWwgbWluaW1hIHRvIG1heGltYSBpbiBib3VuZCdzIGxpbmtlZC1saXN0XG4vLyBzbyBoZWFkIGlzIGFsd2F5cyBhdCBsb3dlcm1vc3Qgc2VnbWVudCB3aGlsZSB3ZSBrZWVwIG9uIHJlbW92aW5nKHNoaWZpbmcpIFxuLy8gdGhlIGl0ZW1zIGluIGxpbmtlZCBsaXN0IGR1cmluZyB0aGUgc2NhbmluZyBmcm9tIGRvd24gdG8gdG9wLlxuLy8gU28gdGhpcyB3YXkgYWN0dWFseSBJIGFtIGFibGUgdG8gc29ydCBmaXJzdCBlZGdlIG9mIGJvdW5kIGluIEFFVCwgd2hpbGUgYWxzb1xuLy8gaGF2ZSBhY2Nlc3MgdG8gbmV4dCBwb2ludGVyIGluIHRoZSBib3VuZCBsaW5rZWQgbGlzdC5cbnZhciBBRVQsIFxuIFBULFxuIFNCVCxcbiBMTVQ7XG5mdW5jdGlvbiBpbml0R2xvYmFsKCkge1xuICBBRVQgPSBuZXcgQUVUQ2xhc3MoKTtcbiAgUFQgPSBbXTtcbiAgU0JUID0gbmV3IExpc3QoKTtcbiAgTE1UID0gbmV3IExpc3Qoe2NvbXBhcmU6IGZ1bmN0aW9uKGEsYikge1xuICAgIHJldHVybiBhLnlCb3QgLSBiLnlCb3Q7XG4gIH19KTtcbn1cbmZ1bmN0aW9uIGludGVyc2VjdChwb2x5MSxwb2x5Mikge1xuICBpbml0R2xvYmFsKCk7XG4gIC8vIGluc2VydCBsb2NhbCBtaW5pbWEgbm9kZSBpLmUuIG9iamVjdCBvZiBsZWZ0IGFuZCAgcmlnaHQgYm91bmQgYW5kIHlCb3RcbiAgdmFyIHVwZGF0ZUxNVGFuZFNCVCA9IGZ1bmN0aW9uKG5vZGUpIHsgXG4gICAgTE1ULmluc2VydChub2RlKTtcbiAgICAvL1RPRE8gZmluZGluZyBub2RlIGluIHNvcnRlZCBsaXN0IGlzIGV4cGVuc2l2ZVxuICAgIGlmICghU0JULmZpbmQobm9kZS55Qm90KSkgU0JULmluc2VydChub2RlLnlCb3QpO1xuICB9O1xuICBnZXRMb2NhbE1pbmltYUxpc3QocG9seTEsJ3N1YmplY3QnKS5mb3JFYWNoKHVwZGF0ZUxNVGFuZFNCVCk7IFxuICBnZXRMb2NhbE1pbmltYUxpc3QocG9seTIsJ2NsaXAnKS5mb3JFYWNoKHVwZGF0ZUxNVGFuZFNCVCk7XG4gIHZhciB5Qm90ID0gU0JULnBvcCgpLHlUb3A7XG4gIHdoaWxlIChTQlQuaGVhZCkge1xuICAgIHdoaWxlIChMTVQuaGVhZCAmJiBNYXRoLnJvdW5kMTAoTE1ULmhlYWQuZGF0dW0ueUJvdCwtNSkgPT09XG4gICAgICBNYXRoLnJvdW5kMTAoeUJvdCwtNSkpIHtcbiAgICAgIGFkZEVkZ2VzT2ZMTVQoTE1ULnBvcCgpKTtcbiAgICB9XG4gICAgeVRvcCA9IFNCVC5wb3AoKTtcbiAgICBjb25zb2xlLmxvZygneUJvdDogJysgeUJvdCArICcgLHlUb3A6ICcrIHlUb3ApO1xuICAgIGJ1aWxkSW50ZXJzZWN0aW9ucyh5Qm90LHlUb3ApO1xuICAgIHByb2Nlc3NJbnRlcnNlY3Rpb25zKCk7XG4gICAgcHJvY2Vzc0FFVGVkZ2VzKHlCb3QseVRvcCk7XG4gICAgeUJvdCA9IHlUb3A7XG4gIH1cbiAgdmFyIG91dHB1dCA9IFBUXG4gICAgLmZpbHRlcihmdW5jdGlvbiAocG9seSxpKSB7XG4gICAgICAvL3JlbW92ZSBtZXJnZWQgcG9seWdvbiB0byBhbm90aGVyIHBvbHlnb24gXG4gICAgICByZXR1cm4gcG9seS5sZWZ0ICYmIHBvbHkucmlnaHQ7fSlcbiAgICAubWFwKGZ1bmN0aW9uIChwb2x5KSB7XG4gICAgICByZXR1cm4gcG9seS50b0Nvb3JkaW5hdGVzKCk7XG4gICAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5mdW5jdGlvbiBleHRyYWN0UG9seWdvbnMoUFQpIHtcbiAgdmFyIHVuaXF1ZVBUID0gUFQuZmlsdGVyKGZ1bmN0aW9uKGVsZW0sIHBvcywgc2VsZikge1xuICAgIHZhciBpbmQ9MDtcbiAgICB3aGlsZSAoIHNlbGZbaW5kXS5jb29yZGluYXRlcyAhPT0gc2VsZltwb3NdLmNvb3JkaW5hdGVzKSB7XG4gICAgICBpbmQrKztcbiAgICB9XG4gICAgcmV0dXJuIGluZCA9PSBwb3M7XG4gIH0pO1xuICByZXR1cm4gdW5pcXVlUFQubWFwKGZ1bmN0aW9uKHBvbHkpIHtcbiAgICB2YXIgcG9pbnRzPSBbXTtcbiAgICB2YXIgY3VyID0gcG9seS5jb29yZGluYXRlcy5faGVhZDtcbiAgICB3aGlsZShjdXIpIHtcbiAgICAgIHBvaW50cy5wdXNoKFtjdXIuZGF0YS54LCBjdXIuZGF0YS55XSk7XG4gICAgICBjdXIgPSBjdXIubmV4dDtcbiAgICB9XG4gICAgcG9pbnRzLnB1c2goW3BvaW50c1swXVswXSwgcG9pbnRzWzBdWzFdXSk7XG4gICAgcmV0dXJuIHBvaW50cztcbiAgfSk7XG59XG4vL05PVEU6IGV2ZXJ5IHdoZXJlIGVkZ2UgbWVhbnMgaGVhZCBvZiBib3VuZCBcbi8vIGFsd2F5cyBpbnNlcnQvYXR0YWNoIGluIEFFVCwgU1QsIGludGVyc2VjdGlvbiBwb2ludCwgcG9seWdvbiBlZGdlIGV0Y1xuZnVuY3Rpb24gYWRkRWRnZXNPZkxNVChub2RlKSB7XG4gIC8vVE9ETy12YXR0aSBmaXJzdCBpbnNlcnQgaW4gQUVUIHRoZW4gYWRkTG9jYWxNaW4gaWYgZWRnZXMgYXJlIGNvdHJpYnV0aW5nXG4gIEFFVC5pbnNlcnQobm9kZS5sZWZ0KTtcbiAgQUVULmluc2VydChub2RlLnJpZ2h0KTtcbiAgbm9kZS5sZWZ0LmdldEhlYWREYXRhKCkuc2lkZSA9IEFFVC5nZXRTaWRlKG5vZGUubGVmdCk7XG4gIG5vZGUucmlnaHQuZ2V0SGVhZERhdGEoKS5zaWRlID0gQUVULmdldFNpZGUobm9kZS5yaWdodCk7XG4gIC8vIGxlZnQgaXMgbm90IG5lY2Vzc2FyeSBlZGdlMVxuICBpZihBRVQuaXNDb250cmlidXRpbmcobm9kZS5sZWZ0KSkge1xuICAgIGFkZExvY2FsTWluKFxuICAgICAgbm9kZS5sZWZ0LmdldEhlYWREYXRhKCkuc2VnbWVudC5zdGFydCxcbiAgICAgIG5vZGUubGVmdCxcbiAgICAgIG5vZGUucmlnaHQpO1xuICB9XG4gIC8vVE9ETyBmaW5kaW5nIG5vZGUgaW4gc29ydGVkIGxpc3QgaXMgZXhwZW5zaXZlXG4gIGlmICghU0JULmZpbmQobm9kZS5sZWZ0LmdldEhlYWREYXRhKCkueVRvcCkpIHtcbiAgICBTQlQuaW5zZXJ0KG5vZGUubGVmdC5nZXRIZWFkRGF0YSgpLnlUb3ApO1xuICB9XG4gIGlmICghU0JULmZpbmQobm9kZS5yaWdodC5nZXRIZWFkRGF0YSgpLnlUb3ApKSB7ICBcbiAgICBTQlQuaW5zZXJ0KG5vZGUucmlnaHQuZ2V0SGVhZERhdGEoKS55VG9wKTtcbiAgfVxufVxuLy8gZWFjaCBwb2x5Z29uIGlzIGxpbmtlZCBsaXN0IChub3Qgc3JvdGVkIGxpbmtlZCBsaXN0KSBvZiBsZWZ0IHNpZGUgZWRnZXMgXG4vLyBhbmQgcmlnaHQgc2lkZSBlZGdlcy5cbmZ1bmN0aW9uIGFkZExvY2FsTWluKHBvaW50LGVkZ2UxLGVkZ2UyKSB7XG4gIHZhciBpc1JpZ2h0UmlnaHQgPSBBRVQuZ2V0RGF0YShBRVQudGFpbCkgPT09IGVkZ2UyLmdldEhlYWREYXRhKCk7XG5cbiAgdmFyIHBvbHkgPSBuZXcgUG9seWdvbihQVC5sZW5ndGgsaXNSaWdodFJpZ2h0KTtcbiAgcG9seS5hZGRMZWZ0KHBvaW50KTtcbiAgcG9seS5hZGRSaWdodChwb2ludCk7XG4gIGVkZ2UxLmdldEhlYWREYXRhKCkucG9seWdvbiA9IHBvbHk7XG4gIGVkZ2UyLmdldEhlYWREYXRhKCkucG9seWdvbiA9IHBvbHk7XG4gIFBULnB1c2gocG9seSk7XG4gIHJldHVybiBwb2x5O1xufVxuXG5mdW5jdGlvbiBhZGRMb2NhbE1heChwb2ludCxlZGdlMSxlZGdlMikge1xuICBpZihlZGdlMS5nZXRIZWFkRGF0YSgpLnNpZGUgPT09ICdsZWZ0Jykge1xuICAgIGFkZExlZnQocG9pbnQsZWRnZTEpO1xuICB9IGVsc2Uge1xuICAgIGFkZFJpZ2h0KHBvaW50LGVkZ2UxKTtcbiAgfVxuICB2YXIgcG9seTEgPSBlZGdlMS5nZXRIZWFkRGF0YSgpLnBvbHlnb24sXG4gICAgcG9seTIgPSBlZGdlMi5nZXRIZWFkRGF0YSgpLnBvbHlnb247XG4gICBcbiAgaWYoIXBvbHkxLmlzRXF1YWwocG9seTIpKSB7XG4gICAgcG9seTIuYXBwZW5kUG9seWdvbihwb2x5MSxlZGdlMS5nZXRIZWFkRGF0YSgpLnNpZGUpO1xuICAgIC8vIGNoYW5nZSByZWYgdG8gZWRnZTItPnBvbHlnb24gZnJvbSBlZGdlMS0+cG9seWdvbiBmb3IgYWxsIGFjdGl2ZSBlZGdlcyBcbiAgICAvLyB0aGF0IGhhdmUgZWRnZTEtPnBvbHlnb25cbiAgICB2YXIgY3VyUG9seSwgY3VyID0gQUVULmhlYWQ7XG4gICAgZG8ge1xuICAgICAgY3VyUG9seSA9IEFFVC5nZXREYXRhKGN1cikucG9seWdvbjtcbiAgICAgIGlmIChjdXJQb2x5ICYmIGN1clBvbHkuaWQgPT09IHBvbHkxLmlkKSB7XG4gICAgICAgIEFFVC5nZXREYXRhKGN1cikucG9seWdvbiA9IHBvbHkyO1xuICAgICAgfVxuICAgICAgY3VyID0gY3VyLm5leHQ7XG4gICAgfSB3aGlsZSAoY3VyICE9PSBBRVQuaGVhZCk7XG4gIH1cbn1cblxuLy9pdHMgbm90IE8obG9nKG4pKSBidXQgTyhuKVxuZnVuY3Rpb24gcmVtb3ZlUG9seWdvbihwb2x5KSB7XG4gIHZhciBpbmQgPSBQVC5pbmRleE9mKHBvbHkpO1xuICBpZihpbmQgPiAtMSkge1xuICAgIFBULnNwbGljZShpbmQsMSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkSW50ZXJzZWN0aW9ucyh5Qm90LHlUb3ApIHtcbiAgdmFyIGRZID0geVRvcCAtIHlCb3Q7XG4gIFNUID0gbmV3IFNUQ2xhc3MoKTtcbiAgSVQgPSBuZXcgSVRDbGFzcygpOyBcbiAgdmFyIGludFBvaW50O1xuICAvL2luaXRpYXRlIHRoZSBmaXJzdCBlZGdlIGluIFNUXG4gIHZhciBBRVRlZGdlID0gQUVULmdldEhlYWQoKTsgXG4gIHZhciB4VG9wID0gQUVULmdldERhdGEoQUVUZWRnZSkueEJvdCArIEFFVC5nZXREYXRhKEFFVGVkZ2UpLmRlbHRhWCAqIGRZO1xuICBBRVQuZ2V0RGF0YShBRVRlZGdlKS54VG9wID0geFRvcDtcbiAgQUVULmdldERhdGEoQUVUZWRnZSkuaXNQcm9jZXNzZWQgPSBmYWxzZTsgLy91c2VkIGluIHByb2Nlc3NBRVRlZGdlc1xuICB2YXIgU1RlZGdlID0gU1QuaW5zZXJ0KEFFVC5nZXRCb3VuZChBRVRlZGdlKSk7IC8vcmV0dXJuIHRoZSByZWYgdG8gaW5zZXJ0ZWQgZGF0YVxuXG4gIEFFVGVkZ2UgPSBBRVRlZGdlLm5leHQ7XG4gIHdoaWxlKCBBRVRlZGdlICE9PSBBRVQuaGVhZCkge1xuICAgIEFFVC5nZXREYXRhKEFFVGVkZ2UpLmlzUHJvY2Vzc2VkID0gZmFsc2U7IC8vdXNlZCBpbiBwcm9jZXNzQUVUZWRnZXNcbiAgICB4VG9wID0gQUVULmdldERhdGEoQUVUZWRnZSkueEJvdCArIEFFVC5nZXREYXRhKEFFVGVkZ2UpLmRlbHRhWCAqIGRZO1xuICAgIC8vY2hlY2sgaW50ZXJzZWN0aW9uc1xuICAgIC8vVE9ETyB3aGF0IGlmIHhUb3AgPT0gU1RlZGdlLnhUb3BcbiAgICB3aGlsZShNYXRoLnJvdW5kMTAoeFRvcCwtNSkgPCBNYXRoLnJvdW5kMTAoU1QuZ2V0RGF0YShTVGVkZ2UpLnhUb3AsLTUpKSB7XG4gICAgICBpbnRQb2ludCA9IGludGVyc2VjdGlvbi5pbnRlcnNlY3QoU1QuZ2V0RGF0YShTVGVkZ2UpLnNlZ21lbnQsXG4gICAgICAgIEFFVC5nZXREYXRhKEFFVGVkZ2UpLnNlZ21lbnQpO1xuICAgICAgLy9hdHRhY2hpbmcgaGVhZCBvZiB0aGUgYm91bmQgdG8gaW50IHBvaW50XG4gICAgICBpbnRQb2ludC5sZWZ0RWRnZSA9IFNULmdldEJvdW5kKFNUZWRnZSk7IC8vIGNvbnNpZGVyaW5nIHRoZSBib3R0b20geFxuICAgICAgaW50UG9pbnQucmlnaHRFZGdlID0gQUVULmdldEJvdW5kKEFFVGVkZ2UpO1xuICAgICAgSVQuaW5zZXJ0KGludFBvaW50KTtcbiAgICAgIGlmKFNUZWRnZSA9PT0gU1QuaGVhZCkgYnJlYWs7XG4gICAgICBTVGVkZ2UgPSBTVGVkZ2UucHJldjtcbiAgICB9XG4gICAgQUVULmdldERhdGEoQUVUZWRnZSkueFRvcCA9IHhUb3A7XG4gICAgU1QuaW5zZXJ0KEFFVC5nZXRCb3VuZChBRVRlZGdlKSk7IC8vVE9ETyBpcyBzaG91bGQgYmUgaW5zZXJ0IGJlZm9yZSBTVGVkZ2VcbiAgICBTVGVkZ2U9IFNULnRhaWw7XG4gICAgQUVUZWRnZSA9IEFFVGVkZ2UubmV4dDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzSW50ZXJzZWN0aW9ucygpIHtcbiAgdmFyIGludFBvaW50ID0gSVQuZ2V0SGVhZCgpO1xuICBpZiAoaW50UG9pbnQpIHtcbiAgICB2YXIgaW50UG9pbnRUeXBlLGVkZ2UxLGVkZ2UyLCB0ZW1wLCBpc0NvbnRyaWJ1dGluZztcbiAgICBkbyB7XG4gICAgICBlZGdlMSA9IElULmdldERhdGEoaW50UG9pbnQpLmxlZnRFZGdlO1xuICAgICAgZWRnZTIgPSBJVC5nZXREYXRhKGludFBvaW50KS5yaWdodEVkZ2U7XG4gICAgICBpbnRQb2ludFR5cGUgPSBjbGFzc2lmeUludGVyc2VjdGlvbihlZGdlMS5nZXRIZWFkRGF0YSgpLCBlZGdlMi5nZXRIZWFkRGF0YSgpKTtcbiAgICAgIGlmIChlZGdlMS5nZXRIZWFkRGF0YSgpLnR5cGUgPT09IGVkZ2UyLmdldEhlYWREYXRhKCkudHlwZSkge1xuICAgICAgICAvLyYmIGVkZ2UxLmdldEhlYWREYXRhKCkuc2lkZSAhPT0gZWRnZTIuZ2V0SGVhZERhdGEoKS5zaWRlKSB7XG4gICAgICAgIC8vIGxpa2UgZWRnZXNcbiAgICAgICAgLy8gVE9ETyB0ZXN0IGNhc2UgbmVlZCB0byBiZSBjaGVja2VkXG4gICAgICAgIGlmKEFFVC5pc0NvbnRyaWJ1dGluZyhlZGdlMSkpIHtcbiAgICAgICAgICBhZGRMZWZ0KElULmdldERhdGEoaW50UG9pbnQpLGVkZ2UxKTtcbiAgICAgICAgICBhZGRSaWdodChJVC5nZXREYXRhKGludFBvaW50KSxlZGdlMik7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcCA9IGVkZ2UxLmdldEhlYWREYXRhKCkuc2lkZTtcbiAgICAgICAgZWRnZTEuZ2V0SGVhZERhdGEoKS5zaWRlID0gZWRnZTIuZ2V0SGVhZERhdGEoKS5zaWRlO1xuICAgICAgICBlZGdlMi5nZXRIZWFkRGF0YSgpLnNpZGUgPSB0ZW1wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9UT0RPIGNoZWNraW5nIGVkZ2UgcG9seWdvbiBpcyBub3QgcGFydCBmbyB2YXRpaSBhbGdvXG4gICAgICAgIGlmIChpbnRQb2ludFR5cGUgPT09ICdtYXhpbWEnICYmIGVkZ2UxLmdldEhlYWREYXRhKCkucG9seWdvbiBcbiAgICAgICAgICAmJiBlZGdlMi5nZXRIZWFkRGF0YSgpLnBvbHlnb24pIHtcbiAgICAgICAgICBhZGRMb2NhbE1heChJVC5nZXREYXRhKGludFBvaW50KSxlZGdlMSxlZGdlMik7XG4gICAgICAgIH0gZWxzZSBpZiAoaW50UG9pbnRUeXBlID09PSAnbGVmdC1pbnRlcm1lZGlhdGUnIFxuICAgICAgICAgICYmIGVkZ2UyLmdldEhlYWREYXRhKCkucG9seWdvbikge1xuICAgICAgICAgIGFkZExlZnQoSVQuZ2V0RGF0YShpbnRQb2ludCksZWRnZTIpO1xuICAgICAgICB9IGVsc2UgaWYgKGludFBvaW50VHlwZSA9PT0gJ3JpZ2h0LWludGVybWVkaWF0ZScgXG4gICAgICAgICAgJiYgZWRnZTEuZ2V0SGVhZERhdGEoKS5wb2x5Z29uKSB7XG4gICAgICAgICAgYWRkUmlnaHQoSVQuZ2V0RGF0YShpbnRQb2ludCksZWRnZTEpO1xuICAgICAgICB9IGVsc2UgaWYgKGludFBvaW50VHlwZSA9PT0gJ21pbmltYScpIHtcbiAgICAgICAgICBhZGRMb2NhbE1pbihJVC5nZXREYXRhKGludFBvaW50KSxlZGdlMSxlZGdlMik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vU3dhcCBlZGdlMSBhbmQgZWRnZTIgcG9zaXRpb25zIGluIHRoZSBBRVQ7XG4gICAgICAvL1RPRE8gdGhlcmUgc2hvdWxkIGJlIHNvbWUgb3RoZXIgd2F5IHhCb3QgaXMgbW9kaWZpZWQuIElmIHRoZXJlIGlzXG4gICAgICAvLyBhbm90aGVyIGludGVyc2VjdGlvbiBvbiBzYW1lIGxpbmUgaXQgbWF5IGJlIHByb2JsZW0gXG4gICAgICAvLyBUT0RPIGl0IHNob3VsZCBiZSBzd2FwIE9OTFlcbiAgICAgIC8qQUVULnJlbW92ZShlZGdlMSk7XG4gICAgICBlZGdlMS5nZXRIZWFkRGF0YSgpLnhCb3QgPSBlZGdlMS5nZXRIZWFkRGF0YSgpLnhUb3A7XG4gICAgICBBRVQuaW5zZXJ0KGVkZ2UxKTtcbiAgICAgIEFFVC5yZW1vdmUoZWRnZTIpO1xuICAgICAgZWRnZTIuZ2V0SGVhZERhdGEoKS54Qm90ID0gZWRnZTIuZ2V0SGVhZERhdGEoKS54VG9wO1xuICAgICAgQUVULmluc2VydChlZGdlMik7Ki9cbiAgICAgIEFFVC5zd2FwKGVkZ2UxLGVkZ2UyKTtcbiAgICAgIC8vVE9ETyBjYW4gYmUgZG9uZSBpbiBpZiBpbnRQb2ludFR5cGUgYWNjb3JkaW5nbHkgXG4gICAgICAvL3N3YXAgcG9seWdvbnNcbiAgICAgIHRlbXAgPSBlZGdlMS5nZXRIZWFkRGF0YSgpLnBvbHlnb247XG4gICAgICBlZGdlMS5nZXRIZWFkRGF0YSgpLnBvbHlnb24gPSBlZGdlMi5nZXRIZWFkRGF0YSgpLnBvbHlnb247XG4gICAgICBlZGdlMi5nZXRIZWFkRGF0YSgpLnBvbHlnb24gPSB0ZW1wO1xuICAgICAgLy9UT0RPIHdoeSBub3QgcmVjYWxjdWxhdGUgc2lkZSBvZiBlZGdlc1xuICAgICAgaW50UG9pbnQgPSBpbnRQb2ludC5uZXh0O1xuICAgIH0gd2hpbGUgKGludFBvaW50ICE9PSBJVC5oZWFkICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0FFVGVkZ2VzKHlCb3QseVRvcCkge1xuICB2YXIgY3VyID0gQUVULmdldEhlYWQoKSxcbiAgICB2ZXJ0ZXhUeXBlLGRhdGEsaXNDb250cmlidXRpbmcscHJldjtcbiAgaWYgKGN1cikge1xuICAgIGRvIHsgXG4gICAgICBBRVQuZ2V0RGF0YShjdXIpLmlzUHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICAgIGlzQ29udHJpYnV0aW5nID0gQUVULmlzQ29udHJpYnV0aW5nKEFFVC5nZXRCb3VuZChjdXIpKTtcbiAgICAgIC8vaXNDb250cmlidXRpbmcgPSBBRVQuZ2V0RGF0YShjdXIpLnBvbHlnb24gPyB0cnVlIDogZmFsc2U7XG4gICAgICAvL1RPRE8gdmF0dGkgYWxnbyBkb2VzbnQgY2FsIGlzQ29udHJpYnV0aW5nLCBjYW4gd2UgY2FycnkgZm9yd2FyZCBsaWtlXG4gICAgICAgIC8vIHNpZGVcbiAgICAgIGlmIChNYXRoLnJvdW5kMTAoQUVULmdldERhdGEoY3VyKS55VG9wLC01KSA9PT0gTWF0aC5yb3VuZDEwKHlUb3AsLTUpKSB7XG4gICAgICAgIHZlcnRleFR5cGUgPSBBRVQuZ2V0RGF0YShjdXIpLnNlZ21lbnQuZW5kLnR5cGU7XG4gICAgICAgIGlmICh2ZXJ0ZXhUeXBlID09PSAnbWF4aW1hJykge1xuICAgICAgICAgIGlmKGlzQ29udHJpYnV0aW5nKSB7IFxuICAgICAgICAgICAgYWRkTG9jYWxNYXgoQUVULmdldERhdGEoY3VyKS5zZWdtZW50LmVuZCxBRVQuZ2V0Qm91bmQoY3VyKSxcbiAgICAgICAgICAgICAgQUVULmdldEJvdW5kKGN1ci5uZXh0KSk7XG4gICAgICAgICAgICAvL3JlbW92ZSB0aGUgY3VyIGVkZ2UgYW5kIG5leHQgYWxzbyAoYmVpbmcgcmVtb3ZlZCBvdXRzaWRlIGlmKVxuICAgICAgICAgICAgLypwcmV2ID0gY3VyO1xuICAgICAgICAgICAgY3VyID0gY3VyLm5leHQ7XG4gICAgICAgICAgICBBRVQucmVtb3ZlKHByZXYuZGF0dW0pOyovXG4gICAgICAgICAgfVxuICAgICAgICAgIC8qcHJldiA9IGN1cjtcbiAgICAgICAgICBjdXIgPSBjdXIubmV4dDtcbiAgICAgICAgICBBRVQucmVtb3ZlKHByZXYuZGF0dW0pOyovXG4gICAgICAgICAgdmFyIGUxID0gY3VyO1xuICAgICAgICAgIHZhciBlMiA9IGN1ci5uZXh0O1xuICAgICAgICAgIGN1ciA9IGN1ci5uZXh0Lm5leHQ7XG4gICAgICAgICAgQUVULnJlbW92ZShlMS5kYXR1bSk7XG4gICAgICAgICAgQUVULnJlbW92ZShlMi5kYXR1bSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmVydGV4VHlwZSA9IEFFVC5nZXREYXRhKGN1cikuc2lkZSArICctJyArIHZlcnRleFR5cGU7XG4gICAgICAgICAgaWYgKHZlcnRleFR5cGUgPT09ICdsZWZ0LWludGVybWVkaWF0ZScpIHtcbiAgICAgICAgICAgIGlmKGlzQ29udHJpYnV0aW5nKSB7XG4gICAgICAgICAgICAgIGFkZExlZnQoQUVULmdldERhdGEoY3VyKS5zZWdtZW50LmVuZCxBRVQuZ2V0Qm91bmQoY3VyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh2ZXJ0ZXhUeXBlID09PSAncmlnaHQtaW50ZXJtZWRpYXRlJykge1xuICAgICAgICAgICAgaWYoaXNDb250cmlidXRpbmcpIHtcbiAgICAgICAgICAgICAgYWRkUmlnaHQoQUVULmdldERhdGEoY3VyKS5zZWdtZW50LmVuZCxBRVQuZ2V0Qm91bmQoY3VyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGRhdGEgPSBBRVQuZ2V0RGF0YShjdXIpO1xuICAgICAgICAgIGN1ciA9IEFFVC5zdWNjKGN1cik7IC8vcmV0dXJucyByZWYgdG8gc2FtZSBib3VuZCBidXQgbW92ZWQgdG8gXG4gICAgICAgICAgICAvLyB1cHBlciBlZGdlXG4gICAgICAgICAgQUVULmdldERhdGEoY3VyKS5zaWRlID0gZGF0YS5zaWRlO1xuICAgICAgICAgIC8vQUVULmdldERhdGEoY3VyKS5pc0NvbnRyaWJ1dGluZyA9IGRhdGEuaXNDb250cmlidXRpbmc7XG4gICAgICAgICAgQUVULmdldERhdGEoY3VyKS5wb2x5Z29uID0gZGF0YS5wb2x5Z29uO1xuICAgICAgICAgIEFFVC5nZXREYXRhKGN1cikuaXNQcm9jZXNzZWQgPSB0cnVlOyAvL1RPRE8gc29ydC0nY2lyY3VsYXInLWxpbmtlZC1saXN0XG4gICAgICAgICAgICAvLyBpcyBjcmVhdGluZyBzbyBtYW55IGlzc3VlIGluIHdoaWxlIGxvb3BcbiAgICAgICAgICAvL1RPRE8gZmluZGluZyBub2RlIGluIHNvcnRlZCBsaXN0IGlzIGV4cGVuc2l2ZVxuICAgICAgICAgIGlmICghU0JULmZpbmQoQUVULmdldERhdGEoY3VyKS55VG9wKSkgXG4gICAgICAgICAgICBTQlQuaW5zZXJ0KEFFVC5nZXREYXRhKGN1cikueVRvcCk7XG4gICAgICAgICAgY3VyID0gY3VyLm5leHQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEFFVC5nZXREYXRhKGN1cikueEJvdCA9IEFFVC5nZXREYXRhKGN1cikueFRvcDsgXG4gICAgICAgIGN1ciA9IGN1ci5uZXh0O1xuICAgICAgfVxuICAgIC8vfSB3aGlsZSAoY3VyICE9PSBBRVQuaGVhZCAmJiBBRVQubGVuZ3RoID4gMCk7XG4gICAgfSB3aGlsZSAoIUFFVC5nZXREYXRhKGN1cikuaXNQcm9jZXNzZWQpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkTGVmdChwb2ludCxib3VuZCkge1xuICBib3VuZC5nZXRIZWFkRGF0YSgpLnBvbHlnb24uYWRkTGVmdChwb2ludCk7XG59XG5mdW5jdGlvbiBhZGRSaWdodChwb2ludCxib3VuZCkge1xuICBib3VuZC5nZXRIZWFkRGF0YSgpLnBvbHlnb24uYWRkUmlnaHQocG9pbnQpO1xufVxuXG5mdW5jdGlvbiBjbGFzc2lmeUludGVyc2VjdGlvbihlZGdlMSxlZGdlMikge1xuICB2YXIgcnVsZXMgPSB7IFxuICAgICdsZWZ0LWNsaXAteC1sZWZ0LXN1YmplY3QnOiAnbGVmdC1pbnRlcm1lZGlhdGUnLFxuICAgICdsZWZ0LXN1YmplY3QteC1sZWZ0LWNsaXAnOiAnbGVmdC1pbnRlcm1lZGlhdGUnLFxuICAgICdyaWdodC1jbGlwLXgtcmlnaHQtc3ViamVjdCc6ICdyaWdodC1pbnRlcm1lZGlhdGUnLFxuICAgICdyaWdodC1zdWJqZWN0LXgtcmlnaHQtY2xpcCc6ICdyaWdodC1pbnRlcm1lZGlhdGUnLFxuICAgICdsZWZ0LXN1YmplY3QteC1yaWdodC1jbGlwJzogJ21heGltYScsXG4gICAgJ2xlZnQtY2xpcC14LXJpZ2h0LXN1YmplY3QnOiAnbWF4aW1hJyxcbiAgICAncmlnaHQtc3ViamVjdC14LWxlZnQtY2xpcCc6ICdtaW5pbWEnLFxuICAgICdyaWdodC1jbGlwLXgtbGVmdC1zdWJqZWN0JzogJ21pbmltYSdcbiAgICAvKidsZWZ0LWNsaXAteC1yaWdodC1jbGlwJzogWydsZWZ0LWludGVybWVkaWF0ZScsJ3JpZ2h0LWludGVybWVkaWF0ZSddLFxuICAgICdyaWdodC1jbGlwLXgtbGVmdC1jbGlwJzogWydsZWZ0LWludGVybWVkaWF0ZScsJ3JpZ2h0LWludGVybWVkaWF0ZSddLFxuICAgICdsZWZ0LXN1YmplY3QteC1yaWdodC1zdWJqZWN0JzogWydsZWZ0LWludGVybWVkaWF0ZScsJ3JpZ2h0LWludGVybWVkaWF0ZSddLFxuICAgICdyaWdodC1zdWJqZWN0LXgtbGVmdC1zdWJqZWN0JzogWydsZWZ0LWludGVybWVkaWF0ZScsJ3JpZ2h0LWludGVybWVkaWF0ZSddKi9cbiAgfTtcbiAgcmV0dXJuIHJ1bGVzW2VkZ2UxLnNpZGUgKyAnLScgKyBlZGdlMS50eXBlICsnLXgtJyArIGVkZ2UyLnNpZGUgKyAnLScrIGVkZ2UyLnR5cGVdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludGVyc2VjdDtcblxuLy92YXIgY3VyID0gQUVULmhlYWQ7IGRvIHsgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoQUVULmdldERhdGEoY3VyKS5zZWdtZW50KSk7IHZhciBjdXIgPSBjdXIubmV4dDt9IHdoaWxlIChjdXIgIT09IEFFVC5oZWFkKTtcbiIsInZhciBQb2x5Z29uID0gZnVuY3Rpb24oaWQsaXNSaWdodFJpZ2h0KSB7XG4gIHRoaXMuaWQgPSBpZDtcbiAgdGhpcy5sZWZ0ID0gW107XG4gIHRoaXMucmlnaHQgPSBbXTtcbiAgdGhpcy5pc1JpZ2h0UmlnaHQgPSBpc1JpZ2h0UmlnaHQgfHwgdHJ1ZTsgLy8gZmFsc2UgZm9yIGhvbGVcbn07XG5cbi8vIGFzc3VtaW5nIGFsd2F5cyBhcHBlbmQgZWRnZTEgcG9seWdvbiB0byBlZGdlMiBhbmQgJ3RoaXMnIGlzIGVkZ2UyIHBvbHlnb24gXG4vLyAnc2lkZScgaXMgc2lkZSBvZiBlZGdlMSBcblBvbHlnb24ucHJvdG90eXBlLmFwcGVuZFBvbHlnb24gPSBmdW5jdGlvbihwb2x5Z29uLHNpZGUpIHtcbiAgaWYgKHNpZGUgPT09ICdyaWdodCcgKSB7XG4gICAgdmFyIGxlZnQgPSB0aGlzLmxlZnRcbiAgICAgIC5jb25jYXQocG9seWdvbi5yaWdodC5yZXZlcnNlKCkuc2xpY2UoMCxwb2x5Z29uLnJpZ2h0Lmxlbmd0aCAtIDEpKVxuICAgICAgLmNvbmNhdChwb2x5Z29uLmxlZnQpO1xuICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gIH0gZWxzZSB7IFxuICAgIHZhciByaWdodCA9IHRoaXMucmlnaHRcbiAgICAgIC5jb25jYXQocG9seWdvbi5sZWZ0LnJldmVyc2UoKS5zbGljZSgwLHBvbHlnb24ubGVmdC5sZW5ndGggLSAxKSlcbiAgICAgIC5jb25jYXQocG9seWdvbi5yaWdodCk7XG4gICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICB9XG4gIC8vcG9seWdvbi5leHRlbmQodGhpcyk7XG4gIHBvbHlnb24ubGVmdCA9IG51bGw7XG4gIHBvbHlnb24ucmlnaHQgPSBudWxsO1xuICAvKnRoaXMubGFzdE1lcmdlZFBvbHlnb24gPSBwb2x5Z29uO1xuICB2YXIgY3VyID0gcG9seWdvbjtcbiAgd2hpbGUgKGN1cikge1xuICAgIGN1ci5leHRlbmQodGhpcyk7XG4gICAgY3VyID0gY3VyLmxhc3RNZXJnZWRQb2x5Z29uO1xuICB9Ki9cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Qb2x5Z29uLnByb3RvdHlwZS5hZGRMZWZ0ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgdGhpcy5sZWZ0LnB1c2gocG9pbnQpO1xuICByZXR1cm4gdGhpcztcbn07XG5Qb2x5Z29uLnByb3RvdHlwZS5hZGRSaWdodCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gIHRoaXMucmlnaHQucHVzaChwb2ludCk7XG4gIHJldHVybiB0aGlzO1xufTtcblBvbHlnb24ucHJvdG90eXBlLmV4dGVuZCA9IGZ1bmN0aW9uKHBvbHlnb24pIHtcbiAgLy90aGlzLmlkID0gcG9seWdvbi5pZDtcbiAgdGhpcy5sZWZ0ID0gcG9seWdvbi5sZWZ0O1xuICB0aGlzLnJpZ2h0ID0gcG9seWdvbi5yaWdodDtcbiAgLy90aGlzLmlzUmluZ2h0UmlnaHQgPSBwb2x5Z29uLmlzUmlnaHRSaWdodDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Qb2x5Z29uLnByb3RvdHlwZS5pc0VxdWFsID0gZnVuY3Rpb24ocG9seWdvbikge1xuICAvL3JldHVybiB0aGlzLmlkID09PSBwb2x5Z29uLmlkO1xuICByZXR1cm4gdGhpcy5sZWZ0ID09PSBwb2x5Z29uLmxlZnQgJiYgdGhpcy5yaWdodCA9PT0gcG9seWdvbi5yaWdodDtcbn07XG5Qb2x5Z29uLnByb3RvdHlwZS50b0Nvb3JkaW5hdGVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnJpZ2h0LmNvbmNhdCh0aGlzLmxlZnQucmV2ZXJzZSgpKVxuICAgIC5tYXAoZnVuY3Rpb24ocHQpIHtcbiAgICAgIHJldHVybiBbcHQueCwgcHQueV07XG4gICAgfSk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBQb2x5Z29uO1xuIiwiLy90YWtlbiBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hdGgvcm91bmRcbi8vIENsb3N1cmVcbihmdW5jdGlvbigpe1xuXG4gIC8qKlxuICAgKiBEZWNpbWFsIGFkanVzdG1lbnQgb2YgYSBudW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgdHlwZSAgVGhlIHR5cGUgb2YgYWRqdXN0bWVudC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9ICB2YWx1ZSBUaGUgbnVtYmVyLlxuICAgKiBAcGFyYW0ge0ludGVnZXJ9IGV4cCAgIFRoZSBleHBvbmVudCAodGhlIDEwIGxvZ2FyaXRobSBvZiB0aGUgYWRqdXN0bWVudCBiYXNlKS5cbiAgICogQHJldHVybnMge051bWJlcn0gICAgICBUaGUgYWRqdXN0ZWQgdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiBkZWNpbWFsQWRqdXN0KHR5cGUsIHZhbHVlLCBleHApIHtcbiAgICAvLyBJZiB0aGUgZXhwIGlzIHVuZGVmaW5lZCBvciB6ZXJvLi4uXG4gICAgaWYgKHR5cGVvZiBleHAgPT09ICd1bmRlZmluZWQnIHx8ICtleHAgPT09IDApIHtcbiAgICAgIHJldHVybiBNYXRoW3R5cGVdKHZhbHVlKTtcbiAgICB9XG4gICAgdmFsdWUgPSArdmFsdWU7XG4gICAgZXhwID0gK2V4cDtcbiAgICAvLyBJZiB0aGUgdmFsdWUgaXMgbm90IGEgbnVtYmVyIG9yIHRoZSBleHAgaXMgbm90IGFuIGludGVnZXIuLi5cbiAgICBpZiAoaXNOYU4odmFsdWUpIHx8ICEodHlwZW9mIGV4cCA9PT0gJ251bWJlcicgJiYgZXhwICUgMSA9PT0gMCkpIHtcbiAgICAgIHJldHVybiBOYU47XG4gICAgfVxuICAgIC8vIFNoaWZ0XG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCdlJyk7XG4gICAgdmFsdWUgPSBNYXRoW3R5cGVdKCsodmFsdWVbMF0gKyAnZScgKyAodmFsdWVbMV0gPyAoK3ZhbHVlWzFdIC0gZXhwKSA6IC1leHApKSk7XG4gICAgLy8gU2hpZnQgYmFja1xuICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnZScpO1xuICAgIHJldHVybiArKHZhbHVlWzBdICsgJ2UnICsgKHZhbHVlWzFdID8gKCt2YWx1ZVsxXSArIGV4cCkgOiBleHApKTtcbiAgfVxuXG4gIC8vIERlY2ltYWwgcm91bmRcbiAgaWYgKCFNYXRoLnJvdW5kMTApIHtcbiAgICBNYXRoLnJvdW5kMTAgPSBmdW5jdGlvbih2YWx1ZSwgZXhwKSB7XG4gICAgICByZXR1cm4gZGVjaW1hbEFkanVzdCgncm91bmQnLCB2YWx1ZSwgZXhwKTtcbiAgICB9O1xuICB9XG4gIC8vIERlY2ltYWwgZmxvb3JcbiAgaWYgKCFNYXRoLmZsb29yMTApIHtcbiAgICBNYXRoLmZsb29yMTAgPSBmdW5jdGlvbih2YWx1ZSwgZXhwKSB7XG4gICAgICByZXR1cm4gZGVjaW1hbEFkanVzdCgnZmxvb3InLCB2YWx1ZSwgZXhwKTtcbiAgICB9O1xuICB9XG4gIC8vIERlY2ltYWwgY2VpbFxuICBpZiAoIU1hdGguY2VpbDEwKSB7XG4gICAgTWF0aC5jZWlsMTAgPSBmdW5jdGlvbih2YWx1ZSwgZXhwKSB7XG4gICAgICByZXR1cm4gZGVjaW1hbEFkanVzdCgnY2VpbCcsIHZhbHVlLCBleHApO1xuICAgIH07XG4gIH1cblxufSkoKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS40LjBcbnZhciBOb2RlLCBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3Q7XG5cbk5vZGUgPSAoZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gTm9kZShkYXR1bSwgcHJldiwgbmV4dCkge1xuICAgIHRoaXMuZGF0dW0gPSBkYXR1bTtcbiAgICB0aGlzLnByZXYgPSBwcmV2O1xuICAgIHRoaXMubmV4dCA9IG5leHQ7XG4gIH1cblxuICByZXR1cm4gTm9kZTtcblxufSkoKTtcblxuU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0ID0gKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdChvcHRpb25zKSB7XG4gICAgdmFyIG9wdCA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5oZWFkID0gb3B0LmhlYWQ7XG4gICAgdGhpcy50YWlsID0gb3B0LnRhaWw7XG4gICAgdGhpcy5sZW5ndGggPSAwO1xuICAgIGlmKCBvcHQuY29tcGFyZSkgXG4gICAgICB0aGlzLmNvbXBhcmUgPSBvcHQuY29tcGFyZTsgXG4gIH1cblxuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbihkYXR1bTEsIGRhdHVtMikge1xuICAgIHJldHVybiBkYXR1bTEgLSBkYXR1bTI7XG4gIH07XG5cbiAgU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZS5pbnNlcnRBbGwgPSBmdW5jdGlvbihsaXN0KSB7XG4gICAgdmFyIHgsIF9pLCBfbGVuO1xuICAgIGlmIChsaXN0ID09IG51bGwpIHtcbiAgICAgIGxpc3QgPSBbXTtcbiAgICB9XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBsaXN0Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICB4ID0gbGlzdFtfaV07XG4gICAgICB0aGlzLmluc2VydCh4KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaGVhZDtcbiAgfTtcblxuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgdmFyIGN1cnJlbnQsIGluc2VydEFmdGVyLCBpbnNlcnRCZWZvcmUsIG5leHQsIG5vZGU7XG4gICAgbm9kZSA9IG5ldyBOb2RlKGRhdHVtKTtcbiAgICBpbnNlcnRCZWZvcmUgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAoYiA9PT0gdGhpcy5oZWFkKSB7XG4gICAgICAgIGEucHJldiA9IHRoaXMudGFpbDtcbiAgICAgICAgdGhpcy5oZWFkID0gYTtcbiAgICAgICAgdGhpcy50YWlsLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhLnByZXYgPSBiLnByZXY7XG4gICAgICAgIGIucHJldi5uZXh0ID0gYTtcbiAgICAgIH1cbiAgICAgIGEubmV4dCA9IGI7XG4gICAgICByZXR1cm4gYi5wcmV2ID0gYTtcbiAgICB9O1xuICAgIGluc2VydEFmdGVyID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgaWYgKGIgPT09IHRoaXMudGFpbCkge1xuICAgICAgICBhLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgIHRoaXMudGFpbCA9IGE7XG4gICAgICAgIHRoaXMuaGVhZC5wcmV2ID0gdGhpcy50YWlsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYS5uZXh0ID0gYi5uZXh0O1xuICAgICAgICBiLm5leHQucHJldiA9IGE7XG4gICAgICB9XG4gICAgICBhLnByZXYgPSBiO1xuICAgICAgcmV0dXJuIGIubmV4dCA9IGE7XG4gICAgfTtcbiAgICB0aGlzLmxlbmd0aCsrOyAvL1RPRE8gaXQgc2hvdWxkIGJlIGJlZm9yZSByZXR1cm4gc3RhdGVtZW50XG4gICAgaWYgKHRoaXMuaGVhZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmhlYWQgPSBub2RlO1xuICAgICAgdGhpcy5oZWFkLm5leHQgPSBub2RlO1xuICAgICAgdGhpcy5oZWFkLnByZXYgPSBub2RlO1xuICAgICAgdGhpcy50YWlsID0gdGhpcy5oZWFkO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbXBhcmUodGhpcy5oZWFkLmRhdHVtLCBub2RlLmRhdHVtKSA+IDApIHtcbiAgICAgIGluc2VydEJlZm9yZShub2RlLCB0aGlzLmhlYWQpO1xuICAgICAgdGhpcy5oZWFkID0gbm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IHRoaXMuaGVhZDtcbiAgICAgIHdoaWxlIChjdXJyZW50ICE9PSB0aGlzLnRhaWwpIHtcbiAgICAgICAgbmV4dCA9IGN1cnJlbnQubmV4dDtcbiAgICAgICAgaWYgKHRoaXMuY29tcGFyZShuZXh0LmRhdHVtLCBub2RlLmRhdHVtKSA+IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgICAgfVxuICAgICAgaW5zZXJ0QWZ0ZXIobm9kZSwgY3VycmVudCk7XG4gICAgICBpZiAoY3VycmVudCA9PT0gdGhpcy50YWlsKSB7XG4gICAgICAgIHRoaXMudGFpbCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIC8qaWYgKHRoaXMuY29tcGFyZShub2RlLmRhdHVtLCB0aGlzLmhlYWQuZGF0dW0pIDwgMCkge1xuICAgICAgdGhpcy5oZWFkID0gbm9kZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29tcGFyZShub2RlLmRhdHVtLCB0aGlzLnRhaWwuZGF0dW0pID4gMCkge1xuICAgICAgdGhpcy50YWlsID0gbm9kZTtcbiAgICB9Ki9cbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcblxuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgdmFyIGN1cnJlbnQ7XG4gICAgY3VycmVudCA9IHRoaXMuaGVhZDtcbiAgICAvL1RPRE8gY2FuIGJlIGN1cnJlbnQuZGF0dW0gIT09IGRhdHVtXG4gICAgLy93aGlsZSAodGhpcy5jb21wYXJlKGN1cnJlbnQuZGF0dW0sIGRhdHVtKSAhPT0gMCkge1xuICAgIHdoaWxlIChjdXJyZW50LmRhdHVtICE9PSBkYXR1bSkge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICAgIGlmIChjdXJyZW50ID09PSB0aGlzLmhlYWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGVuZ3RoLS07XG4gICAgaWYoY3VycmVudCA9PT0gdGhpcy5oZWFkICYmIGN1cnJlbnQgPT09IHRoaXMudGFpbCkge1xuICAgICAgdGhpcy5oZWFkID0gbnVsbDtcbiAgICAgIHRoaXMudGFpbCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjdXJyZW50ID09PSB0aGlzLmhlYWQpIHtcbiAgICAgICAgdGhpcy5oZWFkID0gY3VycmVudC5uZXh0O1xuICAgICAgICB0aGlzLnRhaWwubmV4dCA9IHRoaXMuaGVhZDtcbiAgICAgICAgdGhpcy5oZWFkLnByZXYgPSB0aGlzLnRhaWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50LnByZXYubmV4dCA9IGN1cnJlbnQubmV4dDtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50ID09PSB0aGlzLnRhaWwpIHtcbiAgICAgICAgdGhpcy50YWlsID0gY3VycmVudC5wcmV2O1xuICAgICAgICB0aGlzLmhlYWQucHJldiA9IHRoaXMudGFpbDtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFpbC5uZXh0ID0gdGhpcy5oZWFkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQubmV4dC5wcmV2ID0gY3VycmVudC5wcmV2O1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oZGF0dW0pIHtcbiAgICByZXR1cm4gdGhpcy5maW5kKGRhdHVtKSAhPSBudWxsO1xuICB9O1xuXG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgdmFyIGN1cnJlbnQ7XG4gICAgaWYgKCF0aGlzLmhlYWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50ID0gdGhpcy5oZWFkO1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5jb21wYXJlKGN1cnJlbnQuZGF0dW0sIGRhdHVtKSA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgICB9IHdoaWxlIChjdXJyZW50ICE9PSB0aGlzLmhlYWQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUucHJpbnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudCwgb3V0cHV0O1xuICAgIG91dHB1dCA9IFwiXCI7XG4gICAgaWYgKCEodGhpcy5oZWFkICE9IG51bGwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGN1cnJlbnQgPSB0aGlzLmhlYWQ7XG4gICAgb3V0cHV0ICs9IFwiXCIgKyBjdXJyZW50LmRhdHVtO1xuICAgIHdoaWxlIChjdXJyZW50Lm5leHQgIT09IHRoaXMuaGVhZCkge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICAgIG91dHB1dCArPSBcIiwgXCIgKyBjdXJyZW50LmRhdHVtO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuICBcbiAgU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0dW0gPSB0aGlzLmhlYWQuZGF0dW07XG4gICAgdGhpcy5yZW1vdmUoZGF0dW0pO1xuICAgIHJldHVybiBkYXR1bTtcbiAgfTtcblxuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLnVwcGVyQm91bmQgPSBmdW5jdGlvbihkYXR1bSkge1xuICAgIHZhciB1cHBlciA9IFtdO1xuICAgIHZhciBjdXIgPSB0aGlzLmZpbmQoZGF0dW0pO1xuICAgIGlmIChjdXIgJiYgY3VyICE9PSB0aGlzLnRhaWwpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgdXBwZXIucHVzaChjdXIubmV4dC5kYXR1bSk7XG4gICAgICAgIGN1ciA9IGN1ci5uZXh0O1xuICAgICAgfSB3aGlsZSAoY3VyICE9PSB0aGlzLnRhaWwpO1xuICAgIH1cbiAgICByZXR1cm4gdXBwZXI7XG4gIH07XG5cbiAgU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZS5sb3dlckJvdW5kID0gZnVuY3Rpb24oZGF0dW0pIHtcbiAgICB2YXIgbG93ZXIgPSBbXTtcbiAgICB2YXIgY3VyID0gdGhpcy5maW5kKGRhdHVtKTtcbiAgICBpZiAoY3VyICYmIGN1ciAhPT0gdGhpcy5oZWFkKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGxvd2VyLnB1c2goY3VyLnByZXYuZGF0dW0pO1xuICAgICAgICBjdXIgPSBjdXIucHJldjtcbiAgICAgIH0gd2hpbGUgKGN1ciAhPT0gdGhpcy5oZWFkKTtcbiAgICB9XG4gICAgcmV0dXJuIGxvd2VyO1xuICB9O1xuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLmxvd2VyQ291bnQgPSBmdW5jdGlvbihkYXR1bSkge1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgdmFyIGN1ciA9IHRoaXMuZmluZChkYXR1bSk7XG4gICAgaWYgKGN1ciAmJiBjdXIgIT09IHRoaXMuaGVhZCkge1xuICAgICAgZG8ge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBjdXIgPSBjdXIucHJldjtcbiAgICAgIH0gd2hpbGUgKGN1ciAhPT0gdGhpcy5oZWFkKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9O1xuXG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUudXBwZXJDb3VudCA9IGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICB2YXIgY3VyID0gdGhpcy5maW5kKGRhdHVtKTtcbiAgICBpZiAoY3VyICYmIGN1ciAhPT0gdGhpcy50YWlsKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGN1ciA9IGN1ci5uZXh0O1xuICAgICAgfSB3aGlsZSAoY3VyICE9PSB0aGlzLnRhaWwpO1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH07XG5cbiAgcmV0dXJuIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdDtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3Q7XG4iLCJ2YXIgU29ydGVkTGlzdCA9IHJlcXVpcmUoJy4vc29ydGVkLWxpbmtlZC1saXN0LmpzJyk7XG4vLyBTVCBpcyBzb3J0ZWQgbGlzdCBvZiBib3VuZHMgYWxvbmcgeCBheGlzIGZvciB4VG9wIG9mIGN1cnJlbnQgc2VnbWVudC5cbi8vIGluIFNUIGVhY2ggbm9kZSBkYXRhIGlzIGluc3RhbmNlIG9mIEJvdW5kIChGYXN0TGlzdCkgaS5lLiBsaW5rZWQgbGlzdCBvZiBcbi8vIHBvbHlnb24gc2VnbWVudHMgc29ydGVkIGJvdHRvbSB0byB0b3AgIFxuLy8gZWRnZSA9IHRoaXMuaGVhZC5kYXR1bS5faGVhZFxuXG52YXIgU1QgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jb25zdHJ1Y3Rvcih7Y29tcGFyZTogZnVuY3Rpb24oYSxiKXtcbiAgICAvL3JldHVybiBhLl9oZWFkLmRhdGEueFRvcCAtIGIuX2hlYWQuZGF0YS54VG9wOyAgXG4gICAgLy9UT0RPIG5lZWQgdG8gY2hlY2sgZm9yIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIGxpbmVzXG4gICAgaWYgKE1hdGgucm91bmQxMChhLl9oZWFkLmRhdGEueFRvcCwtNSkgPT09XG4gICAgICBNYXRoLnJvdW5kMTAoYi5faGVhZC5kYXRhLnhUb3AsLTUpKSB7XG4gICAgICB2YXIgeFRvcCA9IGEuX2hlYWQuZGF0YS54VG9wO1xuICAgICAgdmFyIHNlZ0EgPSBhLl9oZWFkLmRhdGEuc2VnbWVudDtcbiAgICAgIHZhciBzZWdCID0gYi5faGVhZC5kYXRhLnNlZ21lbnQ7XG4gICAgICBpZiAoTWF0aC5yb3VuZDEwKE1hdGguYWJzKHNlZ0Euc3RhcnQueCAtIHNlZ0Iuc3RhcnQueCksLTUpID09PVxuICAgICAgICAgIE1hdGgucm91bmQxMChcbiAgICAgICAgICAgIE1hdGguYWJzKHNlZ0Iuc3RhcnQueCAtIHhUb3ApICsgTWF0aC5hYnMoeFRvcCAtIHNlZ0Euc3RhcnQueClcbiAgICAgICAgICAgICwtNSkpIFxuICAgICAge1xuICAgICAgICAvLyBpLmUuIG9uZSBlbmQgb24gbGVmdCBhbmQgYW5vdGhlciBvbiByaWdodCBvZiB4VG9wXG4gICAgICAgIHJldHVybiBzZWdBLnN0YXJ0LnggLSBzZWdCLnN0YXJ0Lng7XG4gICAgICAvL30gZWxzZSBpZiAoc2VnQS5zdGFydC54ID4geFRvcCAmJiBzZWdCLnN0YXJ0LnggPiB4VG9wKSB7XG4gICAgICAvLyAgcmV0dXJuIDEuMC9iLl9oZWFkLmRhdGEuZGVsdGFYIC0gMS4wL2EuX2hlYWQuZGF0YS5kZWx0YVg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBib3RoIGVuZCBhcmUgZWl0aGVyIHNpZGUgb2YgeFRvcFxuICAgICAgICByZXR1cm4gMS4wL2EuX2hlYWQuZGF0YS5kZWx0YVggLSAxLjAvYi5faGVhZC5kYXRhLmRlbHRhWDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGEuX2hlYWQuZGF0YS54VG9wIC0gYi5faGVhZC5kYXRhLnhUb3A7XG4gICAgfVxuICB9fSk7XG59O1xuXG5TVC5wcm90b3R5cGUgPSBuZXcgU29ydGVkTGlzdCgpO1xuU1QucHJvdG90eXBlLmdldEhlYWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaGVhZDtcbn07XG5TVC5wcm90b3R5cGUuZ2V0SGVhZERhdGEgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaGVhZC5kYXR1bS5nZXRIZWFkRGF0YSgpO1xufTtcblNULnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oZWRnZSkge1xuICByZXR1cm4gZWRnZS5kYXR1bS5nZXRIZWFkRGF0YSgpO1xufTtcblNULnByb3RvdHlwZS5nZXRCb3VuZCA9IGZ1bmN0aW9uKGVkZ2UpIHtcbiAgcmV0dXJuIGVkZ2UuZGF0dW07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNUO1xuIl19
(9)
});
