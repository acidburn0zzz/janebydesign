module.exports = (function() {

  var extractTitleAndDate = function(path) {

    var segments = function(path) {
      return path.split("/");
    };

    var extractTitle = function(path) {
      var s = segments(path);
      var title;
      if (s.length === 1) {
        title = s[0];
      } else {
        title = path.replace(extractDate(path) + "/", '');
        title = title.replace("-", ' ');
      }

      return title.replace(".html",'');
    };

    var extractDate = function(path) {
      var s = segments(path);
      if (s.length === 4) {
        return [s[0], s[1], s[2]].join("/");
      }
      return undefined;
    };

    return [extractTitle(path), extractDate(path)];
  };

  return extractTitleAndDate;

})();
