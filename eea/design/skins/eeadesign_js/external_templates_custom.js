jQuery(function($){
   $("#eap-siteaction-chooselang-menu").find('h2').click(function(ev){
      var panel = $(ev.target).next();
      panel.slideToggle();
   });
});
