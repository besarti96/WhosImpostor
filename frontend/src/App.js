import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [roomCode, setRoomCode] = useState("");

  // Funktion um Test Backend-Endpoint (GET /) aufzurufen (bereits implementiert)
  const handleTestBackend = () => {
    fetch('http://localhost:3000/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => setMessage("Error: " + error));
  };

  // Funktion um den /create-room Endpoint aufzurufen (POST)
  const handleCreateRoom = () => {
    fetch('http://localhost:3000/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        // Neuen Raumcode aus der Antwort extrahieren
        if (data.roomCode) {
          setRoomCode(data.roomCode);
        } else {
          setRoomCode("Kein Raumcode erhalten.");
        }
      })
      .catch(error => setRoomCode("Fehler: " + error));
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Who Is Impostor</h1>
      <button onClick={handleTestBackend}>Test Backend</button>
      <p>{message}</p>
      <hr />
      <button onClick={handleCreateRoom}>Create Room</button>
      {roomCode && <p>Neuer Raum: {roomCode}</p>}
    </div>
  );
}

export default App;
