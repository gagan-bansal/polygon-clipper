setTimeout(function() {
  var List = require('../src/sorted-linked-list.js');
//  var l = new List();
//  l.insertAll([1,2,3,4,5,6,7,8,9]);
//  console.log(l.print());
  debugger;
//  console.log('upper Bound 2: '+ l.upperBound(2));
//  console.log('upper Bound 8: '+ l.upperBound(8));
//  console.log('upper Bound 1: '+ l.upperBound(1));
//  console.log('upper Bound 9: '+ l.upperBound(9));
//  console.log('upper Bound 6: '+ l.upperBound(6));
//  console.log('upper Bound 6: '+ l.upperBound(6));
  var l = new List({compare: function(a,b){ return a.y - b.y; }});
  l.insert({ y: 0, edge: {id: 'a'}});
  l.insert({ y: 2, edge: {id: 'b'}});
  l.insert({ y: 2, edge: {id: 'c'}});
  e1 = l.pop();
  e2 = l.pop();
  e3 = l.pop();

},200);
