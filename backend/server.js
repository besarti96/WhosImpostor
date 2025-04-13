const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// In-Memory-Speicher für Räume
const rooms = {};

// Themen-Mapping nach Genre (für zentrale Themenvorgabe)
const topicsMapping = {
    Fussball: [
      "Lionel Messi", "Cristiano Ronaldo", "Neymar", "Kylian Mbappé", "Zinedine Zidane",
      "Ronaldinho", "David Beckham", "Pelé", "Diego Maradona", "Erling Haaland",
      "Luka Modric", "Mohamed Salah", "Karim Benzema", "Robert Lewandowski", "Kevin De Bruyne",
      "Harry Kane", "Gianluigi Buffon", "Franz Beckenbauer", "Sergio Ramos", "Andres Iniesta", "Ilir Kari"
    ],
    Musik: [
      "Michael Jackson", "Elvis Presley", "Tupac Shakur", "Beyoncé", "Eminem",
      "Madonna", "Drake", "The Beatles", "Rihanna", "Kanye West",
      "Adele", "Taylor Swift", "Ed Sheeran", "Whitney Houston", "Freddie Mercury",
      "Bruno Mars", "Justin Bieber", "Snoop Dogg", "Lady Gaga", "Bob Marley", "Loris Bernet"
    ],
    Movie: [
      "Leonardo DiCaprio", "Brad Pitt", "Tom Hanks", "Johnny Depp", "Robert De Niro",
      "Morgan Freeman", "Scarlett Johansson", "Meryl Streep", "Angelina Jolie", "Denzel Washington",
      "Will Smith", "Keanu Reeves", "Natalie Portman", "Emma Watson", "Christian Bale",
      "Chris Hemsworth", "Tom Cruise", "Jennifer Lawrence", "Besart Jashari", "Ryan Gosling", "Suat Gaylordi", "Arber Synguli"
    ],
    Technologie: [
      "Elon Musk", "Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Jeff Bezos",
      "Larry Page", "Sergey Brin", "Tim Berners-Lee", "Satya Nadella", "Sundar Pichai",
      "Linus Torvalds", "Ada Lovelace", "Alan Turing", "Dennis Ritchie", "James Gosling",
      "Guido van Rossum", "Grace Hopper", "Jack Dorsey", "Susan Wojcicki", "Kevin Systrom"
    ]
  };
  

// CORS und JSON-Parsing aktivieren
app.use(cors());
app.use(express.json());

// Basisroute
app.get('/', (req, res) => {
  res.send('Backend is running.');
});

// POST /create-room: Erstellt einen neuen Raum und initialisiert players und ready-Array
app.post('/create-room', (req, res) => {
  // Generiere einen zufaelligen, 6-stelligen Raumcode (Buchstaben und Zahlen)
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Initialisiere den Raum mit leeren Arrays für players und ready
  rooms[roomCode] = { players: [], ready: [] };
  
  // Sende den generierten Raumcode als JSON zurueck
  res.json({ roomCode });
});

// POST /join-room: Ermoeglicht das Beitreten zu einem existierenden Raum
app.post('/join-room', (req, res) => {
  const { roomCode, playerName } = req.body;
  
  // Pruefe, ob der Raum existiert
  if (!rooms[roomCode]) {
    return res.status(404).json({ error: "Raum nicht gefunden" });
  }
  
  // Fuege den Spieler hinzu, falls er noch nicht in der Liste ist
  if (!rooms[roomCode].players.includes(playerName)) {
    rooms[roomCode].players.push(playerName);
  }
  
  res.json({ message: "Erfolgreich beigetreten", players: rooms[roomCode].players });
});

// GET /room/:roomCode: Liefert die aktuelle Spielerliste sowie ggf. die Rollenzuweisung zurueck
app.get('/room/:roomCode', (req, res) => {
  const { roomCode } = req.params;
  if (!rooms[roomCode]) {
    return res.status(404).json({ error: "Raum nicht gefunden" });
  }
  res.json({ players: rooms[roomCode].players, roles: rooms[roomCode].roles || null, genre: rooms[roomCode].genre || null });
});

// POST /ready: Markiert einen Spieler als ready
app.post('/ready', (req, res) => {
  const { roomCode, playerName } = req.body;
  if (!rooms[roomCode]) {
    return res.status(404).json({ error: "Raum nicht gefunden" });
  }
  // Initialisiere das ready-Array, falls noch nicht vorhanden
  if (!rooms[roomCode].ready) {
    rooms[roomCode].ready = [];
  }
  // Fuege den Spieler hinzu, falls er noch nicht als ready markiert ist
  if (!rooms[roomCode].ready.includes(playerName)) {
    rooms[roomCode].ready.push(playerName);
  }
  res.json({ message: "Player marked as ready", ready: rooms[roomCode].ready });
});

