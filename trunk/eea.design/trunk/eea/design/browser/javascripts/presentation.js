var original_go = go;
var original_subgo = subgo;
var slides = document.getElementsByClassName('slide');


var scroll_top = function(){
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  for (var i = 0, slides_length = slides.length; i < slides_length; i++){
    var slide = slides[i];
    slide.scrollTop = 0;
  }
};

function showHelpMessage(el) {
    // hide or show help message if user has correct permissions and
    // the slide doesn't have any content
    var current_value = document.getElementById(el).value;
    var current_slide_id = "slide" + current_value;
    var current_slide = document.getElementById(current_slide_id);
    var help_message = document.getElementById('presentation_help_message');
    if ( current_slide.childNodes.length < 2 && help_message ) {
        if ( help_message.className !== "visible" ) {
            help_message.className = "visible";
        }
    }
    else if ( help_message ) {
        if ( help_message.className !== "hidden" ) {
            help_message.className = "hidden";
        }
    }
}

go = function(step){
  original_go(step);
  showHelpMessage("jumplist");
  scroll_top();
};

subgo = function(step){
  original_subgo(step);
  showHelpMessage("jumplist");
  scroll_top();
};
