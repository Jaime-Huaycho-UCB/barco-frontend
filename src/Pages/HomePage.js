import { Box, Typography } from "@mui/material";
import CharacterList from "../Components/CharacterList";

function HomePage() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Box sx={{ padding: 4, width: "100%", maxWidth: 1000 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Lista de Personajes
        </Typography>
        <CharacterList />
      </Box>
    </Box>
  );
}

export default HomePage;
