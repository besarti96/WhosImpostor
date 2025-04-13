// src/components/PlayerList.js
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const PlayerList = ({ players }) => {
  return (
    <Grid container spacing={2}>
      {players.map((p, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">{p}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlayerList;
