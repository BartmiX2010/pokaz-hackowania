// LuxMart - Premium E-commerce JavaScript

// ============================================
// DANE PRODUKTÓW
// ============================================
const products = [
    { id: 1, name: 'MacBook Pro 16"', category: 'electronics', price: 12999, oldPrice: 14999, rating: 4.9, reviews: 234, badge: 'Bestseller', icon: 'fa-laptop' },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'electronics', price: 6499, oldPrice: null, rating: 4.8, reviews: 567, badge: 'Nowość', icon: 'fa-mobile-alt' },
    { id: 3, name: 'Kurtka Skórzana Premium', category: 'fashion', price: 1299, oldPrice: 1899, rating: 4.7, reviews: 89, badge: 'Sale', icon: 'fa-tshirt' },
    { id: 4, name: 'Sony WH-1000XM5', category: 'electronics', price: 1699, oldPrice: null, rating: 4.9, reviews: 412, badge: null, icon: 'fa-headphones' },
    { id: 5, name: 'Zegarek Omega Seamaster', category: 'fashion', price: 24999, oldPrice: null, rating: 5.0, reviews: 45, badge: 'Premium', icon: 'fa-clock' },
    { id: 6, name: 'Sofa Modułowa Luxe', category: 'home', price: 8999, oldPrice: 10999, rating: 4.6, reviews: 78, badge: 'Sale', icon: 'fa-couch' },
    { id: 7, name: 'Rower Trek Domane', category: 'sport', price: 15999, oldPrice: null, rating: 4.8, reviews: 156, badge: null, icon: 'fa-bicycle' },
    { id: 8, name: 'iPad Pro 12.9"', category: 'electronics', price: 5999, oldPrice: 6999, rating: 4.9, reviews: 321, badge: 'Sale', icon: 'fa-tablet-alt' },
    { id: 9, name: 'Lampa Designer Milano', category: 'home', price: 2499, oldPrice: null, rating: 4.5, reviews: 67, badge: null, icon: 'fa-lightbulb' },
    { id: 10, name: 'Buty Nike Air Max', category: 'sport', price: 799, oldPrice: 999, rating: 4.7, reviews: 234, badge: 'Sale', icon: 'fa-shoe-prints' },
    { id: 11, name: 'Torebka Louis Vuitton', category: 'fashion', price: 8999, oldPrice: null, rating: 4.9, reviews: 123, badge: 'Premium', icon: 'fa-shopping-bag' },
    { id: 12, name: 'Ekspres Jura Z10', category: 'home', price: 11999, oldPrice: 13999, rating: 4.8, reviews: 89, badge: 'Sale', icon: 'fa-coffee' },
];

// ============================================
// ZMIENNE STANU
// ============================================
let cart = [];
let wishlist = [];
let currentUser = null;
let orders = [];
let users = []; // Baza użytkowników z hasłami

