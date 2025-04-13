import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [roomCodeCreated, setRoomCodeCreated] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [players, setPlayers] = useState([]);
  const [gameTheme, setGameTheme] = useState("");
  const [gameResult, setGameResult] = useState(null);


  const handleTestBackend = () => {
    fetch('http://localhost:3000/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => setMessage("Error: " + error));
  };

  const handleCreateRoom = () => {
    fetch('http://localhost:3000/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.roomCode) {
          setRoomCodeCreated(data.roomCode);
        } else {
          setRoomCodeCreated("Kein Raumcode erhalten.");
        }
      })
      .catch(error => setRoomCodeCreated("Fehler: " + error));
  };

  const handleJoinRoom = () => {
    fetch('http://localhost:3000/join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, playerName }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setJoinMessage("Fehler: " + data.error);
        } else {
          setJoinMessage(data.message);
          setPlayers(data.players);
        }
      })
      .catch(error => setJoinMessage("Fehler: " + error));
  };

  const handleStartGame = () => {
    // Nutze hier idealerweise den Raumcode, der beim Erstellen oder Beitreten gespeichert wurde.
    // Hier nehmen wir an, dass der Raumcode in "roomCodeCreated" gespeichert wurde, falls der Raum über "Create Room" erstellt wurde.
    // Alternativ kannst du auch den "roomCode"-State aus dem Beitrittsformular verwenden.
    const currentRoomCode = roomCodeCreated || roomCode; 
    
    // Überprüfe, ob ein Thema eingegeben wurde
    if (!gameTheme) {
      setGameResult("Bitte gebe zuerst ein Thema ein.");
      return;
    }
    
    fetch('http://localhost:3000/start-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: currentRoomCode, theme: gameTheme }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setGameResult("Fehler: " + data.error);
        } else {
          // Zeige die komplette Rollenzuweisung als JSON, eventuell formatiert
          setGameResult(JSON.stringify(data.roles, null, 2));
        }
      })
      .catch(error => setGameResult("Fehler: " + error));
  };
  

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Who Is Impostor</h1>
      <button onClick={handleTestBackend}>Test Backend</button>
      <p>{message}</p>
      <hr />
      <button onClick={handleCreateRoom}>Create Room</button>
      {roomCodeCreated && <p>Neuer Raum: {roomCodeCreated}</p>}
      <hr />

      <hr />
<h2>Spiel starten</h2>
<div>
  <input 
    type="text"
    placeholder="Thema eingeben (z.B. Cristiano Ronaldo)"
    value={gameTheme}
    onChange={(e) => setGameTheme(e.target.value)}
  />
</div>
<button onClick={handleStartGame}>Start Game</button>
{gameResult && (
  <div style={{ whiteSpace: "pre-wrap", textAlign: "left", maxWidth: "600px", margin: "20px auto" }}>
    <h3>Spiel-Ergebnis:</h3>
    <pre>{gameResult}</pre>
  </div>
)}


      <h2>Raum beitreten</h2>
      <div>
        <input 
          type="text"
          placeholder="Raumcode eingeben"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
      </div>
      <div>
        <input 
          type="text"
          placeholder="Deinen Namen eingeben"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>
      <button onClick={handleJoinRoom}>Join Room</button>
      {joinMessage && <p>{joinMessage}</p>}
      {players.length > 0 && (
        <div>
          <h3>Spielerliste:</h3>
          <ul>
            {players.map((p, index) => (
              <li key={index}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
