if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

Orsted.jQuery.$(function ($) {
    Orsted.Branding.mobile.initTabs();
    Orsted.Branding.mobile.initSelectBoxes();
    Orsted.Branding.mobile.initProgressBar();
    Orsted.Branding.mobile.initProgressBarClickAjax();
    Orsted.Branding.mobile.initTablesInColumnView();
    Orsted.Branding.mobile.initTablesInRowView();
    Orsted.Branding.mobile.searchCategoriesWrapMobile();
    if (Orsted.jQuery.$(".sub-menu").length > 0) {
        //Insert first slide we find just before the submenu
        Orsted.jQuery.$(".sub-menu").before(jQuery(".gallery").first());
    }
    var widestSpan = '';
    Orsted.jQuery.$('.cal-wrap .tabset ul a span').each(function () {
        if (Orsted.jQuery.$(this).width() > jQuery(widestSpan).width()) {
            widestSpan = this;
        }
    }).width(Orsted.jQuery.$(widestSpan).width());

    Orsted.Branding.mobile.initOpenCloseMenu();
    //initCycleCarousel();
});

Orsted.jQuery.$(window).resize(function () {
    Orsted.Branding.mobile.initProgressBar();
});

;Orsted.Branding.mobile = (function ($) {
    if (typeof $ != "undefined") {
        var jQuery = $;
        var ActivateMobileLeftNavigation = true;


        function searchCategoriesWrapMobile(){
            if(jQuery(".search-categories .search-category").length){
                var numOfCategories = jQuery(".search-categories .search-category").length;
                var splitAt = Math.ceil(numOfCategories / 2);

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

// open-close init
        function initOpenCloseMenu() {

            var resizeTimer;
            var overlay = jQuery('.nav-overlay').css({display: 'none', opacity: 0.5});
            var animSpeed = 400;
            var body = jQuery('body');
            var menuActiveClass = 'menu-active';
            var lastActive = jQuery();

            initCloseOverlay();

            jQuery(".tabset-links > li > a").on("click",function(){
                var newHeight = jQuery(".tabset-links").height() + jQuery(this).next("ul").height();
                jQuery(".menu-slide").css('height',newHeight + 'px');
                return false;
            });

            jQuery(".header-holder .menu-opener").off("touchstart");
            jQuery(".header-holder .menu-opener").on("touchstart", function(e){
                e.preventDefault();

                if(jQuery(".header-holder .menu-slide").height() > 0){
                    hideMenu();
                }else{
                    showMenu();
                }

                return false;
            });

            jQuery(".sub-menu .menu-opener, .sub-menu .title-menu").off("touchstart");
            jQuery(".sub-menu .menu-opener, .sub-menu .title-menu").on("touchstart", function(e){
                e.preventDefault();

                if(jQuery(".sub-menu .menu-slide").height() > 0){
                    hideSubMenu();
                }else{
                    showSubMenu();
                }

                return false;
            });

            function showMenu(){
                hideSearch();
                hideSubMenu();
                hideLoginAccordion();
                jQuery(".header-holder .menu-slide").css({'position':'absolute','visibility':'hidden','height':'auto'});
                var newHeight = jQuery(".header-holder .menu-slide").height();

                if(jQuery(".header-holder .menu-slide ul li.active ul").length){
                    newHeight = newHeight + jQuery(".header-holder .menu-slide ul li.active ul").height();
                }

                if(jQuery(".header-holder .menu-slide .prev-page").length){
                    newHeight = newHeight + jQuery(this).height();
                }

                jQuery(".header-holder .menu-slide").css({'visibility':'visible','height':'0'});
                jQuery(".header-holder .menu-slide").css('height',newHeight + 'px');

                body.addClass(menuActiveClass);
                jQuery("#header").addClass("active-menu");
                overlay.stop(true).fadeIn(animSpeed);
                overlay.css("top",jQuery("#header").offset().top+"px");

            }

            function hideMenu(){

                jQuery(".header-holder .menu-slide").css('height','0px');

                jQuery("#header").removeClass("active-menu");
                overlay.stop(true).fadeOut(animSpeed, function() {
                    body.removeClass(menuActiveClass);
                });

            }

            function showSubMenu(){
                hideMenu();
                hideSearch();
                hideLoginAccordion();
                jQuery(".sub-menu .menu-slide").css({'position':'absolute','visibility':'hidden','height':'auto'});
                var newHeight = jQuery(".sub-menu .menu-slide").height();
                jQuery(".sub-menu .menu-slide").css({'visibility':'visible','height':'0'});
                jQuery(".sub-menu .menu-slide").css('height',newHeight + 'px');

                overlay.stop(true).fadeIn(animSpeed);
                overlay.css("top",jQuery(".sub-menu .menu-slide").offset().top+"px");
            }

            function hideSubMenu(){

                jQuery(".sub-menu .menu-slide").css('height','0px');

                overlay.stop(true).fadeOut(animSpeed, function() {

                });

            }

            function initCloseOverlay(){
                overlay.off("touchend");
                overlay.on("touchend", function(e){
                    hideLoginAccordion();
                    hideMenu();
                    hideSearch();
                    hideSubMenu();
                    return false;
                });
            }

            jQuery(".search-opener").off("touchstart");
            jQuery(".search-opener").on("touchstart",function(e){
                e.preventDefault();

                if(jQuery(".search-slide").height() > 0){
                    hideSearch();
                }else{
                    showSearch();
                }

                return false;
            });

            function hideSearch(){

                jQuery(".search-slide").css('height','0px');
                jQuery("#search-input").val("");
                jQuery("#search-input").blur();
                body.removeClass(menuActiveClass);
                jQuery("#header").removeClass("active-search");
                overlay.stop(true).fadeOut(animSpeed);
            }

            function showSearch(){
                hideMenu();
                hideSubMenu();
                hideLoginAccordion();
                jQuery(".search-slide").css({'visibility':'hidden','height':'auto'});
                var newHeight = $(".search-slide").height();
                jQuery(".search-slide").css({'visibility':'visible','height':'0'});
                jQuery(".search-slide").css('height',newHeight + 'px');
                body.addClass(menuActiveClass);
                overlay.stop(true).fadeIn(animSpeed);
                jQuery("#header").addClass("active-search");
                overlay.css("top",jQuery("#header").offset().top+"px");

            }


            function resizeOverlay() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    overlay.css({height: ''});
                    overlay.css({height: getPageHeight()});
                }, 100);
            }

            function getPageHeight() {
                return Math.max(
                    Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight),
                    Math.max(document.body.offsetHeight, document.body.scrollHeight)
                );
            }

            resizeOverlay();

            //Show login-screen popup
            jQuery("#header .popup-open").bind("touchstart",function(e){
                e.preventDefault();
                if(jQuery("#header .popup").height() > 0){
                    hideLoginAccordion();
                }else{
                    showLoginAccordion();
                }

                return false;
            });

            jQuery("#header .popup-close").bind("touchstart",function(e){
                e.preventDefault();
                hideLoginAccordion();
                return false;
            });


            function showLoginAccordion(){
                hideMenu();
                hideSearch();
                hideSubMenu();
                jQuery("#header .popup").css({'visibility':'hidden','height':'auto'});
                var newHeight = $("#header .popup").height();
                jQuery("#header .popup").css({'visibility':'visible','height':'0'});
                jQuery("#header .popup").css('height',newHeight + 'px');
                overlay.stop(true).fadeIn(animSpeed);
                jQuery("#header").addClass("active-login");
            }

            function hideLoginAccordion(){
                jQuery("#header .popup").css('height','0px');
                overlay.stop(true).fadeOut(animSpeed);
                jQuery("#header").removeClass("active-login");
            }

            jQuery(".accordion li .opener").on("click",function(e){
                var newHeight = $("#header .popup").height();
                jQuery("#header .popup").css('height','600px');
            });

        }

        function initTablesInRowView(){
            jQuery(".table-wrap:not(.mobile-column-view, .no-mobile):visible").each(function(){
                var myTable = jQuery(this).find("table");
                var newTable = document.createElement('table');
                var headHolder = new Array();
                myTable.find("tr").each(function(i){

                    var thisRow = jQuery(this);
                    if(i == 0){
                        thisRow.find("td, th").each(function(){
                            var thisCell = jQuery(this);
                            if(thisCell.html() !== ""){
                                headHolder.push("<span class='headitem'>"+ thisCell.html() + "</span>");
                            }else{
                                headHolder.push("");
                            }
                        });
                    }else{
                        thisRow.find("td, th").each(function(){
                            var thisCell = jQuery(this);
                            thisCell.wrapInner("<div class='headcontent'></div>");
                            var cellPreText = headHolder[thisCell.index()];
                            thisCell.prepend(cellPreText);
                        });
                    }
                });

            });

        }

        function initTablesInColumnView(){
            jQuery(".table-wrap.mobile-column-view:not(.no-mobile)").each(function(){
                var wrap = jQuery(this);
                var myTable = jQuery(this).find("table").get(0);
                var newTable = document.createElement('table');
                var headHolder = new Array();

                var maxColumns = 0;
                // Find the max number of columns
                for(var r = 0; r < myTable.rows.length; r++) {
                    if(myTable.rows[r].cells.length > maxColumns) {
                        maxColumns = myTable.rows[r].cells.length;
                    }
                }

                for(var c = 0; c < maxColumns; c++) {
                    newTable.insertRow(c);

                    for(var r = 0; r < myTable.rows.length; r++) {

                        if(c % 2 === 0){
                            jQuery(newTable.rows[c]).addClass("odd");
                        }

                        if(c == 0 && r !== 0){
                            headHolder.push("<span class='headitem'>"+myTable.rows[r].cells[c].innerHTML + "</span>");
                        }

                        if(myTable.rows[r].length <= c) {
                            newTable.rows[c].insertCell(r);
                            newTable.rows[c].cells[r] = '-';
                        }
                        else {
                            newTable.rows[c].insertCell(r);
                            if(headHolder[r - 1]){
                                newTable.rows[c].cells[r].innerHTML = headHolder[r - 1] + "<div class='headcontent'>" + myTable.rows[r].cells[c].innerHTML + "</div>";
                            }else{
                                newTable.rows[c].cells[r].innerHTML = myTable.rows[r].cells[c].innerHTML;
                            }


                        }
                    }

                }
                jQuery(myTable).after(jQuery(newTable));
                jQuery(myTable).hide();

            });

        }

// content tabs init
        function initTabs() {
            jQuery('.tabset').contentTabs({
                addToParent: true,
                autoHeight: true,
                tabLinks: 'a'
            });
            jQuery('.tab-nav').contentTabs({
                addToParent: true,
                autoHeight: true,
                tabLinks: 'a'
            });
            jQuery('.tabset-links').contentTabs({
                addToParent: true,
                autoHeight: true,
                tabLinks: '> li > a',
                event: 'touchstart'
            });

            /* Enable if mobile tabs should be deeplinked */
            /*
            jQuery('.tab-switcher > li > a').click(function(e){
                e.preventDefault();
                window.location = jQuery(this).attr("data-mobile-href");
                return false;
            });
            */

            //Move the tabs-content around to fit mobile-view
            jQuery(".tabs-container, .tabs-area").each(function(){

                    var tab = jQuery(this);
                    if (tab.find("div.tab-content-area").length != 0) { /*Fixed this OverView List Markup in Mobile Rendering*/
                    var tabsContent = tab.find(".tab-content-area");
                    var tabsNav = tab.find(".tab-switcher");

                        tabsNav.find("li").each(function (i) {
                        var thisNavTab = jQuery(this)
                        var content = tabsContent.find("> div, > article").eq(i);
                        thisNavTab.append(content.clone().addClass("tab-content-area").hide());
                        if (i == 0) {
                            thisNavTab.find("> a").hide();
                            thisNavTab.find("> .tab-content-area").show();
                        }
                    });

                    tabsContent.remove();
                    initMobileTabsClick(tabsNav);
                }
            });

            function initMobileTabsClick(switcher){
                switcher.find(" > li > a").on("click", function(e){
                    e.preventDefault();
                    var clicked = jQuery(this);
                    var tabWrap = clicked.parent().parent();
                    var tabNavWrap = clicked.parent();
                    /*tabNavWrap.addClass("active");
                    switcher.find(" > li").not(tabNavWrap).removeClass("active");*/
                    var thisTabNavContent = tabNavWrap.find(".tab-content-area");
                    var allTabNavContent = tabWrap.find(".tab-content-area").not(thisTabNavContent);
                    clicked.slideUp();
                    switcher.find(" > li > a").not(clicked).slideDown();
                    allTabNavContent.slideUp();
                    tabNavWrap.find(".tab-content-area").slideDown();
                    return false;
                });
            }

        }

        function initProgressBar(){

            var elem = jQuery(".progress-bar");

            elem.find("li").not(".active").css("width", '');
            elem.find("li.active").css("width", '');

            if (elem.height() > 32) {
                elem.find("li.active p").not(".progress-element-number").hide().parents("li.active").addClass("center-text");
            } else {
                elem.find("li.active p").not(".progress-element-number").show().parents("li.active").removeClass("center-text");
            }

            var num_items = elem.find("li").length,
                elem_width = elem.innerWidth(),
                active_item_width = elem.find("li.active").outerWidth();
            active_item_width = (active_item_width % (num_items - 1) !== 0)
                ? (active_item_width - (active_item_width % (num_items - 1)) + (num_items - 1))
                : active_item_width;
            var remaining_items_width = (elem_width - active_item_width) / (num_items - 1);
            elem.find("li").not(".active").css("width", remaining_items_width+"px");
            elem.find("li.active").css("width", active_item_width+"px");

        }
        function initProgressBarClickAjax(){

            var elem = jQuery(".progress-bar");

            elem.find("li").on("click", function(e){
                e.preventDefault();
                elem.find("li").removeClass("active");
                jQuery(this).addClass("active");

                //Insert ajax for fetching content for the new step in the progress-bare

                initProgressBar();
                return false;
            });
        }

        function initSelectBoxes(){
            if(jQuery("select").length){
                jQuery('select').customSelect();
            }
        }

        return {
            initOpenCloseMenu: initOpenCloseMenu,
            initTabs: initTabs,
            initProgressBar: initProgressBar,
            initSelectBoxes: initSelectBoxes,
            initTablesInRowView: initTablesInRowView,
            initTablesInColumnView: initTablesInColumnView,
            initProgressBarClickAjax: initProgressBarClickAjax,
            searchCategoriesWrapMobile: searchCategoriesWrapMobile,
            ActivateMobileLeftNavigation: ActivateMobileLeftNavigation
        }

    }
})(Orsted.jQuery.$);