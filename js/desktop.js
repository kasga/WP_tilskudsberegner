if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

;Orsted.Branding.desktop = (function ($) {

    if (typeof $ != "undefined") {
        var jQuery = $;

        function searchCategoriesWrap(){
            if(jQuery(".search-categories .search-category").length){
                var numOfCategories = jQuery(".search-categories .search-category").length;
                var splitAt = Math.ceil(numOfCategories / 3);

                jQuery(".search-categories .search-category").each(function(i){
                    i++;

                    if(i == 1){
                        jQuery('.search-categories .search-category:lt('+splitAt+')').wrapAll("<div class='search-category-wrap clearfix'></div>");
                    }

                    if(i % splitAt == 0){
                        jQuery('.search-categories .search-category').slice(i, i+splitAt).wrapAll("<div class='search-category-wrap clearfix'></div>");
                    }

                });
            }
        }

        function calculateTeaserBoxesHeights() {

            var gridrows = jQuery(".grid-row, .product-grid-row");

            gridrows.each(function (i) {

                var tboxes = jQuery(gridrows[i]).find(".heading, .teaser-box"); // leoca - changed from '.teaser-box .heading' to '.heading' to cover QC1170.

                if (tboxes.length > 1) {

                    var maxHeight = Math.max.apply(null, tboxes.find("h2").map(function () {
                        return jQuery(this).height();
                    }).get());
                    for (var k = 0, j = tboxes.length; k < j; k++) {

                        //leoca - changed logic: previously it will set margin for h1, now it should apply to div "heading"
                        var tbox = jQuery(tboxes[k]);

                        if(tbox.hasClass("teaser-box")){
                            var thisHeight = maxHeight - tbox.find("h2").height();
                        }else{
                            var thisHeight = maxHeight - tbox.height();
                        }


                        jQuery(tbox).css("margin-top", thisHeight + "px");
                    }
                }
            });
        }

        //ADILA-reimplement this function in the above method to fix the additional content box issue - PBI 10445
        //function calculateTeaserBoxesHeights() {

        //    var gridrows = jQuery(".grid-row");

        //    gridrows.each(function (i) {

        //        var tboxes = jQuery(gridrows[i]).find(".teaser-box h2").parent(".teaser-box");

        //        if (tboxes.length > 1) {

        //            var maxHeight = Math.max.apply(null, tboxes.find("h2").map(function () {
        //                return jQuery(this).height();
        //            }).get());
        //            for (var i = 0, j = tboxes.length; i < j; i++) {

        //                var tbox = jQuery(tboxes[i]);
        //                var tboxHead = tbox.find("h2");
        //                var thisHeight = maxHeight - tboxHead.height();
        //                tboxHead.css("margin-top", thisHeight + "px");
        //            }
        //        }
        //    });
        //}

        function calculateLoginBoxHeights() {
            $(".default-login-box-container").each(function() {
                var maxHeight = 0;
                $(this).find(".default-login-box").each(function() {
                    if ($(this).height() > maxHeight) {
                        maxHeight = $(this).height();
                    }
                });
                $(this).find(".default-login-box").css("height", maxHeight + "px");
            });
        }


        function caseTitleHeights() {
            $(".cases-list").each(function() {
                $(this).find(".cases-single").filter(":odd").each(function() {
                    var oddHeight = $(this).find("h2").height(),
                        evenHeight = $(this).next(".cases-single").find("h2").height();
                    if (oddHeight > evenHeight) {
                        $(this).next(".cases-single").find("h2").css("margin-top", oddHeight - evenHeight + "px");
                        $(this).find("h2").css("margin-top", "0");
                    } else if (evenHeight > oddHeight) {
                        $(this).next(".cases-single").find("h2").css("margin-top", "0");
                        $(this).find("h2").css("margin-top", evenHeight - oddHeight + "px");
                    } else {
                        $(this).next(".cases-single").find("h2").css("margin-top", "0");
                        $(this).find("h2").css("margin-top", "0");
                    }
                });
            });
        }


        function initLastClasses(){
            jQuery(".related-links li").last().addClass("last");
        }

//Menu functionality
        function initSearchToggle(){

            //Open/close search field
            jQuery(".search-opener").on('click',function(){

                if(jQuery("#header .search-form").is(":visible")){
                    hideSearch();
                }else{
                    showSearch();
                }

                return false;
            });

            //Close search field if clicking outside
            jQuery('html').on('touchstart click', function() {
                hideSearch();
                hideLoginPopup();
                jQuery("#header .nav-drop").css("top","-9999px");
            });

            jQuery('#header').on('touchstart click', function(event) {
                event.stopPropagation();
            });

        }

        function showSearch(){
            hideLoginPopup();
            jQuery(".search-form").slideDown(200);
            jQuery("#header").addClass("active-search");
        }

        function hideSearch() {
            // leoca - changed selectors as this will affect the search result page (there are two search boxes in this page)
            if (jQuery(".search-form.search-slide").is(":visible"))
            {
                jQuery(".search-form.search-slide").slideUp(200, function () {
                    if(jQuery("#hdfTooltip").length){
                        jQuery("#searchBox").val(jQuery("#hdfTooltip")[0].value);
                    }
                });
            }
            jQuery("#header").removeClass("active-search");
        }

// content tabs init
        function initTabs() {
            jQuery('.tabset').contentTabs({
                addToParent: true,
                autoHeight: true,
                tabLinks: 'a',
                event: 'click touchstart'
            });
            jQuery('.tab-switcher').contentTabs({
                addToParent: true,
                autoHeight: true,
                tabLinks: 'a',
                event: 'click touchstart'
            });
            jQuery('.tab-nav').contentTabs({
                addToParent: true,
                autoHeight: true,
                tabLinks: 'a',
                event: 'click touchstart'
            });
        }

        //init slide nav
        function initMenu(){

            //Check if logo is wider than 153px
            var logo_width = jQuery("#header .logo img").width();
            if(logo_width > 153){
                logo_width = logo_width + 15;
                jQuery("#header .header-holder .section").css("margin-left", logo_width+"px");
            }



            var fadeSpeed = 150,
                isTopMenu = jQuery('.nav-slides').hasClass("top-menu"),
                subMenu = jQuery('.nav-slides .sub-nav ul');

            showActiveMenuItem();

            //This function renders the menu according to current screen-size
            function calculateMenuSpace(){

                var subMenuWidth = subMenu.parent().outerWidth();

                if(isTopMenu){
                    subMenu = jQuery('.nav-slides .sub-nav ul li.active ul');
                }

                var items = subMenu.find("li:not(.last, .hidden)");
                var moreMenuItem = jQuery("#show-more-of-menu-btn");

                var splitMenuAt = calculateNumberOfItemsInMenu(subMenuWidth, items, moreMenuItem);

                if(!prevActive || items.length == splitMenuAt){

                    prevActive = false;

                    if(isTopMenu){
                        jQuery(".nav-slides .sub-nav ul li.active ul li:visible, .nav-slides ul li.active ul li.last .prev").hide();
                    }else{
                        jQuery(".nav-slides .sub-nav ul li:visible, .nav-slides ul li.last .prev").hide();
                    }

                    if(items.length != splitMenuAt && items.length > 0){
                        moreMenuItem.show();
                        items.eq(splitMenuAt).hide();
                        items.eq(splitMenuAt).nextAll().hide();
                        items.eq(splitMenuAt).prevAll().show();
                    }else{
                        items.show();
                        moreMenuItem.hide();
                    }
                }

            }

            //This function returns the index where we need to split the menu
            function calculateNumberOfItemsInMenu(menuWidth, items, moreMenuItem){

                var itemsWidth = 0;
                var itemsWidthGrowth = [];
                var splitMenuAt;
                items.each(function(i){
                    var item = jQuery(this);
                    if (item.is(':visible')) {
                        itemsWidth += item.children('a').outerWidth();
                    } else {
                        item.show();
                        itemsWidth += item.children('a').outerWidth();
                        item.hide();
                    }
                    if (i > 0) {
                        itemsWidth -= 6;
                    }
                    itemsWidthGrowth[i] = itemsWidth;
                });

                //Test if there is room without more-btn
                if((menuWidth - moreMenuItem.outerWidth(true)) > itemsWidthGrowth[items.length - 1] && moreMenuItem.is(":visible")){
                    return itemsWidthGrowth.length;
                }

                function checkBackThroughItems(ite, back) {
                    if (menuWidth - moreMenuItem.outerWidth(true) < itemsWidthGrowth[ite - back]) {
                        checkBackThroughItems(ite, back + 1);
                    } else {
                        splitMenuAt = ite;
                    }
                }

                for (var i = 0; i < itemsWidthGrowth.length; i++) {
                    if(menuWidth - moreMenuItem.outerWidth(true) < itemsWidthGrowth[i]){
                        checkBackThroughItems(i, 0);
                        break;
                    }else{
                        splitMenuAt = itemsWidthGrowth.length;
                    }
                }

                return splitMenuAt;
            }

            //Bind the "more"-link in the menu to show the hidden menu-items
            jQuery(".nav-slides .next").bind("click",function(){
                if(isTouchDevice){
                    jQuery(".nav-drop").css("top","-9999px");
                    jQuery(".nav-slides > .sub-nav > ul > li.hover").removeClass("hover");
                }
                prevActive = true;

                if(isTopMenu){
                    var lastVisible = jQuery(".nav-slides .sub-nav ul li.active ul li:visible").last().index();
                    jQuery(".nav-slides .sub-nav ul li.active ul li:visible, .nav-slides .next").fadeOut(fadeSpeed,function(){
                        jQuery(".nav-slides .sub-nav ul li.active ul li").eq(lastVisible).nextAll().fadeIn(fadeSpeed);
                        jQuery(".nav-slides .sub-nav ul li.active ul li.last .prev").fadeIn(fadeSpeed);
                    });
                }else{
                    var lastVisible = jQuery(".nav-slides .sub-nav ul li:visible").last().index();
                    jQuery(".nav-slides .sub-nav ul li:visible, .nav-slides .next").fadeOut(fadeSpeed,function(){
                        jQuery(".nav-slides .sub-nav ul li").eq(lastVisible).nextAll().fadeIn(fadeSpeed);
                        jQuery(".nav-slides .sub-nav ul li .prev").fadeIn(fadeSpeed);
                    });
                }


                return false;
            });

            //Bind the "prev"-link in the menu to show the hidden menu-items
            jQuery(".nav-slides ul li.last .prev").bind("click",function(){
                if(isTouchDevice){
                    jQuery(".nav-drop").css("top","-9999px");
                    jQuery(".nav-slides > .sub-nav > ul > li.hover").removeClass("hover");
                }
                prevActive = false;

                if(isTopMenu){
                    var firstVisible = jQuery(".nav-slides .sub-nav ul li.active ul li:visible").first().index();
                    jQuery(".nav-slides .sub-nav ul li.active ul li:visible, .nav-slides ul li.last .prev").fadeOut(fadeSpeed,function(){
                        jQuery(".nav-slides .sub-nav ul li.active ul li").eq(firstVisible).prevAll().fadeIn(fadeSpeed);
                        jQuery(".nav-slides .next").fadeIn(fadeSpeed);
                    });
                }else{
                    var firstVisible = jQuery(".nav-slides .sub-nav ul li:visible").first().index();
                    jQuery(".nav-slides .sub-nav ul li:visible, .nav-slides ul li.last .prev").fadeOut(fadeSpeed,function(){
                        jQuery(".nav-slides .sub-nav ul li").eq(firstVisible).prevAll().fadeIn(fadeSpeed);
                        jQuery(".nav-slides .next").fadeIn(fadeSpeed);
                    });
                }

                return false;
            });

            //We run the function to render the menu (and bind it to window resize)
            if(isTouchDevice){
                calculateMenuSpace();
            }else{
                jQuery(window).bind('resize orientationchange', function(){
                    if(!jQuery(".header-holder").hasClass("js-slide-hidden")){
                        calculateMenuSpace();
                    }
                }).trigger("resize");
            }

            //Menu hide/show functionality
            var topOffset = 100;
            var win = jQuery(window);
            var s4workspace = jQuery('#s4-workspace');
            var buttonsmenu = jQuery("#header .buttons-menu");
            var menu = jQuery("#header .main-slide");
            var search = jQuery("#header .search-slide");

            if(!isTouchDevice){
                win.bind('resize orientationchange scroll', refreshLayoutWin);
                s4workspace.bind('resize orientationchange scroll', refreshLayoutWorkspace);
            }

            function refreshLayoutWin() {

                //Check if we need to hide/show menu/btnsmenu
                if (win.scrollTop() > topOffset) {
                    hideMenu();
                } else if (!jQuery("#header").hasClass("active-main-slide")) {
                    showMenu(false);
                }
            }

            function refreshLayoutWorkspace() {

                //Check if we need to hide/show menu/btnsmenu
                if (s4workspace.scrollTop() > topOffset) {
                    hideMenu();
                } else {
                    showMenu(false);
                }
            }

            function showMenu(slide){
                jQuery("#header").addClass("active-main-slide");
                if(slide){
                    menu.slideDown(200);
                }else{
                    menu.show();
                }
                calculateMenuSpace();

                if(foldOutLogonMenuActive){
                    hideLoginPopup();
                }

                buttonsmenu.slideUp(100);
            }

            function hideMenu(slide){
                jQuery("#header").removeClass("active-main-slide");
                if(slide){
                    menu.slideUp(100);
                }else{
                    menu.hide();
                }

                if(foldOutLogonMenuActive){
                    hideLoginPopup();
                }

                buttonsmenu.show();
            }

            //Show menu when minimized and clicking "Menu"
            jQuery(".main-opener").bind("touchstart click",function(e){
                e.preventDefault();
                hideLoginPopup();
                showMenu(true);
                return false;
            });

            //Show login-screen popup
            jQuery("#header .popup-open").bind("touchstart click",function(e){
                e.preventDefault();
                if(jQuery("#header .popup ").is(":visible")){
                    hideLoginPopup();
                }else{
                    if(jQuery(this).hasClass("foldout")){
                        showLoginPopup(true);
                    }else{
                        showLoginPopup(false);
                    }

                }

                return false;
            });

            jQuery("#header .popup-close").bind("touchstart click",function(e){
                e.preventDefault();
                hideLoginPopup();
                return false;
            });

            function showActiveMenuItem() {
                if (jQuery("#header .main-slide").find('.sub-nav li.active').length > 0) {
                    var activeMenuItem = jQuery("#header .main-slide").find('.sub-nav li.active');
                    if (!activeMenuItem.is(':visible')) {
                        var oldFadeSpeed = fadeSpeed;
                        fadeSpeed = 0;
                        jQuery('#show-more-of-menu-btn').trigger("click");
                        fadeSpeed = oldFadeSpeed;
                    }
                }
                jQuery('.wrapper .sub-nav ').css('visibility','visible');
            }

            jQuery("#header .section").css("visibility", "visible");
        }

        function initMegaDropdown(){

            if(isTouchDevice){
                jQuery(".nav-slides.bottom-menu ul > li:not(.last), .nav-slides.top-menu ul > li:not(.last) > ul > li").on("touchstart",function(){
                    var touchedItem = jQuery(this);
                    var touchedItemLink = touchedItem.find("a");

                    if(touchedItem.hasClass("hover")){
                        jQuery(".nav-slides ul li:not(.last)").removeClass("hover");
                        jQuery("#header .nav-drop").css("top","-9999px");
                    }else{
                        jQuery(".nav-slides ul li:not(.last)").removeClass("hover");
                        touchedItem.addClass("hover");
                        jQuery("#header .nav-drop").css("top","-9999px");

                        if(jQuery("#"+touchedItemLink.data("href")).length){
                            positionMegaDropdown(jQuery("#"+touchedItemLink.data("href")));
                            jQuery("#"+touchedItemLink.data("href")).css("top","100%");
                        }

                    }
                });

                jQuery('html').on('touchstart', function() {
                    jQuery(".nav-slides ul li:not(.last)").removeClass("hover");
                    jQuery("#header .nav-drop").css("top","-9999px");
                });

                jQuery('#header .nav-drop').on('touchstart', function(event) {
                    event.stopPropagation();
                });
            }else{

                //Show megaddropdown when hovering a menu-item
                jQuery(".nav-slides.bottom-menu ul > li:not(.last), .nav-slides.top-menu ul > li:not(.last) > ul > li").hover(function(){
                    var hoveredItem = jQuery(this);
                    var hoveredItemLink = hoveredItem.find("a");
                    hoveredItem.parents('ul').find('.hover').removeClass('hover');
                    hoveredItem.addClass("hover");
                    if(jQuery("#"+hoveredItemLink.data("href")).length){
                        positionMegaDropdown(jQuery("#"+hoveredItemLink.data("href")));
                        jQuery("#"+hoveredItemLink.data("href")).css("top","100%");
                    }
                },function(){
                    var hoveredItem = jQuery(this);
                    hoveredItem.removeClass("hover");
                    jQuery(".nav-drop").css("top","-9999px");

                });

                //Keep megadropdown active when hovering it
                jQuery(".nav-drop").hover(function(){
                    var dropid = jQuery(this).attr("id");
                    jQuery(this).css("top","100%");
                    jQuery(".nav-slides ul li a[data-href='"+dropid+"']").parent().addClass("hover");
                },function(){
                    jQuery(".nav-slides ul li").removeClass("hover");
                    jQuery(".nav-drop").css("top","-9999px");
                });
            }

            function positionMegaDropdown(navElem){
                if(navElem.find(".side-col").length == 0){
                    navElem.css("width","auto");
                    var navId = navElem.attr("id");
                    var holder = jQuery(".header-holder");
                    var navMenuItem = jQuery(".nav-slides ul li a[data-href='"+navId+"']");
                    var navMenuItemLeftOffset = navMenuItem.offset().left - holder.offset().left - 36;
                    if(navElem.width() + navMenuItemLeftOffset > holder.width()){
                        if(holder.width() < 966){
                            navElem.css("right","0px");
                        }else{
                            navElem.css("right","-8px");
                        }

                        navElem.css("left","auto");
                    }else{
                        navElem.css("left",navMenuItemLeftOffset +"px");
                    }


                }
            }

        }

        function showLoginPopup(foldout){
            hideSearch();
            jQuery("#header").addClass("active");

            if(foldout == true){
                foldOutLogonMenuActive = true;
                var poptrigger = jQuery("#header .menu .popup-open");
                var pop = jQuery("#header .popup");
                var left = poptrigger.offset().left - (pop.width() / 2 - (poptrigger.width()-27));
                var top = poptrigger.offset().top;
                jQuery("#header .popup .foldout").css("width",poptrigger.width()+"px");
                jQuery("#header .popup .foldout").show();
                jQuery("#header .foldout .foldout-whiter").css("width",jQuery("#header .popup .foldout").width()+18+"px");
                pop.css("top","48px");
                pop.css("left",left+"px");
            }else{

            }

            jQuery("#header .popup ").fadeIn(100);
        }

        function hideLoginPopup(){
            foldOutLogonMenuActive = false;
            jQuery("#header").removeClass("active");
            jQuery("#header .popup ").fadeOut(100, function(){
                jQuery("#header .popup").css("top","40px");
                jQuery("#header .popup").css("left","50%");
                jQuery("#header .popup .foldout").hide();
            });

        }

// open-close init
        function initOpenClose() {
            jQuery('.open-close').openClose({
                addClassBeforeAnimation: false,
                activeClass: 'active-slide-block',
                opener: '.slide-opener',
                slider: '.slide-block',
                animSpeed: 400,
                effect: 'slide'
            });
        }

// align blocks height
        function initSameHeight() {
            jQuery('.tabs-section .boxes').sameHeight({
                elements: '.holder',
                flexible: true
            });
            jQuery('.intro').sameHeight({
                elements: '.heading',
                flexible: true,
                multiLine: true,
                biggestHeight: true
            });
            jQuery('.article-columns').sameHeight({
                elements: '.heading',
                flexible: true,
                multiLine: true,
                biggestHeight: true
            });
            jQuery('.blocks').sameHeight({
                elements: 'div.block, div.tab-area',
                flexible: true,
                multiLine: true,
                biggestHeight: true
            });
            jQuery('.top-five-section').sameHeight({
                elements: '.heading',
                flexible: true,
                multiLine: true,
                biggestHeight: true
            });
        }

        function initErrorLabelPlacement(){

            //Aligning error labels placement
            jQuery(".error-text.long-error").each(function(){

                if(jQuery(this).prev().prop("tagName") == "TEXTAREA"  ){
                    var heightOffset = (jQuery(this).prev().outerHeight() - jQuery(this).outerHeight()) / 2;
                    jQuery(this).css("top",heightOffset+"px");
                }else{
                    var heightOffset = (jQuery(this).outerHeight() - 34) / 2;
                    jQuery(this).css("top","-"+heightOffset+"px");
                }

            });
        }

        function initSelectBoxes(){
            function hideCurrentOption(input) {
                var $sbHolder = jQuery(input).next(".sbHolder"),
                    $sbOptions = $sbHolder.find(".sbOptions"),
                    sbValues = $sbHolder.find("li");
                $sbHolder.find(".sbHidden").removeClass("sbHidden");
                sbValues.find('a[rel="'+ jQuery(input).val() +'"]:contains("'+jQuery(input).find(":selected").text()+'")').parent().addClass("sbHidden");
                sbValues.removeClass("sbEven");
                sbValues.not(".sbHidden").filter(":odd").addClass("sbEven");
                if ($sbOptions.hasClass("above")) {
                    $sbOptions.css({
                        /* leoca - fix for dropdown rendering on top */
                        "top": "32px"
                        //"top": - $sbOptions.outerHeight() - 1 + "px"
                    });
                }
            }

            var allSelect = jQuery(".wrapper select").not(".ms-ToolPaneOuter select");
            allSelect.selectbox({
                onOpen: function(inst){
                    jQuery(inst.input).next(".sbHolder").addClass("open");
                    // hideCurrentOption(inst.input);
                },
                onClose: function(inst){
                    jQuery(inst.input).next(".sbHolder").removeClass("open");
                    // hideCurrentOption(inst.input);
                },
                effect: "fade"
            });
        }

        function calculateBoxHeights(winWidth) {
            var productRow = jQuery(".product-boxes-row"),
                windowWidth = (winWidth != undefined) ? winWidth : jQuery(window).width(),
                mqWidth = windowWidth + jQuery.scrollbarWidth(),
                $colElems = jQuery('.col-1-4, .col-3-4'),
                productBoxes = jQuery('.product-box');

            jQuery(".product-box", productRow).css("height", "");

            productBoxes.css({
                height: "",
                paddingBottom: ''
            });

            if (mqWidth <= 1023) {
                $colElems.addClass('col-responsive');
                jQuery('.wrapper .product-grid-row .product-box').removeClass('col-first');
                jQuery('.col-1-4:nth-of-type(odd), .col-3-4:nth-of-type(odd)').addClass('col-first');
                jQuery('.wrapper .col-p-3-4 .product-box:nth-of-type(odd), .wrapper .col-p-4-4 .product-box:nth-of-type(odd)').addClass('col-first');
            } else {
                $colElems.removeClass('col-responsive col-first');
                jQuery('.wrapper .product-grid-row .product-box').removeClass('col-first');
                jQuery('.col-1-4:nth-of-type(4n+1), .col-3-4:nth-of-type(2n+1), .col-2-3 .col-1-4:nth-of-type(2n+1)').addClass('col-first');
                jQuery('.wrapper .col-p-2-4 .product-box:nth-of-type(2n+1), .wrapper .col-p-3-4 .product-box:nth-of-type(3n+1), .wrapper .col-p-4-4 .product-box:nth-of-type(4n+1)').addClass('col-first');
            }
            productBoxes.each(function(i) {
                if (jQuery(productBoxes[i]).hasClass('col-first') && jQuery(productBoxes[i+1]).length > 0) {
                    var boxesInRow = jQuery(productBoxes[i]).nextUntil(".col-first").andSelf(),
                        tallestHeight = 0;
                    for (var b = 0; b < boxesInRow.length; b++) {
                        if (jQuery(boxesInRow[b]).outerHeight() > tallestHeight) {
                            tallestHeight = jQuery(boxesInRow[b]).outerHeight();
                        }
                    }
                    if (mqWidth > 1023 && tallestHeight < 550) {
                        tallestHeight = 550;
                    }
                    boxesInRow.css('height', tallestHeight + "px");

                }
            });
        }

        function notPartnersClassAdding() {
            jQuery(".wrapper .social-networks ul").not(".partners").addClass("not-partners");
        }


        return {
            initLastClasses: initLastClasses,
            initSearchToggle: initSearchToggle,
            showSearch: showSearch,
            hideSearch: hideSearch,
            initTabs: initTabs,
            initMenu: initMenu,
            initMegaDropdown: initMegaDropdown,
            showLoginPopup: showLoginPopup,
            hideLoginPopup: hideLoginPopup,
            initOpenClose: initOpenClose,
            initSameHeight: initSameHeight,
            initErrorLabelPlacement: initErrorLabelPlacement,
            initSelectBoxes: initSelectBoxes,
            calculateTeaserBoxesHeights: calculateTeaserBoxesHeights,
            calculateLoginBoxHeights: calculateLoginBoxHeights,
            caseTitleHeights: caseTitleHeights,
            searchCategoriesWrap: searchCategoriesWrap,
            calculateBoxHeights: calculateBoxHeights,
            notPartnersClassAdding: notPartnersClassAdding
        }

    }
})(Orsted.jQuery.$);

