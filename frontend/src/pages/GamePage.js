// src/pages/GamePage.js
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

// topicsMapping wird außerhalb der Komponente deklariert, damit es stabil bleibt.
const topicsMapping = {
  Fussball: ["Cristiano Ronaldo", "Pepe", "Jürgen Klopp", "Lionel Messi", "Zinedine Zidane"],
  Musik: ["Usher", "Beyonce", "Elvis Presley", "Michael Jackson", "Madonna"],
  Movie: ["Leonardo DiCaprio", "Brad Pitt", "Meryl Streep", "Tom Hanks", "Scarlett Johansson"],
  Technologie: ["Elon Musk", "Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Sundar Pichai"],
};

const GamePage = () => {
  const location = useLocation();
  const { roomCode, name, role, genre } = location.state || {};

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topicDetails, setTopicDetails] = useState(null);

  // Beim Mounten: Zufälliges Thema für das gegebene Genre auswählen.
  // Da topicsMapping nun konstant ist, genügt [genre] als Dependency.
  useEffect(() => {
    if (genre && topicsMapping[genre]) {
      const topics = topicsMapping[genre];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      setSelectedTopic(randomTopic);
    }
  }, [genre]);

  // API-Aufruf basierend auf selectedTopic
 useEffect(() => {
  if (!selectedTopic || role === "impostor") return;
  setLoading(true);

  const fetchTopicData = async () => {
    try {
      const res = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(selectedTopic)}&format=json&no_redirect=1`
      );
      const data = await res.json();

      setTopicDetails({
        name: selectedTopic,
        description: data.Abstract || "Keine weiteren Informationen verfuegbar.",
        strThumb: data.Image || "https://via.placeholder.com/400"
      });
    } catch (err) {
      console.error("API-Fehler:", err);
      setTopicDetails({
        name: selectedTopic,
        description: `Fallback: Das Thema ist ${selectedTopic}.`,
        strThumb: "https://via.placeholder.com/400"
      });
    }
    setLoading(false);
  };

  fetchTopicData();
}, [selectedTopic, role]);


  return (
    <Container maxWidth="md" style={{ marginTop: "30px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Gesuchtes Wort: {genre}
      </Typography>
      {loading ? (
  <Box mt={5}>
    <CircularProgress />
    <Typography variant="h5" style={{ marginTop: "10px" }}>
      Lade Thema...
    </Typography>
  </Box>
) : error ? (
  <Typography variant="h5" color="error">
    {error}
  </Typography>
) : role === "impostor" ? (
  <Box mt={3}>
    <Typography variant="h4" color="error" gutterBottom>
      Du bist der Impostor!
    </Typography>
    <Typography variant="body1" style={{ marginTop: "10px" }}>
      Täusche die anderen – du hast kein Thema erhalten du Opfer, drecks Nutte was verarschisch eus.
    </Typography>
  </Box>
) : topicDetails ? (
  <Box mt={3}>
    <Typography variant="h4" gutterBottom>
      Thema: {selectedTopic}
    </Typography>
          {topicDetails.strThumb || topicDetails.thumb ? (
            <Card style={{ maxWidth: 400, margin: "auto" }}>
              <CardMedia
                component="img"
                image={topicDetails.strThumb || topicDetails.thumb}
                alt={selectedTopic}
              />
              <CardContent>
                <Typography variant="body1">
                  {topicDetails.strDescriptionEN || topicDetails.description || "Keine weiteren Informationen verfuegbar."}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              {topicDetails.strDescriptionEN || topicDetails.description || "Keine weiteren Informationen verfuegbar."}
            </Typography>
          )}
        </Box>
      ) : (
        <Typography variant="body1">
          Infos:
        </Typography>
      )}
    </Container>
  );
};

export default GamePage;
