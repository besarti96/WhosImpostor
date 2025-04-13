// src/components/JoinRoomSection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';

const JoinRoomSection = () => {
  const navigate = useNavigate();
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [joinName, setJoinName] = useState("");

  const handleJoinRoom = () => {
    navigate("/room", { state: { roomCode: joinRoomCode, name: joinName, role: "joiner" } });
  };

  return (
    <Box>
      <Typography variant="h5">Join Room</Typography>
      <TextField
        label="Room Code"
        variant="outlined"
        value={joinRoomCode}
        onChange={(e) => setJoinRoomCode(e.target.value)}
        fullWidth
        style={{ marginBottom: "10px" }}
      />
      <TextField
        label="Your Name"
        variant="outlined"
        value={joinName}
        onChange={(e) => setJoinName(e.target.value)}
        fullWidth
        style={{ marginBottom: "10px" }}
      />
      <Button variant="contained" onClick={handleJoinRoom} fullWidth>
        Join Room
      </Button>
    </Box>
  );
};

export default JoinRoomSection;
