import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useLocation } from 'react-router-dom';



const GamePage = () => {
  const location = useLocation();
  const { role, genre } = location.state || {};

  const [selectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topicDetails, setTopicDetails] = useState(null);

  useEffect(() => {
    if (!selectedTopic || role === "impostor") return;

    const fetchWikipediaData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://de.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages&exintro=true&explaintext=true&pithumbsize=800&titles=${encodeURIComponent(selectedTopic)}`
        );
        
        const data = await response.json();
        const page = Object.values(data.query.pages)[0];
        
        // Fallback Bild wenn kein Wikipedia-Bild existiert
        const imageUrl = page.thumbnail?.source || `https://loremflickr.com/800/500/${encodeURIComponent(selectedTopic)}`;
        
        // Ersten Satz des Extracts nehmen
        const description = page.extract?.split('. ')[0] || `Informationen über ${selectedTopic}`;

        setTopicDetails({
          name: selectedTopic,
          description: description + '.',
          strThumb: imageUrl,
        });
        
      } catch (err) {
        console.error('API Fehler:', err);
        setError('Daten konnten nicht geladen werden');
        // Fallback Bild bei Fehler
        setTopicDetails({
          name: selectedTopic,
          description: `Informationen über ${selectedTopic}`,
          strThumb: `https://loremflickr.com/800/500/${encodeURIComponent(selectedTopic)}`,
        });
      }
      setLoading(false);
    };

    fetchWikipediaData();
  }, [selectedTopic, role]);

  return (
    <Container maxWidth="md" style={{ marginTop: "40px", textAlign: "center" }}>
      <Typography variant="h3" gutterBottom style={{ fontWeight: "bold", letterSpacing: "2px" }}>
        🎯 Gesuchtes Thema: {genre}
      </Typography>

      {loading ? (
        <Box mt={5}>
          <CircularProgress color="secondary" thickness={5} />
          <Typography variant="h5" style={{ marginTop: "10px" }}>
            🔄 Lade Thema...
          </Typography>
        </Box>
      ) : error ? (
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      ) : role === "impostor" ? (
        <Box mt={3}>
          <Typography variant="h3" color="error" gutterBottom style={{ fontWeight: "bold" }}>
            🚨 Du bist der Impostor!
          </Typography>
          <Typography variant="body1" style={{ marginTop: "10px", fontSize: "1.2rem" }}>
            Du hast kein Thema erhalten. Täusche die anderen Spieler geschickt!
          </Typography>
        </Box>
      ) : topicDetails ? (
        <Box mt={5}>
          <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#333" }}>
            🎬 Thema: {topicDetails.name}
          </Typography>
          <Card
            style={{
              maxWidth: 600,
              margin: "auto",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              transform: "scale(1.02)",
            }}
          >
            
            <CardMedia
              component="img"
              image={topicDetails.strThumb}
              alt={topicDetails.name}
              style={{ height: 350, objectFit: "cover" }}
            />
            <CardContent style={{ backgroundColor: "#f7f7f7" }}>
              <Typography variant="body1" style={{ fontSize: "1.1rem" }}>
                {topicDetails.description}
              </Typography>
            </CardContent>
          </Card>
          
        </Box>
      ) : (
        <Typography variant="body1">
          Es konnten keine Informationen angezeigt werden.
        </Typography>
      )}
    </Container>
  );
  
};


export default GamePage;
