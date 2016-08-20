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
        title = title.replace(/\-/g, ' ');
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
  
  var formatDate = function(str) {
    var months = {
      "01": "january",
      "02": "february",
      "03": "march",
      "04": "april",
      "05": "may",
      "06": "june",
      "07": "july",
      "08": "august",
      "09": "september",
      "10": "october",
      "11": "november",
      "12": "december"
    };

    var splitDate = str.split('/');
    return splitDate[2] + " " + months[splitDate[1]] + " " + splitDate[0];
  };

  return [extractTitleAndDate, formatDate];

})();
