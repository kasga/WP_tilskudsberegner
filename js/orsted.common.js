if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

; Orsted.Branding.common = (function ($) {

    if (typeof $ != "undefined") {
        var jQuery = $;
        
        //this should only be applied when in edit mode
        function ApplyToolPartFix() {
            jQuery(function () {
                if (typeof g_disableCheckoutInEditMode == "undefined" || g_disableCheckoutInEditMode == true) {
                    if (jQuery("div[id*='DeltaPlaceHolderMain']").find(".ms-ToolPaneOuter").length > 0) {
                        jQuery("div[id*='DeltaPlaceHolderMain']").find(".ms-ToolPaneOuter").prepend("<table><tr height='100px'><td>&nbsp;</td></tr></table>")
                    }
                }
            });
        }

        //this should only be applied when in www mode
        function ApplyScrollBarFix() {
            jQuery(function () {
                if (typeof g_disableCheckoutInEditMode == "undefined" && typeof SP !== 'undefined') {
                    SP.UI.Workspace.add_resized(function () {
                        jQuery("#s4-workspace").css("width", "auto");
                        jQuery("#s4-workspace").css("height", "auto");
                    });
                }
            });
        }

        //to provide padding for hero and page titles
        //when on front page, set the hero webpart bottom padding to 40px
        //when on section page, set the hero webpart bottom padding to 40px and -10px top margin
        //on section page, when hero and page title are displayed remove the bottom padding
        //on section page if hero and page title are not displayed, add a 50px bottom padding between top nav and first content
        function ApplyPublishingFormatting() {
            jQuery(function () {
                var sectionpage = jQuery(".section-page");
                if (sectionpage.length > 0) {
                    var sectionpagewherowebpart = jQuery(".sectionpagetoppicture div");
                    var pagetitle = jQuery(".pageTitle:visible");
                    if (sectionpagewherowebpart.length === 0 && pagetitle.length === 0) {
                        jQuery(".sectionpagetoppicture").css("padding-bottom", "50px");
                    }

                    if (sectionpagewherowebpart.length > 0) {
                        jQuery(".sectionpagetoppicture").css("margin-top", "-10px");
                        if (pagetitle.length > 0) {
                            jQuery(".sectionpagetoppicture .ms-webpartzone-cell").css("margin", "auto auto 0px");
                        }
                        else {
                            jQuery(".sectionpagetoppicture .ms-webpartzone-cell").css("margin", "auto auto 40px");
                        }
                    }
                }
                else {
                    var frontpageherowebpart = jQuery(".fullwidthsection div")
                    if (frontpageherowebpart.length > 0) {

                        jQuery(jQuery(".fullwidthsection .ms-webpartzone-cell")[0]).css("margin", "auto auto 40px");
                    }
                    else {
                        jQuery(jQuery(".fullwidthsection")[0]).css("margin", "auto auto 50px");
                    }
                }
            });
        }

        function ApplyGridZoneWWWStyle() {
            jQuery(function () {
                if (typeof g_disableCheckoutInEditMode == "undefined" || !g_disableCheckoutInEditMode) {
                    jQuery(".wrapper .col-1-3").addClass("col-www");
                    jQuery(".wrapper .col-1-2").addClass("col-www");
                    jQuery(".wrapper .col-2-3").addClass("col-www");
                    jQuery(".wrapper .col-3-3").addClass("col-www");

                    jQuery(".wrapper .col-www").each(function () {
                        if (jQuery(this).find(".s4-wpcell-plain").length > 0) {
                            var zoneWidth = jQuery(this)[0].offsetWidth;
                            jQuery(this).find(".s4-wpcell-plain").each(function () {
                                var elem = jQuery(this)[0];
                                jQuery(elem).width(zoneWidth);
                                if (!jQuery(elem).hasClass("overflow-hidden-none")) {
                                    jQuery(elem).css("overflow", "hidden");
                                }
                            });
                        }
                    });

                }
            });
        }

        function ResizeVideos() {
            jQuery(function () {
                if (typeof g_disableCheckoutInEditMode == "undefined" || !g_disableCheckoutInEditMode) {
                    var videos = jQuery('iframe[src*="23video"],iframe[src*="vimeo"],iframe[src*="youtube"]');
                    var resizedVideos = jQuery('iframe[src*="23video"],iframe[src*="vimeo"],iframe[src*="youtube"]').parents('.video');


                    videos.each(function () {
                        var elem = jQuery(this);

                        if (!resizedVideos.is(elem)) {
                            var embedDiv = elem.parents('div.ms-rte-embedcode');
                            if (embedDiv.length == 0) {
                                elem.wrap(function () {
                                    return "<div class='video'></div>";
                                });
                            }
                            else {
                                embedDiv.attr("class", "");
                                embedDiv.wrap(function () {
                                    return "<div class='video'></div>";
                                });
                            }
                        }
                    });
                    Orsted.Branding.initFitVids();
                }
            });
        }

        return {
            ApplyToolPartFix: ApplyToolPartFix,
            ApplyScrollBarFix: ApplyScrollBarFix,
            ApplyPublishingFormatting: ApplyPublishingFormatting,
            ApplyGridZoneWWWStyle: ApplyGridZoneWWWStyle,
            ResizeVideos: ResizeVideos
        }
    }
})(Orsted.jQuery.$);

; Orsted.Branding.Styling = (function ($) {
    if (typeof $ != "undefined") {
        var jQuery = $;

        function HasLinkArrowStyling() {
            return jQuery('#ms-rterangecursor-start').parent('a').hasClass('ms-rteElement-LinkArrow') || jQuery('#ms-rterangecursor-start').nextUntil('#ms-rterangecursor-end').hasClass('ms-rteElement-LinkArrow');
        }

        function ApplyLinkArrowStyling() {
            if (!HasLinkArrowStyling()) {
                if (jQuery('#ms-rterangecursor-start').parent('a').length > 0) {
                    jQuery('#ms-rterangecursor-start').parent('a').addClass('ms-rteElement-LinkArrow');
                }
                else {
                    jQuery('#ms-rterangecursor-start').nextUntil('#ms-rterangecursor-end').addClass('ms-rteElement-LinkArrow');
                }
            }
        }

        function RemoveLinkArrowStyling() {
            if (HasLinkArrowStyling()) {
                if (jQuery('#ms-rterangecursor-start').parent('a').length > 0) {
                    jQuery('#ms-rterangecursor-start').parent('a').removeClass('ms-rteElement-LinkArrow');
                }
                else {
                    jQuery('#ms-rterangecursor-start').nextUntil('#ms-rterangecursor-end').removeClass('ms-rteElement-LinkArrow');
                }
            }
        }

        return {
            ApplyLinkArrowStyling: ApplyLinkArrowStyling,
            RemoveLinkArrowStyling: RemoveLinkArrowStyling,
            HasLinkArrowStyling: HasLinkArrowStyling
        }
    }
})(Orsted.jQuery.$);

Orsted.Branding.common.ApplyToolPartFix();
Orsted.Branding.common.ApplyScrollBarFix();
Orsted.Branding.common.ApplyPublishingFormatting();
Orsted.Branding.common.ApplyGridZoneWWWStyle();
Orsted.Branding.common.ResizeVideos();