/*
 * Browser platform detection
 */
PlatformDetect = (function(){
	var detectModules = {};

	// try to detect css folder path
	var detectedPath, links = document.getElementsByTagName('link');
	for(var i = 0; i < links.length; i++) {
		if(links[i].getAttribute('media') === 'all') {
			detectedPath = links[i].getAttribute('href');
			if(detectedPath) {
				detectedPath = detectedPath.replace(/[^\/]*$/, '');
				break;
			}
		}
	}

	return {
		options: {
		    cssPath: '_layouts/15/Orsted.Group.Branding/v2/css/'
		},
		addModule: function(obj) {
			detectModules[obj.type] = obj;
		},
		addRule: function(rule) {
			if(this.matchRule(rule)) {
				this.applyRule(rule);
				return true;
			}
		},
		matchRule: function(rule) {
			return detectModules[rule.type].matchRule(rule);
		},
		applyRule: function(rule) {
			var head = document.getElementsByTagName('head')[0], fragment, cssText;
			if(rule.css) {
				cssText = '<link rel="stylesheet" href="' + (detectedPath || this.options.cssPath) + rule.css + '" />';
				if(head) {
					fragment = document.createElement('div');
					fragment.innerHTML = cssText;
					head.appendChild(fragment.childNodes[0]);
				} else {
					document.write(cssText);
				}
			}

			if(rule.meta) {
				if(head) {
					fragment = document.createElement('div');
					fragment.innerHTML = rule.meta;
					head.appendChild(fragment.childNodes[0]);
				} else {
					document.write(rule.meta);
				}
			}
		},
		matchVersions: function(host, target) {
			target = target.toString();
			host = host.toString();

			var majorVersionMatch = parseInt(target, 10) === parseInt(host, 10);
			var minorVersionMatch = (host.length > target.length ? host.indexOf(target) : target.indexOf(host)) === 0;

			return majorVersionMatch && minorVersionMatch;
		}
	};
}());

