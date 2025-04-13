import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [roomCodeCreated, setRoomCodeCreated] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [players, setPlayers] = useState([]);

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

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Who Is Impostor</h1>
      <button onClick={handleTestBackend}>Test Backend</button>
      <p>{message}</p>
      <hr />
      <button onClick={handleCreateRoom}>Create Room</button>
      {roomCodeCreated && <p>Neuer Raum: {roomCodeCreated}</p>}
      <hr />
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
