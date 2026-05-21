import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { Dinosaurio, MensajeGlobal, SesionUsuario } from '../types';

interface FavoritosPageProps {
    sesion: SesionUsuario | null;
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
}

function FavoritosPage(props: FavoritosPageProps) {
    const [items, setItems] = useState<Dinosaurio[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!props.sesion) { setCargando(false); return; }
        cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.sesion]);

    async function cargar() {
        try {
            const data = await api.getFavoritos();
            setItems(data.map(f => f.dinosaurio));
        } catch (e: unknown) {
            props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error al cargar' });
        } finally {
            setCargando(false);
        }
    }

    async function eliminar(id: number) {
        try {
            await api.eliminarFavorito(id);
            setItems(prev => prev.filter(d => d.id !== id));
            props.onMensaje({ tipo: 'success', texto: 'Eliminado de favoritos.' });
        } catch (e: unknown) {
            props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error' });
        }
    }

    if (!props.sesion) {
        return (
            <section className="container py-5">
                <div className="alert alert-warning">
                    Debés iniciar sesión para ver tus favoritos.
                </div>
                <button type="button" className="btn btn-warning mt-2"
                        onClick={() => props.onNavegar('/login')}>
                    Ir al login
                </button>
            </section>
        );
    }

    return (
        <section className="container py-5">
            <div className="d-flex align-items-center gap-2 mb-4">
                <div style={{ width: 4, height: 28, backgroundColor: '#2e6da4', borderRadius: 2 }} />
                <div>
                    <h2 className="fw-bold mb-0">Mis favoritos</h2>
                    <p className="text-secondary small mb-0">Los dinosaurios que marcaste como favoritos.</p>
                </div>
            </div>

            {cargando ? (
                <Cargando />
            ) : items.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="fs-1 mb-3">☆</div>
                        <h5 className="fw-bold">No tenés favoritos todavía</h5>
                        <p className="text-secondary mb-3">Explorá el catálogo y marcá los que más te gusten.</p>
                        <button type="button" className="btn fw-semibold"
                                style={{ backgroundColor: '#2e6da4', color: 'white' }}
                                onClick={() => props.onNavegar('/dinosaurios')}>
                            Explorar catálogo
                        </button>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {items.map(dino => (
                        <div className="card border-0 shadow-sm feature-card" key={dino.id}
                             style={{ cursor: 'pointer' }}
                             onClick={() => props.onNavegar(`/dinosaurios/${dino.id}`)}>
                            <div className="row g-0">
                                {dino.imagen && (
                                    <div className="col-3 col-md-2">
                                        <img src={dino.imagen} alt={dino.nombre}
                                             style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 100, borderRadius: '12px 0 0 12px' }}
                                             onError={e => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                )}
                                <div className={dino.imagen ? 'col-9 col-md-10' : 'col-12'}>
                                    <div className="card-body d-flex justify-content-between align-items-center p-3">
                                        <div>
                                            <h6 className="fw-bold mb-1">{dino.nombre}</h6>
                                            <div className="d-flex gap-1 flex-wrap">
                                                <span className="badge" style={{ backgroundColor: '#2e6da4' }}>{dino.tipo}</span>
                                                <span className="badge bg-secondary">{dino.epoca}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 ms-3">
                                            <button type="button"
                                                    className="btn btn-sm fw-semibold"
                                                    style={{ backgroundColor: '#0d1b2a', color: 'white' }}
                                                    onClick={e => { e.stopPropagation(); props.onNavegar(`/dinosaurios/${dino.id}`); }}>
                                                Ver
                                            </button>
                                            <button type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Quitar de favoritos"
                                                    onClick={e => { e.stopPropagation(); eliminar(dino.id); }}>
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default FavoritosPage;
