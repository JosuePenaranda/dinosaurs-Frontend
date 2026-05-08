import React from 'react';

interface CargandoProps {
    texto?: string;
}

function Cargando(props: CargandoProps) {
    return (
        <div className="d-flex align-items-center gap-3 py-4">
            <div className="spinner-border text-warning" role="status"></div>
            <span>{props.texto ?? 'Cargando...'}</span>
        </div>
    );
}

export default Cargando;
