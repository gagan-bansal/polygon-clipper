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
