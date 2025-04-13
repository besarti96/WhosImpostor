// src/RoomPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Card, CardContent } from '@mui/material';

const backendUrl = "http://localhost:3000";

const RoomPage = () => {
  // Lese Daten aus dem Router-Location-State
  const { roomCode, name, role, genre } = useLocation().state || {};
  const [players, setPlayers] = useState([]);

  // Beim Mounten: Spieler dem Raum hinzufügen
  useEffect(() => {
    const joinRoom = async () => {
      try {
        // Ruft den Backend-Endpunkt zum Beitreten auf
        const res = await fetch(`${backendUrl}/join-room`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerName: name }),
        });
        const data = await res.json();
        console.log(data);
        // Füge den eigenen Namen zur lokalen Spielerliste hinzu (falls noch nicht drin)
        setPlayers(prev => prev.includes(name) ? prev : [...prev, name]);
      } catch (error) {
        console.error("Fehler beim Joinen:", error);
      }
    };
    joinRoom();
  }, [roomCode, name]);

  // (Optional) Hier könntest Du per Polling oder WebSocket regelmäßig die Liste aktualisieren
  
  return (
    <Container maxWidth="md" style={{ marginTop: '30px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Raum: {roomCode}</Typography>
      {genre && <Typography variant="h6" gutterBottom>Genre: {genre}</Typography>}
      <Typography variant="h6">Dein Name: {name} ({role})</Typography>

      {/* Anzeige aller beigetretenen Spieler */}
      <Box mt={3}>
        <Typography variant="h5" gutterBottom>Spieler im Raum</Typography>
        <Paper elevation={3} style={{ padding: '15px', backgroundColor: '#fafafa' }}>
          <Grid container spacing={2}>
            {players.map((player, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{player}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default RoomPage;
