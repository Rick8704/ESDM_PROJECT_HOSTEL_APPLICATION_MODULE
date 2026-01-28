sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], (Controller, History) => {
    "use strict";

    return Controller.extend("project1.controller.RoomAvailabilityShell", {
        onNavBack() {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
                return;
            }

            this.getOwnerComponent().getRouter().navTo("RouteMain", {}, true);
        }
    });
});


