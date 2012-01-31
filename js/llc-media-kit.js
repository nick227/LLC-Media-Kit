 
/**
 * MVMedia Interactive Media Kit v0.1
 * 01/19/2012 Multiview Inc,
 * 
 */

 /**** SETUP VARS HERE! ***/
var feedName = 'data/dma-site.xml';
var startPage = 'audience';
var pageNames_ar = new Array('audience', 'benefits', 'inventory', 'pricing', 'contact');
var stageHeight = $(document).height()-80;
var linkOrder = { "audience":1, "benefits": 2, "inventory": 3, "pricing": 4, "contact": 5};

//*** Global nav animation ***//
var globalNavPointer;
var currentSelection;
var pointerTargetX = 0;
var pointerInMotion = false;
var pointerAnimationHandler;
var currentBenefit;


var mediaKit = {/*** Retrieves xml feed, runs template manager, attach onclick actions ****/
	init: function() {
	$(window).unload( function () {} );
	mediaKit.loadPage(startPage, 'none');
	mediaKit.setupLinks();
	},
	loadPage: function(pageName, animationMethod, order){
		$.get(feedName, function(xml){
		mediaKit.site = $.xml2json(xml);
		document.title = mediaKit.site.siteTitle;
		var template = 'templates/'+pageName+'.html';
		if($('header#header-main').length < 1){//permanentally setup header
		var header_t = 'templates/header.html';
		var nav_t = 'templates/back-next-arrows.html';
			$.get(header_t, function(data) {
			var res = tmpl(data, mediaKit.site);
			$('section#header-anchor').html(res);
				$.get(nav_t, function(data) {//permanentally nav buttons
				var res = tmpl(data, mediaKit.site);
				$('body').prepend(data);
				});
				
				globalNavPointer = $('.header-edge-pointer');
				console.log(globalNavPointer);
				mediaKit.setPointerTargetX('#' + startPage + '_mainNav');
				$(window).resize(function(){mediaKit.setPointerX();});
			});
		}
			$.get(template, function(data) {//now for the body content
			var newPage = tmpl(data, mediaKit.site);
				if(animationMethod=='none'){//initial load
				$('section#stage-anchor').html(newPage);
				$('.stage').css('height', stageHeight);
				$('body').data('activeNav', '0');
				}else{//a nav click
				var activeNav = $('body').data('activeNav');
				var direction = (activeNav < order) ? 'up' : 'down';
				if(activeNav == order){
				return true;
				}
	//AUDIENCE PAGE
		if(pageName == 'audience'){
			mediaKit.pageTransition(direction, newPage);
			}
	//BENEFITS PAGE
		if(pageName == 'benefits'){
			mediaKit.pageTransition(direction, newPage);
			mediaKit.setupBenefitsPage();
			}
	//INVENTORY PAGE
		if(pageName == 'inventory'){
			//transition up
			mediaKit.pageTransition(direction, newPage);
			mediaKit.setupInventoryPage();
			}
	//PRICING PAGE
		if(pageName == 'pricing'){
			mediaKit.pageTransition(direction, newPage);
			}
	//CONTACT PAGE
		if(pageName == 'contact'){
			mediaKit.pageTransition(direction, newPage);
			}

	$('body').data('activeNav', order);		
}
		
	return true;
			});
		});
	},
	pageTransition: function(dir, newPage){
	
			var pageTransitionSpeed = 1150;
			var currentStage = $('section.stage'),
				currentStageHeight = currentStage.height(),
				currentStageWidth = currentStage.width(),
				currentStageTopPos = currentStage.position(),
				currentStageTop = currentStageTopPos.top,
				currentStageLeft = currentStageTopPos.left,
				newBottom = currentStageTop+currentStageHeight,
				newRight = currentStageLeft+currentStageWidth;
			var curStageID = $(currentStage).attr('id');
			
			if(dir=='up'){
			var newtop = stageHeight-80;
			var newContainer = '<div id="temp-new-container" style="width:100%; position:absolute; top:'+stageHeight+'px">'+newPage+'</div>';
			$('section.stage').wrap('<div id="temp-big-container" style="width:100%; height:10000px; top:0; left:0; position:absolute; z-index:1" />');
			$('div#temp-big-container').append(newContainer).animate({marginTop:'-'+newtop}, 
															pageTransitionSpeed, 'linear', function() {
															$('#'+curStageID).remove();
															$("#temp-new-container").unwrap();
															$("section.stage").unwrap();
															});  
			
			$('div#slideContainer').css('height', stageHeight);
			
			}
			if(dir=='down'){
			var newtop = stageHeight-80;
			var newContainer = '<div id="temp-new-container" style="width:100%; height:'+stageHeight+'px position:absolute; top:-'+stageHeight+'px"; z-index:2>'+newPage+'</div>';
			$('section.stage').wrap('<div id="temp-big-container" style="width:100%; height:10000px; left:0; position:absolute; top:-'+stageHeight+'px"; z-index:1" />');
			$('div#temp-big-container').prepend(newContainer).animate({marginTop:stageHeight}, 
															pageTransitionSpeed, 'linear', function() {
															$('#'+curStageID).remove();
															$("#temp-new-container").unwrap();
															$("section.stage").unwrap();
															});  
			
			$('div#slideContainer').css('height', stageHeight);
			
			}
			if(dir=='left'){
			var newtop = stageHeight-80;
			var newContainer = '<div id="temp-new-container" style="width:100%; position:absolute; left:'+currentStageWidth+'px">'+newPage+'</div>';
			$('section.stage').wrap('<div id="temp-big-container" style="height:100%; width:10000px; top:0; left:0; position:absolute; z-index:1" />');
			$('div#temp-big-container').append(newContainer).animate({left:'-'+currentStageWidth}, 
															pageTransitionSpeed, 'linear', function() {
															$('#'+curStageID).remove();
															$("#temp-new-container").unwrap();
															$("section.stage").unwrap();
															});  
			
			$('div#slideContainer').css('height', stageHeight);
			
			}
			
			$('.stage').css('height', stageHeight);
			$(window).resize(function(){
			var stageHeight = $(document).height()-80;
			$('.stage').css('height', stageHeight);
			});
			
	
	},
	setupLinks: function(){
		mediaKit.linkOrder = linkOrder;
		$('a.slideChange').live('click', function(){
			var relval = $(this).attr('rel');
			var order = mediaKit.linkOrder[relval];
		mediaKit.loadPage(relval, 'yes', order);
		mediaKit.setPointerTargetX(this);
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
	setupBenefitsPage: function(){
		var delayInc = 100;
		$('.benefit-box').each(function(){
			var targetX = $(this).position().left;
			$(this).css({opacity: 0});
			$(this).css({left: targetX + 400});
			$(this).delay(1200 + delayInc).animate({opacity: 1, left: targetX},{ duration: 300, specialEasing:{
													opacity: 'linear',
													left: 'swing'}});
			delayInc += 100;
			$(this).click(function(){
				if(currentBenefit != undefined && $(currentBenefit).attr('id') != $('#' + $(this).attr('id') + ' .benefit-content').attr('id')){
					$(currentBenefit).stop();
					$(currentBenefit).animate({top: 0}, 200, function(){});
					$($(currentBenefit).parent()).removeClass('benefit-box-selected');
				}
				currentBenefit = $('#' + $(this).attr('id') + ' .benefit-content');
				$(this).addClass('benefit-box-selected');
				$(currentBenefit).animate({top: -130}, 200, function(){});
			});
		});
	},
	setupInventoryPage: function(){
			
				$('body, section, div').bind('mousedown.welcome', function() {
				$('#inventory-stage .welcome-message').animate({
    			opacity: 0.25,
    			height: '0'
				}, {queue:false, duration:600, easing: 'easeInExpo'}, function() {
				$('body, section, div').unbind('mousedown.welcome');
				$('#inventory-stage .welcome-message').remove();
				});  
				});
				mediaKit.setupArrowSubNav();
				mediaKit.setupVirtualIpad();
		
	},
	shiftIpadScreen: function(whereTo){
		var target = 0;
		switch (whereTo){
			case "player":
			break;
			case "home":
			target = 510;
			break;
		}
		$('#homeScreen').animate({left:(target-510)}, 300, function(){});
	},
	initPresentationArrows: function(e){
		var prevArrowX = $('#ipad').offset().left - $('#presentationPrev').width() - 80;
		var nextArrowX = $('#ipad').offset().left + $('#ipad').width() + $('#presentationPrev').width() + 80;
		var leftArrow = $('#presentationPrev');
		var rightArrow = $('#presentationNext');
		leftArrow.css({'left': prevArrowX});
		rightArrow.css({'left': nextArrowX});
		if(e=='firstInit'){
			leftArrow.css({'opacity': 0});
			rightArrow.css({'opacity': 0});
			setTimeout(function(){		
			leftArrow.animate({'opacity': 0.7}, 1000, function(){});
			rightArrow.animate({'opacity': 0.7}, 1000, function(){});
			}, 2000);
			
			leftArrow.click(function(){
				var prevSubSelection = $('ul li.selected').prev();
				if(prevSubSelection != undefined){
					prevSubSelection.trigger('click');
				}
			});
			rightArrow.click(function(){
				var nextSubSelection = $('ul li.selected').next();
				if(nextSubSelection != undefined){
					nextSubSelection.trigger('click');
				}
			});
		}		
	},
	setupVirtualIpad: function(){ //sets up interactive ipad on inventory screen
		// fade screen images
		//$("#ipadScreen .screen").fadeTo(0,0.5);
		
		window.zoomAni = setInterval(function() {
			$("#ipadScreen a .zoom, span.glowingIcon").each(function(i){
				$(this).delay(i*200).fadeTo(300, 0.5, function(){
					$(this).delay(100).fadeTo(300, 1);
				});
			});
		}, 3000);
		
		// set bg, fade ads, ad events
		$("#ipadScreen a .img").each(function() {
			
			var par = $(this).parent(),
				screen = par.siblings(".screen"),
				src = screen.attr('src');
			
			// set bg image				
			$(this).css('background-image','url('+src+')');
			
			// Click ad event
			$(this).add(this.nextSibling).click(function(event){
				if (!par.is('.active')) {
					var c = par.attr('class').replace('ad_','').replace('zoom ','');
					$('#'+c).trigger('click');
					
					var arrow = $('nav.nav-sub').find('img.pointerArrowSml');
					var p = $('nav.nav-sub ul li').find('li.selected').position();
					$(arrow).stop(true, true).animate({top:p.top}, 200, function(){});
					//return false;

				}				
			});
			
			// parent rollover effect
			$(this).parent().hover(function(){
				// hover in
				screen.clearQueue().fadeTo(300, 0.5);
				$(this).siblings('a').clearQueue().fadeTo(300,0);
				$(this).find('.zoom').fadeTo(0,0);
			},function(){
				// hover out
				screen.clearQueue().fadeTo(300, 1);
				$(this).siblings('a').clearQueue().fadeTo(300,1);
				$(this).find('.zoom').fadeTo(0,1);
			});
			
		});
		
		$("a.fancybox").fancybox({
			'titlePosition'	: 'inside',
			'opacity'		: true,
			'overlayShow'	: true,
			'transitionIn'	: 'elastic',
			'transitionOut'	: 'elastic',
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
		  //event.stopPropagation();
		  		  
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
//				$('#ipadScreen a').each(function(){
//					$(this).removeClass('active').find('.img').fadeTo(0, 0)
//				});
				
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
		//.eq(0).trigger('click'); // first link make active on load
		
	},
	setupArrowSubNav: function(){
$("div.nav-sub").delay(1234).fadeIn();
$("div.nav-sub").find('.nav-btn').click(function(){
$(this).parent('div').find('div.nav-active').removeClass('nav-active');
$(this).addClass('nav-active');
var adID = $(this).attr('id').substr($(this).attr('id').indexOf('_'), $(this).attr('id').length);
alert(adID);
var zoomid = 'a.ad_'+$(this).attr('id');
$(zoomid).trigger('click');
});


	}

}//end mediaKit var