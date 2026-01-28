// Hostel blocks data
const hostelBlocks = [
    {
        name: "Block A",
        code: "KTDI",
        rooms: [
            {
                type: "Standard",
                available: 25,
                total: 50,
                price: "RM 350/month"
            },
            {
                type: "Double",
                available: 12,
                total: 30,
                price: "RM 450/month"
            },
            {
                type: "Single with Bathroom",
                available: 5,
                total: 20,
                price: "RM 600/month"
            }
        ]
    },
    {
        name: "Block B",
        code: "KTC",
        rooms: [
            {
                type: "Standard",
                available: 30,
                total: 60,
                price: "RM 350/month"
            },
            {
                type: "Double",
                available: 8,
                total: 25,
                price: "RM 450/month"
            },
            {
                type: "Single with Bathroom",
                available: 0,
                total: 15,
                price: "RM 600/month"
            }
        ]
    },
    {
        name: "Block C",
        code: "KTHO",
        rooms: [
            {
                type: "Standard",
                available: 40,
                total: 80,
                price: "RM 350/month"
            },
            {
                type: "Double",
                available: 20,
                total: 40,
                price: "RM 450/month"
            },
            {
                type: "Single with Bathroom",
                available: 10,
                total: 25,
                price: "RM 600/month"
            }
        ]
    },
    {
        name: "Block D",
        code: "KTDI",
        rooms: [
            {
                type: "Standard",
                available: 35,
                total: 70,
                price: "RM 350/month"
            },
            {
                type: "Double",
                available: 15,
                total: 35,
                price: "RM 450/month"
            },
            {
                type: "Single with Bathroom",
                available: 8,
                total: 20,
                price: "RM 600/month"
            }
        ]
    }
];

let currentPage = 1;
const itemsPerPage = 2;
let filteredBlocks = [...hostelBlocks];

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function calcOccupancyPct(room) {
    if (!room.total) return 0;
    const occupied = room.total - room.available;
    return clamp(Math.round((occupied / room.total) * 100), 0, 100);
}

function getProgressColor(room) {
    if (room.available <= 0) return "red";
    const occ = calcOccupancyPct(room);
    if (occ >= 70) return "orange";
    return "green";
}

function buildingIconSvg() {
    return `
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M4 22V2h10v6h6v14H4Zm2-2h2v-2H6v2Zm0-4h2v-2H6v2Zm0-4h2v-2H6v2Zm0-4h2V4H6v4Zm4 12h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2V4h-2v4Zm4 12h4v-2h-4v2Zm0-4h4v-2h-4v2Z"/>
        </svg>
    `;
}

function roomIconSvg(type) {
    // simple bed-like icon for all room types to match the screenshot feel
    return `
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M7 11a3 3 0 1 1 0-6h4a3 3 0 0 1 3 3v3h5a2 2 0 0 1 2 2v5h-2v-2H5v2H3v-7a2 2 0 0 1 2-2h2Zm0-2h5V8a1 1 0 0 0-1-1H7a1 1 0 0 0 0 2Z"/>
        </svg>
    `;
}

// Render blocks
function renderBlocks(blocks) {
    const container = document.getElementById('blocksContainer');
    if (!container) return;

    container.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const blocksToShow = blocks.slice(startIndex, endIndex);

    blocksToShow.forEach(block => {
        const blockCard = document.createElement('div');
        blockCard.className = 'block-card';

        let roomsHTML = '';
        block.rooms.forEach(room => {
            const isFullyBooked = room.available === 0;
            const occupancyPct = calcOccupancyPct(room);
            const progressColor = getProgressColor(room);
            
            roomsHTML += `
                <div class="room-row">
                    <div class="room-row-header">
                        <div class="room-left">
                            <span class="room-icon">${roomIconSvg(room.type)}</span>
                            <span class="room-name">${room.type}</span>
                        </div>
                        <div class="room-price">${room.price}</div>
                    </div>
                    <div class="room-meta">
                        <span>${room.available} / ${room.total} available</span>
                        <span class="dot"></span>
                        <span>${occupancyPct}% occupied</span>
                    </div>
                    <div class="progress-line" aria-hidden="true">
                        <div class="progress-fill ${progressColor}" style="width: ${isFullyBooked ? 0 : occupancyPct}%"></div>
                    </div>
                    ${
                        isFullyBooked
                            ? '<button class="apply-btn" disabled>Fully Booked</button>'
                            : `<button class="apply-btn" onclick="handleApply('${block.name}', '${room.type}')">Apply for ${room.type}</button>`
                    }
                </div>
            `;
        });

        blockCard.innerHTML = `
            <div class="block-top">
                <div class="block-top-row">
                    <div class="block-title">
                        <span class="block-icon">${buildingIconSvg()}</span>
                        <span>${block.name}</span>
                    </div>
                    <div class="block-code">${block.code}</div>
                </div>
            </div>
            <div class="block-body">
                ${roomsHTML}
            </div>
        `;

        container.appendChild(blockCard);
    });

    updatePagination(blocks.length);
}

// Update pagination
function updatePagination(totalBlocks) {
    const totalPages = Math.ceil(totalBlocks / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.setAttribute('data-page', i);
        btn.addEventListener('click', () => {
            currentPage = i;
            renderBlocks(filteredBlocks);
        });
        pagination.appendChild(btn);
    }
}

// Search functionality
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredBlocks = [...hostelBlocks];
        } else {
            filteredBlocks = hostelBlocks.filter(block => 
                block.name.toLowerCase().includes(searchTerm) ||
                block.code.toLowerCase().includes(searchTerm)
            );
        }
        
        currentPage = 1;
        renderBlocks(filteredBlocks);
    });
}

// Handle apply button click
function handleApply(blockName, roomType) {
    const params = new URLSearchParams({
        block: blockName,
        roomType
    });
    const nextHash = `#/hostel-application?${params.toString()}`;

    // If this page is inside an iframe (UI5 shell), update the parent hash so UI5 routing works.
    try {
        if (window.top && window.top !== window) {
            window.top.location.hash = nextHash;
            return;
        }
    } catch (e) {
        // cross-origin protection; fallback to current window
    }

    window.location.hash = nextHash;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBlocks(filteredBlocks);
    handleSearch();
});

