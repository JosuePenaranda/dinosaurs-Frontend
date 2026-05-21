import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { Dinosaurio, MensajeGlobal } from '../types';

interface InicioPageProps {
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
    sesion: { rol: string } | null;
}

function InicioPage(props: InicioPageProps) {
    const [destacados, setDestacados] = useState<Dinosaurio[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        api.getDinosaurios()
            .then(data => setDestacados(data.slice(0, 4)))
            .catch(() => {})
            .finally(() => setCargando(false));
    }, []);

    return (
        <>
            {/* Accesos rápidos */}
            <section className="container py-5">
                <div className="d-flex align-items-center gap-2 mb-4">
                    <div style={{ width: 4, height: 32, backgroundColor: '#2e6da4', borderRadius: 2 }} />
                    <h2 className="fw-bold mb-0">Bienvenido a Dino Portal</h2>
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="card border-0 feature-card h-100"
                             style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #0d1b2a, #1b3a5c)' }}
                             onClick={() => props.onNavegar('/dinosaurios')}>
                            <div className="card-body d-flex align-items-center gap-4 p-4">
                                <div className="fs-1 flex-shrink-0">🦕</div>
                                <div>
                                    <h4 className="fw-bold text-white mb-1">Explorar Dinosaurios</h4>
                                    <p className="mb-3" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                        Buscá y filtrá por nombre, tipo y época.
                                    </p>
                                    <button className="btn btn-sm btn-light fw-semibold" type="button"
                                            onClick={e => { e.stopPropagation(); props.onNavegar('/dinosaurios'); }}>
                                        Ver catálogo →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card border-0 feature-card h-100"
                             style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #1b3a5c, #2e6da4)' }}
                             onClick={() => props.onNavegar('/favoritos')}>
                            <div className="card-body d-flex align-items-center gap-4 p-4">
                                <div className="fs-1 flex-shrink-0">★</div>
                                <div>
                                    <h4 className="fw-bold text-white mb-1">Mis Favoritos</h4>
                                    <p className="mb-3" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                        Accedé rápido a los dinosaurios que marcaste.
                                    </p>
                                    <button className="btn btn-sm btn-light fw-semibold" type="button"
                                            onClick={e => { e.stopPropagation(); props.onNavegar('/favoritos'); }}>
                                        Ver favoritos →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dinosaurios destacados */}
            <section className="container pb-5">
                <div className="d-flex align-items-center gap-2 mb-4">
                    <div style={{ width: 4, height: 28, backgroundColor: '#2e6da4', borderRadius: 2 }} />
                    <h3 className="fw-bold mb-0">Dinosaurios destacados</h3>
                </div>
                {cargando ? (
                    <Cargando />
                ) : destacados.length === 0 ? (
                    <div className="alert alert-secondary">No hay dinosaurios disponibles aún.</div>
                ) : (
                    <div className="row g-4">
                        {destacados.map(dino => (
                            <div className="col-sm-6 col-lg-3" key={dino.id}>
                                <div className="card h-100 border-0 feature-card overflow-hidden"
                                     style={{ cursor: props.sesion ? 'pointer' : 'default' }}
                                     onClick={() => props.sesion && props.onNavegar(`/dinosaurios/${dino.id}`)}>
                                    {dino.imagen ? (
                                        <img src={dino.imagen} alt={dino.nombre}
                                             style={{ height: 200, objectFit: 'cover', width: '100%' }}
                                             onError={e => (e.currentTarget.style.display = 'none')} />
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center"
                                             style={{ height: 200, background: '#1b3a5c' }}>
                                            <span className="fs-1">🦕</span>
                                        </div>
                                    )}
                                    <div className="card-body p-3">
                                        <h6 className="fw-bold mb-2">{dino.nombre}</h6>
                                        <div className="d-flex gap-1 flex-wrap">
                                            <span className="badge" style={{ backgroundColor: '#2e6da4' }}>{dino.tipo}</span>
                                            <span className="badge bg-secondary">{dino.epoca}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default InicioPage;
