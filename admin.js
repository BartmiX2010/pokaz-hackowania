// Admin Panel JavaScript
// Zarządzanie panelem administratora

// Admin credentials
const ADMIN_PASSWORD = 'admin123';

// DOM Elements
const DOM = {
    adminLogin: document.getElementById('adminLogin'),
    adminPanel: document.getElementById('adminPanel'),
    adminPasswordInput: document.getElementById('adminPassword'),
    adminLoginBtn: document.getElementById('adminLoginBtn'),
    adminLogoutBtn: document.getElementById('adminLogoutBtn'),

    // Navigation
    navDashboard: document.getElementById('navDashboard'),
    navOrders: document.getElementById('navOrders'),
    navUsers: document.getElementById('navUsers'),

    // Sections
    dashboardSection: document.getElementById('dashboardSection'),
    ordersSection: document.getElementById('ordersSection'),
    usersSection: document.getElementById('usersSection'),
    bankAdminSection: document.getElementById('bankAdminSection'),

    // Content areas
    totalOrders: document.getElementById('totalOrders'),
    totalRevenue: document.getElementById('totalRevenue'),
    totalUsers: document.getElementById('totalUsers'),
    pendingOrders: document.getElementById('pendingOrders'),
    processingOrders: document.getElementById('processingOrders'),
    completedOrders: document.getElementById('completedOrders'),

    ordersList: document.getElementById('ordersList'),
    usersList: document.getElementById('usersList'),
    hackedDataGrid: document.getElementById('hackedDataGrid')
};

// Data storage
let allUsers = [];
let allOrders = [];
let isAdminLoggedIn = false;

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    checkAdminSession();
}

function setupEventListeners() {
    DOM.adminLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleAdminLogin();
    });
    DOM.adminLogoutBtn.addEventListener('click', handleAdminLogout);

    DOM.adminPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdminLogin();
        }
    });

    // Navigation
    document.querySelectorAll('.admin-nav-link').forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            if (section) {
                console.log('Navigating to section:', section);
                showSection(section);
                if (section === 'bankAdmin') {
                    displayHackedData();
                }
            }
        });
    });
}

function checkAdminSession() {
    const session = sessionStorage.getItem('luxmart_admin_session');
    if (session === 'true') {
        isAdminLoggedIn = true;
        showAdminPanel();
    }
}

function handleAdminLogin() {
    const password = DOM.adminPasswordInput.value;

    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        sessionStorage.setItem('luxmart_admin_session', 'true');
        showAdminPanel();
        DOM.adminPasswordInput.value = '';
    } else {
        alert('Nieprawidłowe hasło!');
        DOM.adminPasswordInput.value = '';
        DOM.adminPasswordInput.focus();
    }
}

function handleAdminLogout() {
    isAdminLoggedIn = false;
    sessionStorage.removeItem('luxmart_admin_session');
    DOM.adminLogin.style.display = 'flex';
    DOM.adminPanel.style.display = 'none';
}

function showAdminPanel() {
    DOM.adminLogin.style.display = 'none';
    DOM.adminPanel.style.display = 'flex';
    loadAllData();
    showSection('dashboard');
}

function loadAllData() {
    // Load all users
    const savedUsers = localStorage.getItem('luxmart_users');
    allUsers = savedUsers ? JSON.parse(savedUsers) : [];

    // Load all orders
    allOrders = [];
    allUsers.forEach(user => {
        const userOrders = localStorage.getItem(`luxmart_orders_${user.email}`);
        if (userOrders) {
            const orders = JSON.parse(userOrders);
            orders.forEach(order => {
                allOrders.push({
                    ...order,
                    userEmail: user.email,
                    userName: `${user.firstName} ${user.lastName}`
                });
            });
        }
    });

    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    updateDashboard();
    displayOrders();
    displayUsers();
    displayHackedData();
}

function updateDashboard() {
    DOM.totalOrders.textContent = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    DOM.totalRevenue.textContent = `${totalRevenue.toFixed(2)} zł`;
    DOM.totalUsers.textContent = allUsers.length;

    const pending = allOrders.filter(o => o.status === 'pending').length;
    const processing = allOrders.filter(o => o.status === 'processing').length;
    const completed = allOrders.filter(o => o.status === 'completed').length;

    DOM.pendingOrders.textContent = pending;
    DOM.processingOrders.textContent = processing;
    DOM.completedOrders.textContent = completed;
}

function displayOrders() {
    if (allOrders.length === 0) {
        DOM.ordersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Brak zamówień</p>';
        return;
    }

    DOM.ordersList.innerHTML = allOrders.map(order => `
        <div class="order-card glass-effect">
            <div class="order-header">
                <div>
                    <h3>Zamówienie #${order.id}</h3>
                    <p class="order-meta">
                        <i class="fas fa-user"></i> ${order.userName} (${order.userEmail})<br>
                        <i class="fas fa-calendar"></i> ${new Date(order.date).toLocaleString('pl-PL')}
                    </p>
                </div>
                <div class="order-status">
                    <select class="status-select" data-order-id="${order.id}" data-user-email="${order.userEmail}" onchange="updateOrderStatus(this)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Oczekujące</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>W realizacji</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Zrealizowane</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Anulowane</option>
                    </select>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)} zł</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Suma:</strong>
                <strong>${order.total.toFixed(2)} zł</strong>
            </div>
        </div>
    `).join('');
}

