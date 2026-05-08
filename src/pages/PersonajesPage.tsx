import React from 'react';
import CatalogoPage from './CatalogoPage';
import { api } from '../services/api';

function PersonajesPage() {
    return (
        <CatalogoPage
            titulo="Personajes"
            placeholder="Buscar personaje por nombre..."
            badge="Personaje"
            textoVacio="No hay personajes publicados todavía."
            cargarItems={api.getPersonajes}
        />
    );
}

export default PersonajesPage;
