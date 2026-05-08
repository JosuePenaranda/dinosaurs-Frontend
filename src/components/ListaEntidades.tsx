import React from 'react';

interface Item {
    id: number;
    nombre: string;
    [key: string]: unknown;
}

interface ListaEntidadesProps {
    items: Item[];
    seleccionado: Item | null;
    onSeleccionar: (item: Item) => void;
    textoVacio?: string;
}

function ListaEntidades(props: ListaEntidadesProps) {
    if (props.items.length === 0) {
        return (
            <div className="list-group shadow-sm">
                <div className="list-group-item text-secondary">
                    {props.textoVacio ?? 'Sin resultados.'}
                </div>
            </div>
        );
    }

    return (
        <div className="list-group shadow-sm">
            {props.items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${props.seleccionado?.id === item.id ? 'active' : ''}`}
                    onClick={() => props.onSeleccionar(item)}
                >
                    <span className="fw-semibold">{item.nombre}</span>
                </button>
            ))}
        </div>
    );
}

export default ListaEntidades;