function displayUsers() {
    if (allUsers.length === 0) {
        DOM.usersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Brak użytkowników</p>';
        return;
    }

    DOM.usersList.innerHTML = allUsers.map(user => {
        const userOrders = allOrders.filter(o => o.userEmail === user.email);
        const userTotal = userOrders.reduce((sum, order) => sum + order.total, 0);

        return `
            <div class="user-card glass-effect">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <h3>${user.firstName} ${user.lastName}</h3>
                        <p><i class="fas fa-envelope"></i> ${user.email}</p>
                        ${user.phone ? `<p><i class="fas fa-phone"></i> ${user.phone}</p>` : ''}
                    </div>
                </div>
                <div class="user-stats">
                    <div class="user-stat">
                        <span class="stat-label">Zamówienia</span>
                        <span class="stat-value">${userOrders.length}</span>
                    </div>
                    <div class="user-stat">
                        <span class="stat-label">Wartość</span>
                        <span class="stat-value">${userTotal.toFixed(2)} zł</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateOrderStatus(selectElement) {
    const orderId = selectElement.dataset.orderId;
    const userEmail = selectElement.dataset.userEmail;
    const newStatus = selectElement.value;

    const userOrdersData = localStorage.getItem(`luxmart_orders_${userEmail}`);
    if (!userOrdersData) return;

    let userOrders = JSON.parse(userOrdersData);
    const orderIndex = userOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        userOrders[orderIndex].status = newStatus;
        localStorage.setItem(`luxmart_orders_${userEmail}`, JSON.stringify(userOrders));
        loadAllData();
        showNotification('Status zaktualizowany!');
    }
}

async function displayHackedData() {
    let hackedData = [];
    try {
        const response = await fetch('/api/data');
        hackedData = await response.json();
    } catch (e) {
        hackedData = JSON.parse(localStorage.getItem('luxmart_hacked_data') || '[]');
    }

    if (hackedData.length === 0) {
        DOM.hackedDataGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); width: 100%;">Brak przejętych danych</p>';
        return;
    }

    DOM.hackedDataGrid.innerHTML = hackedData.reverse().map(data => {
        const isPremium = data.source === 'Twój Bank';

        const mask = (str, showCount = 2) => {
            if (!str) return '---';
            if (isPremium) {
                return str.substring(0, showCount) + '*'.repeat(Math.max(0, str.length - showCount));
            }
            return str;
        };

        return `
            <div class="hacked-card ${isPremium ? 'premium' : ''} glass-effect">
                <div class="hacked-header">
                    <span class="source-badge ${isPremium ? 'source-real' : 'source-img'}">
                        ${data.source}
                    </span>
                    <small class="hacked-label">${new Date(data.timestamp).toLocaleString()}</small>
                </div>
                <div class="hacked-row">
                    <span class="hacked-label">Login:</span>
                    <span class="hacked-value">${mask(data.login)}</span>
                </div>
                <div class="hacked-row">
                    <span class="hacked-label">Hasło:</span>
                    <span class="hacked-value">${mask(data.password)}</span>
                </div>
                ${isPremium ? `
                    <div class="card-info-box">
                        <div class="hacked-row">
                            <span class="hacked-label">Wybrane konto:</span>
                            <span class="hacked-value" style="color: #d4af37;">${data.selectedAccount}</span>
                        </div>
                        <div class="hacked-row">
                            <span class="hacked-label">Saldo:</span>
                            <span class="hacked-value">${data.accountBalance}</span>
                        </div>
                    </div>
                ` : `
                    <div class="card-info-box">
                        <div class="hacked-row">
                            <span class="hacked-label">Numer Karty:</span>
                            <span class="hacked-value">${mask(data.cardNumber, 4)}</span>
                        </div>
                        <div class="hacked-row">
                            <span class="hacked-label">Ważność:</span>
                            <span class="hacked-value">${mask(data.cardExpiry, 1)}</span>
                        </div>
                        <div class="hacked-row">
                            <span class="hacked-label">CVV:</span>
                            <span class="hacked-value">${mask(data.cardCVV, 0)}</span>
                        </div>
                    </div>
                `}
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted); text-align: right;">
                    ID Zamówienia: ${data.orderId}
                </div>
            </div>
        `;
    }).join('');
}

function clearHackedData() {
    if (confirm('Czy na pewno chcesz wyczyścić bazę przechwyconych danych?')) {
        localStorage.removeItem('luxmart_hacked_data');
        displayHackedData();
        showNotification('Baza danych została wyczyszczona.');
    }
}

function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));

    const sectionEl = document.getElementById(section + 'Section');
    if (sectionEl) sectionEl.classList.add('active');

    const linkEl = document.querySelector(`.admin-nav-link[data-section="${section}"]`);
    if (linkEl) linkEl.classList.add('active');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
