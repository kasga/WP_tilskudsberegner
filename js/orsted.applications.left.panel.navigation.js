if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

; Orsted.ApplicationLeftNavigation = (function ($) {
    if (typeof $ != undefined) {
        var jQuery = $;

        function Init() {
            var navDataHiddenControl = jQuery(document.getElementById("hfLeftNavigation"));

            if (navDataHiddenControl.length > 0) {
                var navigationData = jQuery.parseJSON(jQuery(navDataHiddenControl).val());

                var navigationTree = GenerateNavigationParentTree(navigationData);
                var ulContainer = document.createElement("ul");

                jQuery(navigationTree).each(function (index) {
                    jQuery(ulContainer).append(jQuery(this));
                });

                //generate baseline left navigation tree
                jQuery(document.getElementById("navLeftNavigation")).append(ulContainer);

                MessageLeftNavigationUI(document.getElementById("navLeftNavigation"));

                //navigation level
                var navigationLevel = Number(jQuery(document.getElementById("hfLeftNavigation_MenuLevel")).val());
                ExtractPertinentNavigationItems(document.getElementById("navLeftNavigation"), navigationLevel);
            } else {
                jQuery(document.getElementById("navLeftNavigation")).hide();
            }
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
            if (jQuery(rootLeftNavigationNode).find("li.ancestor").siblings().find("ul").length > 0) {
                jQuery(rootLeftNavigationNode).find("li.ancestor").siblings().find("ul").remove();
            } else {
                $(rootLeftNavigationNode).children().children().children(":not(a)").each(function (index) {
                    var activeNodePresent = jQuery(this).find("li.active").length > 0;

                    if (!activeNodePresent) {
                        jQuery(this).find("ul").remove();
                    }
                });
            }
            RemoveUnwantedChildNavigationItems(currentNode);
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
            Init: Init
        }
    }
})(Orsted.jQuery.$);

Orsted.jQuery.$(document).ready(function () {
    Orsted.ApplicationLeftNavigation.Init();
});