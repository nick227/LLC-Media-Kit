 
/**
 * MVMedia Interactive Media Kit v0.1
 * 01/19/2012 Multiview Inc,
 * 
 */

 /**** SETUP VARS HERE! ***/
var feedName = 'data/dma-site.xml';




var mediaKit = {/*** Retrieves xml feed, runs template manager, attach onclick actions ****/
	init: function() {
	mediaKit.loadPage('home', 'none');
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