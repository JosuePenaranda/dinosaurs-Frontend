import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';

interface Item {
    id: number;
    nombre: string;
    contenidoHtml?: string;
    [key: string]: unknown;
}

type TipoCatalogo = 'personajes' | 'sagas' | 'razas';

const TIPOS: { label: string; valor: TipoCatalogo }[] = [
    { label: 'Personajes', valor: 'personajes' },
    { label: 'Sagas',      valor: 'sagas' },
    { label: 'Razas',      valor: 'razas' },
];

function cargarPorTipo(tipo: TipoCatalogo): Promise<Item[]> {
    if (tipo === 'personajes') return api.getPersonajes() as unknown as Promise<Item[]>;
    if (tipo === 'sagas')      return api.getSagas() as unknown as Promise<Item[]>;
    return api.getRazas() as unknown as Promise<Item[]>;
}

interface PanelDetalleProps {
    item: Item | null;
    lado: string;
}

function PanelDetalle(props: PanelDetalleProps) {
    if (!props.item) {
        return (
            <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-dark text-white fw-semibold">{props.lado}</div>
                <div className="card-body text-secondary">Seleccioná un elemento.</div>
            </div>
        );
    }
    const html = (props.item.contenidoHtml ?? '')
        .replace(/^\s*<h[1-6][^>]*>.*?<\/h[1-6]>\s*/i, '');
    return (
        <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white fw-semibold">{props.lado}</div>
            <div className="card-body">
                <h5 className="fw-bold mb-3">{props.item.nombre}</h5>
                <div className="detail-html" style={{ fontSize: '0.9rem' }}
                     dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    );
}

function CompararPage() {
    const [tipo, setTipo] = useState<TipoCatalogo>('personajes');
    const [items, setItems] = useState<Item[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [izq, setIzq] = useState<Item | null>(null);
    const [der, setDer] = useState<Item | null>(null);

    const cargar = async (t: TipoCatalogo) => {
        try {
            setCargando(true);
            setError('');
            setIzq(null);
            setDer(null);
            const datos = await cargarPorTipo(t);
            setItems(datos);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error desconocido');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(tipo); }, [tipo]);

    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-1">Comparar</h2>
            <p className="text-secondary mb-4">
                Elegí el tipo, seleccioná un elemento en cada columna y comparalos lado a lado.
            </p>

            <div className="d-flex gap-2 mb-4">
                {TIPOS.map((t) => (
                    <button
                        key={t.valor}
                        type="button"
                        className={`btn btn-sm ${tipo === t.valor ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setTipo(t.valor)}>
                        {t.label}
                    </button>
                ))}
                {(izq || der) && (
                    <button type="button"
                            className="btn btn-sm btn-outline-secondary ms-auto"
                            onClick={() => { setIzq(null); setDer(null); }}>
                        Limpiar selección
                    </button>
                )}
            </div>

            {cargando ? (
                <Cargando />
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-dark text-white fw-semibold">Izquierda</div>
                                <div className="card-body p-0" style={{ maxHeight: 300, overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        {items.length === 0 && (
                                            <li className="list-group-item text-secondary">Sin resultados.</li>
                                        )}
                                        {items.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                className={`list-group-item list-group-item-action ${izq?.id === item.id ? 'active' : ''}`}
                                                onClick={() => { if (der?.id === item.id) setDer(null); setIzq(item); }}>
                                                {item.nombre}
                                            </button>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-dark text-white fw-semibold">Derecha</div>
                                <div className="card-body p-0" style={{ maxHeight: 300, overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        {items.length === 0 && (
                                            <li className="list-group-item text-secondary">Sin resultados.</li>
                                        )}
                                        {items.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                className={`list-group-item list-group-item-action ${der?.id === item.id ? 'active' : ''}`}
                                                onClick={() => { if (izq?.id === item.id) setIzq(null); setDer(item); }}>
                                                {item.nombre}
                                            </button>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(izq || der) && (
                        <div className="row g-3">
                            <div className="col-md-6">
                                <PanelDetalle item={izq} lado={izq?.nombre ?? 'Sin selección'} />
                            </div>
                            <div className="col-md-6">
                                <PanelDetalle item={der} lado={der?.nombre ?? 'Sin selección'} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default CompararPage;
