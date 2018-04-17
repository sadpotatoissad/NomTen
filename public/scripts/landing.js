//fade flash message after 3 seconds
$(document).ready(function(){
  if($(".alert") != null){
    $(".alert").animate({opacity: 0}, 6000);
  }
})