// iPad detection
PlatformDetect.addModule({
	type: 'ipad',
	parseUserAgent: function() {
		var match = /(iPad).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
		if(match) {
			return {
				retina: window.devicePixelRatio > 1,
				version: match[2].replace(/_/g, '.')
			};
		}
	},
	matchRule: function(rule) {
		this.matchData = this.matchData || this.parseUserAgent();
		if(this.matchData) {
			var matchVersion = rule.version ? PlatformDetect.matchVersions(this.matchData.version, rule.version) : true;
			var matchDevice = rule.deviceType ? (rule.deviceType === 'retina' && this.matchData.retina) || (rule.deviceType === 'noretina' && !this.matchData.retina) : true;
			return matchVersion && matchDevice;
		}
	}
});

// Android detection
PlatformDetect.addModule({
	type: 'android',
	parseUserAgent: function() {
		var match = /(Android) ([0-9.]*).*/.exec(navigator.userAgent);
		if(match) {
			return {
				deviceType: navigator.userAgent.indexOf('Mobile') > 0 ? 'mobile' : 'tablet',
				version: match[2]
			};
		}
	},
	matchRule: function(rule) {
		this.matchData = this.matchData || this.parseUserAgent();
		if(this.matchData) {
			var matchVersion = rule.version ? PlatformDetect.matchVersions(this.matchData.version, rule.version) : true;
			var matchDevice = rule.deviceType ? rule.deviceType === this.matchData.deviceType : true;
			return matchVersion && matchDevice;
		}
	}
});

