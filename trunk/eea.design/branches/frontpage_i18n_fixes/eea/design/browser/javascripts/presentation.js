var original_go = window.go;
var original_subgo = window.subgo;
var original_startup = window.startup;
var slides = document.querySelectorAll('.slide');


var scroll_top = function(){
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  var i, slides_length;
  for (i = 0, slides_length = slides.length; i < slides_length; i+= 1){
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
    if ( current_slide.childNodes.length < 3 && help_message ) {
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

window.go = function(step){
  original_go(step);
  showHelpMessage("jumplist");
  scroll_top();
};

window.subgo = function(step){
  original_subgo(step);
  showHelpMessage("jumplist");
  scroll_top();
};


var presentation = document.querySelectorAll(".presentation");
var presentation_loader = document.querySelectorAll(".presentation-loader");
var controls = document.querySelectorAll("#controls");
var footer = document.querySelectorAll("#footer");
window.startup = function startup() {
    original_startup();
    // hide the loading gif after s5_slides logic is done 
    presentation_loader[0].style.display = "none";
    presentation[0].style.display = "block";
    controls[0].style.display = "block";
    footer[0].style.display = "block";
    window.setTimeout(function() {
        presentation[0].style.opacity = 1;
    }, 100); 
};
window.onload = window.startup;
