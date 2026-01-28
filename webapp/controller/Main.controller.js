sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project1.controller.Main", {
        onInit() {
        },

        onAfterRendering() {
            const avatar = document.getElementById("studentProfileAvatar");
            const menu = document.getElementById("studentProfileMenu");
            if (!avatar || !menu) {
                return;
            }

            avatar.addEventListener("click", () => {
                const hidden = menu.hasAttribute("hidden");
                if (hidden) {
                    menu.removeAttribute("hidden");
                } else {
                    menu.setAttribute("hidden", "true");
                }
            });

            document.addEventListener("click", (e) => {
                if (menu.hasAttribute("hidden")) {
                    return;
                }
                if (menu.contains(e.target) || avatar.contains(e.target)) {
                    return;
                }
                menu.setAttribute("hidden", "true");
            });

            menu.querySelectorAll(".portalProfileItem").forEach((btn) => {
                btn.addEventListener("click", () => {
                    const target = btn.getAttribute("data-target");
                    if (target === "admin") {
                        const hash = "#/admin";
                        try {
                            if (window.top && window.top !== window) {
                                window.top.location.hash = hash;
                            } else {
                                window.location.hash = hash;
                            }
                        } catch (e) {
                            window.location.hash = hash;
                        }
                    } else {
                        // Go to student main page: clear hash entirely so RouteMain ('') is matched
                        try {
                            const win = window.top && window.top !== window ? window.top : window;
                            const base = win.location.href.split("#")[0];
                            win.location.href = base;
                        } catch (e) {
                            window.location.href = window.location.href.split("#")[0];
                        }
                    }
                });
            });
        }
    });
});


