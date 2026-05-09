import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { Dinosaurio, MensajeGlobal, SesionUsuario } from '../types';

interface DetalleDinosaurioPageProps {
    id: number;
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
    sesion: SesionUsuario | null;
}

function DetalleDinosaurioPage(props: DetalleDinosaurioPageProps) {
    const [dino, setDino] = useState<Dinosaurio | null>(null);
    const [cargando, setCargando] = useState(true);
    const [esFavorito, setEsFavorito] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await api.getDinosaurio(props.id);
                setDino(data);
                if (props.sesion) {
                    const favs = await api.getFavoritos();
                    setEsFavorito(favs.some(f => f.dinosaurio.id === props.id));
                }
            } catch (e: unknown) {
                props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error al cargar' });
            } finally {
                setCargando(false);
            }
        };
        cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id]);

    async function toggleFavorito() {
        if (!props.sesion) {
            props.onMensaje({ tipo: 'danger', texto: 'Debés iniciar sesión para guardar favoritos.' });
            return;
        }
        try {
            if (esFavorito) {
                await api.eliminarFavorito(props.id);
                setEsFavorito(false);
            } else {
                await api.agregarFavorito(props.id);
                setEsFavorito(true);
            }
        } catch (e: unknown) {
            props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error' });
        }
    }

    if (cargando) return <div className="container py-5"><Cargando /></div>;

    if (!dino) return (
        <section className="container py-5">
            <div className="alert alert-danger">Dinosaurio no encontrado.</div>
            <button type="button" className="btn btn-outline-secondary mt-2"
                    onClick={() => props.onNavegar('/dinosaurios')}>
                Volver al catálogo
            </button>
        </section>
    );

    return (
        <section className="container py-5">
            <button type="button" className="btn btn-outline-secondary btn-sm mb-4"
                    onClick={() => props.onNavegar('/dinosaurios')}>
                ← Volver al catálogo
            </button>

            <div className="row g-4">
                {/* Imagen y datos principales */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        {dino.imagen ? (
                            <img src={dino.imagen} alt={dino.nombre}
                                 className="card-img-top"
                                 style={{ objectFit: 'cover', maxHeight: 300 }}
                                 onError={e => (e.currentTarget.style.display = 'none')} />
                        ) : (
                            <div className="bg-secondary d-flex align-items-center justify-content-center"
                                 style={{ height: 200, borderRadius: '0.375rem 0.375rem 0 0' }}>
                                <span className="text-white fs-1">🦕</span>
                            </div>
                        )}
                        <div className="card-body">
                            <div className="d-flex gap-2 mb-3">
                                <span className="badge text-bg-warning">{dino.tipo}</span>
                                <span className="badge text-bg-secondary">{dino.epoca}</span>
                            </div>
                            <button type="button"
                                    className={`btn w-100 ${esFavorito ? 'btn-warning' : 'btn-outline-warning'}`}
                                    onClick={toggleFavorito}>
                                {esFavorito ? '★ En favoritos' : '☆ Agregar a favoritos'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Información detallada */}
                <div className="col-lg-8">
                    <h2 className="fw-bold mb-4">{dino.nombre}</h2>

                    <div className="row g-3 mb-4">
                        {dino.habitat && (
                            <div className="col-sm-6">
                                <div className="card border-0 bg-light h-100">
                                    <div className="card-body">
                                        <div className="text-warning fw-semibold small text-uppercase mb-1">Hábitat</div>
                                        <div>{dino.habitat}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {dino.alimentacion && (
                            <div className="col-sm-6">
                                <div className="card border-0 bg-light h-100">
                                    <div className="card-body">
                                        <div className="text-warning fw-semibold small text-uppercase mb-1">Alimentación</div>
                                        <div>{dino.alimentacion}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {dino.tamanio && (
                            <div className="col-sm-6">
                                <div className="card border-0 bg-light h-100">
                                    <div className="card-body">
                                        <div className="text-warning fw-semibold small text-uppercase mb-1">Tamaño</div>
                                        <div>{dino.tamanio}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {dino.descripcion && (
                        <div className="mb-4">
                            <h5 className="fw-bold">Descripción</h5>
                            <p className="text-secondary">{dino.descripcion}</p>
                        </div>
                    )}

                    {dino.curiosidades && (
                        <div className="card border-0 border-start border-warning border-4 bg-light">
                            <div className="card-body">
                                <h5 className="fw-bold mb-2">Curiosidades</h5>
                                <p className="mb-0 text-secondary">{dino.curiosidades}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default DetalleDinosaurioPage;