// GET /ready/:roomCode: Liefert die Liste der ready markierten Spieler
app.get('/ready/:roomCode', (req, res) => {
  const { roomCode } = req.params;
  if (!rooms[roomCode]) {
    return res.status(404).json({ error: "Raum nicht gefunden" });
  }
  res.json({ ready: rooms[roomCode].ready || [] });
});

// POST /start-game: Startet das Spiel, weist zufaellig einen Impostor zu und generiert eine einheitliche Themenvorgabe
// Beachte: Der Parameter "theme" aus dem Request repraesentiert das gewaehlte Genre.
app.post('/start-game', (req, res) => {
  const { roomCode, theme } = req.body;
  
  if (!rooms[roomCode]) {
    return res.status(404).json({ error: "Raum nicht gefunden" });
  }
  
  const players = rooms[roomCode].players;
  const ready = rooms[roomCode].ready || [];
  
  if (players.length < 3) {
    return res.status(400).json({ error: "Es werden mindestens 3 Spieler benötigt, um das Spiel zu starten." });
  }
  
  // Pruefung: Alle Spieler muessen ready sein
  if (ready.length !== players.length) {
    return res.status(400).json({ error: "Nicht alle Spieler sind ready." });
  }
  
  // Generiere eine einheitliche Themenvorgabe basierend auf dem Genre
  let selectedTopic = "";
  if (theme && topicsMapping[theme]) {
    const topics = topicsMapping[theme];
    selectedTopic = topics[Math.floor(Math.random() * topics.length)];
  } else {
    selectedTopic = theme; // Fallback: Falls kein Mapping existiert, wird das Genre direkt verwendet.
  }
  
  // Bestimme den Impostor zufaellig
  const impostorIndex = Math.floor(Math.random() * players.length);
  
  // Jeder Spieler bekommt ein Objekt mit role und der Themenvorgabe;
  // der Impostor erhaelt KEINE Themenvorgabe (null)
  const roles = players.map((player, index) => {
    return {
      player,
      role: index === impostorIndex ? 'impostor' : 'player',
      theme: index === impostorIndex ? null : selectedTopic
    };
  });
  
  rooms[roomCode].roles = roles;
  rooms[roomCode].genre = theme;
  res.json({ message: "Spiel gestartet", roles });
});

// POST /buzz: Startet die Votingphase, indem ein leeres Votes-Objekt initialisiert wird
app.post('/buzz', (req, res) => {
  const { roomCode } = req.body;
  
  if (!rooms[roomCode]) {
    return res.status(404).json({ error: "Raum nicht gefunden" });
  }
  
  rooms[roomCode].votes = {};
  res.json({ message: "Voting phase started. Please submit your votes using the /vote endpoint." });
});

// POST /vote: Erlaubt einem Spieler abzustimmen, wen er verdaechtigt
app.post('/vote', (req, res) => {
  const { roomCode, voterName, suspectName } = req.body;
  
  if (!rooms[roomCode]) {
    return res.status(404).json({ error: "Raum nicht gefunden" });
  }
  
  if (!rooms[roomCode].votes) {
    return res.status(400).json({ error: "Voting phase has not started. Please buzz first." });
  }
  
  // Jeder Spieler darf einmal abstimmen – speichere den Vote
  rooms[roomCode].votes[voterName] = suspectName;
  res.json({ message: `${voterName} voted for ${suspectName}` });
});

// POST /evaluate-votes: Wertet die Stimmen aus und ermittelt den Kandidaten mit den meisten Votes
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
  
  // Zaehle fuer jeden Kandidaten die abgegebenen Stimmen
  for (const voter in votes) {
    const suspect = votes[voter];
    voteCounts[suspect] = (voteCounts[suspect] || 0) + 1;
  }
  
  // Bestimme den Kandidaten mit den meisten Stimmen
  let maxVotes = 0;
  let candidate = null;
  for (const suspect in voteCounts) {
    if (voteCounts[suspect] > maxVotes) {
      maxVotes = voteCounts[suspect];
      candidate = suspect;
    }
  }
  
  res.json({ message: "Voting evaluation complete", candidate, voteCounts });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
