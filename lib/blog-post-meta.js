module.exports = (function() {
  var summarize = function(text) {
    return text.split("<!--more-->")[0];
  };

  var permalink = function(path) {
    return "/blog/posts/" + path;
  };

  var tags = function(str) {
    return str.split(",");
  };

  return {
    summarize: summarize,
    permalink: permalink,
    tags: tags
  };
})();
