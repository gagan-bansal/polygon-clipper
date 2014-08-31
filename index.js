var Clipper = require('./src/clipper.js');

module.exports = function(subj,clip,process,precision) {
  var instance = new Clipper();
  return instance.overlay(subj, clip, process);
};

