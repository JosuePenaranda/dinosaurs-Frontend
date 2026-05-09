import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { Dinosaurio, MensajeGlobal } from '../types';

interface InicioPageProps {
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
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
                <h2 className="fw-bold mb-4">Bienvenido a Dino Portal</h2>
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 h-100 feature-card"
                             style={{ cursor: 'pointer' }}
                             onClick={() => props.onNavegar('/dinosaurios')}>
                            <div className="card-body d-flex flex-column justify-content-center p-4">
                                <div className="fs-1 mb-3">🦕</div>
                                <h4 className="fw-bold">Explorar Dinosaurios</h4>
                                <p className="text-secondary mb-3">
                                    Buscá y filtrá por nombre, tipo y época.
                                </p>
                                <button className="btn btn-outline-dark align-self-start" type="button"
                                        onClick={() => props.onNavegar('/dinosaurios')}>
                                    Ver catálogo
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 h-100 feature-card"
                             style={{ cursor: 'pointer' }}
                             onClick={() => props.onNavegar('/favoritos')}>
                            <div className="card-body d-flex flex-column justify-content-center p-4">
                                <div className="fs-1 mb-3">★</div>
                                <h4 className="fw-bold">Mis Favoritos</h4>
                                <p className="text-secondary mb-3">
                                    Accedé rápido a los dinosaurios que marcaste.
                                </p>
                                <button className="btn btn-outline-warning align-self-start" type="button"
                                        onClick={() => props.onNavegar('/favoritos')}>
                                    Ver favoritos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dinosaurios destacados */}
            <section className="container pb-5">
                <h3 className="fw-bold mb-4">Dinosaurios destacados</h3>
                {cargando ? (
                    <Cargando />
                ) : destacados.length === 0 ? (
                    <div className="alert alert-secondary">No hay dinosaurios disponibles aún.</div>
                ) : (
                    <div className="row g-4">
                        {destacados.map(dino => (
                            <div className="col-sm-6 col-lg-3" key={dino.id}>
                                <div className="card h-100 shadow-sm border-0 feature-card"
                                     style={{ cursor: 'pointer' }}
                                     onClick={() => props.onNavegar(`/dinosaurios/${dino.id}`)}>
                                    {dino.imagen && (
                                        <img src={dino.imagen} alt={dino.nombre}
                                             className="card-img-top section-card-image"
                                             onError={e => (e.currentTarget.style.display = 'none')} />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{dino.nombre}</h5>
                                        <div className="d-flex gap-2">
                                            <span className="badge text-bg-warning">{dino.tipo}</span>
                                            <span className="badge text-bg-secondary">{dino.epoca}</span>
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
