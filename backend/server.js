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

    // POST /buzz: Startet die Abstimmungsphase, indem Votes im Raum initialisiert werden
app.post('/buzz', (req, res) => {
    const { roomCode } = req.body;

    if (!rooms[roomCode]) {
        return res.status(404).json({ error: "Raum nicht gefunden" });
    }

    // Initialisiere einen leeren Votes-Container im Raum
    rooms[roomCode].votes = {};
    res.json({ message: "Voting phase started. Please submit your votes using the /vote endpoint." });
});

// POST /vote: Ein Spieler gibt ab, wen er verdächtigt
app.post('/vote', (req, res) => {
    const { roomCode, voterName, suspectName } = req.body;

    if (!rooms[roomCode]) {
        return res.status(404).json({ error: "Raum nicht gefunden" });
    }

    // Überprüfen, ob die Voting-Phase gestartet wurde
    if (!rooms[roomCode].votes) {
        return res.status(400).json({ error: "Voting phase has not started. Please buzz first." });
    }

    // Jeder Spieler darf einmal abstimmen; speichere den Vote
    rooms[roomCode].votes[voterName] = suspectName;
    res.json({ message: `${voterName} voted for ${suspectName}` });
});

// POST /evaluate-votes: Wertet die abgestimmten Stimmen aus und ermittelt den Kandidaten mit den meisten Votes
app.post('/evaluate-votes', (req, res) => {
    const { roomCode } = req.body;

    if (!rooms[roomCode]) {
        return res.status(404).json({ error: "Raum nicht gefunden" });
    }

    if (!rooms[roomCode].votes) {
        return res.status(400).json({ error: "Voting phase has not started" });
    }

    const votes = rooms[roomCode].votes;
    const voteCounts = {};

    // Zähle die Stimmen für jeden verdächtigten Spieler
    for (const voter in votes) {
        const suspect = votes[voter];
        voteCounts[suspect] = (voteCounts[suspect] || 0) + 1;
    }

    // Ermittele den Kandidaten mit den meisten Stimmen
    let maxVotes = 0;
    let candidate = null;
    for (const suspect in voteCounts) {
        if (voteCounts[suspect] > maxVotes) {
            maxVotes = voteCounts[suspect];
            candidate = suspect;
        }
    }

    // Hier könnte weitere Logik implementiert werden:
    // z. B. ob der ausgewählte Kandidat auch der Impostor ist, oder ob es Unentschieden gibt.
    res.json({ message: "Voting evaluation complete", candidate, voteCounts });
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
