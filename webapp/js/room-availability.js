// Hostel blocks data
const hostelBlocks = [
    {
        name: "Block A",
        code: "KTDI",
        rooms: [
            {
                type: "Standard",
                icon: "🛏️",
                available: 25,
                total: 50,
                price: "RM 350/month",
                occupancy: 50
            },
            {
                type: "Double",
                icon: "🛏️🛏️",
                available: 12,
                total: 30,
                price: "RM 450/month",
                occupancy: 40
            },
            {
                type: "Single with Bathroom",
                icon: "🛏️🚿",
                available: 5,
                total: 20,
                price: "RM 600/month",
                occupancy: 75
            }
        ]
    },
    {
        name: "Block B",
        code: "KTC",
        rooms: [
            {
                type: "Standard",
                icon: "🛏️",
                available: 30,
                total: 60,
                price: "RM 350/month",
                occupancy: 50
            },
            {
                type: "Double",
                icon: "🛏️🛏️",
                available: 8,
                total: 25,
                price: "RM 450/month",
                occupancy: 68
            },
            {
                type: "Single with Bathroom",
                icon: "🛏️🚿",
                available: 0,
                total: 15,
                price: "RM 600/month",
                occupancy: 100
            }
        ]
    },
    {
        name: "Block C",
        code: "KTHO",
        rooms: [
            {
                type: "Standard",
                icon: "🛏️",
                available: 40,
                total: 80,
                price: "RM 350/month",
                occupancy: 50
            },
            {
                type: "Double",
                icon: "🛏️🛏️",
                available: 20,
                total: 40,
                price: "RM 450/month",
                occupancy: 50
            },
            {
                type: "Single with Bathroom",
                icon: "🛏️🚿",
                available: 10,
                total: 25,
                price: "RM 600/month",
                occupancy: 60
            }
        ]
    },
    {
        name: "Block D",
        code: "KTDI",
        rooms: [
            {
                type: "Standard",
                icon: "🛏️",
                available: 35,
                total: 70,
                price: "RM 350/month",
                occupancy: 50
            },
            {
                type: "Double",
                icon: "🛏️🛏️",
                available: 15,
                total: 35,
                price: "RM 450/month",
                occupancy: 57
            },
            {
                type: "Single with Bathroom",
                icon: "🛏️🚿",
                available: 8,
                total: 20,
                price: "RM 600/month",
                occupancy: 60
            }
        ]
    }
];

let currentPage = 1;
const itemsPerPage = 2;
let filteredBlocks = [...hostelBlocks];

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
            const progressColor = room.occupancy >= 75 ? 'orange' : room.occupancy >= 100 ? 'red' : 'green';
            
            roomsHTML += `
                <div class="room-type">
                    <div class="room-type-header">
                        <span class="room-type-icon">${room.icon}</span>
                        <span class="room-type-name">${room.type}</span>
                    </div>
                    <div class="room-availability">${room.available} / ${room.total} available</div>
                    <div class="room-price">${room.price}</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar ${progressColor}" style="width: ${room.occupancy}%"></div>
                    </div>
                    ${isFullyBooked 
                        ? '<button class="apply-btn fully-booked-btn" disabled>Fully Booked</button>'
                        : `<button class="apply-btn" onclick="handleApply('${block.name}', '${room.type}')">Apply for ${room.type}</button>`
                    }
                </div>
            `;
        });

        blockCard.innerHTML = `
            <div class="block-header">
                <div class="block-name">${block.name}</div>
                <div class="block-code">(${block.code})</div>
            </div>
            ${roomsHTML}
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
    alert(`Application submitted for ${roomType} in ${blockName}`);
    // Here you would typically navigate to an application form or show a modal
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBlocks(filteredBlocks);
    handleSearch();
});

