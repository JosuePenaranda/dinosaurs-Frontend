import React from 'react';
import CatalogoPage from './CatalogoPage';
import { api } from '../services/api';

function SagasPage() {
    return (
        <CatalogoPage
            titulo="Sagas"
            placeholder="Buscar saga por nombre..."
            badge="Saga"
            textoVacio="No hay sagas publicadas todavía."
            cargarItems={api.getSagas}
        />
    );
}

export default SagasPage;
