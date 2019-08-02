if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

(function ($) {
    $.isBlank = function (obj) {
        return (!obj || $.trim(obj) === "");
    };
})(jQuery);


; Orsted.Branding.FatFooter = (function ($) {
    if (typeof $ != "undefined") {
        var jQuery = $;

        function Init() {
            jQuery(function () {
                var informationLinks = jQuery("#hfInformationLinks").val();
                var certificationLinks = jQuery("#hfCertificationLinks").val();
                var socialLinks = jQuery("#hfSocialMediaLinks").val();

                if (informationLinks) {
                    var _informationData = jQuery.parseJSON(informationLinks);
                    BuildInformationMarkup(_informationData);
                }

                if (certificationLinks) {
                    var _certificateData = jQuery.parseJSON(certificationLinks);
                    BuildCertificateMarkup(_certificateData);
                }
                else {
                    var ulSocialMedia = BuildSocialLinksMarkup();
                    var socialLinksTitle = jQuery("#hfSocialMediaTitle").val();
                    if (ulSocialMedia != null) {
                        var divObj = jQuery("<div />").attr("class", "social-networks");
                        jQuery(divObj).append("<strong>" + socialLinksTitle + "</strong>");
                        jQuery(divObj).append(ulSocialMedia);
                        jQuery("div[class='add-columns add-columns2']").append(divObj);
                    }
                }

            });
        }

        //Added By : BHAJA
        //Date Added : 13-Nov-2013
        //Add(s) the Fatfooter Home Link from FatFooter Settings Page
        function ApplyHomeLink() {
            //FatFooter Header links
            jQuery(function () {
                var headerlink = "";
                headerlink = $('.jq_tocheaderlink').val();
                if (headerlink != "") {
                    $('.JQ_ToCHeader').each(function (i) {
                        $(this).attr("href", headerlink);
                    })
                }
            });
        }

        //Added By : BHAJA
        //Date Added : 21-Nov-2013
        //Check(s) does webpartzone has info, If dont have any webpart will hides so that no extra spacing in Mobile Device
        function HideElementsinMobile() {
            jQuery(function () {                
                if (typeof Orsted.Branding.mobile != "undefined") {
                    jQuery("#fullwidthsection").attr("style", "padding-top:0px !important");
                    if (jQuery("#fullwidthsection").children().length == 0) {
                        jQuery("#fullwidthsection").hide();
                    }

                    //Hide Empty Webpart Zones
                    jQuery("div[class='grid-row']").each(function () {
                        //iterate through each webpart parent div                       
                        jQuery($(this)).children().each(function () {
                            //Check(s) if the Webpartzone has data/not.
                            if ($(this).children().length == 0) {
                                $(this).hide();
                            }
                        });
                    });
                }
            });
        }

        function BuildInformationMarkup(informationData) {
            var divObj = jQuery("<div />").attr("class", "menu-holder");
            var navObj = null;
            var ul = null;
            var ItemCnt = 0;

            for (var i = 0; i < informationData.length; i++) {
                var objLink = informationData[i];
                if (ItemCnt == 0) {
                    navObj = jQuery("<nav />").attr("class", "add-menu");
                    ul = jQuery("<ul />");
                }
                else if (ItemCnt % 4 == 0) {
                    jQuery(navObj).append(ul);
                    jQuery(divObj).append(navObj);
                    navObj = jQuery("<nav />").attr("class", "add-menu");
                    ul = jQuery("<ul />");
                }

                var li = jQuery("<li />");
                var a = jQuery("<a />").attr("href", jQuery.isBlank(objLink.LinkUrl) ? "#" : objLink.LinkUrl).attr("target", objLink.Target).text(objLink.Text);
                var element = jQuery(li).append(a);
                jQuery(ul).append(element);

                ItemCnt += 1;
            }
            jQuery(navObj).append(ul);
            jQuery(divObj).append(navObj);
            jQuery("div[class='add-columns add-columns2']").append(divObj);
        }

        function BuildCertificateMarkup(certificateData) {
            var divSection = jQuery("<div />").attr("class", "section");
            var divpartnertCol = jQuery("<div />").attr("class", "partners-col");
            var socialLinksTitle = jQuery("#hfSocialMediaTitle").val();
            for (var i = 0; i < certificateData.length; i++) {
                var objLink = certificateData[i];
                if (objLink.Type.toLowerCase() != "imagelink") {
                    var a = jQuery("<a />").attr("href", jQuery.isBlank(objLink.LinkUrl) ? "#" : objLink.LinkUrl).attr("class", "privacy").attr("target", objLink.Target).text(objLink.Text);
                    jQuery(divpartnertCol).append(a);
                }
            }

            var ul = jQuery("<ul />").attr("class", "partners");

            for (var i = 0; i < certificateData.length; i++) {
                var objLink = certificateData[i];
                if (objLink.Type.toLowerCase() == "imagelink") {
                    var li = jQuery("<li />").attr("class", objLink.Class);
                    var a = jQuery("<a />").attr("href", jQuery.isBlank(objLink.LinkUrl) ? "#" : objLink.LinkUrl).attr("target", objLink.Target);


                    var divData = jQuery("<div />").attr("data-picture", "").attr("data-alt", objLink.Text);
                    var divInnerData = jQuery("<div />").attr("data-src", jQuery.isBlank(objLink.ImageUrl) ? "#" : objLink.ImageUrl);
                    jQuery(divData).append(divInnerData);

                    jQuery(divData).append("<noscript><img src=" + (jQuery.isBlank(objLink.ImageUrl) ? "#" : objLink.ImageUrl) + " width=" + objLink.Width + " height=" + objLink.Height + " alt=" + objLink.Text + " ></noscript>");

                    jQuery(a).append(divData);
                    jQuery(li).append(a);
                    jQuery(ul).append(li);
                }
            }

            jQuery(divpartnertCol).append(ul);
            jQuery(divSection).append(divpartnertCol);

            var ulSocialMedia = BuildSocialLinksMarkup();

            if (typeof Orsted.Branding.mobile != "undefined") {
                var divObj = jQuery("<div />").attr("class", "social-networks");
                jQuery(divObj).append(divSection);
                if (ulSocialMedia != null) {
                    jQuery(divObj).append("<strong>"+socialLinksTitle+"</strong>");
                    jQuery(divObj).append(ulSocialMedia);
                }
                jQuery("div[class='add-columns add-columns2']").append(divObj);
            }
            else if (typeof Orsted.Branding.desktop != "undefined") {
                jQuery("div[class='add-columns add-columns2']").append(divSection);
                if (ulSocialMedia != null) {
                    var divObj = jQuery("<div />").attr("class", "social-networks");                    
                    jQuery(divObj).append("<strong>"+socialLinksTitle+"</strong>");
                    jQuery(divObj).append(ulSocialMedia);
                    jQuery("div[class='add-columns add-columns2']").append(divObj);
                }
            }
        }

        function BuildSocialLinksMarkup() {

            var socialLinks = jQuery("#hfSocialMediaLinks").val();
            if (socialLinks) {
                var socialData = jQuery.parseJSON(socialLinks);
                var ul = jQuery("<ul />");

                for (var i = 0; i < socialData.length; i++) {
                    var objLink = socialData[i];
                    var li = jQuery("<li />");
                    var a = jQuery("<a />").attr("href", jQuery.isBlank(objLink.LinkUrl) ? "#" : objLink.LinkUrl).attr("target", objLink.Target);

                    var ImgUrl=jQuery.isBlank(objLink.ImageUrl) ? SocialMediaIcons(objLink.Text.toLowerCase()) : objLink.ImageUrl;

                    var img = jQuery("<img />").attr("src", ImgUrl).attr("alt", objLink.Text).attr("width", objLink.Width).attr("height", objLink.Height);
                    jQuery(a).append(img);
                   
                    jQuery(li).append(a);
                    jQuery(ul).append(li);

                }
                return ul;
            }
            else
                return null;

        }

        function SocialMediaIcons(socialIcon) {
            switch (socialIcon) {
                case "linkedin":
                    return "_layouts/15/Orsted.Group.Branding/v2/images/ico_linkedin.png";
                    break;
                case "facebook":
                    return "_layouts/15/Orsted.Group.Branding/v2/images/ico_facebook.png";
                    break;
                case "youtube":
                    return "_layouts/15/Orsted.Group.Branding/v2/images/ico_youtube.png";
                    break;
                case "twitter":
                    return "_layouts/15/Orsted.Group.Branding/v2/images/ico_twitter.png";
                    break;
                case "rss":
                    return "_layouts/15/Orsted.Group.Branding/v2/images/ico_rss.png";
                    break;
                default:
                    return "_layouts/15/Orsted.Group.Branding/v2/images/ico_linkedin.png";
                    break;
            }
        }



        return {
            Init: Init,
            ApplyHomeLink: ApplyHomeLink,
            HideElementsinMobile: HideElementsinMobile
        }
    }
})(Orsted.jQuery.$);


Orsted.Branding.FatFooter.Init();
Orsted.Branding.FatFooter.ApplyHomeLink();
Orsted.Branding.FatFooter.HideElementsinMobile();
