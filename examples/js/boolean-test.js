// allow testing of specific renderers via "?renderer=Canvas", etc
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

var map = new OpenLayers.Map({
    div: "map",
    layers: [
        new OpenLayers.Layer.OSM(),
        new OpenLayers.Layer.Vector("Vector Layer", {
            renderers: renderer
        })
    ],
    center: new OpenLayers.LonLat(0, 0),
    zoom: 1
});

var draw = new OpenLayers.Control.DrawFeature(
    map.layers[1],
    OpenLayers.Handler.Polygon,
    {handlerOptions: {holeModifier: "altKey"}}
);
map.addControl(draw);
draw.activate();

var output;
function doIntersection() {
  var parser = new OpenLayers.Format.GeoJSON();
  if(map.layers[1].features.length > 1) {
    console.log('Intersection in process..');
    var clip = JSON.parse( parser.write(map.layers[1].features[0].geometry));
    var subj = JSON.parse( parser.write(map.layers[1].features[1].geometry));
    output = PolygonClipper(clip.coordinates[0],subj.coordinates[0]);
    console.log(JSON.stringify(output));
    var jsonFeat = {
      "type": "Feature",
      "geometry": {
        "type": "Polygon", 
        "coordinates" : output
      }
    };
    var feats = parser.read(jsonFeat);
    map.layers[1].drawFeature(feats[0],
      {'strokeWidth': 3, 'strokeColor': '#ff0000'});
  } else {
    console.log('No features to process.');
  }
}

function randomTest() {
  map.layers[1].removeAllFeatures();
  map.layers[1].addFeatures([randomPoly(map.getExtent(),3,8)]);
  map.layers[1].addFeatures([randomPoly(map.getExtent(),3,4)]);
  doIntersection();
}
/*********************/
// generate random polygon
// source from http://gis.stackexchange.com/questions/58934/openlayers-generate-random-polygon
function getRandomArbitary (min, max) {
  return Math.random() * (max - min) + min;
}

function featureIntersects (features, feature) {
  for (var i = 0; i<features.length; i++) {
    if (feature.geometry.intersects(features[i].geometry)) {
      return true;
    }
  }
  return false;
}

function lineIntersects (points, point) {
  var line = new OpenLayers.Geometry.LineString([points[points.length-1], point]);
  var other = new OpenLayers.Geometry.LineString(points.slice(0, points.length-2));
  return line.intersects(other);
}

function randomPoly (bounds,minPoints,maxPoints) {
  var numPoints = getRandomArbitary(minPoints,maxPoints);

  var boundsArray = bounds.toArray();
  var minLon = boundsArray[0];
  var minLat = boundsArray[1];
  var maxLon = boundsArray[2];
  var maxLat = boundsArray[3];
  var points = [];
  for (var i=0; i<numPoints; i++) {
    var point = new OpenLayers.Geometry.Point(getRandomArbitary(minLon, maxLon), getRandomArbitary(minLat, maxLat));
    if (i > 2 && lineIntersects(points,point)) {
      numPoints += 1;
    } else {
      points.push(point);
    }
  }
  points.push(points[0].clone());

  return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(points)));
}
function isSimple(points, point) {
  if(points.length > 1) {
    var line1, 
      line2 = new OpenLayers.Geometry.LineString([point, points[points.length -1]]);
    var f2 = new OpenLayers.Feature.Vector(line2);
    map.layers[1].drawFeature(f2, {storkeColor: 'green'});
    for (var i=0; i < points.length -1; i++) {
      line1 = new OpenLayers.Geometry.LineString([points[i], points[i+1]]);
      var f1 = new OpenLayers.Feature.Vector(line1);
      map.layers[1].drawFeature(f1, {storkeColor: 'red'});
      map.layers[1].eraseFeatures([f1]);
      if (line1.intersects(line2)) {
        map.layers[1].eraseFeatures([f2]);
        return true;
      }
    }
    map.layers[1].eraseFeatures([f2]);
  }
  return false;
}
/*********************/
