/**
  * MVMedia Interactive Media Kit v0.1
  * 01/19/2012 Multiview Inc,
  * 
  */ /**** SETUP VARS HERE! ***/
 var subdomain = urlCheck();
 var feedName = 'data/'+subdomain+'-site.xml';
 var startPage = 'audience';
 var pageNames_ar = new Array('audience', 'benefits', 'inventory', 'pricing', 'contact');
 var stageHeight = $(document).height() - 80;
 var transitionCheck = 0;
 var audienceStep = 0;
 var linkOrder = {
     "audience": 1,
     "benefits": 2,
     "inventory": 3,
     "pricing": 4,
     "contact": 5
 };
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],viewPort_width=w.innerWidth||e.clientWidth||g.clientWidth,viewPort_height=w.innerHeight||e.clientHeight||g.clientHeight;
 //*** Global nav animation ***//
 var globalNavPointer;
 var currentSelection;
 var pointerTargetX = 0;
 var pointerInMotion = false;
 var pointerAnimationHandler;
 var currentBenefit;

//if IE...
var ie = false;

 // set ajax caching
 $.ajaxSetup({cache: true});

 var mediaKit = { /*** Retrieves xml feed, runs template manager, attach onclick actions ****/
     init: function () {
         $(window).unload(function () {});
         mediaKit.loadPage(startPage, 'none');
         ie = (/MSIE (\d+\.\d+);/).test(navigator.userAgent);
     },
//     preloadImages: function (styles) {
//     	var d = document;
//     		s = d.styleSheets;
//     		c = d.body
//
//     	if (s) {
//     		for (x=0; x < s.length; x++) {
//     			if (s[x].rules) {
//     				a = s[x].rules;
//     			}
//     			else {
//     				a = s[x].cssRules;
//     			}
//     			if (a) {
//	     			p = s[x].href ? s[x].href.substr(0, s[x].href.lastIndexOf("/") + 1) : '';
//	     			
//	     			for (y=0; y < a.length; y++) {
//	     				t = a[y].style ? a[y].style.background + a[y].style.backgroundImage : undefined ;
//	     				if (t && t.indexOf("url(") > -1) {
//	     					i = /*p + */t.substr(t.indexOf("(") + 1, t.indexOf(")") - t.indexOf("(") - 1);
//	     					c.innerHTML += "<DIV STYLE=\"overflow: hidden; POSITION: absolute; TOP: 0px; LEFT: 0px; WIDTH: 0px; HEIGHT: 0px;\"><IMG SRC=\"" + i + "\" /></DIV>";
//	     				}
//	     			}
//     			}
//     		}
//     	}
//     },
     loadPage: function (pageName, animationMethod, order) {
         $.get(feedName, function (xml) {
             mediaKit.site = $.xml2json(xml);
             document.title = mediaKit.site.siteTitle;
             var template = 'templates/' + pageName + '.html';
             if ($('header#header-main').length < 1) { //permanentally setup header
                 var header_t = 'templates/header.html';
                 var nav_t = 'templates/back-next-arrows.html';
                 $.get(header_t, function (data) {
                     var res = tmpl(data, mediaKit.site);
                     $('section#header-anchor').html(res);
                     // Set nav link click events
                     mediaKit.setupLinks();
                     $.get(nav_t, function (data) { //permanentally nav buttons
                         var res = tmpl(data, mediaKit.site);
                         $('body').prepend(data);
                         // Set up next & prev click events
                     	mediaKit.initPresentationArrows();
                     });
                     
                     globalNavPointer = $('.header-edge-pointer');
                     mediaKit.setPointerTargetX('#' + startPage + '_mainNav');
                     $(window).resize(function () {
                         mediaKit.setPointerX();
                     });
                 });
             }
             $.get(template, function (data) { //now for the body content
                 var newPage = tmpl(data, mediaKit.site);

                 if (animationMethod == 'none') { //initial load
                     $('section#stage-anchor').html(newPage);
					 $('div.cash_section').css('top', viewPort_height);
                     $('body').data('activeNav', '0');
                 } else { //a nav click
                     var activeNav = $('body').data('activeNav');
                     var direction = (activeNav < order) ? 'left' : 'right';
                     if (activeNav == order || transitionCheck == 1) {
                         return true;
                     }
						transitionCheck = 1;
                     //AUDIENCE PAGE
                     if (pageName == 'audience') {
                         $('.stage-bg-gradient').animate({
                             opacity: 0
                         }, 400, function () {
                             mediaKit.pageTransition(direction, newPage);
							$('div.cash_section').css('top', viewPort_height); 
                         });
                     }
                     //BENEFITS PAGE
                     if (pageName == 'benefits') {
                         $('.stage-bg-gradient').animate({
                             opacity: 0
                         }, 400, function () {
                             mediaKit.pageTransition(direction, newPage);
                             mediaKit.setupBenefitsPage();
							$("html, body").animate({ scrollTop: 0}, 900, 'swing' );
                         });
                     }
                     //INVENTORY PAGE
                     if (pageName == 'inventory') {
                         //transition up
                         $('.stage-bg-gradient').animate({
                             opacity: 0
                         }, 400, function () {
                             mediaKit.pageTransition(direction, newPage);
                             mediaKit.setupInventoryPage();
							$("html, body").animate({ scrollTop: 0}, 900, 'swing' );
                         });
                     }
                     //PRICING PAGE
                     if (pageName == 'pricing') {
                         $('.stage-bg-gradient').animate({
                             opacity: 0
                         }, 400, function () {
                             mediaKit.pageTransition(direction, newPage);
							 $("html, body").animate({ scrollTop: 0}, 900, 'swing' );
                         });
                     }
                     //CONTACT PAGE
                     if (pageName == 'contact') {
                         $('.stage-bg-gradient').animate({
                             opacity: 0
                         }, 400, function () {
                             mediaKit.pageTransition(direction, newPage);
							 $("html, body").animate({ scrollTop: 0}, 900, 'swing' );
                         });
                     }

                     $('body').data('activeNav', order);
                 }

                 return true;
             });
         });
     },
     pageTransition: function (dir, newPage) {

         var pageTransitionSpeed = 1150;
         var curStageID = $('div.stage').attr('id'),
         	 currentStage = $('#'+curStageID),
             currentStageHeight = currentStage.height(),
             currentStageWidth = currentStage.width();

         $('#inventory-stage div.welcome-message, #inventory-stage div.nav-sub').fadeOut(500);
         if (dir == 'up') {
             var newtop = stageHeight - 80;
             var newContainer = '<div id="temp-new-container" style="width:100%; position:absolute; top:' + stageHeight + 'px">' + newPage + '</div>';
             $('section.stage').wrap('<div id="temp-big-container" style="width:100%; height:10000px; top:0; left:0; position:absolute; z-index:1"></div>');
             $('div#temp-big-container').append(newContainer).animate({
                 marginTop: '-' + newtop
             }, pageTransitionSpeed, 'linear', function () {
                 $('#' + curStageID).remove();
                 $("#temp-new-container").unwrap();
                 $("section.stage").unwrap();
                 mediaKit.fadeUpBgGradient();
				 transitionCheck = 0;
             });


         }
         if (dir == 'down') {
             var newtop = stageHeight - 80;
             var newContainer = '<div id="temp-new-container" style="width:100%; height:' + stageHeight + 'px position:absolute; top:-' + stageHeight + 'px"; z-index:2>' + newPage + '</div>';
             $('section.stage').wrap('<div id="temp-big-container" style="width:100%; height:10000px; left:0; position:absolute; top:-' + stageHeight + 'px"; z-index:1"></div>');
             $('div#temp-big-container').prepend(newContainer).animate({
                 marginTop: stageHeight
             }, pageTransitionSpeed, 'linear', function () {
                 $('#' + curStageID).remove();
                 $("#temp-new-container").unwrap();
                 $("section.stage").unwrap();
                 mediaKit.fadeUpBgGradient();
				 transitionCheck = 0;
             });


         }
         if (dir == 'left') {
             var newtop = stageHeight - 80;
             var newContainer = '<div id="temp-new-container" style="width:100%; position:absolute; top:0; left:' + currentStageWidth + 'px">' + newPage + '</div>';
             $('#stage-anchor').prepend('<div id="temp-big-container" style="height:10000px; top:0; left:0; position:relative; z-index:1"></div>');
             $('#'+curStageID).prependTo('#temp-big-container');
             $('div#temp-big-container').append(newContainer).animate({
                 left: '-' + currentStageWidth
             }, pageTransitionSpeed, 'easeInOutExpo', function () {
                 $("#temp-new-container .stage").prependTo('#stage-anchor');
                 $("#temp-big-container").remove();
                 if($('body').data('activeNav')!='2'){ //Benefits setup function will handle this with different timing
                	 mediaKit.fadeUpBgGradient();
                }
				 transitionCheck = 0;
             });


         }
         if (dir == 'right') {
            var newtop = stageHeight - 80;
            var newContainer = '<div id="temp-new-container" style="width:100%; position:absolute; top:0; right:' + currentStageWidth + 'px">' + newPage + '</div>';
            $('#stage-anchor').prepend('<div id="temp-big-container" style="height:10000px; top:0; right:0; position:relative; z-index:1"></div>');
            $('#'+curStageID).prependTo('#temp-big-container');
            $('div#temp-big-container').append(newContainer).animate({
            	right: '-' + currentStageWidth
            }, pageTransitionSpeed, 'easeInOutExpo', function () {
                $("#temp-new-container .stage").prependTo('#stage-anchor');
                $("#temp-big-container").remove();
                if($('body').data('activeNav')!='2'){
	            	mediaKit.fadeUpBgGradient();
	            	
				}
				transitionCheck = 0;
            });
         
         
         }
     },
     adjustBgGradientPos: function () {
         var stageHeight = $('#stage-anchor').height();
         var i = $('.stage-bg-gradient');
         var s = $('#stage-anchor');
         $(i).offset({
             top: -(($(i).height() - $(s).height()) / 2),
             left: -(($(i).width() - $(s).width()) / 2)
         }); // -((($(i).height() - $(s).height())/2) + s.offset().top)
     },
     fadeUpBgGradient: function () {
     if(!ie){
         	$('.stage-bg-gradient').animate({
            	 opacity: 1
        	 }, 1200);
         }
     },
     setupLinks: function () {
         mediaKit.linkOrder = linkOrder;
         $('a.slideChange').each(function () {
         	$(this).click(function () {
			if(transitionCheck == 0){
         		var relval = $(this).attr('rel');
         		var order = mediaKit.linkOrder[relval];
         		mediaKit.loadPage(relval, 'yes', order);
         		mediaKit.setPointerTargetX(this);
				}
         	});
         });
     },
     setPointerTargetX: function (selected_btn) { //*** GLOBAL NAV POINTER ANIMATION FUNCTIONS ***//
         currentSelection = selected_btn;
         pointerTargetX = $(selected_btn).offset().left + (($(selected_btn).width() - $(globalNavPointer).width()) / 2);
         if (!pointerInMotion) {
             pointerAnimationHandler = setInterval(mediaKit.animatePointer, 30);
             pointerInMotion = true;
         }
     },
     animatePointer: function () {
         if (globalNavPointer != null) {
             var currentX = globalNavPointer.offset().left
             var distanceToTarget = (pointerTargetX - currentX);
             var addAmount = (distanceToTarget / 6);
             globalNavPointer[0].style.left = currentX + addAmount + 'px';
             if (distanceToTarget < 1 && distanceToTarget > -1) {
                 globalNavPointer[0].style.left = pointerTargetX + 'px';
                 clearInterval(pointerAnimationHandler);
                 pointerInMotion = false;
             }
         }
     },
     setPointerX: function () {
             pointerTargetX = $(currentSelection).offset().left + (($(currentSelection).width() - $(globalNavPointer).width()) / 2);
             globalNavPointer[0].style.left = pointerTargetX + 'px';
     },
     setupBenefitsPage: function () {
         $('.benefit-box').each(function () {
             $(this).hover(function(){
             	var icon = $('#' + $(this).attr('id') + ' .benefit-graphic');
             	var title = $('#' + $(this).attr('id') + ' h2');
             	var id = $(icon).attr('id').substr(-1, 1);
             	$(icon).removeClass('sprite-benefit' + id + '-off');
             	$(icon).addClass('sprite-benefit' + id);
             	$(title).addClass('rollover');
             }, function(){
             	var icon = $('#' + $(this).attr('id') + ' .benefit-graphic');
             	var id = $(icon).attr('id').substr(-1, 1);
             	var title = $('#' + $(this).attr('id') + ' h2');
             	$(icon).removeClass('sprite-benefit' + id);
         		$(icon).addClass('sprite-benefit' + id + '-off');
         		$(title).removeClass('rollover');
             });
             $(this).click(function () {
             	if(currentBenefit != undefined){
             		if($(currentBenefit).attr('id') == $('#' + $(this).attr('id') + ' .benefit-content').attr('id')){
             			$(this).removeClass('benefit-box-selected');
             			$(currentBenefit).animate({
                    	 top: 0
                 		}, 200, function () {});
                 		currentBenefit = null;
             		}else{
             			$(currentBenefit).stop();
             			$(currentBenefit).animate({
                    	 top: 0
                 		}, 200, function () {});
                 		$(this).addClass('benefit-box-selected');
                 		currentBenefit = $('#' + $(this).attr('id') + ' .benefit-content');
                 		$(currentBenefit).animate({
                    	 top: -200
                		 }, 200, function () {});
             		}
             	}else{
             		currentBenefit = $('#' + $(this).attr('id') + ' .benefit-content');
             		$(this).addClass('benefit-box-selected');
             		$(currentBenefit).animate({
                     top: -200
                 }, 200, function () {});
             	}
             });
         });
		introBenefitsPage1();
		function introBenefitsPage1(){
     		$('.benefit-box').each(function () {
     			$(this).css({opacity: 0});
     		});
     		var a = $('#benefitsText_Your');
     		var b = $('#benefitsText_Benefits');
     		$('#benefitsText_Explore').css('opacity', '0');
    	 	var yourTop = $(a).position().top;
    	 	var benefitsLeft = $(b).position().left;
    	 	$(a).css('top', yourTop + 250 + 'px');
     		$(a).css('opacity', 0);
     		$(b).css('opacity', 0);
     		$(b).css('left', benefitsLeft + 250 + 'px');
     		$(a).delay(1000).animate({top: yourTop, opacity: 1}, 400, 'swing', function(){
     			$(b).delay(100).animate({left: benefitsLeft, opacity: 1}, 400, 'swing', function(){introBenefitsPage2();});
     		});
    	 }
		function introBenefitsPage2(){
     		var delayInc = 100;
			$('.benefit-box').each(function () {
				var targetX = $(this).position().left;
    	 		$(this).css({left: targetX + 400});
    			$(this).delay(delayInc).animate({opacity: 1,
    											left: targetX}, 
    											{duration: 300,
    	             							specialEasing: 
    	             							{opacity: 'linear',
    	                 						left: 'swing'}});
    	    	delayInc += 100;
    		});
    		setTimeout(function(){introBenefitsPage3();}, 1000);
    	 }
		function introBenefitsPage3(){
			var c = $('#benefitsText_Explore');
			$(c).delay(200).animate({opacity: 1}, 500);
			mediaKit.fadeUpBgGradient();
     	}
     },
     setupInventoryPage: function () {
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
		var leftArrow = $('#presentationPrev');
		var rightArrow = $('#presentationNext');
		leftArrow.click(function(){
			if($('body').data('activeNav') == 1 || $('body').data('activeNav') == 0){//still on page one
				if(audienceStep==1){//bottom of page one
				$("html, body").animate({ scrollTop: 0}, 900, 'swing' );
				audienceStep=0;
				}
			}else{
				previousMainSlide();
			}
		});
		rightArrow.click(function(){
			if($('body').data('activeNav') == 1 || $('body').data('activeNav') == 0){//still on page one
				if(audienceStep==0){//top of page one
				var destination = $('.cash_section').offset().top;
				$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination-140}, 1500, function(){
				$("html, body").delay(1150).animate({ scrollTop: $(document).height()-$(window).height()}, 1800, 'swing' );
				audienceStep=1;
				});
				}else{//bottom of page one
				advanceMainSlide();
				audienceStep=0;
				}
			}else{
			advanceMainSlide();
			}
		});
			function previousMainSlide(){
					var activeNav = $('body').data('activeNav') == 0 ? 1 : $('body').data('activeNav');
						activeNav = activeNav > 1 ? activeNav - 2: activeNav - 1;
					$('#inventory-nav-main .slideChange').eq(activeNav).trigger('click');
			}
			function advanceMainSlide(){
					var activeNav = $('body').data('activeNav') == 0 ? 1 : $('body').data('activeNav');
					$('#inventory-nav-main .slideChange').eq(activeNav).trigger('click');
			}
	},
	setupVirtualIpad: function(){ //sets up interactive ipad on inventory screen
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
			'transitionOut'	: 'elastic'
		});
		
		
		// setup draggables 	
		$('.draggable').draggable({ axis: 'y', snapMode: 'both' }).bind( "dragstop", function(event, ui) {
		  
		  var height = -$(this).height(),
		  	  top = ui.position.top,
		  	  parHeight = $(this).parent().height();
		  
		  // SlideContainer rebound
		  if ($(this).is('#ipadWrap') && height > top - parHeight + 50) {
		  	
		  	$(this).animate({top:0}, 300, 'swing');
		  
		  } 
		  // iPadScreen rebound
		  else if (!$(this).is('#ipadWrap') && height > top - parHeight) {
		  
		  	  $(this).animate({top:height+parHeight}, 300, 'swing');
		  			  
		  }
		  // Top rebound (both)
		  else if (top > 0) {
		    
		    $(this).animate({top:0}, 300, 'swing');
		  
		  }
		  
		  // Keep child drag from triggering parent
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
				
				// show triggered ad
				ad.addClass('active').find('.img').fadeTo(0,1);
				
			});
			
		})
		
	},
	setupArrowSubNav: function(){
$("div.nav-sub").delay(1234).fadeIn();
$("div.nav-sub").find('.nav-btn').click(function(){
$(this).parent('div').find('div.nav-active').removeClass('nav-active');
$(this).addClass('nav-active');
var adID = $(this).attr('id').substr($(this).attr('id').indexOf('_')+1, $(this).attr('id').length);
var zoomid = 'a.ad_'+adID;
$(zoomid).trigger('click');
});


	}

}//end mediaKit var
