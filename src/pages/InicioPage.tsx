import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { MensajeGlobal, Personaje, Raza, Saga } from '../types';

interface InicioPageProps {
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
}

function InicioPage(props: InicioPageProps) {
    const [personajes, setPersonajes] = useState<Personaje[]>([]);
    const [sagas, setSagas] = useState<Saga[]>([]);
    const [razas, setRazas] = useState<Raza[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [rp, rs, rr] = await Promise.all([
                    api.getPersonajes(),
                    api.getSagas(),
                    api.getRazas(),
                ]);
                setPersonajes(rp.slice(0, 4));
                setSagas(rs.slice(0, 4));
                setRazas(rr.slice(0, 4));
            } catch (e: unknown) {
                props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error al cargar datos' });
            } finally {
                setCargando(false);
            }
        };
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* Cards de secciones */}
            <section className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 h-100 feature-card">
                            <img src="/images/pages/personajes.png"
                                 className="card-img-top section-card-image"
                                 alt="Personajes" />
                            <div className="card-body">
                                <h3 className="h5 fw-bold">Personajes</h3>
                                <p className="text-secondary mb-3">
                                    Explorá las fichas publicadas con contenido detallado.
                                </p>
                                <button className="btn btn-outline-dark"
                                        type="button"
                                        onClick={() => props.onNavegar('/personajes')}>
                                    Ver personajes
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 h-100 feature-card">
                            <img src="/images/pages/sagas.jpg"
                                 className="card-img-top section-card-image"
                                 alt="Sagas" />
                            <div className="card-body">
                                <h3 className="h5 fw-bold">Sagas</h3>
                                <p className="text-secondary mb-3">
                                    Consultá los grandes arcos narrativos de la serie.
                                </p>
                                <button className="btn btn-outline-dark"
                                        type="button"
                                        onClick={() => props.onNavegar('/sagas')}>
                                    Ver sagas
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 h-100 feature-card">
                            <img src="/images/pages/goku.jpg"
                                 className="card-img-top section-card-image"
                                 alt="Razas" />
                            <div className="card-body">
                                <h3 className="h5 fw-bold">Razas</h3>
                                <p className="text-secondary mb-3">
                                    Descubrí el origen y características de cada raza.
                                </p>
                                <button className="btn btn-outline-dark"
                                        type="button"
                                        onClick={() => props.onNavegar('/razas')}>
                                    Ver razas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resumen de contenido */}
            <section className="container pb-5">
                <h2 className="fw-bold mb-4">Contenido publicado</h2>
                {cargando ? (
                    <Cargando />
                ) : (
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <h5 className="fw-bold text-warning text-uppercase mb-3">Personajes</h5>
                                    <ul className="list-group list-group-flush">
                                        {personajes.length === 0
                                            ? <li className="list-group-item px-0 text-secondary">Sin publicados.</li>
                                            : personajes.map(p => (
                                                <li key={p.id} className="list-group-item px-0">{p.nombre}</li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <h5 className="fw-bold text-warning text-uppercase mb-3">Sagas</h5>
                                    <ul className="list-group list-group-flush">
                                        {sagas.length === 0
                                            ? <li className="list-group-item px-0 text-secondary">Sin publicadas.</li>
                                            : sagas.map(s => (
                                                <li key={s.id} className="list-group-item px-0">{s.nombre}</li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <h5 className="fw-bold text-warning text-uppercase mb-3">Razas</h5>
                                    <ul className="list-group list-group-flush">
                                        {razas.length === 0
                                            ? <li className="list-group-item px-0 text-secondary">Sin publicadas.</li>
                                            : razas.map(r => (
                                                <li key={r.id} className="list-group-item px-0">{r.nombre}</li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}

export default InicioPage;
