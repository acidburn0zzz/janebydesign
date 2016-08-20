console.log('Hello, there!');

// Brand image fade-in text on hover
// $(".navbar-brand").hover(
//   function() {
//     $(this).append( $("<span> Back to blog home</span>") ).fadeIn( 500 );
//   }, function () {
//     $(this).find("span:last").remove();
//   }
// );

// Display relevant tag posts
var displayTags = (function() {
  var urlSearchParam = window.location.search;
  if (urlSearchParam.includes('?tag=')) {
    var tagName = urlSearchParam.split('=')[1];
    $('ul.list-inline').not('#'+tagName).hide();
    $('#tag-for-page').html('Now showing all posts for #'+tagName+' ✌');
  } else {
    $('#tag-for-page').html('All tags and their respective posts ✌');
  }
})();

// Toggle navigation media screens
$( ".mobile-nav-panel" ).click(function() {
  $( ".nav-tags" ).toggleClass( "active" );
});


// Highlight links for current page
var currentPageLink = (function() {
  $("a").each(function() {
    if (this.href == window.location) {
      $(this).css("background-color", "#f8e71c");
    }
  });
})();


// Remove/add classes for footer based on screen size
var screenFooterClass = (function($) {
  var $window = $(window);

  $window.resize(function resize() {
    if ($window.width() <= 425) {
      return $('#footer').addClass('nav').removeClass('navbar-fixed-bottom');
    }

    $('#footer').addClass('navbar-fixed-bottom').removeClass('nav');
  }).trigger('resize');
})($);


