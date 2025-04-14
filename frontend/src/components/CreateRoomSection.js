// src/components/CreateRoomSection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, TextField } from '@mui/material';

const backendUrl = "http://localhost:3000";

const CreateRoomSection = () => {
  const navigate = useNavigate();
  const [createdRoomCode, setCreatedRoomCode] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [creatorName, setCreatorName] = useState("");

  const genres = ["Fussball", "Fighters", "Musik", "Movie", "Technologie"];

  // Ruft den Endpunkt zur Raumerstellung auf
  const handleCreateRoom = async () => {
    try {
      const response = await fetch(`${backendUrl}/create-room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setCreatedRoomCode(data.roomCode);
    } catch (error) {
      console.error("Fehler bei der Raumerstellung:", error);
    }
  };

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);
  };

  // Navigation in den erstellten Raum als Creator
  const proceedAsCreator = () => {
    navigate("/room", {
      state: {
        roomCode: createdRoomCode,
        name: creatorName,
        role: "creator",
        genre: selectedGenre,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h5">Create Room</Typography>
      <Button variant="contained" onClick={handleCreateRoom} style={{ margin: "10px" }}>
        Create Room
      </Button>
      {createdRoomCode && (
        <Box>
          <Typography variant="h6">Room Code: {createdRoomCode}</Typography>
          <Typography variant="subtitle1">Select Genre:</Typography>
          <Grid container spacing={2} justifyContent="center" style={{ marginTop: "10px" }}>
            {genres.map((genre) => (
              <Grid item key={genre}>
                <Button
                  variant={selectedGenre === genre ? "contained" : "outlined"}
                  onClick={() => handleSelectGenre(genre)}
                >
                  {genre}
                </Button>
              </Grid>
            ))}
          </Grid>
          {selectedGenre && (
            <Box mt={2}>
              <TextField
                label="Your Name"
                variant="outlined"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={proceedAsCreator} style={{ marginTop: "10px" }} fullWidth>
                Proceed
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CreateRoomSection;
