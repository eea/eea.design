/* EXTERNAL DEPENDENCIES: eea.tabs.js */

/* client side pagination
 * eg: https://www.eea.europa.eu/code/design-elements#toc-66
 * used in relatedItems tabs
 * https://www.eea.europa.eu/publications/eu-2010-biodiversity-baseline
 */
(function ($) {
  $(document).ready(function () {
    function panel() {
      var $el = $(this);
      var buttonID = $el.attr("id");
      if (!buttonID) {
        return;
      }
      var $tooltip = $("#tip-" + buttonID);

      var article_lang = buttonID === "article-language";

      var fordef;
      if ($tooltip.length > 0) {
        // if we don't remove title from links the title will be used for tooltip
        // content instead of the constructed panels
        // var initial_title =  a.attr("title");
        // a.attr("title", "").removeAttr("href");
        fordef = "click, blur";
        $el.tooltip({
          tip: $tooltip[0],
          position: "bottom center",
          offset: [0, 0],
          delay: 10000000,
          events: {
            def: fordef
          }
        });
        // re add original title which can be set after the tooltip logic
        // a.attr('title', initial_title);
        $el.click(function (ev) {
          // #118582 allow language selector links to resolve so we check if
          // the target of the event is inside the panel-content area
          if ($(ev.target).closest(".panel-content").length) {
            return;
          }
          ev.preventDefault();
          var $this = $(this),
            tooltip = $tooltip[0];
          var $panels = $(".panel");
          $panels.each(function () {
            var $this = $(this);
            var $id = $this.attr("id");
            if ($id !== "" && $id !== $tooltip.attr("id")) {
              $this.fadeOut("fast");
            }
          });

          var pos_left = window.Math.floor($this.offset().left);
          if (article_lang) {
            $("#tip-article-language").css({
              position: "absolute",
              display: "block",
              top: "auto"
            });
            if (pos_left > 200) {
              tooltip.style.right = "0px";
              tooltip.firstElementChild.style.float = "right";
            } else {
              // article language link is on the left side of
              // the screen probably mobile
              tooltip.style.right = "auto";
              tooltip.firstElementChild.style.float = "left";
            }
          } else {
            // attempt to position the tooltip bottom right from target on mini_header
            var gnav_pos_left = window.Math.floor(
              $("#secondary-portaltabs").offset().left
            );
            var eWidth = $this.outerWidth();
            var tWidth = $tooltip.outerWidth();
            var left = pos_left + eWidth - gnav_pos_left - tWidth + "px";

            if (tooltip.style.left !== left) {
              tooltip.style.left = left;
            }
          }

          $tooltip.fadeIn("fast");
        });
      }
    }

    $("body").click(function (e) {
      var target = $(e.target);
      target = target[0].tagName === "A" ? target : target.parent();
      var parents = $(".navbar-header, #content"),
        panels = parents.find(".panel");

      if (
        !target.is(
          "#portal-globalnav > a, .secondary-portaltabs a, .panel, #article-language a"
        ) &&
        !target.parents(".panel").length
      ) {
        panels.fadeOut("fast");
        $(".eea-navsiteactions-active").removeClass(
          "eea-navsiteactions-active"
        );
      }
    });

    $("#secondary-portaltabs").addClass("eea-slide-tooltips");
    $("#article-language").each(panel);
    $(".eea-slide-tooltips").find("> li").each(panel);
  });
})(jQuery);
