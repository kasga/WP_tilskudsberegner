Type.registerNamespace('Orsted.Ribbon.Page.Components');

Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling = 
    function ApplyLinkArrowStyling() {
        Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.initializeBase(this);
    }

Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.initialize = 
    function () {
        ExecuteOrDelayUntilScriptLoaded(
            Function.createDelegate(null,
                Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.initializePageComponent)
            , 'SP.Ribbon.js');
    }

Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.initializePageComponent = 
    function () {
        var ribbonPageManager = SP.Ribbon.PageManager.get_instance();
        if (ribbonPageManager !== null) {
            ribbonPageManager.addPageComponent(Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.instance);
        }
    }

Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.refreshRibbonStatus = function () {
    SP.Ribbon.PageManager.get_instance().get_commandDispatcher().executeCommand(Commands.CommandIds.ApplicationStateChanged, null);
}

Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.prototype = {
    init: function () {
    },
    getId: function () {
        return 'Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling';
    },
    getFocusedCommands: function () {
        return [];
    },
    getGlobalCommands: function () {
        return ['Orsted.Group.Branding.RibbonLinkArrow.CheckBoxCommand', 'Orsted.Group.Branding.RibbonLinkArrow.CheckBoxQueryCommand'];
    },
    isFocusable: function () {
        return true;
    },
    receiveFocus: function () {
        return true;
    },
    yieldFocus: function () {
        return true;
    },
    canHandleCommand: function (commandId) {
        if ((commandId === 'Orsted.Group.Branding.RibbonLinkArrow.CheckBoxCommand') || (commandId === 'Orsted.Group.Branding.RibbonLinkArrow.CheckBoxQueryCommand')) {
            return true;
        }
        else {
            return false;
        }
        
    },
    handleCommand: function (commandId, properties, sequence) {
        switch (commandId) {
            case 'Orsted.Group.Branding.RibbonLinkArrow.CheckBoxCommand':
                if (properties.On) {
                    Orsted.Branding.Styling.ApplyLinkArrowStyling();
                }
                else {
                    Orsted.Branding.Styling.RemoveLinkArrowStyling();
                }
                break;
            case 'Orsted.Group.Branding.RibbonLinkArrow.CheckBoxQueryCommand':
                if (!this.checkBoxDefaultSet) {
                    if (Orsted.Branding.Styling.HasLinkArrowStyling()) {
                        properties.On = true;
                    }
                    this.checkBoxDefaultSet = true;
                    return properties.On;
                }
                break;
        }
    },
    checkBoxDefaultSet: false
}

Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.registerClass('Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling', CUI.Page.PageComponent);
Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.instance = new Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling();
Orsted.Ribbon.Page.Components.ApplyLinkArrowStyling.initialize();



SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs("Orsted.Ribbon.Page.Components.js");