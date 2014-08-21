(function () {

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

        function randomPoly (bounds) {
            var numPoints = getRandomArbitary(2, 5);

            var boundsArray = bounds.toArray();
            var minLon = boundsArray[0];
            var minLat = boundsArray[1];
            var maxLon = boundsArray[2];
            var maxLat = boundsArray[3];
            var points = [];
            for (var i=0; i<numPoints; i++) {
                var point = new OpenLayers.Geometry.Point(getRandomArbitary(minLon, maxLon), getRandomArbitary(minLat, maxLat));
                if (i > 2 && lineIntersects(points, point)) {
                    numPoints += 1;
                } else {
                    points.push(point);
                }
            }
            points.push(points[0].clone());

            return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(points)));
        } 

        var map = new OpenLayers.Map("map");
        layer = new OpenLayers.Layer.OSM("Simple OSM Map");
        map.addLayer(layer);
        var vector = new OpenLayers.Layer.Vector("vector");
        map.addLayer(vector);
        map.zoomToMaxExtent();

        var numFeatures = getRandomArbitary(1, 10);
        var features = [];
        for (var i=0; i<numFeatures; i++) {
            var poly = randomPoly(map.getExtent());
            if (featureIntersects(features, poly)) {
                numFeatures +=1;
            }else {
                features.push(poly);
            }
        }
        vector.addFeatures(features);
}());
