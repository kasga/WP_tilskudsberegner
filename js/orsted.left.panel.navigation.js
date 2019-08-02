if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

; Orsted.LeftNavigation = (function ($) {
    if (typeof $ != undefined) {
        var jQuery = $;

        function Init() {
            var navDataHiddenControl = jQuery(document.getElementById("hfLeftNavigation"));

            if (navDataHiddenControl.length > 0) {
                var navigationData = GetNavagationDataJSONArray();

                var navigationTree = GenerateNavigationParentTree(navigationData);
                var ulContainer = document.createElement("ul");

                jQuery(navigationTree).each(function (index) {
                    jQuery(ulContainer).append(jQuery(this));
                });

                //generate baseline left navigation tree
                jQuery(GetRootNavigationContainerElement()).append(ulContainer);

                MessageLeftNavigationUI(GetRootNavigationContainerElement());

                //navigation level
                var navigationLevel = Number(jQuery(document.getElementById("hfLeftNavigation_MenuLevel")).val());
                var navigationItems = ExtractPertinentNavigationItems(GetRootNavigationContainerElement(), navigationLevel);

                jQuery(GetRootNavigationContainerElement()).append(navigationItems);

                if (jQuery(GetRootNavigationContainerElement()).children("ul").length > 1) {
                    jQuery(GetRootNavigationContainerElement()).children("ul:first").remove();
                }

                HideHiddenLinks(GetRootNavigationContainerElement());

                if (jQuery(GetRootNavigationContainerElement()).children("ul").children().length < 1) {
                    jQuery(GetRootNavigationContainerElement()).hide();
                }

                /*
                //removes li elements, li elements should not appear at all
                if (jQuery(document.getElementById("navLeftNavigation")).children("li").length > 0) {
                    jQuery(document.getElementById("navLeftNavigation")).children("li").remove();
                }
                */
                //RemoveBottomBordersFromListElements(document.getElementById("navLeftNavigation"));
            } else {
                jQuery(GetRootNavigationContainerElement()).hide();
            }
        }

        function GetNavagationDataJSONArray() {
            var navDataHiddenControl = jQuery(document.getElementById("hfLeftNavigation"));

            if (jQuery(navDataHiddenControl).length > 0) {
                var navigationData = jQuery.parseJSON(jQuery(navDataHiddenControl).val());
                return navigationData;
            }

            return null;
        }

        function GetRootNavigationContainerElement() {
            return document.getElementById("navLeftNavigation");
        }

        function GenerateNavigationParentTree(data) {
            var mainNodes = new Array();

            for (var i = 0; i < data.length; i++) {
                var rootNode = new NavigationNode(data[i]);

                var rootListElement = GenerateListNodeElements(data[i]);

                if (rootNode.ChildNodes != null && rootNode.ChildNodes.length > 0) {
                    jQuery(rootNode.ChildNodes).each(function (index) {
                        var ul = document.createElement("ul");

                        var childItems = GenerateChildTreeNodes($(this).get(0), ul, "");
                        jQuery(rootListElement).append(childItems);
                    });
                }

                mainNodes.push(rootListElement);
            }

            return mainNodes;
        }

        function GenerateChildTreeNodes(data, nodes, parentNodeUrl) {
            var node = new NavigationNode(data);

            var element = GenerateListNodeElements(node);

            if (parentNodeUrl == "") {
                jQuery(nodes).append(element);
            } else {
                var parentNodekey = GetSearchKeyForUrlElement(parentNodeUrl);
                jQuery(nodes).find(parentNodekey).parent().children("ul:first").append(element);
            }

            if (node.ChildNodes != null && node.ChildNodes.length > 0) {
                var childNodes = node.ChildNodes;

                parentNodeUrl = node.LinkUrl;
                var currentNodeKey = GetSearchKeyForUrlElement(parentNodeUrl);

                var ul = document.createElement("ul");
                jQuery(nodes).find(currentNodeKey).parent().append(ul);

                for (var i = 0; i < childNodes.length; i++) {
                    GenerateChildTreeNodes(childNodes[i], nodes, parentNodeUrl);
                }
            }

            return nodes;
        }

        function MessageLeftNavigationUI(rootLeftNavigationNode) {
            var currentNode = GetCurrentNavigationNode(rootLeftNavigationNode);

            StyleCurrentNodeListElement(currentNode);
            StyleParentNodeListElement(currentNode);
        }

        function GetCurrentNavigationNode(rootLeftNavigationNode) {
            var currentNode = jQuery(rootLeftNavigationNode).find('a[currentlyselectednode="true"]:first');

            if (currentNode == undefined || currentNode == null || currentNode.length < 1) {
                var currentRelativeUrl = decodeURIComponent(window.location.pathname);
                var searchKey = GetSearchKeyForUrlElement(currentRelativeUrl[currentRelativeUrl.length - 1] == "/" ? currentRelativeUrl.substring(0, currentRelativeUrl.length - 1) : currentRelativeUrl);
                jQuery(rootLeftNavigationNode).find(searchKey).each(function () {
                    var url = jQuery(this).attr("href");

                    if (url == currentRelativeUrl) {
                        return jQuery(this);
                    }
                });

                return jQuery(rootLeftNavigationNode).find(searchKey).get(0);
            }

            return currentNode;
        }

        function StyleCurrentNodeListElement(currentNode) {
            jQuery(currentNode).parent("li").addClass("active");
        }

        function StyleParentNodeListElement(currentNode) {
            jQuery(currentNode).parent("li").parent("ul").parent("li").addClass("ancestor");
        }

        function RemoveBottomBordersFromListElements(rootLeftNavigationNode) {
            var numberOfLinks = jQuery("#" + jQuery(rootLeftNavigationNode).attr("id") + " ul").find("li:last a").length;
            jQuery("#" + jQuery(rootLeftNavigationNode).attr("id") + " ul").find("li:last a").each(function (index) {
                if (index == numberOfLinks - 1) {
                    return false;
                }

                jQuery(this).attr("style", "border-bottom: none;");
            });//.attr("style", "border-bottom: none;")
        }

        function ExtractPertinentNavigationItems(rootLeftNavigationNode, navigationLevel) {
            var currentNode = GetCurrentNavigationNode(rootLeftNavigationNode);

            //RemoveUnwantedChildNavigationItems(currentNode);
            //RemoveUnwatedChildNavigationItemsForSiblings(rootLeftNavigationNode);

            var currentNavUrl = jQuery(currentNode).attr("href");
            var currentLinkIsTopNavLink = CurrentLinkIsSingleDeckTopNavLink(currentNavUrl);

            /*
                This function will trigger if the page is a top link/second deck top link.

                Note: The Single Decker topnav is the second decker's 2nd deck top nav. Same HTML.
            */
            if (currentLinkIsTopNavLink) {
                RemoveUnwantedChildNavigationItems(currentNode);
                RemoveUnwatedChildNavigationItemsForSiblings(rootLeftNavigationNode);

                return jQuery("<ul />").append(jQuery(rootLeftNavigationNode).find("li.active:first").children("ul"));
            }

            if (navigationLevel == 1) {
                var ancestorUrl = jQuery(rootLeftNavigationNode).find("li.ancestor").children("a:first").attr("href");
                var ancesstorIsTopLevelLink = CurrentLinkIsSingleDeckTopNavLink(ancestorUrl);

                if (ancesstorIsTopLevelLink) {
                    RemoveUnwantedChildNavigationItems(currentNode);
                    RemoveUnwatedChildNavigationItemsForSiblings(rootLeftNavigationNode);

                    return jQuery("<ul />").append(jQuery(rootLeftNavigationNode).find("li.ancestor").children("ul"));
                }
            } else {

            }

            jQuery(rootLeftNavigationNode).find("li.ancestor").parent().siblings("ul").find("ul").remove();
            RemoveUnwantedChildNavigationItems(currentNode);
            return jQuery(rootLeftNavigationNode).find("li.ancestor").parent().parent().children("ul");
        }

        function RemoveUnwantedChildNavigationItems(currentNode) {
            var childLinks = jQuery(currentNode).siblings("ul");

            if (jQuery(childLinks).length > 0) {
                jQuery(childLinks).children("li").find("ul").remove();
            }

            jQuery(currentNode).parent("li").parent("ul").children("li:not(.active)").children("ul").remove()
        }

        function RemoveUnwatedChildNavigationItemsForSiblings(rootNode) {
            //removes adjacent UL elements for the parent
            if (jQuery(rootNode).find("li.active:first").parent().siblings().find("ul").length > 0) {
                jQuery(rootNode).find("li.active:first").parent().siblings().find("ul").remove();
            }

            //removes unwated nodes in the parent UL's children
            if (jQuery(rootNode).find("li.active:first").parent("ul").children(":not(li.active)").find("ul").length > 0) {
                jQuery(rootNode).find("li.active:first").parent("ul").children(":not(li.active)").find("ul").remove()
            }

            //removes items from ancesstor siblings
            jQuery(rootNode).find("li.active:first").parent("ul").parent("li").siblings("li").find("ul").remove();

            jQuery(rootNode).find("li.active:first").parent("ul").parent("li").parent("ul").parent("li").children("ul").each(function (index) {
                if (jQuery(this).children("li.active").length < 1) {
                    jQuery(this).remove();
                }
            })
        }

        //this is to find out if the url in the argument is a link in the single decker top nav
        function CurrentLinkIsSingleDeckTopNavLink(url) {
            var linkArray = new Array();
            var linkIsSecondDeckerNavigation = false;

            jQuery(".sub-nav").find("a[href!=#]").each(function (index) {
                var topDeckerUrl = jQuery(this).attr("href");

                if (url == topDeckerUrl) {
                    linkIsSecondDeckerNavigation = true;
                }
            });

            return linkIsSecondDeckerNavigation;
        }

        function HideHiddenLinks(topLevelNavigationItem) {
            //this will look for child items under the parent UL node.
            jQuery(topLevelNavigationItem).children().children().each(function (index) {
                var hiddenItemsPresent = jQuery(this).find('[excludefromcurrentnavigation="true"]').length;

                if (hiddenItemsPresent > 0) {
                    var selectedItemPresent = jQuery(this).find('li.active').length > 0;

                    if (!selectedItemPresent) {
                        jQuery(this).find('[excludefromcurrentnavigation="true"]:first').parent("li").parent("ul").hide();
                    } else {
                        //make ancesstor into active if present.
                        jQuery(this).find('[excludefromcurrentnavigation="true"]:first').parent("li").parent("ul").parent("li").removeClass("ancestor");
                        jQuery(this).find('[excludefromcurrentnavigation="true"]:first').parent("li").parent("ul").parent("li").addClass("active");

                        //make ancesstor of new selected item into ancestor
                        jQuery(this).find('[excludefromcurrentnavigation="true"]:first').parent("li").parent("ul").parent("li").parent("ul").parent("li").addClass("ancestor");

                        //hide hidden links
                        //jQuery(this).find('[excludefromcurrentnavigation="true"]:first').parent("li").parent("ul").hide();
                    }
                }
            });
        }

        function GetCurrentTopLevelNavigationRootLink(sourceUrl, navigationLevel) {
            var sourceUrlSplitArray = sourceUrl.split("/");
            var rootUrl = "";

            for (var i = 0; i != navigationLevel + 1; i++) {
                rootUrl += sourceUrlSplitArray[i];
                rootUrl += "/";
            }

            if (rootUrl[rootUrl.length - 1] == "/") {
                rootUrl = rootUrl.substring(0, rootUrl.length - 1);
            }

            return rootUrl;
        }

        function GetSearchKeyForUrlElement(url) {
            var key = 'a[href="@Url"]';
            key = key.replace("@Url", url);
            return key;
        }

        function GenerateListNodeElements(nodeObject) {
            var rootNode = new NavigationNode(nodeObject);

            var li = document.createElement("li");
            var a = jQuery(document.createElement("a"))
                .attr("href", rootNode.LinkUrl)
                .attr("CurrentlySelectedNode", rootNode.CurrentlySelectedNode)
                .attr("ExcludeFromCurrentNavigation", rootNode.ExcludeFromCurrentNavigation)
                .text(rootNode.Text);

            if (rootNode.ExcludeFromCurrentNavigation) {
                jQuery(a).hide();
            }

            var combinedElement = jQuery(li).append(a);

            return combinedElement;
        }

        function NavigationNode(item) {
            this.Text = item.Text;
            this.LinkUrl = item.LinkUrl.indexOf("http://") < 0 ? item.LinkUrl.replace("//", "/") : item.LinkUrl;
            this.SortOrder = item.SortOrder;
            this.DisplayType = item.DisplayType;
            this.ExcludeFromGlobalNavigation = item.ExcludeFromGlobalNavigation;
            this.ExcludeFromCurrentNavigation = item.ExcludeFromCurrentNavigation;
            this.HoverText = item.HoverText == "" || item.HoverText == null || item.HoverText == undefined ? item.Text : item.HoverText;
            this.ChildNodes = item.ChildNodes;
            this.CurrentlySelectedNode = item.CurrentlySelectedNode;
            this.LinkType = item.LinkType;
        }

        return {
            Init: Init,
            GetNavagationDataJSONArray: GetNavagationDataJSONArray,
            GenerateNavigationParentTree: GenerateNavigationParentTree,
            GetRootNavigationContainerElement: GetRootNavigationContainerElement,
            NavigationNode: NavigationNode
        }
    }
})(Orsted.jQuery.$);

