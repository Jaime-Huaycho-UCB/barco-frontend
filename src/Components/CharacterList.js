import React, { useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, IconButton } from "@mui/material";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';

// Definir la URL del backend directamente en el código
// const BASE_URL = "https://8qrglpbl-3008.brs.devtunnels.ms";
const BASE_URL = "http://localhost:3008";

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [search, setSearch] = useState("");  // Estado para el valor del buscador

    // Obtener personajes al cargar el componente
    useEffect(() => {
        axios
            .get(`${BASE_URL}/personaje/obtener`)  // Usamos BASE_URL para hacer la petición
            .then((response) => {
                setCharacters(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los personajes:", error);
            });
    }, []);

    // Eliminar personaje (marcar como eliminado)
    const handleDelete = (id) => {
        axios
            .put(`${BASE_URL}/personaje/eliminar/${id}`, { eliminado: 1 })  // Usamos BASE_URL para la URL de la petición
            .then((response) => {
                setCharacters(
                    characters.map((char) =>
                        char.id === id ? { ...char, eliminado: 1 } : char
                    )
                );
            })
            .catch((error) => {
                console.error("Error al eliminar personaje:", error);
            });
    };

    // Filtrar personajes por nombre
    const filteredCharacters = characters.filter((character) =>
        character.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ padding: 3 }}>
            {/* Título */}
            <Typography variant="h4" align="center" gutterBottom>
            </Typography>

            {/* Campo de búsqueda */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                <TextField
                    label="Buscar por nombre"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}  // Actualizar el valor del buscador
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

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f4f4f4' }}>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCharacters.map((character) => (
                            <TableRow
                                key={character.id}
                                sx={{
                                    backgroundColor: character.eliminado ? "#e0e0e0" : "white", // Gris para eliminados
                                    "&:hover": { backgroundColor: "#f5f5f5" }, // Hover sobre las filas
                                }}
                            >
                                <TableCell align="center" sx={{ color: character.eliminado ? "gray" : "black" }}>
                                    {character.nombre}
                                </TableCell>
                                <TableCell align="center">
                                    {/* Si no está eliminado, mostramos el botón de eliminar */}
                                    {character.eliminado === 0 && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDelete(character.id)}
                                            sx={{ borderRadius: 20 }}
                                        >
                                            Matar
                                        </Button>
                                    )}
                                    {/* Si está eliminado, mostramos el texto 'Eliminado' */}
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