// ============================================
// ELEMENTY DOM
// ============================================
const DOM = {
    pages: document.querySelectorAll('.page'),
    navLinks: document.querySelectorAll('.nav-link'),
    mobileLinks: document.querySelectorAll('.mobile-link'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    loginBtn: document.getElementById('loginBtn'),
    heroRegisterBtn: document.getElementById('heroRegisterBtn'),
    profileLoginBtn: document.getElementById('profileLoginBtn'),
    authModal: document.getElementById('authModal'),
    modalClose: document.getElementById('modalClose'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    loginFormElement: document.getElementById('loginFormElement'),
    registerFormElement: document.getElementById('registerFormElement'),
    cartIcon: document.getElementById('cartIcon'),
    cartOverlay: document.getElementById('cartOverlay'),
    cartClose: document.getElementById('cartClose'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    cartCount: document.querySelector('.cart-count'),
    featuredProducts: document.getElementById('featuredProducts'),
    productsGrid: document.getElementById('productsGrid'),
    searchInput: document.getElementById('searchInput'),
    categoryFilter: document.getElementById('categoryFilter'),
    sortFilter: document.getElementById('sortFilter'),
    userMenuItems: document.querySelectorAll('.user-menu-item'),
    userTabs: document.querySelectorAll('.user-tab'),
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    logoutBtn: document.getElementById('logoutBtn'),
    profileInfo: document.getElementById('profileInfo'),
    ordersList: document.getElementById('ordersList'),
    wishlistGrid: document.getElementById('wishlistGrid'),
    toastContainer: document.getElementById('toastContainer'),
    passwordInputs: document.querySelectorAll('.toggle-password'),
    registerPassword: document.getElementById('registerPassword'),
    passwordStrength: document.getElementById('passwordStrength'),
    checkoutModal: document.getElementById('checkoutModal'),
    checkoutModalClose: document.getElementById('checkoutModalClose'),
    checkoutTabs: document.querySelectorAll('#checkoutModal .tab-btn'),
    checkoutTabContents: document.querySelectorAll('.checkout-tab-content'),
    guestCheckoutForm: document.getElementById('guestCheckoutForm'),
    checkoutToLoginBtn: document.getElementById('checkoutToLoginBtn'),
};

// ============================================
// INICJALIZACJA
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderFeaturedProducts();
    renderProducts();
    setupEventListeners();
    updateCartUI();
    updateUserUI();
    checkPaymentReturn();
});

// ============================================
// LOCAL STORAGE
// ============================================
function loadFromStorage() {
    const savedCart = localStorage.getItem('luxmart_cart');
    const savedWishlist = localStorage.getItem('luxmart_wishlist');
    const savedUser = localStorage.getItem('luxmart_user');
    const savedOrders = localStorage.getItem('luxmart_orders');
    const savedUsers = localStorage.getItem('luxmart_users');

    if (savedCart) cart = JSON.parse(savedCart);
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
    if (savedUser) currentUser = JSON.parse(savedUser);
    if (savedOrders) orders = JSON.parse(savedOrders);
    if (savedUsers) users = JSON.parse(savedUsers);
}

function saveToStorage() {
    localStorage.setItem('luxmart_cart', JSON.stringify(cart));
    localStorage.setItem('luxmart_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('luxmart_user', JSON.stringify(currentUser));
    localStorage.setItem('luxmart_orders', JSON.stringify(orders));
    localStorage.setItem('luxmart_users', JSON.stringify(users));
}

// ============================================
// EVENTY
// ============================================
function setupEventListeners() {
    // Nawigacja
    [...DOM.navLinks, ...DOM.mobileLinks].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
            DOM.mobileMenu.classList.remove('active');
        });
    });

    // Przyciski hero
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.tagName === 'BUTTON') {
                navigateTo(btn.dataset.page);
            }
        });
    });

    // Mobile menu
    DOM.mobileMenuBtn.addEventListener('click', () => {
        DOM.mobileMenu.classList.toggle('active');
    });

    // Modal logowania
    DOM.loginBtn.addEventListener('click', openAuthModal);
    DOM.heroRegisterBtn?.addEventListener('click', () => {
        openAuthModal();
        switchToRegister();
    });
    DOM.profileLoginBtn?.addEventListener('click', openAuthModal);
    DOM.modalClose.addEventListener('click', closeAuthModal);
    DOM.authModal.addEventListener('click', (e) => {
        if (e.target === DOM.authModal) closeAuthModal();
    });

    // Przełączanie formularzy
    DOM.showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        switchToRegister();
    });
    DOM.showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchToLogin();
    });

    // Formularze
    DOM.loginFormElement.addEventListener('submit', handleLogin);
    DOM.registerFormElement.addEventListener('submit', handleRegister);

    // Koszyk
    DOM.cartIcon.addEventListener('click', openCart);
    DOM.cartClose.addEventListener('click', closeCart);
    DOM.cartOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.cartOverlay) closeCart();
    });

    // Filtry produktów
    DOM.searchInput.addEventListener('input', filterProducts);
    DOM.categoryFilter.addEventListener('change', filterProducts);
    DOM.sortFilter.addEventListener('change', filterProducts);

    // Menu użytkownika
    DOM.userMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchUserTab(tab);
        });
    });

    // Wylogowanie
    DOM.logoutBtn.addEventListener('click', handleLogout);

    // Toggle hasła
    DOM.passwordInputs.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Siła hasła
    DOM.registerPassword?.addEventListener('input', checkPasswordStrength);

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Checkout Modal Events
    DOM.checkoutModalClose.addEventListener('click', () => {
        DOM.checkoutModal.classList.remove('active');
    });

    DOM.checkoutTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            DOM.checkoutTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            DOM.checkoutTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${target}CheckoutTab`) content.classList.add('active');
            });
        });
    });

    DOM.checkoutToLoginBtn.addEventListener('click', () => {
        DOM.checkoutModal.classList.remove('active');
        openAuthModal();
    });

    DOM.guestCheckoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestData = {
            firstName: document.getElementById('guestFirstName').value,
            lastName: document.getElementById('guestLastName').value,
            email: document.getElementById('guestEmail').value,
            address: document.getElementById('guestAddress').value
        };
        handleGuestCheckout(guestData);
    });
}

// ============================================
// NAWIGACJA
// ============================================
function navigateTo(page) {
    DOM.pages.forEach(p => p.classList.remove('active'));
    DOM.navLinks.forEach(l => l.classList.remove('active'));

    document.getElementById(`${page}Page`).classList.add('active');
    document.querySelector(`.nav-link[data-page="${page}"]`)?.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// PRODUKTY
// ============================================
function createProductCard(product) {
    const inWishlist = wishlist.includes(product.id);
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    return `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<span class="product-badge ${product.badge === 'Sale' ? 'sale' : ''}">${product.badge}</span>` : ''}
            <button class="product-wishlist ${inWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                <i class="fas fa-heart"></i>
            </button>
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                        Do koszyka
                    </button>
                    <button class="btn-quick-view" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderFeaturedProducts() {
    const featured = products.filter(p => p.badge).slice(0, 4);
    DOM.featuredProducts.innerHTML = featured.map(createProductCard).join('');
}

function renderProducts(filteredProducts = products) {
    DOM.productsGrid.innerHTML = filteredProducts.map(createProductCard).join('');
}

function filterProducts() {
    const search = DOM.searchInput.value.toLowerCase();
    const category = DOM.categoryFilter.value;
    const sort = DOM.sortFilter.value;

    let filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search);
        const matchesCategory = category === 'all' || p.category === category;
        return matchesSearch && matchesCategory;
    });

    switch (sort) {
        case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
        case 'newest': filtered.sort((a, b) => b.id - a.id); break;
        default: filtered.sort((a, b) => b.reviews - a.reviews);
    }

    renderProducts(filtered);
}

function getCategoryName(cat) {
    const names = { electronics: 'Elektronika', fashion: 'Moda', home: 'Dom', sport: 'Sport' };
    return names[cat] || cat;
}

function formatPrice(price) {
    return price.toLocaleString('pl-PL') + ' zł';
}

// ============================================
// KOSZYK
// ============================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveToStorage();
    updateCartUI();
    showToast('Dodano do koszyka!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToStorage();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) removeFromCart(productId);
        else { saveToStorage(); updateCartUI(); }
    }
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    DOM.cartCount.textContent = count;
    DOM.cartTotal.textContent = formatPrice(total);

    if (cart.length === 0) {
        DOM.cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Twój koszyk jest pusty</p>
            </div>
        `;
    } else {
        DOM.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="cart-item-image">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function openCart() { DOM.cartOverlay.classList.add('active'); }
function closeCart() { DOM.cartOverlay.classList.remove('active'); }

// ============================================
// WISHLIST
// ============================================
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Usunięto z ulubionych', 'success');
    } else {
        wishlist.push(productId);
        showToast('Dodano do ulubionych!', 'success');
    }
    saveToStorage();
    renderProducts();
    renderFeaturedProducts();
    updateWishlistUI();
}

