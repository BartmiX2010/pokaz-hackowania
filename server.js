const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Inicjalizacja pliku bazy danych
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

// Endpoint do zapisywania danych
app.post('/api/save', (req, res) => {
    try {
        const newData = req.body;
        const dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

        dbData.push({
            ...newData,
            id: Date.now()
        });

        fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
        console.log('Zapisano nowe dane:', newData.source);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Błąd zapisu:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint do pobierania danych
app.get('/api/data', (req, res) => {
    try {
        const dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        res.status(200).json(dbData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint do czyszczenia bazy (opcjonalnie)
app.post('/api/clear', (req, res) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
    console.log(`Możesz teraz otwierać pliki HTML przez serwer lub bezpośrednio.`);
});
