 
/**
 * MVMedia Interactive Media Kit v0.1
 * 01/19/2012 Multiview Inc,
 * 
 */
var mediaKit = {
	init: function() {
		var pagesUrl = 'data/dma-pages.xml';
			$.get(pagesUrl, function(xml){
				mediaKit.pages = $.xml2json(xml);
				mediaKit.buildPage('home');
				});

	},
	buildPage: function(pageName) {
	var test = mediaKit.pages.page.name;
	alert(test);
	
	switch(pageName){
	
	}
	
	}

}//end mediaKit var