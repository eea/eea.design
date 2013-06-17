(function( $ ){

  $.fn.fitContainer = function ( $container, options ) {

     this.$container = $container;

     var settings = $.extend( {
          'method'            : 'grow',
          'incrementBy'       : 5,
          'affectSingleWords' : false,
          'maxWidth'          : 250
        }, options),
         self = this;

    return this.each( function () {

      if ( !settings.affectSingleWords && this.innerHTML.split(/\s/).length === 1 ) {
          return;
      }

      var $this = $(this),
          $container = self.$container || $this.parent(),
          initial_container_height = $container.height(),
          initial_width = $this.width(),
          $parent = $this.parent();

      switch( settings.method ) {
          case 'grow':
              while ( $parent.height() > initial_container_height ) {
                  initial_width += settings.incrementBy;
                  $this.css('min-width', initial_width);
                  if ( this.offsetWidth > settings.maxWidth ) {
                      break;
                  }
              }
              break;
          case 'shrink':
              while ( $parent.height() > initial_container_height ) {
                  initial_width -= settings.incrementBy;
                  $this.css('max-width', initial_width);
                  if ( this.offsetWidth > settings.maxWidth ) {
                      break;
                  }
              }
              break;
      }

    });

  };

  $(function () {
      // plugin call
      // this code needs to run after eea-tabs.js
      var $eea_tabs = $('.eea-tabs');
      if ( $eea_tabs.length && !$.browser.msie ) {
          $eea_tabs.find('a').fitContainer($eea_tabs);
      }
  });
}( jQuery ));

