// local-min-max.js
// input close path i.e. first point and last point are equal
// return array of tags local minima, maxima and intermediate at each point
var Bound = require('./bound.js');
var List = require('./sorted-linked-list.js');
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