function updateWishlistUI() {
    if (wishlist.length === 0) {
        DOM.wishlistGrid.innerHTML = `
            <div class="info-placeholder">
                <i class="fas fa-heart-broken"></i>
                <p>Nie masz jeszcze ulubionych produktów</p>
            </div>
        `;
    } else {
        const wishlistProducts = products.filter(p => wishlist.includes(p.id));
        DOM.wishlistGrid.innerHTML = wishlistProducts.map(p => `
            <div class="wishlist-item">
                <button class="wishlist-remove" onclick="toggleWishlist(${p.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="wishlist-image"><i class="fas ${p.icon}"></i></div>
                <div class="wishlist-name">${p.name}</div>
                <div class="wishlist-price">${formatPrice(p.price)}</div>
            </div>
        `).join('');
    }
}

// ============================================
// AUTENTYKACJA
// ============================================
function openAuthModal() {
    DOM.authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    DOM.authModal.classList.remove('active');
    document.body.style.overflow = '';
}

function switchToRegister() {
    DOM.loginForm.classList.remove('active');
    DOM.registerForm.classList.add('active');
}

function switchToLogin() {
    DOM.registerForm.classList.remove('active');
    DOM.loginForm.classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.toLowerCase().trim();
    const password = document.getElementById('loginPassword').value;

    // Sprawdź czy użytkownik istnieje w bazie
    const user = users.find(u => u.email === email);

    if (!user) {
        showToast('Użytkownik nie istnieje!', 'error');
        return;
    }

    if (user.password !== password) {
        showToast('Nieprawidłowe hasło!', 'error');
        return;
    }

    // Załaduj zamówienia użytkownika
    const userOrders = localStorage.getItem(`luxmart_orders_${email}`);
    orders = userOrders ? JSON.parse(userOrders) : [];

    // Ustaw aktualnego użytkownika (bez hasła w aktywnej sesji)
    currentUser = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address
    };

    saveToStorage();
    updateUserUI();
    closeAuthModal();
    showToast('Zalogowano pomyślnie!', 'success');
    DOM.loginFormElement.reset();
}

function handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById('registerFirstName').value.trim();
    const lastName = document.getElementById('registerLastName').value.trim();
    const email = document.getElementById('registerEmail').value.toLowerCase().trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Walidacja
    if (!firstName || !lastName || !email || !password) {
        showToast('Wypełnij wszystkie pola!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Hasła się nie zgadzają!', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Hasło musi mieć min. 6 znaków!', 'error');
        return;
    }

    // Sprawdź czy użytkownik już istnieje
    if (users.find(u => u.email === email)) {
        showToast('Użytkownik o tym emailu już istnieje!', 'error');
        return;
    }

    // Dodaj nowego użytkownika do bazy
    const newUser = {
        email,
        password, // W prawdziwej aplikacji hasło byłoby zahashowane!
        firstName,
        lastName,
        phone: '',
        address: '',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    orders = [];

    // Ustaw aktualnego użytkownika
    currentUser = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        address: newUser.address
    };

    saveToStorage();
    updateUserUI();
    closeAuthModal();
    showToast('Konto utworzone pomyślnie!', 'success');
    DOM.registerFormElement.reset();
}

function handleLogout() {
    // Zapisz zamówienia użytkownika przed wylogowaniem
    if (currentUser) {
        localStorage.setItem(`luxmart_orders_${currentUser.email}`, JSON.stringify(orders));
    }

    currentUser = null;
    orders = [];
    saveToStorage();
    updateUserUI();
    showToast('Wylogowano pomyślnie', 'success');
}

