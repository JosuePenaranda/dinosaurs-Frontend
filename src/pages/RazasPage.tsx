import React from 'react';
import CatalogoPage from './CatalogoPage';
import { api } from '../services/api';

function RazasPage() {
    return (
        <CatalogoPage
            titulo="Razas"
            placeholder="Buscar raza por nombre..."
            badge="Raza"
            textoVacio="No hay razas publicadas todavía."
            cargarItems={api.getRazas}
        />
    );
}

export default RazasPage;
