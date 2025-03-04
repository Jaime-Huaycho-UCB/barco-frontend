import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importar useNavigate
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, IconButton, Card, CardContent } from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { io } from "socket.io-client"; 

// Definir la URL del backend
const BASE_URL = "https://8qrglpbl-3008.brs.devtunnels.ms"; 
const socket = io(BASE_URL); 

const CharacterList = () => {
    const navigate = useNavigate(); // ✅ Hook para redireccionar
    const [characters, setCharacters] = useState([]);
    const [search, setSearch] = useState("");
    const [loggedCharacter, setLoggedCharacter] = useState(null);
    const idPersonajeSesion = sessionStorage.getItem("idPersonaje");

    // ✅ Redirigir al login si no hay un personaje en sesión
    useEffect(() => {
        if (!idPersonajeSesion) {
            navigate("/"); 
            return; // Evitar que se siga ejecutando el useEffect
        }

        axios.get(`${BASE_URL}/personaje/obtener`)
            .then((response) => {
                const allCharacters = response.data;
                const userCharacter = allCharacters.find(char => char.id.toString() === idPersonajeSesion);
                setLoggedCharacter(userCharacter);
                setCharacters(allCharacters.filter(char => char.id.toString() !== idPersonajeSesion)); 
            })
            .catch((error) => {
                console.error("Error al obtener los personajes:", error);
            });

        socket.on("senal", (updatedCharacters) => {
            const userCharacter = updatedCharacters.find(char => char.id.toString() === idPersonajeSesion);
            setLoggedCharacter(userCharacter);
            setCharacters(updatedCharacters.filter(char => char.id.toString() !== idPersonajeSesion));
        });

        return () => {
            socket.off("senal");
        };
    }, [navigate, idPersonajeSesion]); // ✅ Dependencias para actualizar correctamente

    const handleDelete = (id) => {
        axios.put(`${BASE_URL}/personaje/eliminar/${id}`, { eliminado: 1 })
            .catch((error) => {
                console.error("Error al eliminar personaje:", error);
            });
    };

    const filteredCharacters = characters.filter((character) =>
        character.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ padding: 3 }}>
            {/* Recuadro del personaje logueado */}
            {loggedCharacter && (
                <Card sx={{ marginBottom: 3, padding: 2, backgroundColor: loggedCharacter.eliminado ? "#ffcccc" : "#ccffcc", textAlign: "center" }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Personaje Actual: {loggedCharacter.nombre}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: loggedCharacter.eliminado ? "red" : "green" }}>
                            Estado: {loggedCharacter.eliminado ? "Eliminado" : "Vivo"}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Buscador */}
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                <TextField
                    label="Buscar por nombre"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ maxWidth: 500 }}
                    InputProps={{
                        startAdornment: (
                            <IconButton edge="start">
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Box>

            {/* Tabla de personajes */}
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCharacters.map((character) => (
                            <TableRow
                                key={character.id}
                                sx={{
                                    backgroundColor: character.eliminado ? "#e0e0e0" : "white",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                            >
                                <TableCell align="center" sx={{ color: character.eliminado ? "gray" : "black" }}>
                                    {character.nombre}
                                </TableCell>
                                <TableCell align="center">
                                    {character.eliminado === 0 && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDelete(character.id)}
                                            sx={{ borderRadius: 20 }}
                                            disabled={loggedCharacter?.eliminado} 
                                        >
                                            Matar
                                        </Button>
                                    )}
                                    {character.eliminado === 1 && (
                                        <Typography color="textSecondary">Eliminado</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CharacterList;