; Orsted.LeftNavigation.Mobile = (function ($) {
    if (jQuery == undefined || jQuery == null) {
        var jQuery = $;
    }

    function Init() {
        var navigationData = Orsted.LeftNavigation.GetNavagationDataJSONArray();

        if (navigationData == undefined || navigationData == null || navigationData.length < 1) {
            jQuery("#navLeftNavigation").remove();
            jQuery("#LayoutLeftPanel").find(".row:first").remove();
            return;
        }

        var navigationElements = Orsted.LeftNavigation.GenerateNavigationParentTree(navigationData);
        var tempULContainer = document.createElement("ul");

        jQuery(navigationElements).each(function (index) {
            jQuery(tempULContainer).append(jQuery(this));
        });

        var navigationItems = ExtractElementsForLeftNavigation(tempULContainer);

        var containerElement = Orsted.LeftNavigation.GetRootNavigationContainerElement();
        jQuery(containerElement).css("top", "inherit");
        jQuery(containerElement).append(navigationItems);

        SetupCurrentLocationDiv(containerElement, navigationItems);
        RelocateLeftNavigation();

        var previousPageTextSetting = jQuery(containerElement).find("#hfPreviousPageText").val();
        AppendPreviousPageSection(containerElement, previousPageTextSetting);
    }

    function ExtractElementsForLeftNavigation(elements) {
        var currentlySelectedNavigationNode = jQuery(elements).find('a[currentlyselectednode="true"]:first');
        var parentContainerOfSelectedNode = jQuery(currentlySelectedNavigationNode).parent();

        var ulContainer = document.createElement("ul");
        jQuery(ulContainer)
            .append(jQuery(document.createElement("li")).attr("class", "active").append(currentlySelectedNavigationNode));

        jQuery(parentContainerOfSelectedNode).children("ul").children().each(function (index) {
            var tagName = jQuery(this).get(0).tagName.toLocaleLowerCase();

            if (tagName != "a") {
                var hyperLink = jQuery(this).find("a:first");

                if (hyperLink.length > 0) {
                    jQuery(ulContainer).append(jQuery(document.createElement("li")).append(hyperLink));
                }
            }
        });

        return ulContainer;
    }

    function SetupCurrentLocationDiv(containerElement, fullNavigationTree) {
        var title = jQuery(".sub-nav .active a:first").text();
        jQuery(containerElement).parent().find("div.row .title-menu").text(title);

        /*
            In case an item in the left nav is the same as the header, remove the link.
        */
        var queryTemplate = 'a[href="@url"]';
        var query = queryTemplate.replace('@url', jQuery(".sub-nav .active a").attr("href"));

        if (jQuery(containerElement).find(query).length > 0) {
            jQuery(containerElement).find(query).parent().hide();
        }
    }

    function RelocateLeftNavigation() {
        var leftNavHeader = jQuery(document.getElementById("LayoutLeftPanel")).find(".row");
        var leftNavContainer = jQuery(document.getElementById("LayoutLeftPanel")).find("#navLeftNavigation");

        var mobileContainer = jQuery(document.createElement("div")).attr("id", "mobileLeftNav").attr("class", "sub-menu menu-open-close noindex");
        jQuery(mobileContainer).append(leftNavHeader).append(leftNavContainer);
        
        jQuery("#header").after(mobileContainer);
    }

    function AppendPreviousPageSection(rootElement, previousPageText) {
        var previousPageLinkElement_container = jQuery("<div />").attr("class", "prev-page")
        var previousPageLinkElement_link = jQuery("<a />")
            .attr("href", "javascript:void(0)")
            .text(previousPageText).click(function (event) {
                history.go(-1);
            });

        var combinedElement = jQuery(previousPageLinkElement_container).append(previousPageLinkElement_link);
        
        jQuery(rootElement).append(combinedElement);
    }

    return {
        Init: Init
    }

})(Orsted.jQuery.$);

Orsted.jQuery.$(document).ready(function () {

    var leftNavigationActivated = document.getElementById("hfLeftNavigation_Active");

    if (leftNavigationActivated == undefined || leftNavigationActivated == null || leftNavigationActivated.value != "true") {
        return;
    }

    var mobileLeftNavDetected = false;

    try {
        if (Orsted.Branding.mobile != undefined) {
            if (Orsted.Branding.mobile.ActivateMobileLeftNavigation != undefined
                && Orsted.Branding.mobile.ActivateMobileLeftNavigation != null
                && Orsted.Branding.mobile.ActivateMobileLeftNavigation) {

                Orsted.LeftNavigation.Mobile.Init();
                mobileLeftNavDetected = true;
            }
        }

        if (!mobileLeftNavDetected) {
            Orsted.LeftNavigation.Init();
        }
    } catch (ex) {
        if (console && console.log) {
            console.log("Error while rendering left navigation" + ex.message);
        }
    }
});