function updateUserUI() {
    if (currentUser) {
        DOM.userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        DOM.userEmail.textContent = currentUser.email;
        DOM.logoutBtn.style.display = 'flex';
        DOM.loginBtn.innerHTML = '<i class="fas fa-user"></i><span>' + currentUser.firstName + '</span>';

        DOM.profileInfo.innerHTML = `
            <div class="profile-details">
                <div class="profile-row">
                    <div class="profile-field">
                        <label><i class="fas fa-user"></i> Imię</label>
                        <p>${currentUser.firstName}</p>
                    </div>
                    <div class="profile-field">
                        <label><i class="fas fa-user"></i> Nazwisko</label>
                        <p>${currentUser.lastName}</p>
                    </div>
                </div>
                <div class="profile-row">
                    <div class="profile-field">
                        <label><i class="fas fa-envelope"></i> Email</label>
                        <p>${currentUser.email}</p>
                    </div>
                    <div class="profile-field">
                        <label><i class="fas fa-phone"></i> Telefon</label>
                        <p>${currentUser.phone || 'Nie podano'}</p>
                    </div>
                </div>
                <div class="profile-field">
                    <label><i class="fas fa-map-marker-alt"></i> Adres</label>
                    <p>${currentUser.address || 'Nie podano'}</p>
                </div>
            </div>
        `;

        updateOrdersUI();
        updateWishlistUI();
    } else {
        DOM.userName.textContent = 'Gość';
        DOM.userEmail.textContent = 'Zaloguj się, aby zobaczyć';
        DOM.logoutBtn.style.display = 'none';
        DOM.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Zaloguj się</span>';

        DOM.profileInfo.innerHTML = `
            <div class="info-placeholder">
                <i class="fas fa-user-lock"></i>
                <p>Zaloguj się, aby zobaczyć swój profil</p>
                <button class="btn-primary" onclick="openAuthModal()">
                    <i class="fas fa-sign-in-alt"></i>
                    Zaloguj się
                </button>
            </div>
        `;
    }
}

function updateOrdersUI() {
    if (orders.length === 0) {
        DOM.ordersList.innerHTML = `
            <div class="info-placeholder">
                <i class="fas fa-shopping-basket"></i>
                <p>Brak zamówień do wyświetlenia</p>
            </div>
        `;
    } else {
        DOM.ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-status ${order.status}">${getStatusName(order.status)}</span>
                </div>
                <div class="order-items">
                    ${order.items.slice(0, 3).map(item => `
                        <div class="order-item-img"><i class="fas ${item.icon}"></i></div>
                    `).join('')}
                    ${order.items.length > 3 ? `<div class="order-item-img">+${order.items.length - 3}</div>` : ''}
                </div>
                <div class="order-footer">
                    <span class="order-date">${order.date}</span>
                    <span class="order-total">${formatPrice(order.total)}</span>
                </div>
            </div>
        `).join('');
    }
}

function getStatusName(status) {
    const names = { delivered: 'Dostarczono', processing: 'W realizacji', pending: 'Oczekuje' };
    return names[status] || status;
}

function switchUserTab(tab) {
    DOM.userMenuItems.forEach(i => i.classList.remove('active'));
    DOM.userTabs.forEach(t => t.classList.remove('active'));

    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}Tab`).classList.add('active');
}

function checkPasswordStrength() {
    const password = DOM.registerPassword.value;
    const strength = DOM.passwordStrength;

    strength.classList.remove('weak', 'medium', 'strong');

    if (password.length < 6) {
        strength.classList.add('weak');
        strength.querySelector('.strength-text').textContent = 'Słabe hasło';
    } else if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        strength.classList.add('medium');
        strength.querySelector('.strength-text').textContent = 'Średnie hasło';
    } else {
        strength.classList.add('strong');
        strength.querySelector('.strength-text').textContent = 'Silne hasło';
    }
}

// ============================================
// CHECKOUT
// ============================================
function handleCheckout() {
    if (cart.length === 0) {
        showToast('Koszyk jest pusty!', 'error');
        return;
    }

    if (!currentUser) {
        DOM.checkoutModal.classList.add('active');
        return;
    }

    processOrder(currentUser);
}

