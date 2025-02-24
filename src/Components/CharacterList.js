import React, { useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import axios from "axios";

// Definir la URL del backend directamente en el código
const BASE_URL = "http://localhost:3008";  // Aquí defines el host y puerto de tu backend

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);

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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {characters.map((character) => (
            <TableRow
              key={character.id}
              sx={{
                backgroundColor: character.eliminado ? "gray" : "white", // Plomo para eliminados
              }}
            >
              <TableCell>{character.nombre}</TableCell>
              <TableCell>
                {/* Si no está eliminado, mostramos el botón de eliminar */}
                {character.eliminado === 0 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(character.id)}
                  >
                    Eliminar
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
  );
};

export default CharacterList;