// page init
var isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var prevActive = false;
var foldOutLogonMenuActive = false;
var windowWidth = 0;

jQuery(document).ready(function(){
    jQuery("#header .section").css("visibility", "hidden");
});


jQuery(window).load(function(){

    windowWidth = jQuery(this).width();

    //No fixed menu on tablets
    if(isTouchDevice){
        jQuery("#header").css("position","absolute");
    }



    Orsted.Branding.desktop.initMenu();
    Orsted.Branding.desktop.initSameHeight();
    Orsted.Branding.desktop.initOpenClose();
    Orsted.Branding.desktop.initTabs();
    Orsted.Branding.desktop.initMegaDropdown();
    Orsted.Branding.desktop.initSearchToggle();
    Orsted.Branding.desktop.initErrorLabelPlacement();
    Orsted.Branding.desktop.initSelectBoxes();
    Orsted.Branding.desktop.initLastClasses();
    Orsted.Branding.desktop.calculateTeaserBoxesHeights();
    Orsted.Branding.desktop.calculateLoginBoxHeights();
    Orsted.Branding.desktop.caseTitleHeights();
    Orsted.Branding.desktop.searchCategoriesWrap();
    Orsted.Branding.desktop.calculateBoxHeights();
    Orsted.Branding.desktop.notPartnersClassAdding();
});

if (typeof SP !== 'undefined') {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        Orsted.jQuery.$(window).smartresize(function () {

        Orsted.Branding.desktop.initSelectBoxes();
        var win = jQuery(this).width();

            if (win !== windowWidth) {
            Orsted.Branding.desktop.calculateTeaserBoxesHeights();
            Orsted.Branding.desktop.caseTitleHeights();
            Orsted.Branding.desktop.calculateBoxHeights(win);
            windowWidth = win;
        }

        })
    }, 'common.js');
}

// Detect rules
PlatformDetect.addRule({type: 'ipad', css: 'ipad.css'});
PlatformDetect.addRule({type: 'android', deviceType: 'tablet', css: 'android-tablet.css'});