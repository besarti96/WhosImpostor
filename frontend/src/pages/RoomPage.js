// src/pages/RoomPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import PlayerList from '../components/PlayerList';
import { useNavigate } from 'react-router-dom';

const backendUrl = "http://localhost:3000";

const RoomPage = () => {
  const location = useLocation();
  const { roomCode, name, role, genre } = location.state || {};
  const [players, setPlayers] = useState([]);
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [rolesAssigned, setRolesAssigned] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [roomGenre, setRoomGenre] = useState(genre || ""); // genre vom location.state als Fallback


  // Spieler beitreten und regelmaessiges Aktualisieren der Spielerliste
  useEffect(() => {
    const joinRoom = async () => {
      try {
        const res = await fetch(`${backendUrl}/join-room`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomCode, playerName: name }),
        });
        const data = await res.json();
        if (data && data.players) setPlayers(data.players);
      } catch (error) {
        console.error("Fehler beim Beitreten des Raumes:", error);
      }
    };
    joinRoom();

    

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${backendUrl}/room/${roomCode}`);
        const data = await res.json();
        if (data && data.players) setPlayers(data.players);
      } catch (error) {
        console.error("Fehler beim Abrufen der Spieler:", error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [roomCode, name]);

  // Polling fuer den Ready-Status
  useEffect(() => {
    const fetchReady = async () => {
      try {
        const res = await fetch(`${backendUrl}/ready/${roomCode}`);
        const data = await res.json();
        if (data && data.ready) setReadyPlayers(data.ready);
      } catch (error) {
        console.error("Fehler beim Abrufen des Ready-Status:", error);
      }
    };
    const interval = setInterval(fetchReady, 2000);
    return () => clearInterval(interval);
  }, [roomCode]);

  // Polling fuer die Rollenzuweisung (sofern vorhanden)
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${backendUrl}/room/${roomCode}`);
        const data = await res.json();
        if (data.genre) {
          setRoomGenre(data.genre); // 🔥 Genre vom Server setzen
        }        
        if (data && data.roles) {
          setRolesAssigned(data.roles);
          setGameStarted(true);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Rollenzuweisung:", error);
      }
    };
    const interval = setInterval(fetchRoles, 2000);
    return () => clearInterval(interval);
  }, [roomCode]);

  // Fuer den Ersteller: Spielstart automatisch ausloesen, wenn alle Spieler ready sind
  useEffect(() => {
    if (players.length >= 3 && readyPlayers.length === players.length && !gameStarted && role === "creator") { 
      const startGame = async () => {
        try {
          const res = await fetch(`${backendUrl}/start-game`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomCode, theme: genre }),
          });
          const data = await res.json();
          if (!data.error) {
            // Rollen werden per Polling abgerufen
            let time = 3;
            setCountdown(time);
            const timer = setInterval(() => {
              time -= 1;
              setCountdown(time);
              if (time === 0) {
                clearInterval(timer);
              }
            }, 1000);
          }
        } catch (error) {
          console.error("Fehler beim Starten des Spiels:", error);
        }
      };
      startGame();
    }
  }, [players, readyPlayers, gameStarted, roomCode, role, genre]);

  // Ermittlung der eigenen Rollenzuweisung anhand des Spielernamens
  const myRoleInfo = rolesAssigned ? rolesAssigned.find(r => r.player === name) : null;

  return (
    <Container maxWidth="md" style={{ marginTop: "30px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Room: {roomCode}
      </Typography>
      {genre && (
        <Typography variant="h5" gutterBottom>
          Genre: {genre}
          
        </Typography>
      )}
      <Typography variant="h6" gutterBottom>
        Your Name: {name}
      </Typography>
      

      {/* Anzeige der aktuellen Spieler */}
      <Box mt={3}>
        <Typography variant="h5" gutterBottom>
          Players in Room
        </Typography>
        <Paper elevation={3} style={{ padding: "15px" }}>
          <PlayerList players={players} />
        </Paper>
      </Box>

      {/* Ready-Phase: Button zum Markieren des Ready-Status */}
      {!gameStarted && (
        <Box mt={3}>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await fetch(`${backendUrl}/ready`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ roomCode, playerName: name }),
                });
              } catch (error) {
                console.error("Fehler beim Markieren von Ready:", error);
              }
            }}
          >
            I'm Ready
          </Button>
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            {readyPlayers.length} / {players.length} Ready
          </Typography>
          {countdown > 0 && (
            <Typography variant="h3">{countdown}</Typography>
          )}
        </Box>
      )}

      {/* Anzeige der Rollenzuweisung und Genre, sobald das Spiel gestartet ist */}
      {gameStarted && rolesAssigned && myRoleInfo && (
  <Box mt={3}>
    <Typography variant="h3" style={{ color: myRoleInfo.role === 'impostor' ? "red" : "green" }}>
      {myRoleInfo.role === 'impostor' ? "Du bist der Impostor!" : "Du bist Player!"}
    </Typography>
    <Typography variant="h4" style={{ marginTop: "20px" }}>
      Genre: {roomGenre}
    </Typography>
    
    <Button
      variant="contained"
      style={{ marginTop: "20px" }}
      onClick={() =>
        navigate('/game', {
          state: {
            roomCode,
            name,
            role: myRoleInfo.role,
            genre: myRoleInfo.theme,
          },
        })
      }
    >
      Spiel starten
    </Button>
  </Box>
)}
    </Container>
  );
};

export default RoomPage;
