import { useState } from "react";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import axios from "axios";


const BASE_URL = "https://8qrglpbl-3008.brs.devtunnels.ms";

export const LoginComponent = ({ onLogin }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      alert("Por favor, ingresa tu nombre.");
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/personaje/iniciarSesion`, { nombre: name });
      const { salida, mensaje, idPersonaje } = response.data;
  
      if (salida) {
        sessionStorage.setItem("idPersonaje", idPersonaje); // Guardar ID en sesión
        onLogin(name);
        console.log('redir')
      } else {
        alert(mensaje); // Mostrar mensaje en caso de error
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Ocurrió un error, intenta nuevamente.");
    }
  };
  

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, width: 350, display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: "10px", marginTop: 2 }}
          >
            Ingresar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginComponent;
