(function( $ ){

  $.fn.fitContainer = function( $container, count ) {

    return this.each(function() {
      if ( !this.innerHTML.split(' ').length > 1 ) {
          return;
      }

      var $this = $(this),
          initial_container_height = $container.height(),
          initial_width = $this.width();

      while ( $this.parent().height() > initial_container_height ) {
          initial_width += count || 5;
          $this.css('min-width', initial_width);
      }

    });

  };
})( jQuery );

