setTimeout(function() {
var getminmax = require('../src/local-minima-list.js');
//var poly1 = [[2,4],[7,0],[18,9],[16,13],[14,10],[11,8],[8,11],[7,15],[4,11],[2,4]];
//var poly1 = [[4,0], [8,6], [12,2], [9,14], [4,0]];
//var poly1 = [[3,8], [8,4], [14,10], [3,8]];
var poly1 = [[-11,-1],[8,8],[2,-3],[-11,-1]];
//poly1.reverse();
console.log('poly1: ' + JSON.stringify(poly1));
debugger;
var localMinNodes = getminmax(poly1,'subject');
localMinNodes.forEach(function(node) {
  console.log('yBot: '+ node.yBot);
  function toArray(n) {
    var a =[];
    var cur = n._head;
    while (cur) {
      a.push(cur.data);
      cur = cur.next;
    }
    return a;
  }
  console.log('left: '+ JSON.stringify(toArray(node.left)));
  console.log('right: '+ JSON.stringify(toArray(node.right)));
});
},200);
console.log('debugging mode on');
