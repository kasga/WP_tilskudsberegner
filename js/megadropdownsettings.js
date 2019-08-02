var selectedText = "";

$(document).ready(function () {
    $("select[id$='ddlMenuTabs']").change(function () {
        var selected = $(this).val();

        if (isDirtied) {
            if (!confirm('There are unsaved changes. Are you sure you want to change selection?')) {
                $(this).val(currMegaTab);
                return false;
            }
            else {
                // Clean up the dirty flag
                isDirtied = false;
            }
        }
    });

    // Add Handler to Tabs Dropdown
    $("select[id$='ddlMenuTabs'] option").click(function () {
        var selectedTab = $("select[id$='ddlMenuTabs'] :selected").val();
        currMegaTab = selectedTab;

        var hidValueJson = $("input[id$='hidValue']");

        if (hidValueJson.val()) {

            var jSonStr = hidValueJson.val();
            var objTabs = eval("(" + jSonStr + ")");

            SetTabIfExists(objTabs.TabSettings, selectedTab);
        }
    });

    $("select[id$='ddlMenuTabs']").change(function () {

        var selectedIndex = $("select[id$='ddlMenuTabs']").prop('selectedIndex');

        if (selectedIndex > 0) {
            selectedText = $("select[id$='ddlMenuTabs'] option:selected").text();
        }
        else {
            selectedText = '';
        }
        $("input[id$='txtNavigationTitle']").val(selectedText);
    });

    SetDropDownColor();

    $("#link_to_content").click(function (e) {
        e.preventDefault();
    });

    $("#s4-ribbonrow").hide();

    setTimeout(function () { $("#s4-titlerow").show(); }, 10);

    $("div[id$='txtNavHtmlSectC_EmptyHtmlPanel']").click(function () {

        $("#s4-titlerow").hide();

        $("#s4-ribbonrow").show();

    });

    $("div[id$='txtSectBContents_EmptyHtmlPanel']").click(function () {

        $("#s4-titlerow").hide();

        $("#s4-ribbonrow").show();

    });

});

function SetDropDownColor() {

    var defaultColor;

    var hidField = $("input[id$='hidColorCode']");

    if (hidField.val()) {
        defaultColor = hidField.val();
    }
    else {
        defaultColor = $("select[id$='ddlColors'] option:selected").val();
    }

    $("select[id$='ddlColors']").css("background-color", defaultColor);

    var colorBox = document.getElementById("divColorBox");

    $("#divColorBox").css("background-color", defaultColor);

    $("select[id$='ddlColors']").val(defaultColor);
}

function ChangePreviewColor(colorCode) {

    $("#divColorBox").css("background-color", colorCode);

    $("select[id$='ddlColors']").css("background-color", colorCode);

    $("select[id$='ddlColors']").val(colorCode);

    var hidField = $("input[id$='hidColorCode']");

    hidField.val(colorCode);
}

// Form Dirty checking
var isDirtied = false;
var currMegaTab = 0;

// Insert Dirty form checker for all textboxes
$(document).ready(function () {
    $("input[id$='txtNavigationTitle']").keyup(function () {
        isDirtied = true;
    });
    $("textarea[id$='txtNavigationDesc']").keyup(function () {
        isDirtied = true;
    });
    $("input[id$='txtNavHyperlinkTitle']").keyup(function () {
        isDirtied = true;
    });
    $("input[id$='txtNavHyperlinkUrl']").keyup(function () {
        isDirtied = true;
    });
    $("input[id$='chkOpenNavLinkInNew']").change(function () {
        isDirtied = true;
    });

    var rteSectB = $("textarea[id$='txtSectBContents']").closest("div").find("iframe[Title='Rich Text Editor']").contents().find("body");
    $(rteSectB).focus(function () {
        isDirtied = true;
    });

    $("input[id$='txtNavHyperlinkTitleSectC']").keyup(function () {
        isDirtied = true;
    });
    $("input[id$='txtNavHyperlinkSectC']").keyup(function () {
        isDirtied = true;
    });
    $("input[id$='txtNavRedirectHyperlinkSectC']").keyup(function () {
        isDirtied = true;
    });
    $("input[id$='chkOpenNavLinkInNewSectC']").change(function () {
        isDirtied = true;
    });

    var rteSectC = $("textarea[id$='txtNavHtmlSectC']").closest("div").find("iframe[Title='Rich Text Editor']").contents().find("body");
    $(rteSectC).focus(function () {
        isDirtied = true;
    });
});

function SetTabIfExists(array, id) {

    if (array) {
        if (array.length > 0) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].NavId === id) {

                    SetFields(array[i].NavTitle, array[i].NavDescription, array[i].MainNavTitle, array[i].MainNavUrl, array[i].MainNavOpenNewWindow, array[i].NavSectBHtml, array[i].NavSectCToggle, array[i].NavSectCTitle, array[i].NavSectCUrl, array[i].NavSectCRedirectUrl, array[i].NavSectCOpenNewWindow, array[i].NavSectCHtml, array[i].NavSectCBgColor);

                    return true;
                }
            }
        }
    }

    SetFields(selectedText, '', '', '', false, '', true, '', '', '', false, '');

    return false;
}

function SetFields(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12, val13) {
    $("input[id$='txtNavigationTitle']").val(val1);
    $("textarea[id$='txtNavigationDesc']").html(val2);

    $("input[id$='txtNavHyperlinkTitle']").val(val3);
    $("input[id$='txtNavHyperlinkUrl']").val(val4);
    $("input[id$='chkOpenNavLinkInNew']").attr('checked', val5);

    $("div[id$='txtSectBContents_displayContent']").html(val6);

    $("input[id$='txtNavHyperlinkTitleSectC']").val(val8);
    $("input[id$='txtNavHyperlinkSectC']").val(val9);
    $("input[id$='txtNavRedirectHyperlinkSectC']").val(val10);
    $("input[id$='chkOpenNavLinkInNewSectC']").attr('checked', val11);

    $("div[id$='txtNavHtmlSectC_displayContent']").html(val12);

    $("div[id$='txtNavHtmlSectC_EmptyHtmlPanel']").click();
    $("div[id$='txtSectBContents_EmptyHtmlPanel']").click();

    //$("#s4-ribbonrow").hide();

    $("input[id$='txtNavigationTitle']").focus();

    //setTimeout(function () { $("#s4-titlerow").show(); }, 10);

    //setTimeout(function () { $("select[id$='ddlMenuTabs']").focus(); }, 10);

}


//$('#link_to_content').trigger('click');

//$(document).click();

//$(document).trigger('click');

//SP.SOD.executeOrDelayUntilScriptLoaded(function () {
//    $("div[id$='txtNavHtmlSectC_EmptyHtmlPanel']").click();

//    $("div[id$='txtSectBContents_EmptyHtmlPanel']").click();

//    $("select[id$='ddlMenuTabs']").focus();

//}, "sp.ui.rte.js");