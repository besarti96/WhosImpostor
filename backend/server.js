// server.js
const express = require('express');
const cors = require('cors');  // CORS importieren
const app = express();
const PORT = process.env.PORT || 3000;

// CORS aktivieren
app.use(cors());

// Basisroute definieren
app.get('/', (req, res) => {
    res.send('Backend is running.');
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
