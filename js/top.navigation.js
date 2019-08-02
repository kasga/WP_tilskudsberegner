if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

Orsted.TopNavigation = (function ($) {
    if (typeof $ != "undefined") {
        var jQuery = $;
        //var topNavLabels;
        
        function Init() {

            //set the labels for Menu and Login
            if (topNavLabels != null) {
                if (topNavLabels.Menu != null) {
                    if (jQuery("#buttons-menu-button-menu").length > 0
                    && jQuery("#buttons-menu-button-menu").find("span") != null
                    && jQuery("#buttons-menu-button-menu").find("span").length > 0) {
                        jQuery("#buttons-menu-button-menu").find("span")[0].innerText = topNavLabels.Menu;
                    }
                }

                if (topNavLabels.Login != null) {
                    if (jQuery("#buttons-menu-button-login").length > 0
                    && jQuery("#buttons-menu-button-login").find("span") != null
                    && jQuery("#buttons-menu-button-login").find("em").length > 0) {
                        jQuery("#buttons-menu-button-login").find("em")[0].innerText = topNavLabels.Login;
                    }
                }

                if (topNavLabels.More != null) {
                    if (jQuery("#nav-slides-more-button").length > 0) {
                        jQuery("#nav-slides-more-button")[0].innerText = topNavLabels.More;
                    }
                }
            }            

            var navigationDataProvider = jQuery('.navhidden ul:first > li');
            var navigationDepth = 1;

            if (typeof topMenuNavLevel != 'undefined' && isNumber(topMenuNavLevel)) {
                navigationDepth = topMenuNavLevel;
            }
            
            var currentlySelectedNavItemUrl = GetSelectedNavItemUrl(navigationDataProvider);

            if (navigationDepth == 1) {
                //single decker navigation
                var subNavigation = GenerateSubNavigationElement(navigationDataProvider);
                $(".sub-nav:first").append(subNavigation);

                if (currentlySelectedNavItemUrl != "") {
                    var template = 'a[href="@url"]:first';
                    var searchKey = template.replace("@url", currentlySelectedNavItemUrl);

                    //check if link is present on subnav / single decker top nav area
                    if (jQuery(".sub-nav:first").find(searchKey).length > 0) {
                        jQuery(".sub-nav:first").find(searchKey).parent().addClass("active");
                    } else {
                        var currentlySelectedSplitUrl = currentlySelectedNavItemUrl.split("/");
                        var currentUrl = ""

                        for (var i = 0; i < currentlySelectedSplitUrl.length; i++) {
                            currentUrl += currentlySelectedSplitUrl[i]

                            searchKey = template.replace("@url", currentUrl);
                            jQuery(".sub-nav:first").find(searchKey).parent().addClass("active");

                            if (i + 1 != currentlySelectedSplitUrl.length) {
                                currentUrl += "/"
                            }
                        }
                    }
                }

                return;
            }

            //remove sub navigation to facilate double decker navigation
            jQuery(".sub-nav:first").parent().remove();

            var secondLevelNavigationElement = GenerateDoubleDeckerNavigation(navigationDataProvider);
            jQuery(".row:first").after(secondLevelNavigationElement);//jQuery(".row:first").prepend(secondLevelNavigationElement);

            if (currentlySelectedNavItemUrl != "") {
                //searches the first level for selected links.
                var selectedSecondDeckerNavItem = jQuery(".tabset-links:first").find('a[data-href="@url"]'.replace("@url", currentlySelectedNavItemUrl));

                //if the link is on the second level, this will find it.
                if (jQuery(selectedSecondDeckerNavItem).length < 1) {
                    selectedSecondDeckerNavItem = jQuery(".tabset-links:first").find('a[href="@url"]'.replace("@url", currentlySelectedNavItemUrl));
                }

                if (jQuery(selectedSecondDeckerNavItem).length > 0) {
                    var tagType = jQuery(selectedSecondDeckerNavItem).parent().parent().get(0).tagName;

                    if (tagType.toLowerCase() == "ul"
                        && jQuery(selectedSecondDeckerNavItem).parent().parent().attr("class") != undefined
                        && jQuery(selectedSecondDeckerNavItem).parent().parent().attr("class").indexOf("tabset-links") > -1) {
                        jQuery(selectedSecondDeckerNavItem).parent().addClass("active");
                        return;
                    }

                    //first deck active UI
                    jQuery(selectedSecondDeckerNavItem).parent().parent().parent().addClass("active");

                    //second deck active UI
                    jQuery(selectedSecondDeckerNavItem).parent().addClass("active");
                } else {

                }
            }
        }

        function isNumber(o) {
            return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
        }

        function GenerateSubNavigationElement(dataProvider) {
            var ulContainer = jQuery("<ul />");
            var lastElement = GenerateTailEndScrollingElement();
            
            $(dataProvider).each(function (index) {
                var dataProviderAnchorElement = $(this).children("a");

                if (jQuery(dataProviderAnchorElement).length > 0) {
                    var url = jQuery(dataProviderAnchorElement).attr("href");
                    var displayName = jQuery(dataProviderAnchorElement).find('span[class="menu-item-text"]').text();

                    var megaDropDownId = "drop" + index.toString();

                    var a = jQuery("<a />").attr("data-href", megaDropDownId).attr("href", url).text(displayName);
                    var li = jQuery("<li />").append(a);
                    ulContainer.append(li);
                }
            });

            ulContainer.append(lastElement);

            return ulContainer;
        }

        function GenerateTailEndScrollingElement() {
            //<li class="last" style="display: none;"><a href="#" class="prev" style="display: none;">Back</a></li>
            var backLabel = "Back";
            if (topNavLabels && topNavLabels.Back)
                backLabel = topNavLabels.Back;
            var li = jQuery("<li />").attr("class", "last").attr("style", "display: none;");
            var a = jQuery("<a />").attr("id", "topNavBackButton").attr("href", "#").attr("class", "prev").attr("style", "display: none;").text(backLabel);
            var element = jQuery(li).append(a);

            return element;
        }

        function GetSelectedNavItemUrl(navigationDataProvider) {
            var selectedNavigationItem = jQuery(navigationDataProvider).find("a.selected:first");
            var itemIsSelected = jQuery(selectedNavigationItem).length > 0;

            if (itemIsSelected) {
                var url = jQuery(selectedNavigationItem).attr("href");
                return url;
            }

            return "";
        }

        function GenerateDoubleDeckerNavigation(dataProvider) {
            var divWrapper = jQuery("<div />").attr("class", "nav-slides menu-slide top-menu");

            var moreText = "More";
            if (topNavLabels != null && topNavLabels.More != null) {
                moreText = topNavLabels.More;
            }

            var ahrMore = jQuery("<a />").attr("href", "#").attr("class", "next").attr("id", "show-more-of-menu-btn").text(topNavLabels.More);
            jQuery(divWrapper).append(ahrMore);

            var ulContainer = jQuery("<ul />").attr("class", "tabset-links");
            var secondLevelIndex = 0;

            $(dataProvider).each(function (index) {
                var dataProviderAnchorElement = $(this).children("a");

                if (jQuery(dataProviderAnchorElement).length > 0) {
                    var url = jQuery(dataProviderAnchorElement).attr("href");
                    var displayName = jQuery(dataProviderAnchorElement).find('span[class="menu-item-text"]').text();

                    var groupId = "#tab-nav-drop" + index;

                    //first deck navigation item
                    var a = jQuery("<a />").attr("href", groupId).attr("data-href", url).text(displayName).click(function (event) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }

                        window.location = jQuery(this).attr("data-href");
                    });
                    //var a = jQuery("<a />").attr("href", url).text(displayName);
                    var li = jQuery("<li />").append(a);

                    //second level items generation
                    var secondLevelUL = GenerateDoubleDeckerNavigation_SecondLevelNodes($(this), secondLevelIndex);
                    secondLevelIndex += jQuery(secondLevelUL).children("li").length;

                    //<li class="last"><a href="#" class="prev">Back</a></li>
                    var liBack = jQuery("<li />").attr("class", "last");

                    var backText = "Back";
                    if (topNavLabels != null && topNavLabels.Back != null) {
                        backText = topNavLabels.Back;
                    }

                    var ahrBack = jQuery("<a />").attr("class", "prev").attr("href", "#").text(backText);
                    jQuery(liBack).append(ahrBack);

                    jQuery(secondLevelUL).append(liBack);

                    $(secondLevelUL).attr("id", groupId);
                    $(li).append(secondLevelUL);

                    ulContainer.append(li);
                }
            });
            
            //var liBack = GenerateTailEndScrollingElement();
            //jQuery(ulContainer).append(liBack);

            var navOuterContainer = jQuery("<nav />").attr("class", "sub-nav");
            //Added By : BHAJA
            //Fix the MobileTopNav Issue for DoubleDeck
            if (typeof Orsted.Branding.mobile != "undefined")
                $(navOuterContainer).attr("id", "nav");

            $(navOuterContainer).append(ulContainer);

            jQuery(divWrapper).append(navOuterContainer);

            return divWrapper;
        }

        function GenerateDoubleDeckerNavigation_SecondLevelNodes(currentNode, secondLevelIndex) {
            if (jQuery(currentNode).children("ul").length > 0) {
                var ul = jQuery("<ul />");

                jQuery(currentNode).children("ul").children("li").each(function (index) {
                    var anchorElement = jQuery(this).children("a:first");

                    if (anchorElement.length > 0) {
                        var url = jQuery(anchorElement).attr("href");
                        var displayName = jQuery(anchorElement).find('span[class="menu-item-text"]').text();

                        var dataDropIndex = secondLevelIndex + index;
                        var a = jQuery("<a />").attr("href", url).attr("data-href", "drop" + dataDropIndex).text(displayName);
                        var li = jQuery("<li />").append(a);

                        $(ul).append(li);
                    }
                });

                return ul;
            }

            return null;
        }

        function SelectedNavigationItems() {
            var currentRelativePath = decodeURIComponent(window.location.pathname);
            var currentRelativePathStringArray = currentRelativePath.split("/");

            this.FirstDeckSelectedUrl = "/";

            for (var i = 0; i < 2; i++) {
                this.FirstDeckSelectedUrl += currentRelativePathStringArray[i];

                if (i + 1 != 2) {
                    this.FirstDeckSelectedUrl += "/";
                }
            }

            this.SecondDeckSelectedUrl = "/";

            for (var i = 0; i < 3; i++) {
                this.SecondDeckSelectedUrl += currentRelativePathStringArray[i];

                if (i + 1 != 3) {
                    this.SecondDeckSelectedUrl += "/";
                }
            }
        }

        return {
            Init: Init
        }
    }
})(Orsted.jQuery.$);

Orsted.jQuery.$(document).ready(function () {
    try{
        Orsted.TopNavigation.Init();
    } catch (ex) {
        if (console) {
            var msg = "Ørsted Top Navigation component malfunction detected. Exception message : ";
            msg += ex.message.toString();
            msg += ". Please contact IT support for resolution";

            console.log(msg);
        }
    }
});