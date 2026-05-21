import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { badgeEstado, formatEstado, formatFecha } from '../utils/formatters';
import { Contribucion, MensajeGlobal, SesionUsuario } from '../types';

interface MisContribucionesPageProps {
    sesion: SesionUsuario | null;
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
}

function MisContribucionesPage(props: MisContribucionesPageProps) {
    const [items, setItems] = useState<Contribucion[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!props.sesion) return;
        const cargar = async () => {
            try {
                const datos = await api.getMisContribuciones();
                setItems(datos);
            } catch (e: unknown) {
                props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error al cargar' });
            } finally {
                setCargando(false);
            }
        };
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.sesion]);

    if (!props.sesion) {
        return (
            <section className="container py-5">
                <div className="alert alert-warning">
                    Debés iniciar sesión para ver tus contribuciones.
                </div>
                <button type="button" className="btn btn-warning mt-2"
                        onClick={() => props.onNavegar('/login')}>
                    Ir al login
                </button>
            </section>
        );
    }

    const colorEstado: Record<string, string> = {
        PENDIENTE: '#f0ad4e',
        APROBADA: '#2e6da4',
        RECHAZADA: '#dc3545',
    };

    return (
        <section className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 4, height: 28, backgroundColor: '#2e6da4', borderRadius: 2 }} />
                    <div>
                        <h2 className="fw-bold mb-0">Mis contribuciones</h2>
                        <p className="text-secondary small mb-0">Seguimiento de todos los aportes que enviaste.</p>
                    </div>
                </div>
                <button type="button" className="btn btn-sm fw-semibold"
                        style={{ backgroundColor: '#2e6da4', color: 'white' }}
                        onClick={() => props.onNavegar('/contribuir')}>
                    + Nueva contribución
                </button>
            </div>

            {cargando ? (
                <Cargando />
            ) : items.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="fs-1 mb-3">📝</div>
                        <h5 className="fw-bold">Aún no enviaste contribuciones</h5>
                        <p className="text-secondary mb-3">Compartí tu conocimiento sobre dinosaurios con la comunidad.</p>
                        <button type="button" className="btn fw-semibold"
                                style={{ backgroundColor: '#2e6da4', color: 'white' }}
                                onClick={() => props.onNavegar('/contribuir')}>
                            Enviar primera contribución
                        </button>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {items.map((item) => (
                        <div className="card border-0 shadow-sm" key={item.id}
                             style={{ borderLeft: `4px solid ${colorEstado[item.estado] ?? '#6c757d'}` }}>
                            <div className="card-body p-4">
                                <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                                    <div>
                                        <h5 className="mb-1 fw-bold">{item.titulo}</h5>
                                        <div className="text-secondary small">
                                            {item.tipo} · {formatFecha(item.fechaCreacion)}
                                        </div>
                                    </div>
                                    <span className={`badge text-bg-${badgeEstado(item.estado)} align-self-start`}>
                                        {formatEstado(item.estado)}
                                    </span>
                                </div>
                                {item.observacionAdmin && (
                                    <div className="small p-2 rounded mb-3"
                                         style={{ backgroundColor: '#e8f0f7', color: '#0d1b2a' }}>
                                        <strong>Observación:</strong> {item.observacionAdmin}
                                    </div>
                                )}
                                <div className="detail-html border-top pt-3"
                                     dangerouslySetInnerHTML={{ __html: item.contenido ?? '' }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MisContribucionesPage;
