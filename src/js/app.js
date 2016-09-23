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
  var currentUrl = window.location;
  var urlPartialPathname = window.location.pathname.split('/')[1];

  $("#footer a").each(function() {
    if (this.href.includes(urlPartialPathname)) {
      $(this).css("color", "#f3d34b");
    }
  });

  $(".nav-tags li a").each(function() {
    if (this.href == currentUrl) {
      $(this).css("background-color", "#015249");
      $(this).css("color", "#ffffff");
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


