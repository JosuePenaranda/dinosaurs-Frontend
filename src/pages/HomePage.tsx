import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { MensajeGlobal, Personaje, Saga, Raza } from '../types';

interface HomePageProps {
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
}

function HomePage(props: HomePageProps) {
    const [personajes, setPersonajes] = useState<Personaje[]>([]);
    const [sagas, setSagas] = useState<Saga[]>([]);
    const [razas, setRazas] = useState<Raza[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [dp, ds, dr] = await Promise.all([
                    api.getPersonajes(),
                    api.getSagas(),
                    api.getRazas(),
                ]);
                setPersonajes(dp.slice(0, 4));
                setSagas(ds.slice(0, 4));
                setRazas(dr.slice(0, 4));
            } catch (error: unknown) {
                props.onMensaje({
                    tipo: 'danger',
                    texto: error instanceof Error ? error.message : 'Error desconocido',
                });
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    return (
        <>
            {/* Cards de secciones */}
            <section className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 h-100 feature-card">
                            <img src="/images/pages/personajes.png" className="card-img-top section-card-image" alt="Personajes" />
                            <div className="card-body">
                                <h3 className="h5 fw-bold">Personajes</h3>
                                <p className="text-secondary mb-3">Explorá las fichas publicadas y revisá su contenido detallado.</p>
                                <button className="btn btn-outline-dark" type="button" onClick={() => props.onNavegar('/personajes')}>Entrar</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 h-100 feature-card">
                            <img src="/images/pages/sagas.jpg" className="card-img-top section-card-image" alt="Sagas" />
                            <div className="card-body">
                                <h3 className="h5 fw-bold">Sagas</h3>
                                <p className="text-secondary mb-3">Consultá los grandes arcos narrativos de la serie dentro del portal.</p>
                                <button className="btn btn-outline-dark" type="button" onClick={() => props.onNavegar('/sagas')}>Entrar</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 h-100 feature-card">
                            <img src="/images/pages/goku.jpg" className="card-img-top section-card-image" alt="Razas" />
                            <div className="card-body">
                                <h3 className="h5 fw-bold">Razas</h3>
                                <p className="text-secondary mb-3">Descubrí el origen y las características de cada raza del universo Dragon Ball.</p>
                                <button className="btn btn-outline-dark" type="button" onClick={() => props.onNavegar('/razas')}>Entrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resumen de contenido publicado */}
            <section className="container pb-5">
                <h2 className="fw-bold mb-1">Resumen general</h2>
                <p className="text-secondary mb-4">Un vistazo rápido al contenido disponible dentro del portal.</p>

                {cargando ? (
                    <Cargando />
                ) : (
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <h4 className="h6 fw-bold text-uppercase text-warning">Personajes</h4>
                                    <ul className="list-group list-group-flush mt-3">
                                        {personajes.length === 0
                                            ? <li className="list-group-item px-0 text-secondary">Sin registros publicados.</li>
                                            : personajes.map((item) => (
                                                <li key={item.id} className="list-group-item px-0">{item.nombre}</li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <h4 className="h6 fw-bold text-uppercase text-warning">Sagas</h4>
                                    <ul className="list-group list-group-flush mt-3">
                                        {sagas.length === 0
                                            ? <li className="list-group-item px-0 text-secondary">Sin registros publicados.</li>
                                            : sagas.map((item) => (
                                                <li key={item.id} className="list-group-item px-0">{item.nombre}</li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <h4 className="h6 fw-bold text-uppercase text-warning">Razas</h4>
                                    <ul className="list-group list-group-flush mt-3">
                                        {razas.length === 0
                                            ? <li className="list-group-item px-0 text-secondary">Sin registros publicados.</li>
                                            : razas.map((item) => (
                                                <li key={item.id} className="list-group-item px-0">{item.nombre}</li>
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

export default HomePage;
