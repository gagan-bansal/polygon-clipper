!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.polygonClipper=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/ubuntu/projects/polygon-clipper/index.js":[function(require,module,exports){
var Clipper = require('./src/clipper.js');

module.exports = function(subj,clip,process,precision) {
  var instance = new Clipper();
  return instance.overlay(subj, clip, process);
};


},{"./src/clipper.js":"/home/ubuntu/projects/polygon-clipper/src/clipper.js"}],"/home/ubuntu/projects/polygon-clipper/node_modules/fast-list/fast-list.js":[function(require,module,exports){
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

},{}],"/home/ubuntu/projects/polygon-clipper/node_modules/geojson-allrings/index.js":[function(require,module,exports){
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

},{}],"/home/ubuntu/projects/polygon-clipper/node_modules/intersection/index.js":[function(require,module,exports){
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

},{}],"/home/ubuntu/projects/polygon-clipper/src/aet.js":[function(require,module,exports){
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

},{"./sorted-linked-list.js":"/home/ubuntu/projects/polygon-clipper/src/sorted-linked-list.js"}],"/home/ubuntu/projects/polygon-clipper/src/bound.js":[function(require,module,exports){
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


},{"fast-list":"/home/ubuntu/projects/polygon-clipper/node_modules/fast-list/fast-list.js"}],"/home/ubuntu/projects/polygon-clipper/src/clipper.js":[function(require,module,exports){
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

},{"./aet.js":"/home/ubuntu/projects/polygon-clipper/src/aet.js","./it.js":"/home/ubuntu/projects/polygon-clipper/src/it.js","./local-minima-list.js":"/home/ubuntu/projects/polygon-clipper/src/local-minima-list.js","./polygon.js":"/home/ubuntu/projects/polygon-clipper/src/polygon.js","./precision.js":"/home/ubuntu/projects/polygon-clipper/src/precision.js","./sorted-linked-list.js":"/home/ubuntu/projects/polygon-clipper/src/sorted-linked-list.js","./st.js":"/home/ubuntu/projects/polygon-clipper/src/st.js","fast-list":"/home/ubuntu/projects/polygon-clipper/node_modules/fast-list/fast-list.js","geojson-allrings":"/home/ubuntu/projects/polygon-clipper/node_modules/geojson-allrings/index.js","intersection":"/home/ubuntu/projects/polygon-clipper/node_modules/intersection/index.js"}],"/home/ubuntu/projects/polygon-clipper/src/it.js":[function(require,module,exports){
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

},{"./sorted-linked-list.js":"/home/ubuntu/projects/polygon-clipper/src/sorted-linked-list.js"}],"/home/ubuntu/projects/polygon-clipper/src/local-minima-list.js":[function(require,module,exports){
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

},{"./bound.js":"/home/ubuntu/projects/polygon-clipper/src/bound.js","./sorted-linked-list.js":"/home/ubuntu/projects/polygon-clipper/src/sorted-linked-list.js"}],"/home/ubuntu/projects/polygon-clipper/src/polygon.js":[function(require,module,exports){
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

},{}],"/home/ubuntu/projects/polygon-clipper/src/precision.js":[function(require,module,exports){
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

},{}],"/home/ubuntu/projects/polygon-clipper/src/sorted-linked-list.js":[function(require,module,exports){
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

},{}],"/home/ubuntu/projects/polygon-clipper/src/st.js":[function(require,module,exports){
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

},{"./sorted-linked-list.js":"/home/ubuntu/projects/polygon-clipper/src/sorted-linked-list.js"}]},{},["/home/ubuntu/projects/polygon-clipper/index.js"])("/home/ubuntu/projects/polygon-clipper/index.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tY2xpcHBlci9pbmRleC5qcyIsIi9ob21lL3VidW50dS9wcm9qZWN0cy9wb2x5Z29uLWNsaXBwZXIvbm9kZV9tb2R1bGVzL2Zhc3QtbGlzdC9mYXN0LWxpc3QuanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1jbGlwcGVyL25vZGVfbW9kdWxlcy9nZW9qc29uLWFsbHJpbmdzL2luZGV4LmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tY2xpcHBlci9ub2RlX21vZHVsZXMvaW50ZXJzZWN0aW9uL2luZGV4LmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tY2xpcHBlci9zcmMvYWV0LmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tY2xpcHBlci9zcmMvYm91bmQuanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1jbGlwcGVyL3NyYy9jbGlwcGVyLmpzIiwiL2hvbWUvdWJ1bnR1L3Byb2plY3RzL3BvbHlnb24tY2xpcHBlci9zcmMvaXQuanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1jbGlwcGVyL3NyYy9sb2NhbC1taW5pbWEtbGlzdC5qcyIsIi9ob21lL3VidW50dS9wcm9qZWN0cy9wb2x5Z29uLWNsaXBwZXIvc3JjL3BvbHlnb24uanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1jbGlwcGVyL3NyYy9wcmVjaXNpb24uanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1jbGlwcGVyL3NyYy9zb3J0ZWQtbGlua2VkLWxpc3QuanMiLCIvaG9tZS91YnVudHUvcHJvamVjdHMvcG9seWdvbi1jbGlwcGVyL3NyYy9zdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBDbGlwcGVyID0gcmVxdWlyZSgnLi9zcmMvY2xpcHBlci5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN1YmosY2xpcCxwcm9jZXNzLHByZWNpc2lvbikge1xuICB2YXIgaW5zdGFuY2UgPSBuZXcgQ2xpcHBlcigpO1xuICByZXR1cm4gaW5zdGFuY2Uub3ZlcmxheShzdWJqLCBjbGlwLCBwcm9jZXNzKTtcbn07XG5cbiIsIjsoZnVuY3Rpb24oKSB7IC8vIGNsb3N1cmUgZm9yIHdlYiBicm93c2Vyc1xuXG5mdW5jdGlvbiBJdGVtIChkYXRhLCBwcmV2LCBuZXh0KSB7XG4gIHRoaXMubmV4dCA9IG5leHRcbiAgaWYgKG5leHQpIG5leHQucHJldiA9IHRoaXNcbiAgdGhpcy5wcmV2ID0gcHJldlxuICBpZiAocHJldikgcHJldi5uZXh0ID0gdGhpc1xuICB0aGlzLmRhdGEgPSBkYXRhXG59XG5cbmZ1bmN0aW9uIEZhc3RMaXN0ICgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEZhc3RMaXN0KSkgcmV0dXJuIG5ldyBGYXN0TGlzdFxuICB0aGlzLl9oZWFkID0gbnVsbFxuICB0aGlzLl90YWlsID0gbnVsbFxuICB0aGlzLmxlbmd0aCA9IDBcbn1cblxuRmFzdExpc3QucHJvdG90eXBlID1cbnsgcHVzaDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLl90YWlsID0gbmV3IEl0ZW0oZGF0YSwgdGhpcy5fdGFpbCwgbnVsbClcbiAgICBpZiAoIXRoaXMuX2hlYWQpIHRoaXMuX2hlYWQgPSB0aGlzLl90YWlsXG4gICAgdGhpcy5sZW5ndGggKytcbiAgfVxuXG4sIHBvcDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHZhciB0ID0gdGhpcy5fdGFpbFxuICAgIHRoaXMuX3RhaWwgPSB0LnByZXZcbiAgICBpZiAodC5wcmV2KSB7XG4gICAgICB0LnByZXYgPSB0aGlzLl90YWlsLm5leHQgPSBudWxsXG4gICAgfVxuICAgIHRoaXMubGVuZ3RoIC0tXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAxKSB0aGlzLl9oZWFkID0gdGhpcy5fdGFpbFxuICAgIGVsc2UgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB0aGlzLl9oZWFkID0gdGhpcy5fdGFpbCA9IG51bGxcbiAgICByZXR1cm4gdC5kYXRhXG4gIH1cblxuLCB1bnNoaWZ0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuX2hlYWQgPSBuZXcgSXRlbShkYXRhLCBudWxsLCB0aGlzLl9oZWFkKVxuICAgIGlmICghdGhpcy5fdGFpbCkgdGhpcy5fdGFpbCA9IHRoaXMuX2hlYWRcbiAgICB0aGlzLmxlbmd0aCArK1xuICB9XG5cbiwgc2hpZnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiB1bmRlZmluZWRcbiAgICB2YXIgaCA9IHRoaXMuX2hlYWRcbiAgICB0aGlzLl9oZWFkID0gaC5uZXh0XG4gICAgaWYgKGgubmV4dCkge1xuICAgICAgaC5uZXh0ID0gdGhpcy5faGVhZC5wcmV2ID0gbnVsbFxuICAgIH1cbiAgICB0aGlzLmxlbmd0aCAtLVxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkgdGhpcy5fdGFpbCA9IHRoaXMuX2hlYWRcbiAgICBlbHNlIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgdGhpcy5faGVhZCA9IHRoaXMuX3RhaWwgPSBudWxsXG4gICAgcmV0dXJuIGguZGF0YVxuICB9XG5cbiwgaXRlbTogZnVuY3Rpb24gKG4pIHtcbiAgICBpZiAobiA8IDApIG4gPSB0aGlzLmxlbmd0aCArIG5cbiAgICB2YXIgaCA9IHRoaXMuX2hlYWRcbiAgICB3aGlsZSAobi0tID4gMCAmJiBoKSBoID0gaC5uZXh0XG4gICAgcmV0dXJuIGggPyBoLmRhdGEgOiB1bmRlZmluZWRcbiAgfVxuXG4sIHNsaWNlOiBmdW5jdGlvbiAobiwgbSkge1xuICAgIGlmICghbikgbiA9IDBcbiAgICBpZiAoIW0pIG0gPSB0aGlzLmxlbmd0aFxuICAgIGlmIChtIDwgMCkgbSA9IHRoaXMubGVuZ3RoICsgbVxuICAgIGlmIChuIDwgMCkgbiA9IHRoaXMubGVuZ3RoICsgblxuXG4gICAgaWYgKG0gPT09IG4pIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGlmIChtIDwgbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBvZmZzZXQ6IFwiK24rXCIsXCIrbStcIiAobGVuZ3RoPVwiK3RoaXMubGVuZ3RoK1wiKVwiKVxuICAgIH1cblxuICAgIHZhciBsZW4gPSBtIC0gblxuICAgICAgLCByZXQgPSBuZXcgQXJyYXkobGVuKVxuICAgICAgLCBpID0gMFxuICAgICAgLCBoID0gdGhpcy5faGVhZFxuICAgIHdoaWxlIChuLS0gPiAwICYmIGgpIGggPSBoLm5leHRcbiAgICB3aGlsZSAoaSA8IGxlbiAmJiBoKSB7XG4gICAgICByZXRbaSsrXSA9IGguZGF0YVxuICAgICAgaCA9IGgubmV4dFxuICAgIH1cbiAgICByZXR1cm4gcmV0XG4gIH1cblxuLCBkcm9wOiBmdW5jdGlvbiAoKSB7XG4gICAgRmFzdExpc3QuY2FsbCh0aGlzKVxuICB9XG5cbiwgZm9yRWFjaDogZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICAgIHZhciBwID0gdGhpcy5faGVhZFxuICAgICAgLCBpID0gMFxuICAgICAgLCBsZW4gPSB0aGlzLmxlbmd0aFxuICAgIHdoaWxlIChpIDwgbGVuICYmIHApIHtcbiAgICAgIGZuLmNhbGwodGhpc3AgfHwgdGhpcywgcC5kYXRhLCBpLCB0aGlzKVxuICAgICAgcCA9IHAubmV4dFxuICAgICAgaSArK1xuICAgIH1cbiAgfVxuXG4sIG1hcDogZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICAgIHZhciBuID0gbmV3IEZhc3RMaXN0KClcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHYsIGksIG1lKSB7XG4gICAgICBuLnB1c2goZm4uY2FsbCh0aGlzcCB8fCBtZSwgdiwgaSwgbWUpKVxuICAgIH0pXG4gICAgcmV0dXJuIG5cbiAgfVxuXG4sIGZpbHRlcjogZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICAgIHZhciBuID0gbmV3IEZhc3RMaXN0KClcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHYsIGksIG1lKSB7XG4gICAgICBpZiAoZm4uY2FsbCh0aGlzcCB8fCBtZSwgdiwgaSwgbWUpKSBuLnB1c2godilcbiAgICB9KVxuICAgIHJldHVybiBuXG4gIH1cblxuLCByZWR1Y2U6IGZ1bmN0aW9uIChmbiwgdmFsLCB0aGlzcCkge1xuICAgIHZhciBpID0gMFxuICAgICAgLCBwID0gdGhpcy5faGVhZFxuICAgICAgLCBsZW4gPSB0aGlzLmxlbmd0aFxuICAgIGlmICghdmFsKSB7XG4gICAgICBpID0gMVxuICAgICAgdmFsID0gcCAmJiBwLmRhdGFcbiAgICAgIHAgPSBwICYmIHAubmV4dFxuICAgIH1cbiAgICB3aGlsZSAoaSA8IGxlbiAmJiBwKSB7XG4gICAgICB2YWwgPSBmbi5jYWxsKHRoaXNwIHx8IHRoaXMsIHZhbCwgcC5kYXRhLCB0aGlzKVxuICAgICAgaSArK1xuICAgICAgcCA9IHAubmV4dFxuICAgIH1cbiAgICByZXR1cm4gdmFsXG4gIH1cbn1cblxuaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZihleHBvcnRzKSkgbW9kdWxlLmV4cG9ydHMgPSBGYXN0TGlzdFxuZWxzZSBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YoZGVmaW5lKSAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShcIkZhc3RMaXN0XCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gRmFzdExpc3QgfSlcbn0gZWxzZSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcyB9KSgpLkZhc3RMaXN0ID0gRmFzdExpc3RcblxufSkoKVxuIiwiLy9pbmRleC5qc1xuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBhbGxyaW5ncyhwb2x5Z29uKSB7XG4gICAgdmFyIHJpbmdzO1xuICAgIGlmKHBvbHlnb24udHlwZSAmJiBwb2x5Z29uLmNvb3JkaW5hdGVzKSB7XG4gICAgICBpZiAocG9seWdvbi50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgICAgcmluZ3MgPSBwb2x5Z29uLmNvb3JkaW5hdGVzO1xuICAgICAgfSBlbHNlIGlmIChwb2x5Z29uLnR5cGUgPT09ICdNdWx0aVBvbHlnb24nKSB7XG4gICAgICAgIHJpbmdzID0gcG9seWdvbi5jb29yZGluYXRlcy5yZWR1Y2UoZnVuY3Rpb24ocHJldixjdXIpIHtcbiAgICAgICAgICByZXR1cm4gcHJldi5jb25jYXQoY3VyKTtcbiAgICAgICAgfSxbXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByaW5ncztcbiAgfVxuICBpZih0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gYWxscmluZ3M7XG4gIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgd2luZG93Lmdlb2pzb25BbGxSaW5ncyA9IGFsbHJpbmdzO1xuICB9XG59KSgpO1xuIiwidmFyIGludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ZWN0b3IgPSB7fTtcbiAgICB2ZWN0b3Iub0EgPSBmdW5jdGlvbihzZWdtZW50KSB7XG4gICAgICAgIHJldHVybiBzZWdtZW50LnN0YXJ0O1xuICAgIH07XG4gICAgdmVjdG9yLkFCID0gZnVuY3Rpb24oc2VnbWVudCkge1xuICAgICAgICB2YXIgc3RhcnQgPSBzZWdtZW50LnN0YXJ0O1xuICAgICAgICB2YXIgZW5kID0gc2VnbWVudC5lbmQ7XG4gICAgICAgIHJldHVybiB7eDplbmQueCAtIHN0YXJ0LngsIHk6IGVuZC55IC0gc3RhcnQueX07XG4gICAgfTtcbiAgICB2ZWN0b3IuYWRkID0gZnVuY3Rpb24odjEsdjIpIHtcbiAgICAgICAgcmV0dXJuIHt4OiB2MS54ICsgdjIueCwgeTogdjEueSArIHYyLnl9O1xuICAgIH1cbiAgICB2ZWN0b3Iuc3ViID0gZnVuY3Rpb24odjEsdjIpIHtcbiAgICAgICAgcmV0dXJuIHt4OnYxLnggLSB2Mi54LCB5OiB2MS55IC0gdjIueX07XG4gICAgfVxuICAgIHZlY3Rvci5zY2FsYXJNdWx0ID0gZnVuY3Rpb24ocywgdikge1xuICAgICAgICByZXR1cm4ge3g6IHMgKiB2LngsIHk6IHMgKiB2Lnl9O1xuICAgIH1cbiAgICB2ZWN0b3IuY3Jvc3NQcm9kdWN0ID0gZnVuY3Rpb24odjEsdjIpIHtcbiAgICAgICAgcmV0dXJuICh2MS54ICogdjIueSkgLSAodjIueCAqIHYxLnkpO1xuICAgIH07XG4gICAgdmFyIHNlbGYgPSB7fTtcbiAgICBzZWxmLnZlY3RvciA9IGZ1bmN0aW9uKHNlZ21lbnQpIHtcbiAgICAgICAgcmV0dXJuIHZlY3Rvci5BQihzZWdtZW50KTtcbiAgICB9O1xuICAgIHNlbGYuaW50ZXJzZWN0U2VnbWVudHMgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgLy8gdHVybiBhID0gcCArIHQqciB3aGVyZSAwPD10PD0xIChwYXJhbWV0ZXIpXG4gICAgICAgIC8vIGIgPSBxICsgdSpzIHdoZXJlIDA8PXU8PTEgKHBhcmFtZXRlcikgXG4gICAgICAgIHZhciBwID0gdmVjdG9yLm9BKGEpO1xuICAgICAgICB2YXIgciA9IHZlY3Rvci5BQihhKTtcblxuICAgICAgICB2YXIgcSA9IHZlY3Rvci5vQShiKTtcbiAgICAgICAgdmFyIHMgPSB2ZWN0b3IuQUIoYik7XG4gICAgXG4gICAgICAgIHZhciBjcm9zcyA9IHZlY3Rvci5jcm9zc1Byb2R1Y3QocixzKTsgXG4gICAgICAgIHZhciBxbXAgPSB2ZWN0b3Iuc3ViKHEscCk7XG4gICAgICAgIHZhciBudW1lcmF0b3IgPSB2ZWN0b3IuY3Jvc3NQcm9kdWN0KHFtcCwgcyk7XG4gICAgICAgIHZhciB0ID0gbnVtZXJhdG9yIC8gY3Jvc3M7XG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSB2ZWN0b3IuYWRkKHAsdmVjdG9yLnNjYWxhck11bHQodCxyKSk7XG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG4gICAgfTtcbiAgICBzZWxmLmlzUGFyYWxsZWwgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgLy8gYSBhbmQgYiBhcmUgbGluZSBzZWdtZW50cy4gXG4gICAgICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBhIGFuZCBiIGFyZSBwYXJhbGxlbCAob3IgY28tbGluZWFyKVxuICAgICAgICB2YXIgciA9IHZlY3Rvci5BQihhKTtcbiAgICAgICAgdmFyIHMgPSB2ZWN0b3IuQUIoYik7XG4gICAgICAgIHJldHVybiAodmVjdG9yLmNyb3NzUHJvZHVjdChyLHMpID09PSAwKTtcbiAgICB9O1xuICAgIHNlbGYuaXNDb2xsaW5lYXIgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgLy8gYSBhbmQgYiBhcmUgbGluZSBzZWdtZW50cy4gXG4gICAgICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBhIGFuZCBiIGFyZSBjby1saW5lYXJcbiAgICAgICAgdmFyIHAgPSB2ZWN0b3Iub0EoYSk7XG4gICAgICAgIHZhciByID0gdmVjdG9yLkFCKGEpO1xuXG4gICAgICAgIHZhciBxID0gdmVjdG9yLm9BKGIpO1xuICAgICAgICB2YXIgcyA9IHZlY3Rvci5BQihiKTtcbiAgICAgICAgcmV0dXJuICh2ZWN0b3IuY3Jvc3NQcm9kdWN0KHZlY3Rvci5zdWIocCxxKSwgcikgPT09IDApO1xuICAgIH07XG4gICAgc2VsZi5zYWZlSW50ZXJzZWN0ID0gZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgIGlmIChzZWxmLmlzUGFyYWxsZWwoYSxiKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmludGVyc2VjdFNlZ21lbnRzKGEsYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBzZWxmO1xufTtcbmludGVyc2VjdGlvbi5pbnRlcnNlY3RTZWdtZW50cyA9IGludGVyc2VjdGlvbigpLmludGVyc2VjdFNlZ21lbnRzO1xuaW50ZXJzZWN0aW9uLmludGVyc2VjdCA9IGludGVyc2VjdGlvbigpLnNhZmVJbnRlcnNlY3Q7XG5pbnRlcnNlY3Rpb24uaXNQYXJhbGxlbCA9IGludGVyc2VjdGlvbigpLmlzUGFyYWxsZWw7XG5pbnRlcnNlY3Rpb24uaXNDb2xsaW5lYXIgPSBpbnRlcnNlY3Rpb24oKS5pc0NvbGxpbmVhcjtcbmludGVyc2VjdGlvbi5kZXNjcmliZSA9IGZ1bmN0aW9uKGEsYikge1xuICAgIHZhciBpc0NvbGxpbmVhciA9IGludGVyc2VjdGlvbigpLmlzQ29sbGluZWFyKGEsYik7XG4gICAgdmFyIGlzUGFyYWxsZWwgPSBpbnRlcnNlY3Rpb24oKS5pc1BhcmFsbGVsKGEsYik7XG4gICAgdmFyIHBvaW50T2ZJbnRlcnNlY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzUGFyYWxsZWwgPT09IGZhbHNlKSB7XG4gICAgICAgIHBvaW50T2ZJbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3Rpb24oKS5pbnRlcnNlY3RTZWdtZW50cyhhLGIpO1xuICAgIH1cbiAgICByZXR1cm4ge2NvbGxpbmVhcjogaXNDb2xsaW5lYXIscGFyYWxsZWw6IGlzUGFyYWxsZWwsaW50ZXJzZWN0aW9uOnBvaW50T2ZJbnRlcnNlY3Rpb259O1xufTtcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGludGVyc2VjdGlvbjtcbiIsInZhciBTb3J0ZWRMaXN0ID0gcmVxdWlyZSgnLi9zb3J0ZWQtbGlua2VkLWxpc3QuanMnKTtcbi8vIEFFVCBpcyBzb3J0ZWQgbGlzdCBvZiBib3VuZHMgYWxvbmcgeCBheGlzIGZvciB4Qm90IG9mIGN1cnJlbnQgc2VnbWVudC5cbi8vIGluIEFFVCBlYWNoIG5vZGUgZGF0YSBpcyBib3VuZCBsaW5rZWQgbGlzdCBpbnN0YW5jZSBvZiBGYXN0TGlzdCBcbi8vIGVkZ2UgPSB0aGlzLmhlYWQuZGF0dW0uX2hlYWRcblxudmFyIEFFVCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIHByZWNpc2lvbiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wcmVjaXN0aW9uID8gb3B0aW9ucy5wcmVjaXNpb24gOiAtNTtcbiAgdGhpcy5jb25zdHJ1Y3Rvcih7Y29tcGFyZTogZnVuY3Rpb24oYSxiKXtcbiAgICAvL1RPRE8gbmVlZCB0byBjaGVjayBmb3IgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgbGluZXNcbiAgICAvL1RPRE8gYXBwbHkgcHJlY2lzaW9uIGluIFNUIGNvbXBhcmUgZnVuY3Rpb25cbiAgICBpZiAoTWF0aC5yb3VuZDEwKGEuX2hlYWQuZGF0YS54Qm90LHByZWNpc2lvbikgPT09XG4gICAgICBNYXRoLnJvdW5kMTAoYi5faGVhZC5kYXRhLnhCb3QscHJlY2lzaW9uKSkge1xuICAgICAgdmFyIHhCb3QgPSBhLl9oZWFkLmRhdGEueEJvdDtcbiAgICAgIHZhciBzZWdBID0gYS5faGVhZC5kYXRhLnNlZ21lbnQ7XG4gICAgICB2YXIgc2VnQiA9IGIuX2hlYWQuZGF0YS5zZWdtZW50O1xuICAgICAgdmFyIGQxID0gTWF0aC5yb3VuZDEwKE1hdGguYWJzKHNlZ0EuZW5kLnggLSBzZWdCLmVuZC54KSxwcmVjaXNpb24pO1xuICAgICAgdmFyIGQyID0gTWF0aC5yb3VuZDEwKFxuICAgICAgICBNYXRoLmFicyhzZWdCLmVuZC54IC0geEJvdCkgKyBNYXRoLmFicyh4Qm90IC0gc2VnQS5lbmQueClcbiAgICAgICAgLCBwcmVjaXNpb24pO1xuICAgICAgaWYgKCBkMSA9PT0gZDIpIHtcbiAgICAgICAgLy8gaS5lLiBvbmUgZWRuIG9uIGxlZnQgYW5kIGFub3RoZXIgb24gcmlnaHQgb2YgeEJvdFxuICAgICAgICByZXR1cm4gc2VnQS5lbmQueCAtIHNlZ0IuZW5kLng7XG4gICAgICAvL30gZWxzZSBpZiAoc2VnQS5lbmQueCA+IHhCb3QgJiYgc2VnQi5lbmQueCA+IHhCb3QpIHtcbiAgICAgIC8vICByZXR1cm4gMS4wL2IuX2hlYWQuZGF0YS5kZWx0YVggLSAxLjAvYS5faGVhZC5kYXRhLmRlbHRhWDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGJvdGggZW5kIGFyZSBlaXRoZXIgc2lkZSBvZiB4Ym90XG4gICAgICAgIHJldHVybiAxLjAvYi5faGVhZC5kYXRhLmRlbHRhWCAtIDEuMC9hLl9oZWFkLmRhdGEuZGVsdGFYO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYS5faGVhZC5kYXRhLnhCb3QgLSBiLl9oZWFkLmRhdGEueEJvdDtcbiAgICB9XG4gIH19KTtcbn07XG5cbkFFVC5wcm90b3R5cGUgPSBuZXcgU29ydGVkTGlzdCgpO1xuQUVULnByb3RvdHlwZS5nZXRIZWFkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmhlYWQ7XG59O1xuQUVULnByb3RvdHlwZS5nZXRIZWFkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5oZWFkLmRhdHVtLmdldEhlYWREYXRhKCk7XG59O1xuQUVULnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oZWRnZSkge1xuICByZXR1cm4gZWRnZS5kYXR1bS5nZXRIZWFkRGF0YSgpO1xufTtcbkFFVC5wcm90b3R5cGUuZ2V0Qm91bmQgPSBmdW5jdGlvbihlZGdlKSB7XG4gIHJldHVybiBlZGdlLmRhdHVtO1xufTtcbkFFVC5wcm90b3R5cGUuaXNDb250cmlidXRpbmcgPSBmdW5jdGlvbihib3VuZCkge1xuICAvL2NoZWNrIGlmIGVkZ2UgaXMgY29udHJpYnV0aW5nIGJ5IGV2ZW4vb2RkIHJ1bGVcbiAgdmFyIGxlZnRDb3VudCA9IHRoaXMubG93ZXJCb3VuZChib3VuZClcbiAgICAuZmlsdGVyKGZ1bmN0aW9uKGJvdW5kKSB7XG4gICAgICByZXR1cm4gYm91bmQuZ2V0SGVhZERhdGEoKS50eXBlID09PSB0aGlzWzBdO1xuICAgIH0sW29wcG9zaXRlKGJvdW5kLmdldEhlYWREYXRhKCkudHlwZSldKTtcbiAgcmV0dXJuIGxlZnRDb3VudC5sZW5ndGggJSAyICE9PSAwO1xufTtcbkFFVC5wcm90b3R5cGUuZ2V0U2lkZSA9IGZ1bmN0aW9uKGJvdW5kKSB7XG4gIHZhciBsZWZ0Q291bnQgPSB0aGlzLmxvd2VyQm91bmQoYm91bmQpXG4gICAgLmZpbHRlcihmdW5jdGlvbihib3VuZCkge1xuICAgICAgcmV0dXJuIGJvdW5kLmdldEhlYWREYXRhKCkudHlwZSA9PT0gdGhpc1swXTtcbiAgICB9LFtib3VuZC5nZXRIZWFkRGF0YSgpLnR5cGVdKTtcbiAgICByZXR1cm4gbGVmdENvdW50Lmxlbmd0aCAlIDIgPT0gMCA/ICdsZWZ0JyA6ICdyaWdodCc7XG59O1xuXG5BRVQucHJvdG90eXBlLnN1Y2MgPSBmdW5jdGlvbihlZGdlKSB7XG4gIHZhciBib3VuZCA9IGVkZ2UuZGF0dW07XG4gIC8vdGhpcy5yZW1vdmUoYm91bmQpO1xuICBib3VuZC5zaGlmdCgpO1xuICAvL3JldHVybiB0aGlzLmluc2VydChib3VuZCk7XG4gIHJldHVybiBlZGdlO1xufTtcblxuQUVULnByb3RvdHlwZS5zd2FwID0gZnVuY3Rpb24oYm91bmQxLGJvdW5kMikge1xuICAvL2NvbnNpZGVyaW5nIGJvdW5kMSBhbmQgYm91bmQyIGFyZSBjb25zaWN1dGl2ZSBhbmQgYm9vdW5kMiB3b3VsZCBuZXZlciBiZSBoZWFkIFxuICAvLyBjb25zaWRlciBvcmVkZXIgYSxiLGMsZCBhbmQgcmVwbGFjaW5nIGIsYyB3aWxsIHJlc3VsdCBhLGMsYixkXG4gIHZhciBiID0gdGhpcy5maW5kKGJvdW5kMSk7XG4gIHZhciBjID0gdGhpcy5maW5kKGJvdW5kMik7XG4gIGlmIChiID09IHRoaXMuaGVhZCAmJiBjID09IHRoaXMudGFpbCkge1xuICAgIHRoaXMudGFpbCA9IGI7XG4gICAgdGhpcy5oZWFkID0gYztcbiAgICByZXR1cm4gdGhpczsgICAgICBcbiAgfSBlbHNlIGlmIChiID09IHRoaXMuaGVhZCkge1xuICAgIHRoaXMuaGVhZCA9IGM7XG4gIH0gZWxzZSBpZiAoYyA9PSB0aGlzLnRhaWwpIHtcbiAgICB0aGlzLnRhaWwgPSBiO1xuICB9XG4gIHZhciBhID0gYi5wcmV2O1xuICB2YXIgZCA9IGMubmV4dDtcblxuICBiLnByZXYgPSBjO1xuICBiLm5leHQgPSBkO1xuICBkLnByZXYgPSBiO1xuXG4gIGMubmV4dCA9IGI7XG4gIGMucHJldiA9IGE7XG4gIGEubmV4dCA9IGM7XG4gIHJldHVybiB0aGlzO1xufTtcbkFFVC5wcm90b3R5cGUuaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbihhLCBiKSB7XG4gIGlmIChiID09PSB0aGlzLnRhaWwpIHtcbiAgICBhLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgdGhpcy50YWlsID0gYTtcbiAgICB0aGlzLmhlYWQucHJldiA9IHRoaXMudGFpbDtcbiAgfSBlbHNlIHtcbiAgICBhLm5leHQgPSBiLm5leHQ7XG4gICAgYi5uZXh0LnByZXYgPSBhO1xuICB9XG4gIGEucHJldiA9IGI7XG4gIHJldHVybiBiLm5leHQgPSBhO1xufTtcblxuZnVuY3Rpb24gb3Bwb3NpdGUodHlwZSkge1xuICByZXR1cm4gdHlwZSA9PT0gJ3N1YmplY3QnID8gJ2NsaXAnIDogJ3N1YmplY3QnO1xufVxubW9kdWxlLmV4cG9ydHMgPSBBRVQ7XG4iLCJ2YXIgRmFzdExpc3QgPSByZXF1aXJlKCdmYXN0LWxpc3QnKTtcblxuLy8gYm91bmQobGVmdC9yaWdodCkgaXMgbGlua2VkIGxpc3Qgb2YgcG9seWdvbiBzZW1nZW50cy4gUG9seWdvbiBzZWdtZW50cyBhcmVcbi8vIHB1c2hlZCBmcm9tIGxvY2FsIG1pbmltYSB0byBtYXhpbWEgaW4gYm91bmQncyBsaW5rZWQtbGlzdC4gU28gaGVhZCBvZiBib3VuZFxuLy8gKGxpbmtlZCBsaXN0KSBpcyBhbHdheXMgYXQgbG93ZXJtb3N0IHNlZ21lbnQgd2hpbGUgd2Uga2VlcCBvbiByZW1vdmluZyBcbi8vIChzaGlmaW5nKSB0aGUgaXRlbXMgaW4gbGlua2VkIGxpc3QgZHVyaW5nIHRoZSBzY2FuaW5nIGZyb20gYm90dG9tIHRvIHRvcC5cblxudmFyIEJvdW5kID0gZnVuY3Rpb24oKSB7fTtcbkJvdW5kLnByb3RvdHlwZSA9IG5ldyBGYXN0TGlzdCgpO1xuXG5Cb3VuZC5wcm90b3R5cGUuZ2V0SGVhZERhdGEgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX2hlYWQuZGF0YTtcbn07XG5Cb3VuZC5wcm90b3R5cGUuZ2V0SGVhZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5faGVhZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQm91bmQ7XG5cbiIsInZhciBpbnRlcnNlY3Rpb24gPSByZXF1aXJlKCdpbnRlcnNlY3Rpb24nKTtcbnZhciBGYXN0TGlzdCA9IHJlcXVpcmUoJ2Zhc3QtbGlzdCcpOyBcbnZhciBnZW9qc29uQWxsUmluZ3MgPSByZXF1aXJlKCdnZW9qc29uLWFsbHJpbmdzJyk7XG52YXIgZ2V0TG9jYWxNaW5pbWFMaXN0ID0gcmVxdWlyZSgnLi9sb2NhbC1taW5pbWEtbGlzdC5qcycpO1xudmFyIExpc3QgPSByZXF1aXJlKCcuL3NvcnRlZC1saW5rZWQtbGlzdC5qcycpO1xudmFyIEFFVENsYXNzID0gcmVxdWlyZSgnLi9hZXQuanMnKTtcbnZhciBTVENsYXNzID0gcmVxdWlyZSgnLi9zdC5qcycpO1xudmFyIElUQ2xhc3MgPSByZXF1aXJlKCcuL2l0LmpzJyk7XG52YXIgUG9seWdvbiA9IHJlcXVpcmUoJy4vcG9seWdvbi5qcycpO1xuLy9UT0RPIGNoZWNrIGhvdyB0byBpbmNsdWRlIGNsb3N1cmUgLyBvciBvbmUgdGltZSBleGVjdXRpb24gb2YgZnVuY3Rpb25cbnZhciBQcmVjaXNpb24gPSByZXF1aXJlKCcuL3ByZWNpc2lvbi5qcycpO1xuLy8gQUVUIGlzIHNvcnRlZCBsaXN0IG9mIGJvdW5kcyBhbG9uZyB4IGF4aXMuXG4vLyBlYWNoIGRhdGEgaXRlbSBpbiBBRVQgaXMgYm91bmQobGVmdC9yaWdodCkgaS5lLiBsaW5rZWQgbGlzdCBvZiBwb2x5Z29uIHNlbWdlbnRzXG4vLyBwb2x5Z29uIHNlZ21lbnRzIGFyZSBwdXNoZWQgZnJvbSBsb2NhbCBtaW5pbWEgdG8gbWF4aW1hIGluIGJvdW5kJ3MgbGlua2VkLWxpc3Rcbi8vIHNvIGhlYWQgaXMgYWx3YXlzIGF0IGxvd2VybW9zdCBzZWdtZW50IHdoaWxlIHdlIGtlZXAgb24gcmVtb3Zpbmcoc2hpZmluZykgXG4vLyB0aGUgaXRlbXMgaW4gbGlua2VkIGxpc3QgZHVyaW5nIHRoZSBzY2FuaW5nIGZyb20gZG93biB0byB0b3AuXG4vLyBTbyB0aGlzIHdheSBhY3R1YWx5IEkgYW0gYWJsZSB0byBzb3J0IGZpcnN0IGVkZ2Ugb2YgYm91bmQgaW4gQUVULCB3aGlsZSBhbHNvXG4vLyBoYXZlIGFjY2VzcyB0byBuZXh0IHBvaW50ZXIgaW4gdGhlIGJvdW5kIGxpbmtlZCBsaXN0LlxudmFyIENsaXBwZXIgPSBmdW5jdGlvbigpIHtcbn07XG5DbGlwcGVyLnByb3RvdHlwZS5vdmVybGF5ID0gZnVuY3Rpb24oc3ViaixjbGlwLHByb2Nlc3MpIHtcbiAgdGhpcy5BRVQgPSBuZXcgQUVUQ2xhc3MoKTtcbiAgdGhpcy5QVCA9IFtdO1xuICB0aGlzLlNCVCA9IG5ldyBMaXN0KCk7XG4gIHRoaXMuTE1UID0gbmV3IExpc3Qoe2NvbXBhcmU6IGZ1bmN0aW9uKGEsYikge1xuICAgIHJldHVybiBhLnlCb3QgLSBiLnlCb3Q7XG4gIH19KTtcbiAgdGhpcy5JVCA9IG51bGw7XG4gIC8vIGluc2VydCBsb2NhbCBtaW5pbWEgbm9kZSBpLmUuIG9iamVjdCBvZiBsZWZ0IGFuZCAgcmlnaHQgYm91bmQgYW5kIHlCb3RcbiAgdGhpcy51cGRhdGVMTVRhbmRTQlQoc3Viaiwnc3ViamVjdCcpO1xuICB0aGlzLnVwZGF0ZUxNVGFuZFNCVChjbGlwLCdjbGlwJyk7XG4gIHZhciB5Qm90ID0gdGhpcy5TQlQucG9wKCkseVRvcDtcbiAgd2hpbGUgKHRoaXMuU0JULmhlYWQpIHtcbiAgICB3aGlsZSAodGhpcy5MTVQuaGVhZCAmJiBNYXRoLnJvdW5kMTAodGhpcy5MTVQuaGVhZC5kYXR1bS55Qm90LC01KSA9PT1cbiAgICAgIE1hdGgucm91bmQxMCh5Qm90LC01KSkge1xuICAgICAgdGhpcy5hZGRFZGdlc09mTE1UKHRoaXMuTE1ULnBvcCgpKTtcbiAgICB9XG4gICAgeVRvcCA9IHRoaXMuU0JULnBvcCgpO1xuICAgIC8vY29uc29sZS5sb2coJ3lCb3Q6ICcrIHlCb3QgKyAnICx5VG9wOiAnKyB5VG9wKTtcbiAgICB0aGlzLmJ1aWxkSW50ZXJzZWN0aW9ucyh5Qm90LHlUb3ApO1xuICAgIHRoaXMucHJvY2Vzc0ludGVyc2VjdGlvbnMoKTtcbiAgICB0aGlzLnByb2Nlc3NBRVRlZGdlcyh5Qm90LHlUb3ApO1xuICAgIHlCb3QgPSB5VG9wO1xuICB9XG4gIC8qdmFyIG91dHB1dCA9IHsgXG4gICAgZXh0ZXJpb3I6IHtcInR5cGVcIjogXCJNdWx0aVBvbHlnb25cIiwgY29vcmRpbmF0ZXM6W1tdXX0sXG4gICAgaG9sZXM6IFtdfTtcbiAgcG9seWdvbnMuZm9yRWFjaChmdW5jdGlvbiAocG9seSkge1xuICAgIGlmIChwb2x5LmlzSG9sZSkge1xuICAgICAgb3V0cHV0LmhvbGVzLnB1c2gocG9seS5nZXRDb29yZGluYXRlcygpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LmV4dGVyaW9yLmNvb3JkaW5hdGVzWzBdLnB1c2gocG9seS5nZXRDb29yZGluYXRlcygpKTtcbiAgICB9XG4gIH0pOyovXG4gIHJldHVybiB0aGlzLmV4dHJhY3RQb2x5Z29uKCk7XG59O1xuQ2xpcHBlci5wcm90b3R5cGUuZXh0cmFjdFBvbHlnb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIG91dHB1dCA9IHtcInR5cGVcIjogXCJNdWx0aVBvbHlnb25cIiwgXCJjb29yZGluYXRlc1wiOiBbXX0sXG4gICAgZXh0ZXJpb3JzID1bXSxcbiAgICBob2xlcyA9IHt9O1xuICB0aGlzLlBUXG4gICAgLmZpbHRlcihmdW5jdGlvbiAocG9seSkge1xuICAgICAgLy9yZW1vdmUgcG9seWdvbiB0aGF0IGFyZSBtZXJnZWQgdG8gYW5vdGhlciBwb2x5Z29uc1xuICAgICAgcmV0dXJuIHBvbHkubGVmdCAmJiBwb2x5LnJpZ2h0O30pXG4gICAgLmZvckVhY2goZnVuY3Rpb24gKHBvbHkpIHtcbiAgICAgIGlmKHBvbHkuaXNIb2xlKSB7XG4gICAgICAgIGhvbGVzW3BvbHkuaWRdID0ge2Nvb3JkaW5hdGVzOiBwb2x5LmdldENvb3JkaW5hdGVzKCl9OyAgICAgICAgICBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4dGVyaW9ycy5wdXNoKHtjb29yZGluYXRlczogcG9seS5nZXRDb29yZGluYXRlcygpLFxuICAgICAgICAgIGhvbGVJZHM6IHBvbHkuaG9sZUlkc30pO1xuICAgICAgfVxuICAgIH0pO1xuICAvLyBhcHBlbmQgaG9sZXMgdG8gZXh0ZXJpb3JcbiAgZXh0ZXJpb3JzLmZvckVhY2goZnVuY3Rpb24ocG9seSkge1xuICAgIHZhciBjb29yZGluYXRlcyA9IFtwb2x5LmNvb3JkaW5hdGVzXTtcbiAgICBwb2x5LmhvbGVJZHMuZm9yRWFjaChmdW5jdGlvbihpZCkge1xuICAgICAgY29vcmRpbmF0ZXMucHVzaChob2xlc1tpZF0uY29vcmRpbmF0ZXMpO30pO1xuICAgIG91dHB1dC5jb29yZGluYXRlcy5wdXNoKGNvb3JkaW5hdGVzKTtcbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59O1xuQ2xpcHBlci5wcm90b3R5cGUudXBkYXRlTE1UYW5kU0JUID0gZnVuY3Rpb24ocG9seSx0eXBlKSB7XG4gIGlmIChwb2x5LnR5cGUgJiYgcG9seS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICB0aGlzLnVwZGF0ZUxNVGFuZFNCVHdpdGhQb2x5Z29uKHBvbHksdHlwZSk7XG4gIH0gZWxzZSBpZiAocG9seS50eXBlICYmIHBvbHkudHlwZSA9PT0gJ011bHRpUG9seWdvbicpIHtcbiAgICBwb2x5LmNvb3JkaW5hdGVzLmZvckVhY2goZnVuY3Rpb24oZWFjaCkge1xuICAgICAgdGhpcy51cGRhdGVMTVRhbmRTQlR3aXRoUG9seWdvbih7dHlwZTonUG9seWdvbicsY29vcmRpbmF0ZXM6ZWFjaH0sdHlwZSlcbiAgICB9LHRoaXMpO1xuICB9IGVsc2UgaWYgKHBvbHkudHlwZSAmJiBwb2x5LnR5cGUgPT09ICdGZWF0dXJlJykge1xuICAgIHRoaXMudXBkYXRlTE1UYW5kU0JUd2l0aFBvbHlnb24ocG9seS5nZW9tZXRyeSx0eXBlKTtcbiAgfSBlbHNlIGlmIChwb2x5LnR5cGUgJiYgcG9seS50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgcG9seS5mZWF0dXJlcy5mb3JFYWNoKGZ1bmN0aW9uKHBnKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxNVGFuZFNCVHdpdGhQb2x5Z29uKHBnLmdlb21ldHJ5LHR5cGUpO1xuICAgIH0sdGhpcyk7XG4gIH0gZWxzZSB7XG4gICAgIC8vVE9ETyB0aHJvdyBlcnJvclxuICB9XG59O1xuQ2xpcHBlci5wcm90b3R5cGUudXBkYXRlTE1UYW5kU0JUd2l0aFBvbHlnb24gPSBmdW5jdGlvbihwb2x5LHR5cGUpIHtcbiAgZ2VvanNvbkFsbFJpbmdzKHBvbHkpLmZvckVhY2goZnVuY3Rpb24gKHJpbmcpIHtcbiAgICBnZXRMb2NhbE1pbmltYUxpc3QocmluZyx0eXBlKS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgdGhpcy5MTVQuaW5zZXJ0KG5vZGUpO1xuICAgICAgLy9UT0RPIGZpbmRpbmcgbm9kZSBpbiBzb3J0ZWQgbGlzdCBpcyBleHBlbnNpdmVcbiAgICAgIGlmICghdGhpcy5TQlQuZmluZChub2RlLnlCb3QpKSB0aGlzLlNCVC5pbnNlcnQobm9kZS55Qm90KTtcbiAgICB9LCB0aGlzKTtcbiAgfSwgdGhpcyk7XG59O1xuLy9OT1RFOiBldmVyeSB3aGVyZSBlZGdlIG1lYW5zIGhlYWQgb2YgYm91bmQgXG4vLyBhbHdheXMgaW5zZXJ0L2F0dGFjaCBpbiBBRVQsIFNULCBpbnRlcnNlY3Rpb24gcG9pbnQsIHBvbHlnb24gZWRnZSBldGNcbkNsaXBwZXIucHJvdG90eXBlLmFkZEVkZ2VzT2ZMTVQgPSBmdW5jdGlvbihub2RlKSB7XG4gIC8vVE9ETy12YXR0aSBmaXJzdCBpbnNlcnQgaW4gQUVUIHRoZW4gYWRkTG9jYWxNaW4gaWYgZWRnZXMgYXJlIGNvdHJpYnV0aW5nXG4gIHRoaXMuQUVULmluc2VydChub2RlLmxlZnQpO1xuICB0aGlzLkFFVC5pbnNlcnQobm9kZS5yaWdodCk7XG4gIG5vZGUubGVmdC5nZXRIZWFkRGF0YSgpLnNpZGUgPSB0aGlzLkFFVC5nZXRTaWRlKG5vZGUubGVmdCk7XG4gIG5vZGUucmlnaHQuZ2V0SGVhZERhdGEoKS5zaWRlID0gdGhpcy5BRVQuZ2V0U2lkZShub2RlLnJpZ2h0KTtcbiAgLy8gbGVmdCBpcyBub3QgbmVjZXNzYXJ5IGVkZ2UxXG4gIGlmKHRoaXMuQUVULmlzQ29udHJpYnV0aW5nKG5vZGUubGVmdCkpIHtcbiAgICB0aGlzLmFkZExvY2FsTWluKFxuICAgICAgbm9kZS5sZWZ0LmdldEhlYWREYXRhKCkuc2VnbWVudC5zdGFydCxcbiAgICAgIG5vZGUubGVmdCxcbiAgICAgIG5vZGUucmlnaHQpO1xuICB9XG4gIC8vVE9ETyBmaW5kaW5nIG5vZGUgaW4gc29ydGVkIGxpc3QgaXMgZXhwZW5zaXZlXG4gIGlmICghdGhpcy5TQlQuZmluZChub2RlLmxlZnQuZ2V0SGVhZERhdGEoKS55VG9wKSkge1xuICAgIHRoaXMuU0JULmluc2VydChub2RlLmxlZnQuZ2V0SGVhZERhdGEoKS55VG9wKTtcbiAgfVxuICBpZiAoIXRoaXMuU0JULmZpbmQobm9kZS5yaWdodC5nZXRIZWFkRGF0YSgpLnlUb3ApKSB7ICBcbiAgICB0aGlzLlNCVC5pbnNlcnQobm9kZS5yaWdodC5nZXRIZWFkRGF0YSgpLnlUb3ApO1xuICB9XG59O1xuLy8gZWFjaCBwb2x5Z29uIGlzIGxpbmtlZCBsaXN0IChub3Qgc3JvdGVkIGxpbmtlZCBsaXN0KSBvZiBsZWZ0IHNpZGUgZWRnZXMgXG4vLyBhbmQgcmlnaHQgc2lkZSBlZGdlcy5cbkNsaXBwZXIucHJvdG90eXBlLmFkZExvY2FsTWluID0gZnVuY3Rpb24ocG9pbnQsZWRnZTEsZWRnZTIpIHtcbiAgdmFyIHBvbHkgPSBuZXcgUG9seWdvbih0aGlzLlBULmxlbmd0aCk7XG4gIHBvbHkuYWRkTGVmdChwb2ludCk7XG4gIHBvbHkuYWRkUmlnaHQocG9pbnQpO1xuICBlZGdlMS5nZXRIZWFkRGF0YSgpLnBvbHlnb24gPSBwb2x5O1xuICBlZGdlMi5nZXRIZWFkRGF0YSgpLnBvbHlnb24gPSBwb2x5O1xuICB0aGlzLlBULnB1c2gocG9seSk7XG4gIHJldHVybiBwb2x5O1xufTtcblxuQ2xpcHBlci5wcm90b3R5cGUuYWRkTG9jYWxNYXggPSBmdW5jdGlvbihwb2ludCxlZGdlMSxlZGdlMikge1xuICBpZihlZGdlMS5nZXRIZWFkRGF0YSgpLnNpZGUgPT09ICdsZWZ0Jykge1xuICAgIHRoaXMuYWRkTGVmdChwb2ludCxlZGdlMSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hZGRSaWdodChwb2ludCxlZGdlMSk7XG4gIH1cbiAgdmFyIHBvbHkxID0gZWRnZTEuZ2V0SGVhZERhdGEoKS5wb2x5Z29uLFxuICAgIHBvbHkyID0gZWRnZTIuZ2V0SGVhZERhdGEoKS5wb2x5Z29uO1xuICAgXG4gIGlmKCFwb2x5MS5pc0VxdWFsKHBvbHkyKSkge1xuICAgIHBvbHkyLmFwcGVuZFBvbHlnb24ocG9seTEsZWRnZTEuZ2V0SGVhZERhdGEoKS5zaWRlKTtcbiAgICAvLyBjaGFuZ2UgcmVmIHRvIGVkZ2UyLT5wb2x5Z29uIGZyb20gZWRnZTEtPnBvbHlnb24gZm9yIGFsbCBhY3RpdmUgZWRnZXMgXG4gICAgLy8gdGhhdCBoYXZlIGVkZ2UxLT5wb2x5Z29uXG4gICAgdmFyIGN1clBvbHksIGN1ciA9IHRoaXMuQUVULmhlYWQ7XG4gICAgZG8ge1xuICAgICAgY3VyUG9seSA9IHRoaXMuQUVULmdldERhdGEoY3VyKS5wb2x5Z29uO1xuICAgICAgaWYgKGN1clBvbHkgJiYgY3VyUG9seS5pZCA9PT0gcG9seTEuaWQpIHtcbiAgICAgICAgdGhpcy5BRVQuZ2V0RGF0YShjdXIpLnBvbHlnb24gPSBwb2x5MjtcbiAgICAgIH1cbiAgICAgIGN1ciA9IGN1ci5uZXh0O1xuICAgIH0gd2hpbGUgKGN1ciAhPT0gdGhpcy5BRVQuaGVhZCk7XG4gIH1cbiAgcG9seTIuaXNIb2xlID0gZWRnZTEuZ2V0SGVhZERhdGEoKS5zaWRlID09PSAncmlnaHQnO1xuICBpZihwb2x5Mi5pc0hvbGUpIHtcbiAgICB0aGlzLmFzc2lnblRvRXh0ZXJpb3IocG9seTIsZWRnZTEsZWRnZTIpO1xuICB9XG59O1xuXG5DbGlwcGVyLnByb3RvdHlwZS5idWlsZEludGVyc2VjdGlvbnMgPSBmdW5jdGlvbih5Qm90LHlUb3ApIHtcbiAgdmFyIGRZID0geVRvcCAtIHlCb3Q7XG4gIFNUID0gbmV3IFNUQ2xhc3MoKTtcbiAgdGhpcy5JVCA9IG5ldyBJVENsYXNzKCk7IFxuICB2YXIgaW50UG9pbnQ7XG4gIC8vaW5pdGlhdGUgdGhlIGZpcnN0IGVkZ2UgaW4gU1RcbiAgdmFyIEFFVGVkZ2UgPSB0aGlzLkFFVC5nZXRIZWFkKCk7IFxuICB2YXIgeFRvcCA9IHRoaXMuQUVULmdldERhdGEoQUVUZWRnZSkueEJvdCArIHRoaXMuQUVULmdldERhdGEoQUVUZWRnZSkuZGVsdGFYICogZFk7XG4gIHRoaXMuQUVULmdldERhdGEoQUVUZWRnZSkueFRvcCA9IHhUb3A7XG4gIHRoaXMuQUVULmdldERhdGEoQUVUZWRnZSkuaXNQcm9jZXNzZWQgPSBmYWxzZTsgLy91c2VkIGluIHByb2Nlc3NBRVRlZGdlc1xuICB2YXIgU1RlZGdlID0gU1QuaW5zZXJ0KHRoaXMuQUVULmdldEJvdW5kKEFFVGVkZ2UpKTsgLy9yZXR1cm4gdGhlIHJlZiB0byBpbnNlcnRlZCBkYXRhXG5cbiAgQUVUZWRnZSA9IEFFVGVkZ2UubmV4dDtcbiAgd2hpbGUoIEFFVGVkZ2UgIT09IHRoaXMuQUVULmhlYWQpIHtcbiAgICB0aGlzLkFFVC5nZXREYXRhKEFFVGVkZ2UpLmlzUHJvY2Vzc2VkID0gZmFsc2U7IC8vdXNlZCBpbiBwcm9jZXNzQUVUZWRnZXNcbiAgICB4VG9wID0gdGhpcy5BRVQuZ2V0RGF0YShBRVRlZGdlKS54Qm90ICsgdGhpcy5BRVQuZ2V0RGF0YShBRVRlZGdlKS5kZWx0YVggKiBkWTtcbiAgICAvL2NoZWNrIGludGVyc2VjdGlvbnNcbiAgICAvL1RPRE8gd2hhdCBpZiB4VG9wID09IFNUZWRnZS54VG9wXG4gICAgd2hpbGUoTWF0aC5yb3VuZDEwKHhUb3AsLTUpIDwgTWF0aC5yb3VuZDEwKFNULmdldERhdGEoU1RlZGdlKS54VG9wLC01KSkge1xuICAgICAgaW50UG9pbnQgPSBpbnRlcnNlY3Rpb24uaW50ZXJzZWN0KFNULmdldERhdGEoU1RlZGdlKS5zZWdtZW50LFxuICAgICAgICB0aGlzLkFFVC5nZXREYXRhKEFFVGVkZ2UpLnNlZ21lbnQpO1xuICAgICAgLy9hdHRhY2hpbmcgaGVhZCBvZiB0aGUgYm91bmQgdG8gaW50IHBvaW50XG4gICAgICBpbnRQb2ludC5sZWZ0RWRnZSA9IFNULmdldEJvdW5kKFNUZWRnZSk7IC8vIGNvbnNpZGVyaW5nIHRoZSBib3R0b20geFxuICAgICAgaW50UG9pbnQucmlnaHRFZGdlID0gdGhpcy5BRVQuZ2V0Qm91bmQoQUVUZWRnZSk7XG4gICAgICB0aGlzLklULmluc2VydChpbnRQb2ludCk7XG4gICAgICBpZihTVGVkZ2UgPT09IFNULmhlYWQpIGJyZWFrO1xuICAgICAgU1RlZGdlID0gU1RlZGdlLnByZXY7XG4gICAgfVxuICAgIHRoaXMuQUVULmdldERhdGEoQUVUZWRnZSkueFRvcCA9IHhUb3A7XG4gICAgU1QuaW5zZXJ0KHRoaXMuQUVULmdldEJvdW5kKEFFVGVkZ2UpKTsgLy9UT0RPIGlzIHNob3VsZCBiZSBpbnNlcnQgYmVmb3JlIFNUZWRnZVxuICAgIFNUZWRnZT0gU1QudGFpbDtcbiAgICBBRVRlZGdlID0gQUVUZWRnZS5uZXh0O1xuICB9XG59O1xuXG5DbGlwcGVyLnByb3RvdHlwZS5wcm9jZXNzSW50ZXJzZWN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaW50UG9pbnQgPSB0aGlzLklULmdldEhlYWQoKTtcbiAgaWYgKGludFBvaW50KSB7XG4gICAgdmFyIGludFBvaW50VHlwZSxlZGdlMSxlZGdlMiwgdGVtcCwgaXNDb250cmlidXRpbmc7XG4gICAgZG8ge1xuICAgICAgZWRnZTEgPSB0aGlzLklULmdldERhdGEoaW50UG9pbnQpLmxlZnRFZGdlO1xuICAgICAgZWRnZTIgPSB0aGlzLklULmdldERhdGEoaW50UG9pbnQpLnJpZ2h0RWRnZTtcbiAgICAgIGludFBvaW50VHlwZSA9IHRoaXMuY2xhc3NpZnlJbnRlcnNlY3Rpb24oZWRnZTEuZ2V0SGVhZERhdGEoKSwgZWRnZTIuZ2V0SGVhZERhdGEoKSk7XG4gICAgICBpZiAoZWRnZTEuZ2V0SGVhZERhdGEoKS50eXBlID09PSBlZGdlMi5nZXRIZWFkRGF0YSgpLnR5cGUpIHtcbiAgICAgICAgLy8mJiBlZGdlMS5nZXRIZWFkRGF0YSgpLnNpZGUgIT09IGVkZ2UyLmdldEhlYWREYXRhKCkuc2lkZSkge1xuICAgICAgICAvLyBsaWtlIGVkZ2VzXG4gICAgICAgIC8vIFRPRE8gdGVzdCBjYXNlIG5lZWQgdG8gYmUgY2hlY2tlZFxuICAgICAgICBpZih0aGlzLkFFVC5pc0NvbnRyaWJ1dGluZyhlZGdlMSkpIHtcbiAgICAgICAgICBpZiAoZWRnZTEuZ2V0SGVhZERhdGEoKS5zaWRlID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkTGVmdCh0aGlzLklULmdldERhdGEoaW50UG9pbnQpLGVkZ2UxKTtcbiAgICAgICAgICAgIHRoaXMuYWRkUmlnaHQodGhpcy5JVC5nZXREYXRhKGludFBvaW50KSxlZGdlMik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkUmlnaHQodGhpcy5JVC5nZXREYXRhKGludFBvaW50KSxlZGdlMSk7XG4gICAgICAgICAgICB0aGlzLmFkZExlZnQodGhpcy5JVC5nZXREYXRhKGludFBvaW50KSxlZGdlMik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXAgPSBlZGdlMS5nZXRIZWFkRGF0YSgpLnNpZGU7XG4gICAgICAgIGVkZ2UxLmdldEhlYWREYXRhKCkuc2lkZSA9IGVkZ2UyLmdldEhlYWREYXRhKCkuc2lkZTtcbiAgICAgICAgZWRnZTIuZ2V0SGVhZERhdGEoKS5zaWRlID0gdGVtcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vVE9ETyBjaGVja2luZyBlZGdlIHBvbHlnb24gaXMgbm90IHBhcnQgZm8gdmF0aWkgYWxnb1xuICAgICAgICBpZiAoaW50UG9pbnRUeXBlID09PSAnbWF4aW1hJyAmJiBlZGdlMS5nZXRIZWFkRGF0YSgpLnBvbHlnb24gXG4gICAgICAgICAgJiYgZWRnZTIuZ2V0SGVhZERhdGEoKS5wb2x5Z29uKSB7XG4gICAgICAgICAgdGhpcy5hZGRMb2NhbE1heCh0aGlzLklULmdldERhdGEoaW50UG9pbnQpLGVkZ2UxLGVkZ2UyKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnRQb2ludFR5cGUgPT09ICdsZWZ0LWludGVybWVkaWF0ZScgXG4gICAgICAgICAgJiYgZWRnZTIuZ2V0SGVhZERhdGEoKS5wb2x5Z29uKSB7XG4gICAgICAgICAgdGhpcy5hZGRMZWZ0KHRoaXMuSVQuZ2V0RGF0YShpbnRQb2ludCksZWRnZTIpO1xuICAgICAgICB9IGVsc2UgaWYgKGludFBvaW50VHlwZSA9PT0gJ3JpZ2h0LWludGVybWVkaWF0ZScgXG4gICAgICAgICAgJiYgZWRnZTEuZ2V0SGVhZERhdGEoKS5wb2x5Z29uKSB7XG4gICAgICAgICAgdGhpcy5hZGRSaWdodCh0aGlzLklULmdldERhdGEoaW50UG9pbnQpLGVkZ2UxKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnRQb2ludFR5cGUgPT09ICdtaW5pbWEnKSB7XG4gICAgICAgICAgdGhpcy5hZGRMb2NhbE1pbih0aGlzLklULmdldERhdGEoaW50UG9pbnQpLGVkZ2UxLGVkZ2UyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5BRVQuc3dhcChlZGdlMSxlZGdlMik7XG4gICAgICAvL1RPRE8gY2FuIGJlIGRvbmUgaW4gaWYgaW50UG9pbnRUeXBlIGFjY29yZGluZ2x5IFxuICAgICAgLy9zd2FwIHBvbHlnb25zXG4gICAgICB0ZW1wID0gZWRnZTEuZ2V0SGVhZERhdGEoKS5wb2x5Z29uO1xuICAgICAgZWRnZTEuZ2V0SGVhZERhdGEoKS5wb2x5Z29uID0gZWRnZTIuZ2V0SGVhZERhdGEoKS5wb2x5Z29uO1xuICAgICAgZWRnZTIuZ2V0SGVhZERhdGEoKS5wb2x5Z29uID0gdGVtcDtcbiAgICAgIC8vVE9ETyB3aHkgbm90IHJlY2FsY3VsYXRlIHNpZGUgb2YgZWRnZXNcbiAgICAgIGludFBvaW50ID0gaW50UG9pbnQubmV4dDtcbiAgICB9IHdoaWxlIChpbnRQb2ludCAhPT0gdGhpcy5JVC5oZWFkICk7XG4gIH1cbn07XG5cbkNsaXBwZXIucHJvdG90eXBlLnByb2Nlc3NBRVRlZGdlcyA9IGZ1bmN0aW9uKHlCb3QseVRvcCkge1xuICB2YXIgY3VyID0gdGhpcy5BRVQuZ2V0SGVhZCgpLFxuICAgIHZlcnRleFR5cGUsZGF0YSxpc0NvbnRyaWJ1dGluZyxwcmV2O1xuICBpZiAoY3VyKSB7XG4gICAgZG8geyBcbiAgICAgIHRoaXMuQUVULmdldERhdGEoY3VyKS5pc1Byb2Nlc3NlZCA9IHRydWU7XG4gICAgICBpc0NvbnRyaWJ1dGluZyA9IHRoaXMuQUVULmlzQ29udHJpYnV0aW5nKHRoaXMuQUVULmdldEJvdW5kKGN1cikpO1xuICAgICAgLy9UT0RPIHZhdHRpIGFsZ28gZG9lc250IGNhbCBpc0NvbnRyaWJ1dGluZywgY2FuIHdlIGNhcnJ5IGZvcndhcmQgbGlrZVxuICAgICAgICAvLyBzaWRlXG4gICAgICBpZiAoTWF0aC5yb3VuZDEwKHRoaXMuQUVULmdldERhdGEoY3VyKS55VG9wLC01KSA9PT0gTWF0aC5yb3VuZDEwKHlUb3AsLTUpKSB7XG4gICAgICAgIHZlcnRleFR5cGUgPSB0aGlzLkFFVC5nZXREYXRhKGN1cikuc2VnbWVudC5lbmQudHlwZTtcbiAgICAgICAgaWYgKHZlcnRleFR5cGUgPT09ICdtYXhpbWEnKSB7XG4gICAgICAgICAgaWYoaXNDb250cmlidXRpbmcpIHsgXG4gICAgICAgICAgICB0aGlzLmFkZExvY2FsTWF4KHRoaXMuQUVULmdldERhdGEoY3VyKS5zZWdtZW50LmVuZCx0aGlzLkFFVC5nZXRCb3VuZChjdXIpLFxuICAgICAgICAgICAgICB0aGlzLkFFVC5nZXRCb3VuZChjdXIubmV4dCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZTEgPSBjdXI7XG4gICAgICAgICAgdmFyIGUyID0gY3VyLm5leHQ7XG4gICAgICAgICAgY3VyID0gY3VyLm5leHQubmV4dDtcbiAgICAgICAgICB0aGlzLkFFVC5yZW1vdmUoZTEuZGF0dW0pO1xuICAgICAgICAgIHRoaXMuQUVULnJlbW92ZShlMi5kYXR1bSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmVydGV4VHlwZSA9IHRoaXMuQUVULmdldERhdGEoY3VyKS5zaWRlICsgJy0nICsgdmVydGV4VHlwZTtcbiAgICAgICAgICBpZiAodmVydGV4VHlwZSA9PT0gJ2xlZnQtaW50ZXJtZWRpYXRlJykge1xuICAgICAgICAgICAgaWYoaXNDb250cmlidXRpbmcpIHtcbiAgICAgICAgICAgICAgdGhpcy5hZGRMZWZ0KHRoaXMuQUVULmdldERhdGEoY3VyKS5zZWdtZW50LmVuZCx0aGlzLkFFVC5nZXRCb3VuZChjdXIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHZlcnRleFR5cGUgPT09ICdyaWdodC1pbnRlcm1lZGlhdGUnKSB7XG4gICAgICAgICAgICBpZihpc0NvbnRyaWJ1dGluZykge1xuICAgICAgICAgICAgICB0aGlzLmFkZFJpZ2h0KHRoaXMuQUVULmdldERhdGEoY3VyKS5zZWdtZW50LmVuZCx0aGlzLkFFVC5nZXRCb3VuZChjdXIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZGF0YSA9IHRoaXMuQUVULmdldERhdGEoY3VyKTtcbiAgICAgICAgICBjdXIgPSB0aGlzLkFFVC5zdWNjKGN1cik7IC8vcmV0dXJucyByZWYgdG8gc2FtZSBib3VuZCBidXQgbW92ZWQgdG8gXG4gICAgICAgICAgICAvLyB1cHBlciBlZGdlXG4gICAgICAgICAgdGhpcy5BRVQuZ2V0RGF0YShjdXIpLnNpZGUgPSBkYXRhLnNpZGU7XG4gICAgICAgICAgLy90aGlzLkFFVC5nZXREYXRhKGN1cikuaXNDb250cmlidXRpbmcgPSBkYXRhLmlzQ29udHJpYnV0aW5nO1xuICAgICAgICAgIHRoaXMuQUVULmdldERhdGEoY3VyKS5wb2x5Z29uID0gZGF0YS5wb2x5Z29uO1xuICAgICAgICAgIHRoaXMuQUVULmdldERhdGEoY3VyKS5pc1Byb2Nlc3NlZCA9IHRydWU7IC8vVE9ETyBzb3J0ZWQtJ2NpcmN1bGFyJy1saW5rZWQtbGlzdFxuICAgICAgICAgICAgLy8gaXMgY3JlYXRpbmcgc28gbWFueSBpc3N1ZSBpbiB3aGlsZSBsb29wXG4gICAgICAgICAgLy9UT0RPIGZpbmRpbmcgbm9kZSBpbiBzb3J0ZWQgbGlzdCBpcyBleHBlbnNpdmVcbiAgICAgICAgICBpZiAoIXRoaXMuU0JULmZpbmQodGhpcy5BRVQuZ2V0RGF0YShjdXIpLnlUb3ApKSBcbiAgICAgICAgICAgIHRoaXMuU0JULmluc2VydCh0aGlzLkFFVC5nZXREYXRhKGN1cikueVRvcCk7XG4gICAgICAgICAgY3VyID0gY3VyLm5leHQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuQUVULmdldERhdGEoY3VyKS54Qm90ID0gdGhpcy5BRVQuZ2V0RGF0YShjdXIpLnhUb3A7IFxuICAgICAgICBjdXIgPSBjdXIubmV4dDtcbiAgICAgIH1cbiAgICAvL30gd2hpbGUgKGN1ciAhPT0gdGhpcy5BRVQuaGVhZCAmJiB0aGlzLkFFVC5sZW5ndGggPiAwKTtcbiAgICB9IHdoaWxlICghdGhpcy5BRVQuZ2V0RGF0YShjdXIpLmlzUHJvY2Vzc2VkKVxuICB9XG59O1xuXG5DbGlwcGVyLnByb3RvdHlwZS5hZGRMZWZ0ID0gZnVuY3Rpb24ocG9pbnQsYm91bmQpIHtcbiAgYm91bmQuZ2V0SGVhZERhdGEoKS5wb2x5Z29uLmFkZExlZnQocG9pbnQpO1xufTtcbkNsaXBwZXIucHJvdG90eXBlLmFkZFJpZ2h0ID0gZnVuY3Rpb24ocG9pbnQsYm91bmQpIHtcbiAgYm91bmQuZ2V0SGVhZERhdGEoKS5wb2x5Z29uLmFkZFJpZ2h0KHBvaW50KTtcbn07XG5DbGlwcGVyLnByb3RvdHlwZS5hc3NpZ25Ub0V4dGVyaW9yID0gZnVuY3Rpb24ocG9seWdvbiwgZWRnZTEsZWRnZTIpIHtcbiAgdmFyIGxlZnRFeHRlcmlvcklkLCByaWdodEV4dGVyaW9ySWQsXG4gICAgbGVmdEVkZ2UsIHJpZ2h0RWRnZSxcbiAgICBBRVRlZGdlMSA9IHRoaXMuQUVULmZpbmQoZWRnZTEpLFxuICAgIGVkZ2VEYXRhO1xuICB2YXIgY3VyID0gQUVUZWRnZTEgPyBBRVRlZGdlMS5wcmV2IDogbnVsbDsgXG4gIGlmKGN1cikge1xuICAgIGRvIHtcbiAgICAgIGVkZ2VEYXRhID0gdGhpcy5BRVQuZ2V0RGF0YShjdXIpO1xuICAgICAgaWYgKGVkZ2VEYXRhLnBvbHlnb24gJiYgZWRnZURhdGEuaXNIb2xlKSB7XG4gICAgICAgIGN1ciA9IGN1ci5wcmV2OyBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKGVkZ2VEYXRhLnNpZGUgPT09ICdsZWZ0Jykge1xuICAgICAgICAgIGlmIChlZGdlRGF0YS5wb2x5Z29uLmhvbGVJZHMuaW5kZXhPZihwb2x5Z29uLmlkKSA8IDApIHtcbiAgICAgICAgICAgIC8vZWRnZURhdGEucG9seWdvbi5ob2xlSWRzLnB1c2gocG9seWdvbi5pZCk7XG4gICAgICAgICAgICBsZWZ0RWRnZURhdGEgPSBlZGdlRGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoY3VyICE9PSB0aGlzLkFFVC50YWlsKTtcbiAgfVxuICBjdXIgPSBBRVRlZGdlMSA/IEFFVGVkZ2UxLm5leHQubmV4dCA6IG51bGw7IC8vQUVUZWRnZTEubmV4dCBpcyBlZGdlMlxuICBpZihjdXIpIHtcbiAgICBkbyB7XG4gICAgICBlZGdlRGF0YSA9IHRoaXMuQUVULmdldERhdGEoY3VyKTtcbiAgICAgIGlmIChlZGdlRGF0YS5wb2x5Z29uICYmIGVkZ2VEYXRhLmlzSG9sZSkge1xuICAgICAgICBjdXIgPSBjdXIubmV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKGVkZ2VEYXRhLnNpZGUgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICBpZiAoZWRnZURhdGEucG9seWdvbi5ob2xlSWRzLmluZGV4T2YocG9seWdvbi5pZCkgPCAwKSB7XG4gICAgICAgICAgICAvL2VkZ2VEYXRhLnBvbHlnb24uaG9sZUlkcy5wdXNoKHBvbHlnb24uaWQpO1xuICAgICAgICAgICAgcmlnaHRFZGdlRGF0YSA9IGVkZ2VEYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IHdoaWxlIChjdXIgIT09IHRoaXMuQUVULmhlYWQpO1xuICB9XG4gIGlmKGxlZnRFZGdlRGF0YS5wb2x5Z29uLmlkICE9PSBwb2x5Z29uLmlkICYmIFxuICAgIGxlZnRFZGdlRGF0YS5wb2x5Z29uLmlkID09PSByaWdodEVkZ2VEYXRhLnBvbHlnb24uaWQpIHtcbiAgICBsZWZ0RWRnZURhdGEucG9seWdvbi5ob2xlSWRzLnB1c2gocG9seWdvbi5pZCk7XG4gIH1cbn07XG5DbGlwcGVyLnByb3RvdHlwZS5jbGFzc2lmeUludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGVkZ2UxLGVkZ2UyKSB7XG4gIHZhciBydWxlcyA9IHsgXG4gICAgJ2xlZnQtY2xpcC14LWxlZnQtc3ViamVjdCc6ICdsZWZ0LWludGVybWVkaWF0ZScsXG4gICAgJ2xlZnQtc3ViamVjdC14LWxlZnQtY2xpcCc6ICdsZWZ0LWludGVybWVkaWF0ZScsXG4gICAgJ3JpZ2h0LWNsaXAteC1yaWdodC1zdWJqZWN0JzogJ3JpZ2h0LWludGVybWVkaWF0ZScsXG4gICAgJ3JpZ2h0LXN1YmplY3QteC1yaWdodC1jbGlwJzogJ3JpZ2h0LWludGVybWVkaWF0ZScsXG4gICAgJ2xlZnQtc3ViamVjdC14LXJpZ2h0LWNsaXAnOiAnbWF4aW1hJyxcbiAgICAnbGVmdC1jbGlwLXgtcmlnaHQtc3ViamVjdCc6ICdtYXhpbWEnLFxuICAgICdyaWdodC1zdWJqZWN0LXgtbGVmdC1jbGlwJzogJ21pbmltYScsXG4gICAgJ3JpZ2h0LWNsaXAteC1sZWZ0LXN1YmplY3QnOiAnbWluaW1hJ1xuICB9O1xuICByZXR1cm4gcnVsZXNbZWRnZTEuc2lkZSArICctJyArIGVkZ2UxLnR5cGUgKycteC0nICsgZWRnZTIuc2lkZSArICctJysgZWRnZTIudHlwZV07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsaXBwZXI7XG4iLCJ2YXIgU29ydGVkTGlzdCA9IHJlcXVpcmUoJy4vc29ydGVkLWxpbmtlZC1saXN0LmpzJyk7XG5cbnZhciBJVCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNvbnN0cnVjdG9yKHtjb21wYXJlOiBmdW5jdGlvbihhLGIpIHtcbiAgICAvL1RPRE8gLTUgc2hvdWxkIGJlIHZhcmlhYmxlXG4gICAgcmV0dXJuIE1hdGgucm91bmQxMChhLnksLTUpIC0gTWF0aC5yb3VuZDEwKGIueSwtNSk7XG4gIH19KTtcbn07XG5JVC5wcm90b3R5cGUgPSBuZXcgU29ydGVkTGlzdCgpO1xuSVQucHJvdG90eXBlLmdldEhlYWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaGVhZDtcbn07XG5JVC5wcm90b3R5cGUuZ2V0SGVhZERhdGEgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaGVhZC5kYXR1bS5oZWFkRGF0YSgpO1xufTtcbklULnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oaW50ZXJzZWN0aW9uKSB7XG4gIHJldHVybiBpbnRlcnNlY3Rpb24uZGF0dW07XG59O1xubW9kdWxlLmV4cG9ydHMgPSBJVDtcbiIsIi8vIGxvY2FsLW1pbi1tYXguanNcbi8vIGlucHV0IGNsb3NlIHBhdGggaS5lLiBmaXJzdCBwb2ludCBhbmQgbGFzdCBwb2ludCBhcmUgZXF1YWxcbi8vIHJldHVybiBhcnJheSBvZiB0YWdzIGxvY2FsIG1pbmltYSwgbWF4aW1hIGFuZCBpbnRlcm1lZGlhdGUgYXQgZWFjaCBwb2ludFxudmFyIEJvdW5kID0gcmVxdWlyZSgnLi9ib3VuZC5qcycpO1xudmFyIExpc3QgPSByZXF1aXJlKCcuL3NvcnRlZC1saW5rZWQtbGlzdC5qcycpO1xuZnVuY3Rpb24gZ2V0Qm91bmRzKHBhdGgscG9seWdvblR5cGUpIHtcbiAgdmFyIGJvdW5kcyA9IFtdLFxuICAgIHBhcnRCb3VuZCA9IFtdLFxuICAgIHRvdGFsRGV0ID0gMCxcbiAgICBib3VuZCA9IFtdLFxuICAgIHZlcnRleCA9IHt9LHR5cGU7XG4gIGJvdW5kLmRldCA9IDA7XG4gIGZvcih2YXIgaT0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSA8IHBhdGgubGVuZ3RoIC0xIHx8IChpID09IHBhdGgubGVuZ3RoIC0gMSAmJiBwYXJ0Qm91bmQubGVuZ3RoID09IDApKSB7XG4gICAgICB0eXBlID0gZ2V0Tm9kZVR5cGUoaSxwYXRoKTtcbiAgICAgIHZlcnRleCA9IHt4OiBwYXRoW2ldWzBdLHk6IHBhdGhbaV1bMV0sIHR5cGU6IHR5cGUgfTtcbiAgICAgIGJvdW5kLnB1c2godmVydGV4KTtcbiAgICAgIGJvdW5kLmRldCArPSBpPT09IHBhdGgubGVuZ3RoIC0xID8gXG4gICAgICAgIGdldERldCh7eDpwYXRoW2ldWzBdLCB5OnBhdGhbaV1bMV19LCB7eDpwYXRoWzFdWzBdLCB5OnBhdGhbMV1bMV19KVxuICAgICAgICA6IGdldERldCh7eDpwYXRoW2ldWzBdLHk6cGF0aFtpXVsxXX0sIHt4OnBhdGhbaSsxXVswXSx5OnBhdGhbaSsxXVsxXX0pO1xuICAgICAgaWYodmVydGV4LnR5cGUgPT09ICdtYXhpbWEnKSB7XG4gICAgICAgIHRvdGFsRGV0ICs9IGJvdW5kLmRldDtcbiAgICAgICAgaWYoYm91bmRbMF0udHlwZSA9PT0gJ21heGltYScpIHtcbiAgICAgICAgICBpZiAoaSAhPT0gMCkgYm91bmQuZGV0ICs9IGdldERldCh2ZXJ0ZXgsYm91bmRbMF0pO1xuICAgICAgICAgIGlmIChib3VuZC5sZW5ndGggPiAxKSBib3VuZHMucHVzaChib3VuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFydEJvdW5kID0gYm91bmQ7ICBcbiAgICAgICAgfVxuICAgICAgICBib3VuZCA9IFtdLCBib3VuZC5kZXQgPSAwO1xuICAgICAgICBib3VuZC5wdXNoKHZlcnRleCk7XG4gICAgICB9IGVsc2UgaWYgKHZlcnRleC50eXBlID09PSAnbWluaW1hJykge1xuICAgICAgICBib3VuZC5taW5Qb3MgPSBib3VuZC5sZW5ndGggLSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAocGFydEJvdW5kLmxlbmd0aCA+IDApIHtcbiAgICAvL2pvaW4gd2l0aCBwYXJ0IGJvdW5kXG4gICAgdmFyIGRldCA9IGJvdW5kLmRldCArIHBhcnRCb3VuZC5kZXQgXG4gICAgICArIGdldERldChwYXJ0Qm91bmRbcGFydEJvdW5kLmxlbmd0aC0xXSxib3VuZFswXSk7XG4gICAgdmFyIG1pblBvcyA9IGJvdW5kLm1pblBvcyA/IGJvdW5kLm1pblBvcyBcbiAgICAgIDogcGFydEJvdW5kLm1pblBvcyArIGJvdW5kLmxlbmd0aDsgXG4gICAgYm91bmQgPSBib3VuZC5jb25jYXQocGFydEJvdW5kKTtcbiAgICBib3VuZC5taW5Qb3MgPSBtaW5Qb3M7XG4gICAgYm91bmQuZGV0ID0gZGV0O1xuICAgIHRvdGFsRGV0ICs9IGJvdW5kLmRldDtcbiAgICBib3VuZHMucHVzaChib3VuZCk7XG4gIH1cbiAgdmFyIExNTCA9IFtdLGxlZnQscmlnaHQ7XG4gIGZvciAodmFyIGk9MDtpPCBib3VuZHMubGVuZ3RoOyBpKyspIHtcbiAgICAvL2NoZWNrIG9yaWVudGF0aW9uKCt2ZS8tdmUpIG9mIHBhdGggYW5kIGJvdW5kcyBjb252ZXgvY29uY2F2ZVxuICAgIC8vaWYgKHRvdGFsRGV0ICogYm91bmRzW2ldLmRldCA+IDApIHsgLy9zbyBpbmRpdiBib3VuZCBkb2Vzbid0IG1hdHRlclxuICAgICAgLy8gVE9ETyBzbyBjYW4gdXNlIHNpZ25lZCBhcmVhIGluc3RlYWRlIG9mIGNhbGN1bGF0aW5nIHRoZSB0b3RhbERldFxuICAgIGlmICh0b3RhbERldCA+IDApIHsgXG4gICAgICAgIGxlZnRCb3VuZCA9IGJvdW5kc1tpXS5zbGljZSgwLGJvdW5kc1tpXS5taW5Qb3MrMSkucmV2ZXJzZSgpO1xuICAgICAgICByaWdodEJvdW5kID0gYm91bmRzW2ldLnNsaWNlKGJvdW5kc1tpXS5taW5Qb3MsYm91bmRzW2ldLmxlbmd0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmlnaHRCb3VuZCA9IGJvdW5kc1tpXS5zbGljZSgwLGJvdW5kc1tpXS5taW5Qb3MrMSkucmV2ZXJzZSgpO1xuICAgICAgICBsZWZ0Qm91bmQgPSBib3VuZHNbaV0uc2xpY2UoYm91bmRzW2ldLm1pblBvcyxib3VuZHNbaV0ubGVuZ3RoKTtcbiAgICB9XG4gICAgTE1MLnB1c2goe1xuICAgICAgbGVmdDogaW5pdGlhdGVFZGdlcyhsZWZ0Qm91bmQsJ2xlZnQnLHBvbHlnb25UeXBlKSxcbiAgICAgIHJpZ2h0OiBpbml0aWF0ZUVkZ2VzKHJpZ2h0Qm91bmQsJ3JpZ2h0Jyxwb2x5Z29uVHlwZSksXG4gICAgICB5Qm90OiBsZWZ0Qm91bmRbMF0ueX0pOyAgIFxuICB9XG4gIHJldHVybiBMTUw7IFxufVxuZnVuY3Rpb24gc2lnbih2YWwpIHtcbiAgcmV0dXJuIHZhbCA+IDAgPyAxIDogLTE7XG59XG5mdW5jdGlvbiBnZXREZXQoY3VyLG5leHQpIHtcbiAgLy9yZXR1cm4gY3VyWzBdKm5leHRbMV0gLSBjdXJbMV0qbmV4dFswXTtcbiAgcmV0dXJuIGN1ci54ICogbmV4dC55IC0gY3VyLnkgKiBuZXh0Lng7XG59XG5mdW5jdGlvbiBnZXROb2RlVHlwZShpbmQscGF0aCkge1xuICB2YXIgcHJldiwgY3VyID0gcGF0aFtpbmRdLCBuZXh0OyBcbiAgaWYgKGluZCA9PT0gMCkge1xuICAgIHByZXYgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMl07XG4gICAgbmV4dCA9IHBhdGhbaW5kICsgMV07XG4gIH0gZWxzZSBpZiAoaW5kID09PSBwYXRoLmxlbmd0aCAtIDEpIHtcbiAgICBwcmV2ID0gcGF0aFtpbmQgLTFdO1xuICAgIG5leHQgPSBwYXRoWzFdOyBcbiAgfSBlbHNlIHtcbiAgICBwcmV2ID0gcGF0aFtpbmQgLSAxXTtcbiAgICBuZXh0ID0gcGF0aFtpbmQgKyAxXTtcbiAgfVxuICBpZihjdXJbMV0gPiBwcmV2WzFdICYmIGN1clsxXSA+IG5leHRbMV0pIHtcbiAgICByZXR1cm4gJ21heGltYSc7XG4gIH0gZWxzZSBpZihjdXJbMV0gPCBwcmV2WzFdICYmIGN1clsxXSA8IG5leHRbMV0pIHtcbiAgICByZXR1cm4gJ21pbmltYSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdpbnRlcm1lZGlhdGUnO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pbml0aWF0ZUVkZ2VzKHBvaW50cyxzaWRlLHR5cGUpIHtcbiAgdmFyIGxpc3QgPSBuZXcgTGlzdCh7Y29tcGFyZTogZnVuY3Rpb24oYSxiKSB7XG4gICAgcmV0dXJuIGEuc2VnbWVudC5zdGFydC55IC0gYi5zZWdtZW50LnN0YXJ0Lnk7IFxuICB9fSk7XG4gIHZhciBlZGdlID0ge3NpZGU6IHNpZGUsdHlwZTogdHlwZX07XG4gIGZvcih2YXIgaT0wOyBpPHBvaW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBlZGdlLnNlZ21lbnQgPSB7IHN0YXJ0OiBwb2ludHNbaV0sIGVuZDogcG9pbnRzW2krMV0gfTtcbiAgICBlZGdlLnhCb3QgPSBwb2ludHNbaV0ueDtcbiAgICBlZGdlLnlUb3AgPSBwb2ludHNbaSsxXS55O1xuICAgIGVkZ2UuZGVsdGFYID0gKHBvaW50c1tpKzFdLnggLSBwb2ludHNbaV0ueClcbiAgICAgIC8gKHBvaW50c1tpKzFdLnkgLSBwb2ludHNbaV0ueSk7XG4gICAgbGlzdC5pbnNlcnQoZWRnZSk7XG4gIH1cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbmZ1bmN0aW9uIGluaXRpYXRlRWRnZXMocG9pbnRzLHNpZGUsdHlwZSkge1xuICAvL1RPRE8tdmF0dGkgcmVtb3ZlIHNpZGUgaXRzIGFzc2lnbmVkIGJhc2VkIG9uIHBvc2l0aW9uIGluIHBvbHlnb24oY2FuIGNoZWNrIGluIEFFVClcbiAgdmFyIGxpc3QgPSBuZXcgQm91bmQoKTtcbiAgdmFyIGVkZ2U7XG4gIGZvcih2YXIgaT0wOyBpPHBvaW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBlZGdlID0ge3NpZGU6IHNpZGUsdHlwZTogdHlwZX07XG4gICAgZWRnZS5zZWdtZW50ID0geyBzdGFydDogcG9pbnRzW2ldLCBlbmQ6IHBvaW50c1tpKzFdIH07XG4gICAgZWRnZS54Qm90ID0gcG9pbnRzW2ldLng7XG4gICAgZWRnZS55VG9wID0gcG9pbnRzW2krMV0ueTtcbiAgICBlZGdlLmRlbHRhWCA9IChwb2ludHNbaSsxXS54IC0gcG9pbnRzW2ldLngpXG4gICAgICAvIChwb2ludHNbaSsxXS55IC0gcG9pbnRzW2ldLnkpO1xuICAgIGxpc3QucHVzaChlZGdlKTtcbiAgfVxuICByZXR1cm4gbGlzdDtcbn1cbm1vZHVsZS5leHBvcnRzID0gZ2V0Qm91bmRzO1xuIiwidmFyIFBvbHlnb24gPSBmdW5jdGlvbihpZCkge1xuICB0aGlzLmlkID0gaWQ7XG4gIHRoaXMubGVmdCA9IFtdO1xuICB0aGlzLnJpZ2h0ID0gW107XG4gIHRoaXMuaXNIb2xlID0gZmFsc2U7XG4gIHRoaXMuaG9sZUlkcyA9IFtdO1xufTtcblxuLy8gYXNzdW1pbmcgYWx3YXlzIGFwcGVuZCBlZGdlMSBwb2x5Z29uIHRvIGVkZ2UyIGFuZCAndGhpcycgaXMgZWRnZTIgcG9seWdvbiBcbi8vICdzaWRlJyBpcyBzaWRlIG9mIGVkZ2UxIFxuUG9seWdvbi5wcm90b3R5cGUuYXBwZW5kUG9seWdvbiA9IGZ1bmN0aW9uKHBvbHlnb24sc2lkZSkge1xuICBpZiAoc2lkZSA9PT0gJ3JpZ2h0JyApIHtcbiAgICB2YXIgbGVmdCA9IHRoaXMubGVmdFxuICAgICAgLmNvbmNhdChwb2x5Z29uLnJpZ2h0LnJldmVyc2UoKS5zbGljZSgwLHBvbHlnb24ucmlnaHQubGVuZ3RoIC0gMSkpXG4gICAgICAuY29uY2F0KHBvbHlnb24ubGVmdCk7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgfSBlbHNlIHsgXG4gICAgdmFyIHJpZ2h0ID0gdGhpcy5yaWdodFxuICAgICAgLmNvbmNhdChwb2x5Z29uLmxlZnQucmV2ZXJzZSgpLnNsaWNlKDAscG9seWdvbi5sZWZ0Lmxlbmd0aCAtIDEpKVxuICAgICAgLmNvbmNhdChwb2x5Z29uLnJpZ2h0KTtcbiAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gIH1cbiAgcG9seWdvbi5sZWZ0ID0gbnVsbDtcbiAgcG9seWdvbi5yaWdodCA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUG9seWdvbi5wcm90b3R5cGUuYWRkTGVmdCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gIHRoaXMubGVmdC5wdXNoKHBvaW50KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuUG9seWdvbi5wcm90b3R5cGUuYWRkUmlnaHQgPSBmdW5jdGlvbihwb2ludCkge1xuICB0aGlzLnJpZ2h0LnB1c2gocG9pbnQpO1xuICByZXR1cm4gdGhpcztcbn07XG5Qb2x5Z29uLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihwb2x5Z29uKSB7XG4gIC8vdGhpcy5pZCA9IHBvbHlnb24uaWQ7XG4gIHRoaXMubGVmdCA9IHBvbHlnb24ubGVmdDtcbiAgdGhpcy5yaWdodCA9IHBvbHlnb24ucmlnaHQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUG9seWdvbi5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKHBvbHlnb24pIHtcbiAgLy9yZXR1cm4gdGhpcy5pZCA9PT0gcG9seWdvbi5pZDtcbiAgcmV0dXJuIHRoaXMubGVmdCA9PT0gcG9seWdvbi5sZWZ0ICYmIHRoaXMucmlnaHQgPT09IHBvbHlnb24ucmlnaHQ7XG59O1xuUG9seWdvbi5wcm90b3R5cGUuZ2V0Q29vcmRpbmF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucmlnaHQuY29uY2F0KHRoaXMubGVmdC5yZXZlcnNlKCkpXG4gICAgLm1hcChmdW5jdGlvbihwdCkge1xuICAgICAgcmV0dXJuIFtwdC54LCBwdC55XTtcbiAgICB9KTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFBvbHlnb247XG4iLCIvL3Rha2VuIGZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC9yb3VuZFxuLy8gQ2xvc3VyZVxuKGZ1bmN0aW9uKCl7XG5cbiAgLyoqXG4gICAqIERlY2ltYWwgYWRqdXN0bWVudCBvZiBhIG51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9ICB0eXBlICBUaGUgdHlwZSBvZiBhZGp1c3RtZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0gIHZhbHVlIFRoZSBudW1iZXIuXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gZXhwICAgVGhlIGV4cG9uZW50ICh0aGUgMTAgbG9nYXJpdGhtIG9mIHRoZSBhZGp1c3RtZW50IGJhc2UpLlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSAgICAgIFRoZSBhZGp1c3RlZCB2YWx1ZS5cbiAgICovXG4gIGZ1bmN0aW9uIGRlY2ltYWxBZGp1c3QodHlwZSwgdmFsdWUsIGV4cCkge1xuICAgIC8vIElmIHRoZSBleHAgaXMgdW5kZWZpbmVkIG9yIHplcm8uLi5cbiAgICBpZiAodHlwZW9mIGV4cCA9PT0gJ3VuZGVmaW5lZCcgfHwgK2V4cCA9PT0gMCkge1xuICAgICAgcmV0dXJuIE1hdGhbdHlwZV0odmFsdWUpO1xuICAgIH1cbiAgICB2YWx1ZSA9ICt2YWx1ZTtcbiAgICBleHAgPSArZXhwO1xuICAgIC8vIElmIHRoZSB2YWx1ZSBpcyBub3QgYSBudW1iZXIgb3IgdGhlIGV4cCBpcyBub3QgYW4gaW50ZWdlci4uLlxuICAgIGlmIChpc05hTih2YWx1ZSkgfHwgISh0eXBlb2YgZXhwID09PSAnbnVtYmVyJyAmJiBleHAgJSAxID09PSAwKSkge1xuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgLy8gU2hpZnRcbiAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcbiAgICB2YWx1ZSA9IE1hdGhbdHlwZV0oKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gLSBleHApIDogLWV4cCkpKTtcbiAgICAvLyBTaGlmdCBiYWNrXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCdlJyk7XG4gICAgcmV0dXJuICsodmFsdWVbMF0gKyAnZScgKyAodmFsdWVbMV0gPyAoK3ZhbHVlWzFdICsgZXhwKSA6IGV4cCkpO1xuICB9XG5cbiAgLy8gRGVjaW1hbCByb3VuZFxuICBpZiAoIU1hdGgucm91bmQxMCkge1xuICAgIE1hdGgucm91bmQxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcbiAgICAgIHJldHVybiBkZWNpbWFsQWRqdXN0KCdyb3VuZCcsIHZhbHVlLCBleHApO1xuICAgIH07XG4gIH1cbiAgLy8gRGVjaW1hbCBmbG9vclxuICBpZiAoIU1hdGguZmxvb3IxMCkge1xuICAgIE1hdGguZmxvb3IxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcbiAgICAgIHJldHVybiBkZWNpbWFsQWRqdXN0KCdmbG9vcicsIHZhbHVlLCBleHApO1xuICAgIH07XG4gIH1cbiAgLy8gRGVjaW1hbCBjZWlsXG4gIGlmICghTWF0aC5jZWlsMTApIHtcbiAgICBNYXRoLmNlaWwxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcbiAgICAgIHJldHVybiBkZWNpbWFsQWRqdXN0KCdjZWlsJywgdmFsdWUsIGV4cCk7XG4gICAgfTtcbiAgfVxuXG59KSgpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjQuMFxudmFyIE5vZGUsIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdDtcblxuTm9kZSA9IChmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiBOb2RlKGRhdHVtLCBwcmV2LCBuZXh0KSB7XG4gICAgdGhpcy5kYXR1bSA9IGRhdHVtO1xuICAgIHRoaXMucHJldiA9IHByZXY7XG4gICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgfVxuXG4gIHJldHVybiBOb2RlO1xuXG59KSgpO1xuXG5Tb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QgPSAoZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0KG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0ID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmhlYWQgPSBvcHQuaGVhZDtcbiAgICB0aGlzLnRhaWwgPSBvcHQudGFpbDtcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgaWYoIG9wdC5jb21wYXJlKSBcbiAgICAgIHRoaXMuY29tcGFyZSA9IG9wdC5jb21wYXJlOyBcbiAgfVxuXG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uKGRhdHVtMSwgZGF0dW0yKSB7XG4gICAgcmV0dXJuIGRhdHVtMSAtIGRhdHVtMjtcbiAgfTtcblxuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLmluc2VydEFsbCA9IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICB2YXIgeCwgX2ksIF9sZW47XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkge1xuICAgICAgbGlzdCA9IFtdO1xuICAgIH1cbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGxpc3QubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHggPSBsaXN0W19pXTtcbiAgICAgIHRoaXMuaW5zZXJ0KHgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5oZWFkO1xuICB9O1xuXG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oZGF0dW0pIHtcbiAgICB2YXIgY3VycmVudCwgaW5zZXJ0QWZ0ZXIsIGluc2VydEJlZm9yZSwgbmV4dCwgbm9kZTtcbiAgICBub2RlID0gbmV3IE5vZGUoZGF0dW0pO1xuICAgIGluc2VydEJlZm9yZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChiID09PSB0aGlzLmhlYWQpIHtcbiAgICAgICAgYS5wcmV2ID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLmhlYWQgPSBhO1xuICAgICAgICB0aGlzLnRhaWwubmV4dCA9IHRoaXMuaGVhZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEucHJldiA9IGIucHJldjtcbiAgICAgICAgYi5wcmV2Lm5leHQgPSBhO1xuICAgICAgfVxuICAgICAgYS5uZXh0ID0gYjtcbiAgICAgIHJldHVybiBiLnByZXYgPSBhO1xuICAgIH07XG4gICAgaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAoYiA9PT0gdGhpcy50YWlsKSB7XG4gICAgICAgIGEubmV4dCA9IHRoaXMuaGVhZDtcbiAgICAgICAgdGhpcy50YWlsID0gYTtcbiAgICAgICAgdGhpcy5oZWFkLnByZXYgPSB0aGlzLnRhaWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhLm5leHQgPSBiLm5leHQ7XG4gICAgICAgIGIubmV4dC5wcmV2ID0gYTtcbiAgICAgIH1cbiAgICAgIGEucHJldiA9IGI7XG4gICAgICByZXR1cm4gYi5uZXh0ID0gYTtcbiAgICB9O1xuICAgIHRoaXMubGVuZ3RoKys7IC8vVE9ETyBpdCBzaG91bGQgYmUgYmVmb3JlIHJldHVybiBzdGF0ZW1lbnRcbiAgICBpZiAodGhpcy5oZWFkID09IG51bGwpIHtcbiAgICAgIHRoaXMuaGVhZCA9IG5vZGU7XG4gICAgICB0aGlzLmhlYWQubmV4dCA9IG5vZGU7XG4gICAgICB0aGlzLmhlYWQucHJldiA9IG5vZGU7XG4gICAgICB0aGlzLnRhaWwgPSB0aGlzLmhlYWQ7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29tcGFyZSh0aGlzLmhlYWQuZGF0dW0sIG5vZGUuZGF0dW0pID4gMCkge1xuICAgICAgaW5zZXJ0QmVmb3JlKG5vZGUsIHRoaXMuaGVhZCk7XG4gICAgICB0aGlzLmhlYWQgPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50ID0gdGhpcy5oZWFkO1xuICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IHRoaXMudGFpbCkge1xuICAgICAgICBuZXh0ID0gY3VycmVudC5uZXh0O1xuICAgICAgICBpZiAodGhpcy5jb21wYXJlKG5leHQuZGF0dW0sIG5vZGUuZGF0dW0pID4gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgICB9XG4gICAgICBpbnNlcnRBZnRlcihub2RlLCBjdXJyZW50KTtcbiAgICAgIGlmIChjdXJyZW50ID09PSB0aGlzLnRhaWwpIHtcbiAgICAgICAgdGhpcy50YWlsID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyppZiAodGhpcy5jb21wYXJlKG5vZGUuZGF0dW0sIHRoaXMuaGVhZC5kYXR1bSkgPCAwKSB7XG4gICAgICB0aGlzLmhlYWQgPSBub2RlO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb21wYXJlKG5vZGUuZGF0dW0sIHRoaXMudGFpbC5kYXR1bSkgPiAwKSB7XG4gICAgICB0aGlzLnRhaWwgPSBub2RlO1xuICAgIH0qL1xuICAgIHJldHVybiBub2RlO1xuICB9O1xuXG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZGF0dW0pIHtcbiAgICB2YXIgY3VycmVudDtcbiAgICBjdXJyZW50ID0gdGhpcy5oZWFkO1xuICAgIC8vVE9ETyBjYW4gYmUgY3VycmVudC5kYXR1bSAhPT0gZGF0dW1cbiAgICAvL3doaWxlICh0aGlzLmNvbXBhcmUoY3VycmVudC5kYXR1bSwgZGF0dW0pICE9PSAwKSB7XG4gICAgd2hpbGUgKGN1cnJlbnQuZGF0dW0gIT09IGRhdHVtKSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgICAgaWYgKGN1cnJlbnQgPT09IHRoaXMuaGVhZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sZW5ndGgtLTtcbiAgICBpZihjdXJyZW50ID09PSB0aGlzLmhlYWQgJiYgY3VycmVudCA9PT0gdGhpcy50YWlsKSB7XG4gICAgICB0aGlzLmhlYWQgPSBudWxsO1xuICAgICAgdGhpcy50YWlsID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGN1cnJlbnQgPT09IHRoaXMuaGVhZCkge1xuICAgICAgICB0aGlzLmhlYWQgPSBjdXJyZW50Lm5leHQ7XG4gICAgICAgIHRoaXMudGFpbC5uZXh0ID0gdGhpcy5oZWFkO1xuICAgICAgICB0aGlzLmhlYWQucHJldiA9IHRoaXMudGFpbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQucHJldi5uZXh0ID0gY3VycmVudC5uZXh0O1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnQgPT09IHRoaXMudGFpbCkge1xuICAgICAgICB0aGlzLnRhaWwgPSBjdXJyZW50LnByZXY7XG4gICAgICAgIHRoaXMuaGVhZC5wcmV2ID0gdGhpcy50YWlsO1xuICAgICAgICByZXR1cm4gdGhpcy50YWlsLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3VycmVudC5uZXh0LnByZXYgPSBjdXJyZW50LnByZXY7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihkYXR1bSkge1xuICAgIHJldHVybiB0aGlzLmZpbmQoZGF0dW0pICE9IG51bGw7XG4gIH07XG5cbiAgU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24oZGF0dW0pIHtcbiAgICB2YXIgY3VycmVudDtcbiAgICBpZiAoIXRoaXMuaGVhZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnQgPSB0aGlzLmhlYWQ7XG4gICAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzLmNvbXBhcmUoY3VycmVudC5kYXR1bSwgZGF0dW0pID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICAgIH0gd2hpbGUgKGN1cnJlbnQgIT09IHRoaXMuaGVhZCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZS5wcmludCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50LCBvdXRwdXQ7XG4gICAgb3V0cHV0ID0gXCJcIjtcbiAgICBpZiAoISh0aGlzLmhlYWQgIT0gbnVsbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY3VycmVudCA9IHRoaXMuaGVhZDtcbiAgICBvdXRwdXQgKz0gXCJcIiArIGN1cnJlbnQuZGF0dW07XG4gICAgd2hpbGUgKGN1cnJlbnQubmV4dCAhPT0gdGhpcy5oZWFkKSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgICAgb3V0cHV0ICs9IFwiLCBcIiArIGN1cnJlbnQuZGF0dW07XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG4gIFxuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXR1bSA9IHRoaXMuaGVhZC5kYXR1bTtcbiAgICB0aGlzLnJlbW92ZShkYXR1bSk7XG4gICAgcmV0dXJuIGRhdHVtO1xuICB9O1xuXG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUudXBwZXJCb3VuZCA9IGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgdmFyIHVwcGVyID0gW107XG4gICAgdmFyIGN1ciA9IHRoaXMuZmluZChkYXR1bSk7XG4gICAgaWYgKGN1ciAmJiBjdXIgIT09IHRoaXMudGFpbCkge1xuICAgICAgZG8ge1xuICAgICAgICB1cHBlci5wdXNoKGN1ci5uZXh0LmRhdHVtKTtcbiAgICAgICAgY3VyID0gY3VyLm5leHQ7XG4gICAgICB9IHdoaWxlIChjdXIgIT09IHRoaXMudGFpbCk7XG4gICAgfVxuICAgIHJldHVybiB1cHBlcjtcbiAgfTtcblxuICBTb3J0ZWRDaXJjdWxhckRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLmxvd2VyQm91bmQgPSBmdW5jdGlvbihkYXR1bSkge1xuICAgIHZhciBsb3dlciA9IFtdO1xuICAgIHZhciBjdXIgPSB0aGlzLmZpbmQoZGF0dW0pO1xuICAgIGlmIChjdXIgJiYgY3VyICE9PSB0aGlzLmhlYWQpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgbG93ZXIucHVzaChjdXIucHJldi5kYXR1bSk7XG4gICAgICAgIGN1ciA9IGN1ci5wcmV2O1xuICAgICAgfSB3aGlsZSAoY3VyICE9PSB0aGlzLmhlYWQpO1xuICAgIH1cbiAgICByZXR1cm4gbG93ZXI7XG4gIH07XG4gIFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUubG93ZXJDb3VudCA9IGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICB2YXIgY3VyID0gdGhpcy5maW5kKGRhdHVtKTtcbiAgICBpZiAoY3VyICYmIGN1ciAhPT0gdGhpcy5oZWFkKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGN1ciA9IGN1ci5wcmV2O1xuICAgICAgfSB3aGlsZSAoY3VyICE9PSB0aGlzLmhlYWQpO1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH07XG5cbiAgU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZS51cHBlckNvdW50ID0gZnVuY3Rpb24oZGF0dW0pIHtcbiAgICB2YXIgY291bnQgPSAwO1xuICAgIHZhciBjdXIgPSB0aGlzLmZpbmQoZGF0dW0pO1xuICAgIGlmIChjdXIgJiYgY3VyICE9PSB0aGlzLnRhaWwpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgY3VyID0gY3VyLm5leHQ7XG4gICAgICB9IHdoaWxlIChjdXIgIT09IHRoaXMudGFpbCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfTtcblxuICByZXR1cm4gU29ydGVkQ2lyY3VsYXJEb3VibHlMaW5rZWRMaXN0O1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRlZENpcmN1bGFyRG91Ymx5TGlua2VkTGlzdDtcbiIsInZhciBTb3J0ZWRMaXN0ID0gcmVxdWlyZSgnLi9zb3J0ZWQtbGlua2VkLWxpc3QuanMnKTtcbi8vIFNUIGlzIHNvcnRlZCBsaXN0IG9mIGJvdW5kcyBhbG9uZyB4IGF4aXMgZm9yIHhUb3Agb2YgY3VycmVudCBzZWdtZW50LlxuLy8gaW4gU1QgZWFjaCBub2RlIGRhdGEgaXMgaW5zdGFuY2Ugb2YgQm91bmQgKEZhc3RMaXN0KSBpLmUuIGxpbmtlZCBsaXN0IG9mIFxuLy8gcG9seWdvbiBzZWdtZW50cyBzb3J0ZWQgYm90dG9tIHRvIHRvcCAgXG4vLyBlZGdlID0gdGhpcy5oZWFkLmRhdHVtLl9oZWFkXG5cbnZhciBTVCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNvbnN0cnVjdG9yKHtjb21wYXJlOiBmdW5jdGlvbihhLGIpe1xuICAgIC8vcmV0dXJuIGEuX2hlYWQuZGF0YS54VG9wIC0gYi5faGVhZC5kYXRhLnhUb3A7ICBcbiAgICAvL1RPRE8gbmVlZCB0byBjaGVjayBmb3IgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgbGluZXNcbiAgICBpZiAoTWF0aC5yb3VuZDEwKGEuX2hlYWQuZGF0YS54VG9wLC01KSA9PT1cbiAgICAgIE1hdGgucm91bmQxMChiLl9oZWFkLmRhdGEueFRvcCwtNSkpIHtcbiAgICAgIHZhciB4VG9wID0gYS5faGVhZC5kYXRhLnhUb3A7XG4gICAgICB2YXIgc2VnQSA9IGEuX2hlYWQuZGF0YS5zZWdtZW50O1xuICAgICAgdmFyIHNlZ0IgPSBiLl9oZWFkLmRhdGEuc2VnbWVudDtcbiAgICAgIGlmIChNYXRoLnJvdW5kMTAoTWF0aC5hYnMoc2VnQS5zdGFydC54IC0gc2VnQi5zdGFydC54KSwtNSkgPT09XG4gICAgICAgICAgTWF0aC5yb3VuZDEwKFxuICAgICAgICAgICAgTWF0aC5hYnMoc2VnQi5zdGFydC54IC0geFRvcCkgKyBNYXRoLmFicyh4VG9wIC0gc2VnQS5zdGFydC54KVxuICAgICAgICAgICAgLC01KSkgXG4gICAgICB7XG4gICAgICAgIC8vIGkuZS4gb25lIGVuZCBvbiBsZWZ0IGFuZCBhbm90aGVyIG9uIHJpZ2h0IG9mIHhUb3BcbiAgICAgICAgcmV0dXJuIHNlZ0Euc3RhcnQueCAtIHNlZ0Iuc3RhcnQueDtcbiAgICAgIC8vfSBlbHNlIGlmIChzZWdBLnN0YXJ0LnggPiB4VG9wICYmIHNlZ0Iuc3RhcnQueCA+IHhUb3ApIHtcbiAgICAgIC8vICByZXR1cm4gMS4wL2IuX2hlYWQuZGF0YS5kZWx0YVggLSAxLjAvYS5faGVhZC5kYXRhLmRlbHRhWDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGJvdGggZW5kIGFyZSBlaXRoZXIgc2lkZSBvZiB4VG9wXG4gICAgICAgIHJldHVybiAxLjAvYS5faGVhZC5kYXRhLmRlbHRhWCAtIDEuMC9iLl9oZWFkLmRhdGEuZGVsdGFYO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYS5faGVhZC5kYXRhLnhUb3AgLSBiLl9oZWFkLmRhdGEueFRvcDtcbiAgICB9XG4gIH19KTtcbn07XG5cblNULnByb3RvdHlwZSA9IG5ldyBTb3J0ZWRMaXN0KCk7XG5TVC5wcm90b3R5cGUuZ2V0SGVhZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5oZWFkO1xufTtcblNULnByb3RvdHlwZS5nZXRIZWFkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5oZWFkLmRhdHVtLmdldEhlYWREYXRhKCk7XG59O1xuU1QucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbihlZGdlKSB7XG4gIHJldHVybiBlZGdlLmRhdHVtLmdldEhlYWREYXRhKCk7XG59O1xuU1QucHJvdG90eXBlLmdldEJvdW5kID0gZnVuY3Rpb24oZWRnZSkge1xuICByZXR1cm4gZWRnZS5kYXR1bTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU1Q7XG4iXX0=
