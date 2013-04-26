(function( $ ){

  $.fn.fitContainer = function( $container, options ) {

     this.$container = $container;

     var settings = $.extend( {
          'method'      : 'grow',
          'incrementBy' : 5
        }, options);
     var self = this;

    return this.each(function() {

      if ( !this.innerHTML.split(' ').length > 1 ) {
          return;
      }

      var $this = $(this),
          $container = self.$container || $this.parent(),
          initial_container_height = $container.height(),
          initial_width = $this.width();

      switch( settings.method ) {
          case 'grow':
              while ( $this.parent().height() > initial_container_height ) {
                  initial_width += settings.incrementBy;
                  $this.css('min-width', initial_width);
              }
              break;
          case 'shrink':
              while ( $this.parent().height() > initial_container_height ) {
                  initial_width -= settings.incrementBy;
                  $this.css('max-width', initial_width);
              }
              break;
      }

    });

  };

  $(function(){
      // this code needs to run after eea-tabs.js
      var $eea_tabs = $('.eea-tabs');
      if ( $eea_tabs.length ) {
          $eea_tabs.find('a').fitContainer($eea_tabs);
      }
  });
})( jQuery );

