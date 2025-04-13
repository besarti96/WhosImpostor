// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basisroute definieren
app.get('/', (req, res) => {
    res.send('Backend is running.');
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
