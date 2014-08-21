var Dequeue = require('dequeue');
var intersection = require('intersection');
var FastList = require('fast-list'); 

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
