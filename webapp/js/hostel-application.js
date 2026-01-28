// Pre-fill dropdowns based on incoming hash params and sample data
const blocks = ["Block A", "Block B", "Block C", "Block D"];
const roomTypes = ["Standard", "Double", "Single with Bathroom"];

function populateSelect(selectEl, options, selected) {
    if (!selectEl) return;
    selectEl.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.textContent = selectEl.id === "blockPref" ? "Select Block" : "Select Room Type";
    placeholder.value = "";
    selectEl.appendChild(placeholder);

    options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        if (selected && selected.toLowerCase() === opt.toLowerCase()) {
            o.selected = true;
        }
        selectEl.appendChild(o);
    });
}

function getHashParams() {
    const hash = window.location.hash || "";
    const qIndex = hash.indexOf("?");
    if (qIndex === -1) return {};
    const search = hash.slice(qIndex + 1);
    const params = new URLSearchParams(search);
    return {
        block: params.get("block") || "",
        roomType: params.get("roomType") || ""
    };
}

function setFieldError(id, message) {
    const err = document.querySelector(`.field-error[data-for="${id}"]`);
    if (err) err.textContent = message || "";
}

function validateRequiredInput(el) {
    if (!el) return true;
    const id = el.id || "";

    // use native validity where possible
    if (el.required) {
        if (el.tagName === "SELECT") {
            if (!el.value) {
                setFieldError(id, "This field is required.");
                return false;
            }
        } else if (!el.value || !el.value.trim()) {
            setFieldError(id, "This field is required.");
            return false;
        }
    }

    if (el.type === "email" && el.value) {
        // basic native check
        if (!el.checkValidity()) {
            setFieldError(id, "Please enter a valid email address.");
            return false;
        }
    }

    setFieldError(id, "");
    return true;
}

function openSuccessModal() {
    const overlay = document.getElementById("successOverlay");
    if (!overlay) return;
    overlay.hidden = false;
}

function closeSuccessModal() {
    const overlay = document.getElementById("successOverlay");
    if (!overlay) return;
    overlay.hidden = true;

    // After closing success, redirect back to student main page (UI5 RouteMain).
    // Clear hash completely so RouteMain pattern "" is matched.
    try {
        const win = window.top && window.top !== window ? window.top : window;
        const base = win.location.href.split("#")[0];
        win.location.href = base;
    } catch (e) {
        window.location.href = window.location.href.split("#")[0];
    }
}

function handleProfileMenuToggle() {
    const avatar = document.getElementById("profileAvatar");
    const menu = document.getElementById("profileMenu");
    if (!avatar || !menu) return;

    avatar.addEventListener("click", () => {
        const hidden = menu.hasAttribute("hidden");
        if (hidden) {
            menu.removeAttribute("hidden");
        } else {
            menu.setAttribute("hidden", "true");
        }
    });

    document.addEventListener("click", (e) => {
        if (menu.hasAttribute("hidden")) return;
        if (menu.contains(e.target) || avatar.contains(e.target)) return;
        menu.setAttribute("hidden", "true");
    });

    menu.querySelectorAll(".profile-menu-item").forEach((btn) => {
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

document.addEventListener("DOMContentLoaded", () => {
    const params = getHashParams();
    populateSelect(document.getElementById("blockPref"), blocks, params.block);
    populateSelect(document.getElementById("roomTypePref"), roomTypes, params.roomType);

    const requiredIds = [
        "fullName",
        "studentId",
        "email",
        "phone",
        "program",
        "year",
        "gender",
        "blockPref",
        "roomTypePref"
    ];

    const fileInput = document.getElementById("supportingDocs");
    const uploadDrop = document.getElementById("uploadDrop");
    const fileList = document.getElementById("fileList");

    function renderFiles() {
        if (!fileInput || !fileList) return;
        fileList.innerHTML = "";
        const files = Array.from(fileInput.files || []);
        files.forEach(f => {
            const pill = document.createElement("div");
            pill.className = "file-pill";
            pill.textContent = f.name;
            fileList.appendChild(pill);
        });
    }

    function validateFiles() {
        if (!fileInput) return true;
        const ok = (fileInput.files && fileInput.files.length > 0);
        setFieldError("supportingDocs", ok ? "" : "Supporting documents are required.");
        return ok;
    }

    // validate on input/change
    requiredIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", () => validateRequiredInput(el));
        el.addEventListener("change", () => validateRequiredInput(el));
    });

    if (uploadDrop && fileInput) {
        uploadDrop.addEventListener("click", () => fileInput.click());
    }

    if (fileInput) {
        fileInput.addEventListener("change", () => {
            renderFiles();
            validateFiles();
        });
    }

    // modal close handlers
    const closeX = document.getElementById("successCloseX");
    const closeBtn = document.getElementById("successCloseBtn");
    const overlay = document.getElementById("successOverlay");
    if (closeX) closeX.addEventListener("click", closeSuccessModal);
    if (closeBtn) closeBtn.addEventListener("click", closeSuccessModal);
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeSuccessModal();
        });
    }

    // Submit
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();

            let ok = true;
            requiredIds.forEach(id => {
                const el = document.getElementById(id);
                if (!validateRequiredInput(el)) ok = false;
            });
            if (!validateFiles()) ok = false;

            if (!ok) {
                // focus first invalid element
                const firstInvalid = requiredIds
                    .map(id => document.getElementById(id))
                    .find(el => el && !el.checkValidity());
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            openSuccessModal();
        });
    }

    handleProfileMenuToggle();
});


