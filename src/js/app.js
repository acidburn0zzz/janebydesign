console.log('Hello, there!');

// Brand image fade-in text on hover
$(".navbar-brand").hover(
  function() {
    $(this).append( $("<span> Back to blog home</span>") ).fadeIn( 500 );
  }, function () {
    $(this).find("span:last").remove();
  }
);

// Display relevant tag posts
var displayTags = (function() {
  var urlSearchParam = window.location.search;
  if (urlSearchParam.includes('?tag=')) {
    var tagName = urlSearchParam.split('=')[1];
    $('ul').not('#'+tagName).hide();
    $('#tag-title').html('#'+tagName);
  } else {
    $('#tag-title').html('#TAGS');
  }
})();
