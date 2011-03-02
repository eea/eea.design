/* This JS integrates the jQuery Tools Tooltips with the EEA site. */
$(document).ready(function() {
    if ($.fn.tooltip !== undefined) {
        // Inflexible tooltips
        $(".eea-tooltip-top").each(function(i) {
            var title = $(this).attr("title");
            $(this).after($('<div class="eea-tooltip-markup-top">' + title + '</div>'));
            $(this).tooltip({
                effect: 'slide'
            });
        });
        $(".eea-tooltip-bottom").each(function(i) {
            var title = $(this).attr("title");
            $(this).after($('<div class="eea-tooltip-markup-bottom">' + title + '</div>'));
            $(this).tooltip({
                effect: 'slide',
                position: 'bottom center'
            });
        });
        $(".eea-tooltip-left").each(function(i) {
            var title = $(this).attr("title");
            $(this).after($('<div class="eea-tooltip-markup-left">' + title + '</div>'));
            $(this).tooltip({
                effect: 'slide',
                position: 'center left'
            });
        });
        $(".eea-tooltip-right").each(function(i) {
            var title = $(this).attr("title");
            $(this).after($('<div class="eea-tooltip-markup-right">' + title + '</div>'));
            $(this).tooltip({
                effect: 'slide',
                position: 'center right'
            });
        });

        // Flexible tooltips
        $(".eea-flexible-tooltip-right").each(function(i){
          var title = $(this).attr("title");

          var container = $('<div>').addClass('eea-tooltip-markup');
          var bottomright = $('<div>').addClass('tooltip-box-br');
          var topleft = $('<div>').addClass('tooltip-box-tl');
          var content = $('<div>').addClass('tooltip-box-rcontent');
          content.text(title);

          topleft.append(content);
          bottomright.append(topleft);
          container.append(bottomright);

          $(this).after(container);
          $(this).tooltip({
            effect: 'slide',
            position: 'center right',
            offset: [20, 20]
          });
        });

        $(".eea-flexible-tooltip-left").each(function(i){
          var title = $(this).attr("title");

          var container = $('<div>').addClass('eea-tooltip-markup');
          var bottomright = $('<div>').addClass('tooltip-box-br');
          var topleft = $('<div>').addClass('tooltip-box-tl');
          var content = $('<div>').addClass('tooltip-box-lcontent');
          content.text(title);

          topleft.append(content);
          bottomright.append(topleft);
          container.append(bottomright);

          $(this).after(container);
          $(this).tooltip({
            effect: 'slide',
            position: 'center left',
            offset: [20, -10]
          });
        });

        $(".eea-flexible-tooltip-top").each(function(i){
          var title = $(this).attr("title");

          var container = $('<div>').addClass('eea-tooltip-markup');
          var bottomright = $('<div>').addClass('tooltip-box-br');
          var topleft = $('<div>').addClass('tooltip-box-tl');
          var content = $('<div>').addClass('tooltip-box-tcontent');
          content.text(title);

          topleft.append(content);
          bottomright.append(topleft);
          container.append(bottomright);

          $(this).after(container);
          $(this).tooltip({
            effect: 'slide',
            position: 'top center',
            offset: [10, 0]
          });
        });

        $(".eea-flexible-tooltip-bottom").each(function(i){
          var title = $(this).attr("title");

          var container = $('<div>').addClass('eea-tooltip-markup');
          var bottomright = $('<div>').addClass('tooltip-box-br');
          var topleft = $('<div>').addClass('tooltip-box-tl');
          var content = $('<div>').addClass('tooltip-box-bcontent');
          content.text(title);

          topleft.append(content);
          bottomright.append(topleft);
          container.append(bottomright);

          $(this).after(container);
          $(this).tooltip({
            effect: 'slide',
            position: 'bottom center',
            offset: [30, 0]
          });
        });
    }
});
