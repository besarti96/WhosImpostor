// src/pages/HomePage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import CreateRoomSection from '../components/CreateRoomSection';
import JoinRoomSection from '../components/JoinRoomSection';

const HomePage = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: "50px", textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Who Is Neger-Jude
      </Typography>
      <Box mb={4}>
        <CreateRoomSection />
      </Box>
      <Box>
        <JoinRoomSection />
      </Box>
    </Container>
  );
};

export default HomePage;
