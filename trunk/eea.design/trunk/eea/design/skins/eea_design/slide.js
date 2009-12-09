$(document).ready(function() {
	
        $("#portal-siteactions a").each(function(i) {
		var a = $(this);
		a.attr("title","").attr("href", "#");

		// the tooltip panel should have the id in form of 
                // tip-SITEACTION-ID
		a.tooltip({
			tip: '#tip-' + a.parent().attr('id'),
			    position: 'bottom right',
			    offset: [5, -100],
			    events: {
			    tooltip: 'mouseover'
			}

		    });
	    });

		
});