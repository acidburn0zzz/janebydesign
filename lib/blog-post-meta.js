module.exports = (function() {
  var summarize = function(text) {
    return text.split("<!--more-->")[0];
  };

  var permalink = function(path) {
    return "/blog/posts/" + path;
  };

  var tags = function(str) {
    return str.replace(/\, /g, ',').split(",");
  };

  var keyExists = function(h, key) {
    return Object.keys(h).filter(function(k) {
      return key === k;
    }).length > 0;
  };

  return {
    summarize: summarize,
    permalink: permalink,
    tags: tags,
    keyExists: keyExists
  };
})();
