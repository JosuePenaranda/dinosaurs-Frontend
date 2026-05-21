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
            props.onNavegar('/favoritos');
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
            <button type="button" className="btn btn-sm mb-4 fw-semibold"
                    style={{ backgroundColor: '#0d1b2a', color: 'white' }}
                    onClick={() => props.onNavegar('/dinosaurios')}>
                ← Volver al catálogo
            </button>

            {/* Cabecera con imagen */}
            <div className="card border-0 shadow-sm mb-4 overflow-hidden">
                <div className="row g-0">
                    {dino.imagen && (
                        <div className="col-md-4">
                            <img src={dino.imagen} alt={dino.nombre}
                                 style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 280 }}
                                 onError={e => (e.currentTarget.style.display = 'none')} />
                        </div>
                    )}
                    <div className={dino.imagen ? 'col-md-8' : 'col-12'}>
                        <div className="card-body p-4 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex gap-2 mb-3">
                                    <span className="badge" style={{ backgroundColor: '#2e6da4' }}>{dino.tipo}</span>
                                    <span className="badge bg-secondary">{dino.epoca}</span>
                                    {dino.categoria && <span className="badge bg-dark">{dino.categoria}</span>}
                                </div>
                                <h2 className="fw-bold mb-3">{dino.nombre}</h2>
                                {dino.descripcion && (
                                    <div className="text-secondary detail-html"
                                         dangerouslySetInnerHTML={{ __html: dino.descripcion }} />
                                )}
                            </div>
                            <div className="mt-4">
                                <button type="button"
                                        className={`btn fw-semibold ${esFavorito ? 'text-white' : 'btn-outline-secondary'}`}
                                        style={esFavorito ? { backgroundColor: '#2e6da4', borderColor: '#2e6da4' } : {}}
                                        onClick={toggleFavorito}>
                                    {esFavorito ? '★ En favoritos' : '☆ Agregar a favoritos'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info cards */}
            {(dino.habitat || dino.alimentacion || dino.tamanio) && (
                <div className="row g-3 mb-4">
                    {dino.habitat && (
                        <div className="col-sm-4">
                            <div className="card border-0 h-100" style={{ backgroundColor: '#e8f0f7' }}>
                                <div className="card-body p-3">
                                    <div className="fw-bold small text-uppercase mb-1" style={{ color: '#2e6da4' }}>Hábitat</div>
                                    <div className="small">{dino.habitat}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {dino.alimentacion && (
                        <div className="col-sm-4">
                            <div className="card border-0 h-100" style={{ backgroundColor: '#e8f0f7' }}>
                                <div className="card-body p-3">
                                    <div className="fw-bold small text-uppercase mb-1" style={{ color: '#2e6da4' }}>Alimentación</div>
                                    <div className="small">{dino.alimentacion}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {dino.tamanio && (
                        <div className="col-sm-4">
                            <div className="card border-0 h-100" style={{ backgroundColor: '#e8f0f7' }}>
                                <div className="card-body p-3">
                                    <div className="fw-bold small text-uppercase mb-1" style={{ color: '#2e6da4' }}>Tamaño</div>
                                    <div className="small">{dino.tamanio}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {dino.curiosidades && (
                <div className="card border-0" style={{ borderLeft: '4px solid #2e6da4 !important', backgroundColor: '#e8f0f7' }}>
                    <div className="card-body p-4" style={{ borderLeft: '4px solid #2e6da4' }}>
                        <h6 className="fw-bold mb-2" style={{ color: '#0d1b2a' }}>Curiosidades</h6>
                        <p className="mb-0 text-secondary small">{dino.curiosidades}</p>
                    </div>
                </div>
            )}
        </section>
    );
}

export default DetalleDinosaurioPage;
