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
            <h2 className="fw-bold mb-1">Mis favoritos</h2>
            <p className="text-secondary mb-4">Los dinosaurios que marcaste como favoritos.</p>

            {cargando ? (
                <Cargando />
            ) : items.length === 0 ? (
                <div className="alert alert-secondary">
                    No tenés favoritos todavía.{' '}
                    <button type="button" className="btn btn-link p-0"
                            onClick={() => props.onNavegar('/dinosaurios')}>
                        Explorá el catálogo.
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    {items.map(dino => (
                        <div className="col-sm-6 col-lg-4 col-xl-3" key={dino.id}>
                            <div className="card h-100 shadow-sm border-0 feature-card"
                                 style={{ cursor: 'pointer' }}
                                 onClick={() => props.onNavegar(`/dinosaurios/${dino.id}`)}>
                                {dino.imagen && (
                                    <img src={dino.imagen} alt={dino.nombre}
                                         className="card-img-top section-card-image"
                                         onError={e => (e.currentTarget.style.display = 'none')} />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{dino.nombre}</h5>
                                    <div className="d-flex gap-2 mb-3">
                                        <span className="badge text-bg-warning">{dino.tipo}</span>
                                        <span className="badge text-bg-secondary">{dino.epoca}</span>
                                    </div>
                                    <div className="d-flex gap-2 mt-auto">
                                        <button type="button"
                                                className="btn btn-outline-dark btn-sm flex-grow-1"
                                                onClick={e => { e.stopPropagation(); props.onNavegar(`/dinosaurios/${dino.id}`); }}>
                                            Ver detalle
                                        </button>
                                        <button type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                title="Quitar de favoritos"
                                                onClick={e => { e.stopPropagation(); eliminar(dino.id); }}>
                                            ★
                                        </button>
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
