if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

Orsted.PeoplePicker = (function ($) {
    var jQuery;

    function Init() {
        if (typeof $ != "undefined") {
            jQuery = $;
            InitializePeoplePicker();
        }
    }

    function InitializePeoplePicker() {
        if (SP.ClientContext != null) {
            context = new SP.ClientContext.get_current();
            web = context.get_web();
            getUser().done(function (user) {
                var userName = user.get_loginName();
                if (userName != null) {
                    SetUserFieldValue('ContentOwner', userName);
                    SetUserFieldValue('ContentResponsible', userName);
                }
            });
        }
    }

    function SetUserFieldValue(fieldName, userName) {
        var field = jQuery('[id*="UserField' + fieldName + '"][title="People Picker"]')
        if (field.length > 0) {
            var button = jQuery(field).parent().parent().parent().parent().parent().parent().find('[id*="checkNames"]');
            if (field[0].innerHTML == '') {
                field[0].innerHTML = userName;
                button[0].click();
            }
        }
    }

    function getUser() {
        var dfd = jQuery.Deferred(function () {
            user = web.get_currentUser();
            context.load(user);
            context.executeQueryAsync(
                function () {
                    dfd.resolve(user);
                }),
                function () {
                    dfd.reject(args.get_message());
                };
        });
        return dfd.promise();
    }

    return {
        Init: Init
    }
})(Orsted.jQuery.$);

Orsted.jQuery.$(document).ready(function () {
    try {
        Orsted.PeoplePicker.Init();
    } catch (ex) {
        if (console) {
            var msg = "Ørsted people picker init failed. Exception message : ";
            msg += ex.message.toString();
            msg += ". Please contact IT support for resolution";

            console.log(msg);
        }
    }
});


