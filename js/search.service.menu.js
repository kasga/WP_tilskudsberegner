if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

Orsted.SearchServiceMenu = (function ($) {
    function Init() {
        var enableAutoComplete = false;
        if (typeof $ != "undefined") {
            var jQuery = $;

            function getQueryVariable(variable) {
                var query = window.location.search.substring(1);
                var vars = query.split('&');
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split('=');
                    if (decodeURIComponent(pair[0]) == variable) {
                        return decodeURIComponent(pair[1]);
                    }
                }
            }

            var searchErrorBox = jQuery('.error-text,long-error');
            if (searchErrorBox.length > 0) {
                jQuery(searchErrorBox).hide();
            }

            jQuery('#performSearch').bind('touchstart click', function (event) {

                var searchBox = jQuery(this).parent().children().find("#searchBox");
                var redirectURL = jQuery(this).parent().find("#hdfRedirectURL")
                var searchErrorBox = jQuery(this).parent().children().find(".error-text,long-error");
                var toolTip = jQuery(this).parent().find("#hdfTooltip")
                jQuery(searchErrorBox).hide();

                if (searchBox.length > 0 && jQuery(searchBox)[0].value.trim().length > 0 && jQuery(searchBox)[0].value != jQuery(toolTip)[0].value) {
                    var encoded = encodeURIComponent(jQuery(searchBox)[0].value);
                    var searchValue = jQuery(searchBox)[0].value;
                    window.location.href = jQuery(redirectURL)[0].value + "&k=" + encoded;
                    jQuery('input[type="search"]').val(searchValue);
                    return false;
                }
                else {
                    if (typeof Orsted.Branding.mobile === "undefined") {
                        var height = jQuery(searchErrorBox).height();
                        if (height > 16) {
                            jQuery(searchErrorBox).css('top', -1 * (height / 3));
                            jQuery(searchErrorBox).css('right', "1px");
                        }
                        else {
                            jQuery(searchErrorBox).css('text-align', 'center');
                            jQuery(searchErrorBox).css('right', "1px");
                        }
                    }
                    else {
                        var container = jQuery('.text,input-inner-wrap');
                        jQuery(searchErrorBox).css('top', jQuery(container).height() + 'px');
                    }
                    jQuery(searchErrorBox).show();
                    return false;
                }
            });

            jQuery('input[type="search"]').each(function (index) {

                jQuery(this).focus(function () {
                    var input = $(this);
                    var toolTip = jQuery(this).parent().parent().find("#hdfTooltip");
                    if (input.val() == '' || input.val() == toolTip[0].value) {

                        jQuery(input).attr('placeholder', '');
                        input.val('');
                    }
                }).blur(function () {
                    var input = $(this);
                    var toolTip = jQuery(this).parent().parent().find("#hdfTooltip");
                    if (input.val() == '' || input.val() == toolTip[0].value) {
                        input.val(toolTip[0].value);
                        jQuery(input).attr("placeholder", toolTip[0].value);
                    }
                }).blur();

                var toolTip = jQuery(this).parent().parent().find("#hdfTooltip");
                jQuery(this).attr("placeholder", toolTip[0].value);
                jQuery(this).val(getQueryVariable("k"));

                if (typeof (jQuery(this).autocomplete) != 'undefined') {
                    jQuery(this).autocomplete({
                        source: function (req, response) {
                            var spweb = jQuery("#hdfSPWeb");
                            if (this.element.context.value.length > 0 && spweb[0].value.length > 0 && enableAutoComplete) {
                                jQuery.ajax({
                                    contentType: "application/json; charset=utf-8",
                                    url: "/_layouts/15/Orsted.Group.Branding/SearchSuggestion.ashx",
                                    data: { 'name': this.element.context.value, 'spweb': jQuery(spweb)[0].value },
                                    success: function OnComplete(result) {
                                        if (result != null && result.constructor.__typeName == "Array")
                                            response(result);
                                        else
                                            return;
                                    },
                                    error: function OnFail(result) {
                                        return;
                                    }
                                });
                            }
                        },
                        select: function (event, ui) {
                            jQuery(this).val(ui.item.value);
                            var searchInput = jQuery(this).parent().parent().parent().find("#performSearch");
                            jQuery(searchInput)[0].click();
                        }
                    }).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var inner_html;
                        if (index > 0)
                            inner_html = '<a class="list_link"><div class="list_inner_container_wp"><div class="list_item_label">' + item.value + '</div></div></a>';
                        else
                            inner_html = '<a class="list_link"><div class="list_inner_container"><div class="list_item_label">' + item.value + '</div></div></a>';

                        return jQuery("<li></li>")
                            .data("item.autocomplete", item)
                            .append(inner_html)
                            .appendTo(ul);
                    };
                }
            });

            jQuery('input[type="submit"]').each(function (index) {
                var label = jQuery(this).parent().parent().find("#hdfLabel");
                if (label.length > 0)
                    jQuery(this).val(label[0].value);
            });

            jQuery('input[type="search"]').keypress(function (event) {
                if (event.which == 13) {
                    var searchBox = jQuery(this).parent().parent().parent().find("#performSearch");
                    var searchInput = jQuery(this).parent().parent().parent().find("#searchBox");
                    event.preventDefault();
                    event.stopPropagation();
                    jQuery(searchBox)[0].click();
                }
                else {
                    if (jQuery(this).val().trim() != '' || event.which != 32)
                        jQuery(this).parent().find(".error-text,long-error").hide();
                }
            });

            jQuery('.ui-autocomplete.ui-widget').click(function (event) {
                event.stopPropagation();
            });

            jQuery('input[type="search"]').focus(function () {
                enableAutoComplete = true;
            });
        }
    }
    return {
        Init: Init
    }
})(Orsted.jQuery.$);

Orsted.jQuery.$(document).ready(function () {
    try {
        Orsted.SearchServiceMenu.Init();
    } catch (ex) {
        if (console) {
            var msg = "Ørsted Search in service menu component malfunction detected. Exception message : ";
            msg += ex.message.toString();
            msg += ". Please contact IT support for resolution";

            console.log(msg);
        }
    }
});
