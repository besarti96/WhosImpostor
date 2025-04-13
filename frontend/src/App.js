import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState("");

  // Diese Funktion ruft den Backend-Endpunkt auf
  const handleFetch = () => {
    fetch('http://localhost:3000/')  // ruft das einfache Endpoint ab, das "Backend is running." zurückgibt
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => setMessage("Error: " + error));
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Who Is Impostor</h1>
      <button onClick={handleFetch}>Test Backend</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
