const applications = [
    {
        id: 1,
        name: "Muhammad Arif Bin Rahman",
        studentId: "AI210001",
        email: "arif@student.uthm.edu.my",
        phone: "+60 12-345 6789",
        program: "Computer Science",
        year: "Year 2",
        gender: "Male",
        block: "Block A",
        roomType: "Standard",
        floor: "2",
        submitted: "2025-01-08",
        status: "Pending"
    },
    {
        id: 2,
        name: "Siti Nurbalqis Binti Hassan",
        studentId: "AI210023",
        email: "siti@student.uthm.edu.my",
        phone: "+60 17-889 2234",
        program: "Software Engineering",
        year: "Year 2",
        gender: "Female",
        block: "Block B",
        roomType: "Standard",
        floor: "4",
        submitted: "2025-01-07",
        status: "Approved"
    },
    {
        id: 3,
        name: "Kumar Rajesh",
        studentId: "AI210045",
        email: "kumar@student.uthm.edu.my",
        phone: "+60 13-889 3344",
        program: "Information Technology",
        year: "Year 2",
        gender: "Male",
        block: "Block C",
        roomType: "Standard",
        floor: "3",
        submitted: "2025-01-09",
        status: "Approved"
    },
    {
        id: 4,
        name: "Lee Mee Ling",
        studentId: "AI210055",
        email: "lee@student.uthm.edu.my",
        phone: "+60 16-882 9900",
        program: "Data Science",
        year: "Year 2",
        gender: "Female",
        block: "Block A",
        roomType: "Single",
        floor: "2",
        submitted: "2025-01-08",
        status: "Rejected"
    },
    {
        id: 5,
        name: "Muhammad Fair Bin Ismail",
        studentId: "AI210065",
        email: "fair@student.uthm.edu.my",
        phone: "+60 11-882 2211",
        program: "Cybersecurity",
        year: "Year 2",
        gender: "Male",
        block: "Block D",
        roomType: "Deluxe",
        floor: "5",
        submitted: "2025-01-10",
        status: "Pending"
    }
];

let currentFilter = "";
let selectedId = null;

function statusClass(status) {
    switch (status) {
        case "Approved": return "status-approved";
        case "Rejected": return "status-rejected";
        default: return "status-pending";
    }
}

function renderStats() {
    const total = applications.length;
    const pending = applications.filter(a => a.status === "Pending").length;
    const approved = applications.filter(a => a.status === "Approved").length;
    const rejected = applications.filter(a => a.status === "Rejected").length;

    const byId = id => document.getElementById(id);
    byId("statTotalApps").textContent = total;
    byId("statPending").textContent = pending;
    byId("sumTotal").textContent = total;
    byId("sumPending").textContent = pending;
    byId("sumApproved").textContent = approved;
    byId("sumRejected").textContent = rejected;
}

function passesFilter(app) {
    if (!currentFilter) return true;
    const q = currentFilter.toLowerCase();
    return (
        app.name.toLowerCase().includes(q) ||
        app.studentId.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q)
    );
}

function renderTable() {
    const tbody = document.getElementById("appsTbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    applications.filter(passesFilter).forEach(app => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="student-name">${app.name}</div>
                <div class="student-id">${app.studentId}</div>
            </td>
            <td>
                <div>${app.email}</div>
                <div class="student-id">${app.phone}</div>
            </td>
            <td>${app.program}<br><span class="student-id">${app.year}</span></td>
            <td>Block ${app.block.split(" ")[1]} - ${app.roomType}</td>
            <td>${app.submitted}</td>
            <td>
                <span class="status-pill ${statusClass(app.status)}">${app.status}</span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn action-view" title="View" data-action="view" data-id="${app.id}">👁</button>
                    <button class="action-btn action-approve" title="Approve" data-action="approve" data-id="${app.id}">✔</button>
                    <button class="action-btn action-reject" title="Reject" data-action="reject" data-id="${app.id}">✖</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openDetails(id) {
    selectedId = id;
    const app = applications.find(a => a.id === id);
    if (!app) return;

    const byId = s => document.getElementById(s);
    byId("dFullName").textContent = app.name;
    byId("dStudentId").textContent = app.studentId;
    byId("dEmail").textContent = app.email;
    byId("dPhone").textContent = app.phone;
    byId("dProgram").textContent = app.program;
    byId("dYear").textContent = app.year;
    byId("dGender").textContent = app.gender;
    byId("dBlock").textContent = app.block;
    byId("dRoomType").textContent = app.roomType;
    byId("dFloor").textContent = app.floor;
    byId("dSubmitted").textContent = app.submitted;

    const pill = byId("dStatusPill");
    pill.className = "status-pill " + statusClass(app.status);
    pill.textContent = app.status;

    const overlay = document.getElementById("detailsOverlay");
    if (overlay) overlay.hidden = false;
}

function closeDetails() {
    const overlay = document.getElementById("detailsOverlay");
    if (overlay) overlay.hidden = true;
}

function updateStatus(id, status) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    app.status = status;
    renderStats();
    renderTable();
    openDetails(id);
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
        if (!menu || !avatar) return;
        if (menu.hasAttribute("hidden")) return;
        if (menu.contains(e.target) || avatar.contains(e.target)) return;
        menu.setAttribute("hidden", "true");
    });

    menu.querySelectorAll(".profile-menu-item").forEach(btn => {
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
                // Student main: clear hash so RouteMain ('') is used
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
    renderStats();
    renderTable();
    handleProfileMenuToggle();

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentFilter = e.target.value.trim();
            renderTable();
        });
    }

    const tbody = document.getElementById("appsTbody");
    if (tbody) {
        tbody.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-action]");
            if (!btn) return;
            const id = Number(btn.getAttribute("data-id"));
            const action = btn.getAttribute("data-action");
            if (action === "view") {
                openDetails(id);
            } else if (action === "approve") {
                updateStatus(id, "Approved");
            } else if (action === "reject") {
                updateStatus(id, "Rejected");
            }
        });
    }

    const closeX = document.getElementById("detailsCloseX");
    const overlay = document.getElementById("detailsOverlay");
    const approveBtn = document.getElementById("detailsApprove");
    const rejectBtn = document.getElementById("detailsReject");

    if (closeX) closeX.addEventListener("click", closeDetails);
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeDetails();
        });
    }
    if (approveBtn) {
        approveBtn.addEventListener("click", () => {
            if (selectedId != null) updateStatus(selectedId, "Approved");
        });
    }
    if (rejectBtn) {
        rejectBtn.addEventListener("click", () => {
            if (selectedId != null) updateStatus(selectedId, "Rejected");
        });
    }
});


