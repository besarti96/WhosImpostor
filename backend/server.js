// server.js
const express = require('express');
const cors = require('cors');  // CORS importieren
// Alle Räume werden in diesem Objekt gespeichert
const rooms = {};
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
// POST /create-room: Erstellt einen neuen Spielraum
app.post('/create-room', (req, res) => {
    // Generiere einen zufälligen, 6-stelligen Raumcode (Buchstaben und Zahlen)
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Speichere einen neuen Raum mit einem leeren Array für Spieler
    rooms[roomCode] = { players: [] };
    
    // Sende den generierten Raumcode als JSON zurück
    res.json({ roomCode });
});
// POST /join-room: Ermöglicht das Beitreten zu einem vorhandenen Raum
app.post('/join-room', (req, res) => {
    const { roomCode, playerName } = req.body;
    
    // Überprüfe, ob der Raum existiert
    if (!rooms[roomCode]) {
        return res.status(404).json({ error: "Raum nicht gefunden" });
    }
    
    // Füge den Spieler hinzu, sofern er noch nicht drin ist
    if (!rooms[roomCode].players.includes(playerName)) {
        rooms[roomCode].players.push(playerName);
    }
    
    // Sende als Antwort eine Bestätigung und die Liste der Spieler
    res.json({ message: "Erfolgreich beigetreten", players: rooms[roomCode].players });
});




// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
