//makes footer stick to the bottom after dynamic elements retrieved from db
$(document).ready(function() {
  var docHeight = $(window).height();
  var footerHeight = $('footer').outerHeight();
  var footerTop = $('footer').position().top + footerHeight;
  if (footerTop < docHeight) {
    $('footer').css('margin-top', 10 + (docHeight - footerTop) + 'px');
  }
});