function handleGuestCheckout(guestData) {
    processOrder(guestData, true);
}

function processOrder(userData, isGuest = false) {
    const orderId = 'ORD' + Date.now();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
        id: orderId,
        items: [...cart],
        total: total,
        date: new Date().toLocaleDateString('pl-PL'),
        status: 'pending'
    };

    if (!isGuest) {
        orders.unshift(order);
        localStorage.setItem(`luxmart_orders_${userData.email}`, JSON.stringify(orders));
        saveToStorage();
    }

    // Zapisz dane tymczasowe dla powrotu (symulacja)
    localStorage.setItem('luxmart_pending_cart', JSON.stringify(cart));
    localStorage.setItem('luxmart_pending_order', orderId);

    closeCart();
    DOM.checkoutModal.classList.remove('active');

    const paymentData = {
        orderId: orderId,
        amount: total,
        userEmail: userData.email,
        isGuest: isGuest
    };

    const randomBank = Math.random() > 0.3 ? 'bank.html' : 'realbank.html';

    showToast('Przekierowywanie do płatności...', 'success');
    setTimeout(() => {
        window.location.href = `${randomBank}?data=${encodeURIComponent(JSON.stringify(paymentData))}`;
    }, 1000);
}

// ============================================
// PŁATNOŚCI
// ============================================
function handleBankReturn(orderId, status) {
    const pendingCart = JSON.parse(localStorage.getItem('luxmart_pending_cart'));
    const pendingOrderId = localStorage.getItem('luxmart_pending_order');

    if (pendingOrderId === orderId && currentUser) {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            if (status === 'success') {
                orders[orderIndex].status = 'processing'; // Płatność udana, zamówienie w realizacji
                cart = []; // Wyczyść koszyk po udanej płatności
                showToast('Płatność zakończona sukcesem! Twoje zamówienie jest w realizacji.', 'success');
            } else {
                orders[orderIndex].status = 'pending'; // Płatność nieudana, zamówienie nadal oczekuje
                cart = pendingCart || []; // Przywróć koszyk, jeśli płatność nieudana
                showToast('Płatność nieudana. Spróbuj ponownie lub skontaktuj się z obsługą.', 'error');
            }
            saveToStorage();
            updateCartUI();
            updateOrdersUI();
            navigateTo('user');
            switchUserTab('orders');
        }
    } else if (status === 'cancel') {
        // Jeśli użytkownik anulował płatność, ale nie było pendingOrderId lub currentUser
        // Możemy po prostu przywrócić koszyk, jeśli był zapisany
        if (pendingCart) {
            cart = pendingCart;
            saveToStorage();
            updateCartUI();
        }
        showToast('Płatność anulowana.', 'warning');
    }

    // Zawsze czyść tymczasowe dane po powrocie z banku
    localStorage.removeItem('luxmart_pending_cart');
    localStorage.removeItem('luxmart_pending_order');
}

