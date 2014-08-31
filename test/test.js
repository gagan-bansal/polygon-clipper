var polygonClipper = require('../index.js'),
  testDataSet = require('./testdata.js'),
  expect = require('chai').expect;

describe('polygon-clipping',function() {
  it('convex polygons intersection', function() {
    var subj = {"type": "Polygon", "coordinates": [[[4,0], [10,8], [2,4], [4,0]]]};
    var clip = {"type": "Polygon", "coordinates": [[[2,1], [4,4], [2,7], [0,5], [2,1]]]};
    var exp_output = {"type": "MultiPolygon", "coordinates":[[[2.857142857142857,2.2857142857142856],[4,4],[3.5,4.75],[2,4],[2.857142857142857,2.2857142857142856]]]};
    var output = polygonClipper(subj,clip,'intersection');
    expect(output).to.deep.equal(exp_output);
    //expect(output.length).to.equal(30);
  });
  it('subj polygon with hole, intersection', function() {
    debugger;
    var subj = {"type": "Polygon", "coordinates": [
      [[3,2], [5,14], [18,16], [16,6], [3,2]],
      [[6,6], [13,13], [14,7],[6,6]]
    ]};
    var clip = {"type": "Polygon", "coordinates": [[[12,2], [22,8], [7,18], [12,2]]]};
    var exp_output = {"type": "MultiPolygon", "coordinates":[[[11.210526315789473,4.526315789473684],[16,6],[17.058823529411764,11.294117647058822],[11.5,15],[8.100917431192661,14.477064220183486],[9.619047619047619,9.619047619047619],[13,13],[14,7],[10.571428571428571,6.571428571428571],[11.210526315789473,4.526315789473684]]]};
    var output = polygonClipper(subj,clip,'intersection');
    expect(output).to.deep.equal(exp_output);
  });
  it('convex polygon with hole, intersection should return polygon with hole', function() {
    var subj = {
      "type": "Polygon", 
      "coordinates": [
        [[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]], 
        [[20, 30], [35, 35], [30, 20], [20, 30]]
      ]
    };
    var clip = {"type": "Polygon", "coordinates": [
      [[0,20], [40,0], [60,60], [10,50], [0,20]]  
    ]};
    var exp_output = {"type": "MultiPolygon", "coordinates":[
      [[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]], 
      [[30,20],[20,30],[35,35],[30,20]]
    ]};
    var output = polygonClipper(subj,clip,'intersection');
    console.log('ouput: '+ JSON.stringify(output));
    expect(output).to.deep.equal(exp_output);
  });
});
  
