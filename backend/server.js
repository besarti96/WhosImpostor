// server.js
const express = require('express');
const cors = require('cors');  // CORS importieren
const app = express();
const PORT = process.env.PORT || 3000;

// CORS aktivieren
app.use(cors());
app.use(express.json());

// Basisroute definieren
app.get('/', (req, res) => {
    res.send('Backend is running.');
});

// POST /create-room: Erstellt einen neuen Spielraum
app.post('/create-room', (req, res) => {
    // Generiere einen zufälligen, 6-stelligen Raumcode (Buchstaben und Zahlen)
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Sende den generierten Raumcode als JSON zurück
    res.json({ roomCode });
});


// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
