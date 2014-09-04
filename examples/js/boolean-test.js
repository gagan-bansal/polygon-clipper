// allow testing of specific renderers via "?renderer=Canvas", etc
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
var subjStyle = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
  {fillColor: "#32CD32", strokeColor: "#32CD32"},
  OpenLayers.Feature.Vector.style["default"]));
var subjLyr = new OpenLayers.Layer.Vector("subject",{styleMap: subjStyle});
var clipStyle = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
  {fillColor: "yellow", strokeColor: "yellow"},
  OpenLayers.Feature.Vector.style["default"]));
var clipLyr = new OpenLayers.Layer.Vector("subject",{styleMap: clipStyle});
var outStyle = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
  {fillColor: "#DC143C", strokeColor: "#DC143C"},
  OpenLayers.Feature.Vector.style["default"]));
var outLyr = new OpenLayers.Layer.Vector("output",{styleMap: outStyle});

var map = new OpenLayers.Map({
    div: "map",
    layers: [ new OpenLayers.Layer.OSM(),subjLyr,clipLyr,outLyr],
    center: new OpenLayers.LonLat(0, 0),
    zoom: 1
});

var drawSubj = new OpenLayers.Control.DrawFeature(subjLyr,
    OpenLayers.Handler.Polygon,{handlerOptions: {holeModifier: "altKey"}});
var drawClip = new OpenLayers.Control.DrawFeature(clipLyr,
    OpenLayers.Handler.Polygon,{handlerOptions: {holeModifier: "altKey"}});
map.addControls([drawSubj,drawClip]);
drawSubj.activate();

var controls ={ drawSubj: drawSubj, drawClip: drawClip};

var output;
function doIntersection() {
  var parser = new OpenLayers.Format.GeoJSON();
  if(subjLyr.features.length > 0 && clipLyr.features.length > 0) {
    console.log('Intersection in process..');
    var subj = JSON.parse( parser.write(
       new OpenLayers.Geometry.MultiPolygon(subjLyr.features.map(function(f) {
         return f.geometry;
       }))
    ));
    var clip = JSON.parse( parser.write(
       new OpenLayers.Geometry.MultiPolygon(clipLyr.features.map(function(f) {
         return f.geometry;
       }))
    ));
    output = polygonClipper(clip,subj,'intersection');
    console.log(JSON.stringify(output));
    var jsonFeat = {
      "type": "Feature",
      "geometry": output.exterior
    };
    var feats = parser.read(output);
    outLyr.addFeatures(feats)
  } else {
    console.log('No features to process.');
  }
}

function clearAll() {
  subjLyr.removeAllFeatures();
  clipLyr.removeAllFeatures();
  outLyr.removeAllFeatures();
}
$('.draw').on('click',function(evt) {
  for(key in controls) {
    if(key === this.id) {
      controls[key].activate();
      $(this).addClass('active');
    } else {
      controls[key].deactivate();
      $(this).removeClass('active');
    }
  }
});
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
