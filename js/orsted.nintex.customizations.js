if (Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

Orsted.NintexForms = (function ($) {
    var jQuery = $;
    
    function Init() {
        jQuery(document).ready(function () {
            SetHigherZIndexesForDropDownControls();
            ChangeStylesForButtons();
            ChangeStyleForInputTextBox();
            ChangeStyleForCheckBoxes();
            ChangeStyleForRadioButtons();
            UpdateFormLayouts();
            ChangeStyleForCalendarPicker();
        });
    }

    function SetHigherZIndexesForDropDownControls() {
        //updating publishing page z-index elements
        for (var i = 0; i < jQuery(".wrapper .nf-form-input select").length; i++) {
            var currentElement = jQuery("#main .nf-form-input select").get(i);
            var parentElement = jQuery(currentElement).parent().parent().parent(".nf-form-input");//SeekParentControl(currentElement, ".nf-form-input");
            var currentZIndex = jQuery(parentElement).css("z-index");
            var newZIndex = Number(currentZIndex) + 1;

            jQuery(parentElement).css("z-index", newZIndex.toString());
            jQuery(parentElement).css("width", "493px");
        }
    }

    function ChangeStylesForButtons() {
        jQuery('.wrapper .nf-filler-container input[type="submit"]').each(function (index) {
            jQuery(this).height("inherit");
            jQuery(this).parent().parent().parent().css("overflow", "inherit");
        });
    }

    function ChangeStyleForInputTextBox() {
        jQuery('.wrapper .nf-filler-container input[type="text"]').each(function (index) {
            jQuery(this).css("margin-left", "-3px");
        });
    }

    function ChangeStyleForCheckBoxes() {
        jQuery('.wrapper .nf-filler-container input[type="checkbox"]').addClass("styled");
        //Custom.init();

        jQuery('.wrapper .nf-filler-container').each(function (index) {
            jQuery(this)
                .find('input[type="checkbox"]:first')
                .parent('span')
                .parent('td')
                .attr("style", "padding-top: inherit;padding-right: inherit;padding-left: inherit;");

            jQuery(this)
                .find('input[type="checkbox"]:not(:first)')
                .parent('span')
                .parent('td')
                .attr("style", "padding-top: inherit;padding-right: inherit;padding-left: inherit;");
        });
    }

    function ChangeStyleForRadioButtons() {
        jQuery('.wrapper .nf-filler-container input[type="radio"]').addClass("styled");

        jQuery('.wrapper .nf-filler-container').each(function (index) {
            jQuery(this)
                .find('input[type="radio"]:first')
                .parent('span')
                .parent('td')
                .attr("style", "padding-top: inherit;padding-right: inherit;padding-left: inherit;");

            jQuery(this)
                .find('input[type="radio"]:not(:first)')
                .parent('span')
                .parent('td')
                .attr("style", "padding-top: inherit;padding-right: inherit;padding-left: inherit;");
        });
    }

    function UpdateFormLayouts() {
        //remove unwanted borders.
        jQuery('.wrapper td.nf-filler-container').parent("tr").parent("tbody").parent("table").css("border-bottom", "inherit");
    }
    
    var DatePickerFixed = false;

    function ChangeStyleForCalendarPicker() {
        jQuery("body").on("DOMNodeInserted", function () {
            
            if (jQuery(document.getElementById("ui-datepicker-div")).length > 0 && !Orsted.NintexForms.DatePickerFixed ) {
                jQuery(document.getElementById("ui-datepicker-div")).removeClass("ui-helper-hidden-accessible");
                jQuery(document.getElementById("ui-datepicker-div")).show();
                jQuery(document.getElementById("ui-datepicker-div")).hide();
                jQuery(window).resize();
                Orsted.NintexForms.DatePickerFixed = true;
            }
        });
    }

    return {
        Init: Init,
        DatePickerFixed: DatePickerFixed
    }

})(Orsted.jQuery.$);

Orsted.NintexForms.Init();