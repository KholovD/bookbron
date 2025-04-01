class InternetCafeSystem {
    constructor() {
        this.zones = {
            main: { name: 'Main Zone', capacity: 20, pricePerHour: 10000 },
            pro: { name: 'Pro Zone', capacity: 10, pricePerHour: 15000 },
            vip: { name: 'VIP Zone', capacity: 10, pricePerHour: 20000 },
            supervip: { name: 'Super VIP', capacity: 10, pricePerHour: 25000 }
        };
        
        this.currentZone = 'main';
        this.selectedComputer = null;
        this.isLoggedIn = false;
        
        this.initializeElements();
        this.addEventListeners();
        this.renderComputers();
    }

    initializeElements() {
        // Auth elements
        this.authModal = document.getElementById('authModal');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        // Zone elements
        this.zoneBtns = document.querySelectorAll('.zone-btn');
        this.computersGrid = document.getElementById('computersGrid');
        
        // Booking elements
        this.selectedZoneElement = document.getElementById('selectedZone');
        this.selectedPCElement = document.getElementById('selectedPC');
        this.timeSelect = document.getElementById('timeSelect');
        this.totalPriceElement = document.getElementById('totalPrice');
        this.bookBtn = document.getElementById('bookBtn');
    }

    addEventListeners() {
        // Auth listeners
        this.loginBtn.addEventListener('click', () => this.toggleAuthModal());
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        
        // Zone listeners
        this.zoneBtns.forEach(btn => {
            btn.addEventListener('click', () => this.changeZone(btn.dataset.zone));
        });
        
        // Booking listeners
        this.timeSelect.addEventListener('change', () => this.updatePrice());
        this.bookBtn.addEventListener('click', () => this.handleBooking());
    }

    toggleAuthModal() {
        this.authModal.style.display = 
            this.authModal.style.display === 'none' ? 'block' : 'none';
    }

    async handleLogin(e) {
        e.preventDefault();
        // API call to login
        this.isLoggedIn = true;
        this.toggleAuthModal();
        this.updateUIForLoggedInUser();
    }

    async handleRegister(e) {
        e.preventDefault();
        // API call to register
    }

    changeZone(zoneName) {
        this.currentZone = zoneName;
        this.selectedComputer = null;
        this.updateZoneButtons();
        this.renderComputers();
        this.updateBookingPanel();
    }

    updateZoneButtons() {
        this.zoneBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.zone === this.currentZone);
        });
    }

    renderComputers() {
        this.computersGrid.innerHTML = '';
        const zone = this.zones[this.currentZone];
        
        for (let i = 1; i <= zone.capacity; i++) {
            const computer = document.createElement('div');
            computer.className = 'computer available';
            computer.dataset.id = i;
            computer.innerHTML = `
                <div class="computer-number">${i}</div>
                <div class="computer-status">Bo'sh</div>
            `;
            
            // Random computers as occupied (demo purpose)
            if (Math.random() < 0.3) {
                computer.className = 'computer occupied';
                computer.querySelector('.computer-status').textContent = 'Band';
            }
            
            computer.addEventListener('click', () => this.selectComputer(computer));
            this.computersGrid.appendChild(computer);
        }
    }

    selectComputer(computer) {
        if (computer.classList.contains('occupied')) return;
        
        if (this.selectedComputer) {
            this.selectedComputer.classList.remove('selected');
        }
        
        if (this.selectedComputer !== computer) {
            computer.classList.add('selected');
            this.selectedComputer = computer;
        } else {
            this.selectedComputer = null;
        }
        
        this.updateBookingPanel();
    }

    updateBookingPanel() {
        const zone = this.zones[this.currentZone];
        this.selectedZoneElement.textContent = this.selectedComputer ? 
            zone.name : '-';
        this.selectedPCElement.textContent = this.selectedComputer ? 
            this.selectedComputer.dataset.id : '-';
        
        this.updatePrice();
        this.bookBtn.disabled = !this.selectedComputer || !this.isLoggedIn;
    }

    updatePrice() {
        const hours = parseInt(this.timeSelect.value);
        const price = this.selectedComputer ? 
            hours * this.zones[this.currentZone].pricePerHour : 0;
        this.totalPriceElement.textContent = price.toLocaleString('uz-UZ');
    }

    async handleBooking() {
        if (!this.selectedComputer || !this.isLoggedIn) return;

        try {
            // API call to create booking
            const bookingData = {
                zone: this.currentZone,
                computerId: this.selectedComputer.dataset.id,
                hours: parseInt(this.timeSelect.value),
                price: parseInt(this.totalPriceElement.textContent.replace(/\D/g, ''))
            };

            // Simulate API call
            await this.createBooking(bookingData);

            // Update UI
            this.selectedComputer.classList.remove('selected');
            this.selectedComputer.classList.add('occupied');
            this.selectedComputer = null;
            this.updateBookingPanel();

            alert('Buyurtma muvaffaqiyatli yaratildi!');
        } catch (error) {
            alert('Xatolik yuz berdi. Qaytadan urinib ko'ring.');
        }
    }

    async createBooking(bookingData) {
        // Simulate API call
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    updateUIForLoggedInUser() {
        this.loginBtn.style.display = 'none';
        document.querySelector('.user-menu').classList.remove('hidden');
    }
}

// Initialize system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const system = new InternetCafeSystem();
});