function checkUrlParamsForPayment() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    const paymentStatus = urlParams.get('status');

    if (orderId && paymentStatus) {
        handleBankReturn(orderId, paymentStatus);
        // Usuń parametry z URL, aby odświeżenie strony nie wywołało ponownie logiki płatności
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// ============================================
// TOAST
// ============================================
function showToast(message, type = 'success') {
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span class="toast-message">${message}</span>
        <span class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </span>
    `;

    DOM.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ============================================
// QUICK VIEW
// ============================================
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    showToast(`Podgląd: ${product.name}`, 'success');
}

// ============================================
// KONSOLA ZARZĄDZANIA (DEV TOOLS)
// ============================================
// Dodaj do konsoli przeglądarki funkcje do sprawdzania danych
window.LuxMartAdmin = {
    // Pokaż wszystkich użytkowników
    showUsers: () => {
        console.table(users.map(u => ({
            email: u.email,
            imię: u.firstName,
            nazwisko: u.lastName,
            data_utworzenia: u.createdAt
        })));
        console.log('💡 Aby zobaczyć hasła: LuxMartAdmin.showUsersWithPasswords()');
    },

    // Pokaż użytkowników z hasłami (tylko dla admina!)
    showUsersWithPasswords: () => {
        console.table(users);
        console.warn('⚠️ W prawdziwej aplikacji hasła byłyby zahashowane!');
    },

    // Pokaż zamówienia aktualnego użytkownika
    showOrders: () => {
        if (!currentUser) {
            console.warn('Nie jesteś zalogowany!');
            return;
        }
        console.table(orders);
    },

    // Pokaż wszystkie dane w localStorage
    showStorage: () => {
        console.group('📦 LocalStorage LuxMart');
        console.log('Koszyk:', cart);
        console.log('Ulubione:', wishlist);
        console.log('Aktualny użytkownik:', currentUser);
        console.log('Zamówienia:', orders);
        console.log('Liczba użytkowników:', users.length);
        console.groupEnd();
    },

    // Wyczyść wszystkie dane
    clearAll: () => {
        if (confirm('Czy na pewno chcesz usunąć wszystkie dane?')) {
            localStorage.clear();
            cart = [];
            wishlist = [];
            currentUser = null;
            orders = [];
            users = [];
            location.reload();
        }
    },

    // Utwórz testowego użytkownika
    createTestUser: () => {
        const testUser = {
            email: 'test@luxmart.pl',
            password: 'test123',
            firstName: 'Test',
            lastName: 'Użytkownik',
            phone: '+48 500 500 500',
            address: 'ul. Testowa 1, 00-000 Warszawa',
            createdAt: new Date().toISOString()
        };

        if (users.find(u => u.email === testUser.email)) {
            console.warn('Użytkownik testowy już istnieje!');
        } else {
            users.push(testUser);
            saveToStorage();
            console.log('✅ Utworzono użytkownika testowego:');
            console.log('Email: test@luxmart.pl');
            console.log('Hasło: test123');
        }
    }
};

console.log('%c🎉 LuxMart Admin Panel', 'font-size: 20px; font-weight: bold; color: #7c3aed;');
console.log('%cDostępne komendy:', 'font-weight: bold; color: #a855f7;');
console.log('LuxMartAdmin.showUsers() - Pokaż użytkowników');
console.log('LuxMartAdmin.showUsersWithPasswords() - Pokaż użytkowników z hasłami');
console.log('LuxMartAdmin.showOrders() - Pokaż zamówienia');
console.log('LuxMartAdmin.showStorage() - Pokaż wszystkie dane');
console.log('LuxMartAdmin.createTestUser() - Utwórz użytkownika testowego');
console.log('LuxMartAdmin.clearAll() - Wyczyść wszystkie dane');

// ============================================
// SPRAWDZANIE POWROTU Z PŁATNOŚCI
// ============================================
function checkPaymentReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const orderId = urlParams.get('order');

    if (paymentStatus === 'success' && orderId) {
        const pendingOrderId = localStorage.getItem('luxmart_pending_order');

        if (pendingOrderId === orderId && currentUser) {
            // Znajdź zamówienie i zaktualizuj status
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex !== -1) {
                orders[orderIndex].status = 'processing';
                localStorage.setItem(`luxmart_orders_${currentUser.email}`, JSON.stringify(orders));
            }

            // Wyczyść koszyk
            cart = [];
            saveToStorage();
            updateCartUI();
            updateOrdersUI();

            // Wyczyść dane tymczasowe
            localStorage.removeItem('luxmart_pending_cart');
            localStorage.removeItem('luxmart_pending_order');

            // Pokaż sukces i przejdź do zamówień
            showToast('Płatność zakończona sukcesem!', 'success');
            navigateTo('user');
            switchUserTab('orders');
        }

        // Wyczyść parametry URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
