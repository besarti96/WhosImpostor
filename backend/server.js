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

// POST /start-game: Startet das Spiel, weist einen zufälligen Impostor zu und verteilt das Thema an alle anderen Spieler
app.post('/start-game', (req, res) => {
    const { roomCode, theme } = req.body;
    
    // Überprüfen, ob der Raum existiert
    if (!rooms[roomCode]) {
        return res.status(404).json({ error: "Raum nicht gefunden" });
    }
    
    const players = rooms[roomCode].players;
    // Für einen sinnvollen Spielverlauf sollten mindestens 3 Spieler beitreten
    if (players.length < 3) {
        return res.status(400).json({ error: "Es werden mindestens 3 Spieler benötigt, um das Spiel zu starten." });
    }
    
    // Wähle zufällig einen Impostor
    const impostorIndex = Math.floor(Math.random() * players.length);
    
    // Erzeuge ein Rollen-Array, das für jeden Spieler seine Rolle enthält:
    // - Der ausgewählte Impostor erhält nur "impostor" als Rolle.
    // - Alle übrigen erhalten "player" und das gewählte Theme.
    const roles = players.map((player, index) => {
        if (index === impostorIndex) {
            return { player, role: 'impostor' };
        } else {
            return { player, role: 'player', theme: theme };
        }
    });
    
    // Speichere die Rollenzuweisung im Raum (optional für spätere Logik)
    rooms[roomCode].roles = roles;
    
    // ACHTUNG: In einem echten Spiel sollte die Information über die Rollen (vor allem der Impostor-Status)
    // geheim bleiben und nur individuell an die jeweiligen Spieler gesendet werden.
    // Hier senden wir alle Rollen als Demonstration zurück.
    res.json({ message: "Spiel gestartet", roles });
});



// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
