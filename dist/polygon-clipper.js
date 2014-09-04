!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.polygonClipper=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Clipper = require('./src/clipper.js');

module.exports = function(subj,clip,process,precision) {
  var instance = new Clipper();
  return instance.overlay(subj, clip, process);
};


},{"./src/clipper.js":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
//index.js
(function() {
  function allrings(polygon) {
    var rings;
    if(polygon.type && polygon.coordinates) {
      if (polygon.type === 'Polygon') {
        rings = polygon.coordinates;
      } else if (polygon.type === 'MultiPolygon') {
        rings = polygon.coordinates.reduce(function(prev,cur) {
          return prev.concat(cur);
        },[]);
      }
    }
    return rings;
  }
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = allrings;
  } else if (window) {
    window.geojsonAllRings = allrings;
  }
})();

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./sorted-linked-list.js":12}],6:[function(require,module,exports){
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


},{"fast-list":2}],7:[function(require,module,exports){
var intersection = require('intersection');
var FastList = require('fast-list'); 
var geojsonAllRings = require('geojson-allrings');
var getLocalMinimaList = require('./local-minima-list.js');
var List = require('./sorted-linked-list.js');
var AETClass = require('./aet.js');
var STClass = require('./st.js');
var ITClass = require('./it.js');
var Polygon = require('./polygon.js');
//TODO check how to include closure / or one time execution of function
var Precision = require('./precision.js');
// AET is sorted list of bounds along x axis.
// each data item in AET is bound(left/right) i.e. linked list of polygon semgents
// polygon segments are pushed from local minima to maxima in bound's linked-list
// so head is always at lowermost segment while we keep on removing(shifing) 
// the items in linked list during the scaning from down to top.
// So this way actualy I am able to sort first edge of bound in AET, while also
// have access to next pointer in the bound linked list.
var Clipper = function() {
};
Clipper.prototype.overlay = function(subj,clip,process) {
  this.AET = new AETClass();
  this.PT = [];
  this.SBT = new List();
  this.LMT = new List({compare: function(a,b) {
    return a.yBot - b.yBot;
  }});
  this.IT = null;
  // insert local minima node i.e. object of left and  right bound and yBot
  this.updateLMTandSBT(subj,'subject');
  this.updateLMTandSBT(clip,'clip');
  var yBot = this.SBT.pop(),yTop;
  while (this.SBT.head) {
    while (this.LMT.head && Math.round10(this.LMT.head.datum.yBot,-5) ===
      Math.round10(yBot,-5)) {
      this.addEdgesOfLMT(this.LMT.pop());
    }
    yTop = this.SBT.pop();
    //console.log('yBot: '+ yBot + ' ,yTop: '+ yTop);
    this.buildIntersections(yBot,yTop);
    this.processIntersections();
    this.processAETedges(yBot,yTop);
    yBot = yTop;
  }
  /*var output = { 
    exterior: {"type": "MultiPolygon", coordinates:[[]]},
    holes: []};
  polygons.forEach(function (poly) {
    if (poly.isHole) {
      output.holes.push(poly.getCoordinates());
    } else {
      output.exterior.coordinates[0].push(poly.getCoordinates());
    }
  });*/
  return this.extractPolygon();
};
Clipper.prototype.extractPolygon = function() {
  var output = {"type": "MultiPolygon", "coordinates": []},
    exteriors =[],
    holes = {};
  this.PT
    .filter(function (poly) {
      //remove polygon that are merged to another polygons
      return poly.left && poly.right;})
    .forEach(function (poly) {
      if(poly.isHole) {
        holes[poly.id] = {coordinates: poly.getCoordinates()};          
      } else {
        exteriors.push({coordinates: poly.getCoordinates(),
          holeIds: poly.holeIds});
      }
    });
  // append holes to exterior
  exteriors.forEach(function(poly) {
    var coordinates = [poly.coordinates];
    poly.holeIds.forEach(function(id) {
      coordinates.push(holes[id].coordinates);});
    output.coordinates.push(coordinates);
  });
  return output;
};
Clipper.prototype.updateLMTandSBT = function(poly,type) {
  if (poly.type && poly.type === 'Polygon') {
    this.updateLMTandSBTwithPolygon(poly,type);
  } else if (poly.type && poly.type === 'MultiPolygon') {
    poly.coordinates.forEach(function(each) {
      this.updateLMTandSBTwithPolygon({type:'Polygon',coordinates:each},type)
    },this);
  } else if (poly.type && poly.type === 'Feature') {
    this.updateLMTandSBTwithPolygon(poly.geometry,type);
  } else if (poly.type && poly.type === 'FeatureCollection') {
    poly.features.forEach(function(pg) {
      this.updateLMTandSBTwithPolygon(pg.geometry,type);
    },this);
  } else {
     //TODO throw error
  }
};
Clipper.prototype.updateLMTandSBTwithPolygon = function(poly,type) {
  geojsonAllRings(poly).forEach(function (ring) {
    getLocalMinimaList(ring,type).forEach(function(node){
      this.LMT.insert(node);
      //TODO finding node in sorted list is expensive
      if (!this.SBT.find(node.yBot)) this.SBT.insert(node.yBot);
    }, this);
  }, this);
};
//NOTE: every where edge means head of bound 
// always insert/attach in AET, ST, intersection point, polygon edge etc
Clipper.prototype.addEdgesOfLMT = function(node) {
  //TODO-vatti first insert in AET then addLocalMin if edges are cotributing
  this.AET.insert(node.left);
  this.AET.insert(node.right);
  node.left.getHeadData().side = this.AET.getSide(node.left);
  node.right.getHeadData().side = this.AET.getSide(node.right);
  // left is not necessary edge1
  if(this.AET.isContributing(node.left)) {
    this.addLocalMin(
      node.left.getHeadData().segment.start,
      node.left,
      node.right);
  }
  //TODO finding node in sorted list is expensive
  if (!this.SBT.find(node.left.getHeadData().yTop)) {
    this.SBT.insert(node.left.getHeadData().yTop);
  }
  if (!this.SBT.find(node.right.getHeadData().yTop)) {  
    this.SBT.insert(node.right.getHeadData().yTop);
  }
};
// each polygon is linked list (not sroted linked list) of left side edges 
// and right side edges.
Clipper.prototype.addLocalMin = function(point,edge1,edge2) {
  var poly = new Polygon(this.PT.length);
  poly.addLeft(point);
  poly.addRight(point);
  edge1.getHeadData().polygon = poly;
  edge2.getHeadData().polygon = poly;
  this.PT.push(poly);
  return poly;
};

Clipper.prototype.addLocalMax = function(point,edge1,edge2) {
  if(edge1.getHeadData().side === 'left') {
    this.addLeft(point,edge1);
  } else {
    this.addRight(point,edge1);
  }
  var poly1 = edge1.getHeadData().polygon,
    poly2 = edge2.getHeadData().polygon;
   
  if(!poly1.isEqual(poly2)) {
    poly2.appendPolygon(poly1,edge1.getHeadData().side);
    // change ref to edge2->polygon from edge1->polygon for all active edges 
    // that have edge1->polygon
    var curPoly, cur = this.AET.head;
    do {
      curPoly = this.AET.getData(cur).polygon;
      if (curPoly && curPoly.id === poly1.id) {
        this.AET.getData(cur).polygon = poly2;
      }
      cur = cur.next;
    } while (cur !== this.AET.head);
  }
  poly2.isHole = edge1.getHeadData().side === 'right';
  if(poly2.isHole) {
    this.assignToExterior(poly2,edge1,edge2);
  }
};

Clipper.prototype.buildIntersections = function(yBot,yTop) {
  var dY = yTop - yBot;
  ST = new STClass();
  this.IT = new ITClass(); 
  var intPoint;
  //initiate the first edge in ST
  var AETedge = this.AET.getHead(); 
  var xTop = this.AET.getData(AETedge).xBot + this.AET.getData(AETedge).deltaX * dY;
  this.AET.getData(AETedge).xTop = xTop;
  this.AET.getData(AETedge).isProcessed = false; //used in processAETedges
  var STedge = ST.insert(this.AET.getBound(AETedge)); //return the ref to inserted data

  AETedge = AETedge.next;
  while( AETedge !== this.AET.head) {
    this.AET.getData(AETedge).isProcessed = false; //used in processAETedges
    xTop = this.AET.getData(AETedge).xBot + this.AET.getData(AETedge).deltaX * dY;
    //check intersections
    //TODO what if xTop == STedge.xTop
    while(Math.round10(xTop,-5) < Math.round10(ST.getData(STedge).xTop,-5)) {
      intPoint = intersection.intersect(ST.getData(STedge).segment,
        this.AET.getData(AETedge).segment);
      //attaching head of the bound to int point
      intPoint.leftEdge = ST.getBound(STedge); // considering the bottom x
      intPoint.rightEdge = this.AET.getBound(AETedge);
      this.IT.insert(intPoint);
      if(STedge === ST.head) break;
      STedge = STedge.prev;
    }
    this.AET.getData(AETedge).xTop = xTop;
    ST.insert(this.AET.getBound(AETedge)); //TODO is should be insert before STedge
    STedge= ST.tail;
    AETedge = AETedge.next;
  }
};

Clipper.prototype.processIntersections = function() {
  var intPoint = this.IT.getHead();
  if (intPoint) {
    var intPointType,edge1,edge2, temp, isContributing;
    do {
      edge1 = this.IT.getData(intPoint).leftEdge;
      edge2 = this.IT.getData(intPoint).rightEdge;
      intPointType = this.classifyIntersection(edge1.getHeadData(), edge2.getHeadData());
      if (edge1.getHeadData().type === edge2.getHeadData().type) {
        //&& edge1.getHeadData().side !== edge2.getHeadData().side) {
        // like edges
        // TODO test case need to be checked
        if(this.AET.isContributing(edge1)) {
          if (edge1.getHeadData().side === 'left') {
            this.addLeft(this.IT.getData(intPoint),edge1);
            this.addRight(this.IT.getData(intPoint),edge2);
          } else {
            this.addRight(this.IT.getData(intPoint),edge1);
            this.addLeft(this.IT.getData(intPoint),edge2);
          }
        }
        temp = edge1.getHeadData().side;
        edge1.getHeadData().side = edge2.getHeadData().side;
        edge2.getHeadData().side = temp;
      } else {
        //TODO checking edge polygon is not part fo vatii algo
        if (intPointType === 'maxima' && edge1.getHeadData().polygon 
          && edge2.getHeadData().polygon) {
          this.addLocalMax(this.IT.getData(intPoint),edge1,edge2);
        } else if (intPointType === 'left-intermediate' 
          && edge2.getHeadData().polygon) {
          this.addLeft(this.IT.getData(intPoint),edge2);
        } else if (intPointType === 'right-intermediate' 
          && edge1.getHeadData().polygon) {
          this.addRight(this.IT.getData(intPoint),edge1);
        } else if (intPointType === 'minima') {
          this.addLocalMin(this.IT.getData(intPoint),edge1,edge2);
        }
      }
      this.AET.swap(edge1,edge2);
      //TODO can be done in if intPointType accordingly 
      //swap polygons
      temp = edge1.getHeadData().polygon;
      edge1.getHeadData().polygon = edge2.getHeadData().polygon;
      edge2.getHeadData().polygon = temp;
      //TODO why not recalculate side of edges
      intPoint = intPoint.next;
    } while (intPoint !== this.IT.head );
  }
};

Clipper.prototype.processAETedges = function(yBot,yTop) {
  var cur = this.AET.getHead(),
    vertexType,data,isContributing,prev;
  if (cur) {
    do { 
      this.AET.getData(cur).isProcessed = true;
      isContributing = this.AET.isContributing(this.AET.getBound(cur));
      //TODO vatti algo doesnt cal isContributing, can we carry forward like
        // side
      if (Math.round10(this.AET.getData(cur).yTop,-5) === Math.round10(yTop,-5)) {
        vertexType = this.AET.getData(cur).segment.end.type;
        if (vertexType === 'maxima') {
          if(isContributing) { 
            this.addLocalMax(this.AET.getData(cur).segment.end,this.AET.getBound(cur),
              this.AET.getBound(cur.next));
          }
          var e1 = cur;
          var e2 = cur.next;
          cur = cur.next.next;
          this.AET.remove(e1.datum);
          this.AET.remove(e2.datum);
        } else {
          vertexType = this.AET.getData(cur).side + '-' + vertexType;
          if (vertexType === 'left-intermediate') {
            if(isContributing) {
              this.addLeft(this.AET.getData(cur).segment.end,this.AET.getBound(cur));
            }
          } else if (vertexType === 'right-intermediate') {
            if(isContributing) {
              this.addRight(this.AET.getData(cur).segment.end,this.AET.getBound(cur));
            }
          }
          data = this.AET.getData(cur);
          cur = this.AET.succ(cur); //returns ref to same bound but moved to 
            // upper edge
          this.AET.getData(cur).side = data.side;
          //this.AET.getData(cur).isContributing = data.isContributing;
          this.AET.getData(cur).polygon = data.polygon;
          this.AET.getData(cur).isProcessed = true; //TODO sorted-'circular'-linked-list
            // is creating so many issue in while loop
          //TODO finding node in sorted list is expensive
          if (!this.SBT.find(this.AET.getData(cur).yTop)) 
            this.SBT.insert(this.AET.getData(cur).yTop);
          cur = cur.next;
        }
      } else {
        this.AET.getData(cur).xBot = this.AET.getData(cur).xTop; 
        cur = cur.next;
      }
    //} while (cur !== this.AET.head && this.AET.length > 0);
    } while (!this.AET.getData(cur).isProcessed)
  }
};

Clipper.prototype.addLeft = function(point,bound) {
  bound.getHeadData().polygon.addLeft(point);
};
Clipper.prototype.addRight = function(point,bound) {
  bound.getHeadData().polygon.addRight(point);
};
Clipper.prototype.assignToExterior = function(polygon, edge1,edge2) {
  var leftExteriorId, rightExteriorId,
    leftEdge, rightEdge,
    AETedge1 = this.AET.find(edge1),
    edgeData;
  var cur = AETedge1 ? AETedge1.prev : null; 
  if(cur) {
    do {
      edgeData = this.AET.getData(cur);
      if (edgeData.polygon && edgeData.isHole) {
        cur = cur.prev; 
      } else {
        if(edgeData.side === 'left') {
          if (edgeData.polygon.holeIds.indexOf(polygon.id) < 0) {
            //edgeData.polygon.holeIds.push(polygon.id);
            leftEdgeData = edgeData;
          }
        }
        break;
      }
    } while (cur !== this.AET.tail);
  }
  cur = AETedge1 ? AETedge1.next.next : null; //AETedge1.next is edge2
  if(cur) {
    do {
      edgeData = this.AET.getData(cur);
      if (edgeData.polygon && edgeData.isHole) {
        cur = cur.next;
      } else {
        if(edgeData.side === 'right') {
          if (edgeData.polygon.holeIds.indexOf(polygon.id) < 0) {
            //edgeData.polygon.holeIds.push(polygon.id);
            rightEdgeData = edgeData;
          }
        }
        break;
      }
    } while (cur !== this.AET.head);
  }
  if(leftEdgeData.polygon.id !== polygon.id && 
    leftEdgeData.polygon.id === rightEdgeData.polygon.id) {
    leftEdgeData.polygon.holeIds.push(polygon.id);
  }
};
Clipper.prototype.classifyIntersection = function(edge1,edge2) {
  var rules = { 
    'left-clip-x-left-subject': 'left-intermediate',
    'left-subject-x-left-clip': 'left-intermediate',
    'right-clip-x-right-subject': 'right-intermediate',
    'right-subject-x-right-clip': 'right-intermediate',
    'left-subject-x-right-clip': 'maxima',
    'left-clip-x-right-subject': 'maxima',
    'right-subject-x-left-clip': 'minima',
    'right-clip-x-left-subject': 'minima'
  };
  return rules[edge1.side + '-' + edge1.type +'-x-' + edge2.side + '-'+ edge2.type];
};

module.exports = Clipper;

},{"./aet.js":5,"./it.js":8,"./local-minima-list.js":9,"./polygon.js":10,"./precision.js":11,"./sorted-linked-list.js":12,"./st.js":13,"fast-list":2,"geojson-allrings":3,"intersection":4}],8:[function(require,module,exports){
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

},{"./sorted-linked-list.js":12}],9:[function(require,module,exports){
// local-min-max.js
// input close path i.e. first point and last point are equal
// return array of tags local minima, maxima and intermediate at each point
var Bound = require('./bound.js');
var List = require('./sorted-linked-list.js');
function getBounds(path,polygonType) {
  var bounds = [],
    partBound = [],
    totalDet = 0,
    bound = [],
    vertex = {},type;
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
  }
  return list;
}
module.exports = getBounds;

},{"./bound.js":6,"./sorted-linked-list.js":12}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./sorted-linked-list.js":12}]},{},[1])(1)
});


//# sourceMappingURL=polygon-clipper.js.map