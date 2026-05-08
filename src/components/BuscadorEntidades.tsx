import React from 'react';

interface BuscadorEntidadesProps {
    valor: string;
    onChange: (valor: string) => void;
    onBuscar: (e: React.FormEvent) => void;
    placeholder?: string;
}

function BuscadorEntidades(props: BuscadorEntidadesProps) {
    return (
        <form className="row g-2 align-items-center mb-4" onSubmit={props.onBuscar}>
            <div className="col-md-9">
                <input
                    type="text"
                    className="form-control"
                    placeholder={props.placeholder ?? 'Buscar...'}
                    value={props.valor}
                    onChange={(e) => props.onChange(e.target.value)}
                />
            </div>
            <div className="col-md-3 d-grid">
                <button type="submit" className="btn btn-warning fw-semibold">
                    Buscar
                </button>
            </div>
        </form>
    );
}

export default BuscadorEntidades;
