 
/**
 * MVMedia Interactive Media Kit v0.1
 * 01/19/2012 Multiview Inc,
 * 
 */

 /**** SETUP VARS HERE! ***/
var feedName = 'data/dma-site.xml';
var startPage = 'inventory';

//*** Global nav animation ***//
var globalNavPointer;
var currentSelection;
var pointerTargetX = 0;
var pointerInMotion = false;
var pointerAnimationHandler;


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
				
				mediaKit.setupVirtualIpad(); // do we need to provision for non-inventory pages???
				mediaKit.setupArrowSubNav();
				globalNavPointer = $('.header-edge-pointer');
				console.log(globalNavPointer);
				$(window).resize(mediaKit.setPointerX);
				}
				});
		
			return true;
	});
	},
	setupLinks: function(){//super quick page navigation
		$('a.slideChange').live('click', function(){
		var relPage = $(this).attr('rel');
		mediaKit.loadPage(relPage, 'none');
		});
	},
	setPointerTargetX: function(selected_btn){//*** GLOBAL NAV POINTER ANIMATION FUNCTIONS ***//
		currentSelection = selected_btn;
		pointerTargetX = $(selected_btn).offset().left + (($(selected_btn).width() - $(globalNavPointer).width())/2);
		if(!pointerInMotion){
			pointerAnimationHandler = setInterval(mediaKit.animatePointer, 30);
			pointerInMotion = true;
		}
	},
	animatePointer: function(){
		if(globalNavPointer != null){
			var currentX = globalNavPointer.offset().left
			var distanceToTarget = (pointerTargetX - currentX);
			var addAmount = (distanceToTarget / 6);
			globalNavPointer[0].style.left = currentX + addAmount + 'px';
			if(distanceToTarget < 1 && distanceToTarget > -1){
				globalNavPointer[0].style.left = pointerTargetX + 'px';
				clearInterval(pointerAnimationHandler);
				pointerInMotion = false;
			}
		}
	},
	setPointerX: function(){
		console.log('resize');
		if(!pointerInMotion && currentSelection != null){
			pointerTargetX = $(currentSelection).offset().left + (($(currentSelection).width() - $(globalNavPointer).width())/2);
			globalNavPointer[0].style.left = pointerTargetX + 'px';
		}
	},
	setupVirtualIpad: function(){ //sets up interactive ipad on inventory screen
		// fade screen images
		$("#ipadScreen .screen").fadeTo(0,0.5);
		
		// set bg, fade ads, ad events
		$("#ipadScreen a .img").each(function() {
			
			var par = $(this).parent(),
				src = par.siblings(".screen").attr('src');
			
			// set bg image				
			$(this).css('background-image','url('+src+')').fadeTo(0,0);
			
			// Click ad event
			$(this).add(this.nextSibling).click(function(event){
				if (!par.is('.active')) {
					var c = par.attr('class').replace('ad_','').replace('zoom ','');
					$('#'+c).trigger('click');
					// INSERT ARROW UPDATE HERE!!!!!!!!!!
					return false
				}				
			});
			
		});
		
		$("a.zoom").fancybox({
			'titlePosition'	: 'inside',
			'opacity'		: true,
			'overlayShow'	: false,
			'transitionIn'	: 'elastic',
			'type'          : 'image',
			'transitionOut'	: 'none'
		});
		
		// setup draggables 	
		$('.draggable').draggable({ axis: 'y', snapMode: 'both' }).bind( "dragstop", function(event, ui) {
		  
		  var height = -$(this).height(),
		  	  top = ui.position.top,
		  	  parHeight = $(this).parent().height();
		  
		  // SlideContainer rebound
		  if ($(this).is('#ipadWrap') && height > top - parHeight + 50) {
		  	
		  	$(this).animate({top:height+parHeight-50}, 300, 'swing');
		  
		  } 
		  // iPadScreen rebound
		  else if (!$(this).is('#ipadWrap') && height > top - parHeight) {
		  
		  	  $(this).animate({top:height+parHeight}, 300, 'swing');
		  			  
		  }
		  // Top rebound (both)
		  else if (top > 0) {
		    
		    $(this).animate({top:0}, 300, 'swing');
		  
		  }
		  
		  // Keep child drag from triggering parrent
		  event.stopPropagation();
		  		  
		}); 
				
		// Sub Nav actions
		
		$("nav.nav-sub li").each(function() {
		
			$(this).click(function() {
				
				var c = $(this).attr('rel').split(',')[2],
					y1 = $(this).attr('rel').split(',')[0],
					y2 = $(this).attr('rel').split(',')[1],
					ad = $('#ipadScreen .'+c),
					bg = ad.siblings('.screen').attr('src');
					
				// y1 = container position 
				$("#ipadWrap").animate({top:y1}, 300);
				// y2 = screen position
				$("#ipadScreen .draggable").animate({top:y2}, 300);
				
				// hide ads
				$('#ipadScreen a').each(function(){
					$(this).removeClass('active').find('.img').fadeTo(0, 0)
				});
				
				// show triggered ad
				ad.addClass('active').find('.img').fadeTo(0,1);
				
//				 Remove active class
//				$(this)
//				.parent()
//				.siblings()
//				.add(this.parentNode)
//				.find('a').removeClass('active');
//				
//				 Add active class to selected
//				$(this).addClass('active');
				
			});
			
		})
		.eq(0).trigger('click'); // first link make active on load
		
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