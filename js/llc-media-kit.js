 
/**
 * MVMedia Interactive Media Kit v0.1
 * 01/19/2012 Multiview Inc,
 * 
 */

 /**** SETUP VARS HERE! ***/
var feedName = 'data/dma-site.xml';
var startPage = 'inventory';



var mediaKit = {/*** Retrieves xml feed, runs template manager, attach onclick actions ****/
	init: function() {
	$(window).unload( function () {} );
	mediaKit.loadPage(startPage, 'none');
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
				//mediaKit.setupVirtualIpad();
				mediaKit.setupArrowSubNav();
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
	},
	setupVirtualIpad: function(){
		//$('.scroll-pane').jScrollPane();
		$('.draggable').draggable({ axis: 'y', snapMode: 'both' }).bind( "dragstop", function(event, ui) {
		alert('hello');
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

	},
	setupArrowSubNav: function(){
	$('nav.nav-sub').prepend('<img class="pointerArrowSml" src="images/blueSelArrow.png" style="position:absolute; z-index:2" />');
	function hoverItem(){
		var arrow = $(this).parents('nav.nav-sub').find('img.pointerArrowSml');
		var p = $(this).position();
		$(arrow).stop(true, true).animate({
		top:p.top
		}, 200, function(){});
	}

	function hoverOut(){
			
		if($(this).hasClass('selected')){}else{
		
			var arrow = $(this).parents('nav.nav-sub').find('img.pointerArrowSml');
			var curSel = $(this).parent('ul').find('li.selected');
			var p = $(curSel).position();
			
			if($(arrow).is(':animated')){}else{
				$(arrow).delay('500').animate({
				top:p.top
				}, 1150, function(){});
			}
		}
		
	}
	var config = {    
     over: hoverItem,
     timeout: 0, 
     out: hoverOut
		
};

$("nav.nav-sub li").hoverIntent(config);
$("nav.nav-sub li").click(function(){
$(this).parent('ul').find('li.selected').removeClass('selected');
$(this).addClass('selected');
});

	/*
	$('nav.nav-sub').live('hoverIntent', function(){
	alert('asd');
	});*/
	}

}//end mediaKit var