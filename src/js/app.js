console.log('Hello, there!');

// Brand image fade-in text on hover
$(".navbar-brand").hover(
    function() {
      $(this).append( $("<span> Back to blog home</span>") ).fadeIn( 500 );
    }, function () {
      $(this).find("span:last").remove();
    }
  );
