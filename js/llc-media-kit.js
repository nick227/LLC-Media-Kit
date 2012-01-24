 
/**
 * MVMedia Interactive Media Kit v0.1
 * 01/19/2012 Multiview Inc,
 * 
 */

 /**** SETUP VARS HERE! ***/
var feedName = 'data/dma-site.xml';




var mediaKit = {/*** Retrieves xml feed, runs template manager, attach onclick actions ****/
	init: function() {
	mediaKit.loadPage('inventory', 'none');
	mediaKit.setupLinks();
	},
	loadPage: function(pageName, animationMethod){
		$.get(feedName, function(xml){
		mediaKit.site = $.xml2json(xml);
		var template = 'templates/'+pageName+'.html';
				$.get(template, function(data) {
				var res = tmpl(data, mediaKit.site);
				
				if(animationMethod=='none'){
				$('div#container').html(res);
				document.title = mediaKit.site.siteTitle;

		$('.scroll-pane').jScrollPane();
		$('.draggable').draggable({ axis: 'y', snapMode: 'both' }).bind( "dragstop", function(event, ui) {
		  var height = 0-$(this).height(),
		  	  top = ui.position.top;
		  if (height > top - 738) {
		    $(this).animate({top:height+738}, 300, 'swing');
		  } else if (top > 0) {
		    $(this).animate({top:0}, 300, 'swing');
		  }
		});		
		// Ad links need this to move the slideContainer
		// $("#slideContainer").data("jsp").scrollToY(300);

				}
				});
		
			return true;
	});
	},
	setupLinks: function(){
		$('a.slideChange').live('click', function(){
		var relPage = $(this).attr('rel');
		mediaKit.loadPage(relPage, 'none');
		});
	}

}//end mediaKit var