var original_go = go;
var original_subgo = subgo;
var slides = document.getElementsByClassName('slide');


var scroll_top = function(){
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  for (var i = 0; i < slides.length; i++){
    var slide = slides[i];
    slide.scrollTop = 0;
  }
};

go = function(step){
  original_go(step);
  scroll_top();
};

subgo = function(step){
  original_subgo(step);
  scroll_top();
};
