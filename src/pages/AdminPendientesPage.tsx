import React, { useCallback, useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { formatFecha } from '../utils/formatters';
import { Contribucion, MensajeGlobal, SesionUsuario } from '../types';

interface AdminPendientesPageProps {
    sesion: SesionUsuario | null;
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
}

function AdminPendientesPage(props: AdminPendientesPageProps) {
    const [items, setItems] = useState<Contribucion[]>([]);
    const [seleccionado, setSeleccionado] = useState<Contribucion | null>(null);
    const [observacion, setObservacion] = useState('');
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);

    const cargarPendientes = useCallback(async () => {
        try {
            setCargando(true);
            const datos = await api.getPendientes();
            setItems(datos);
            setSeleccionado(datos[0] ?? null);
        } catch (e: unknown) {
            props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error al cargar' });
        } finally {
            setCargando(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.sesion?.rol === 'ADMIN') {
            cargarPendientes();
        }
    }, [props.sesion, cargarPendientes]);

    if (!props.sesion) {
        return (
            <section className="container py-5">
                <div className="alert alert-warning">Debés iniciar sesión.</div>
            </section>
        );
    }

    if (props.sesion.rol !== 'ADMIN') {
        return (
            <section className="container py-5">
                <div className="alert alert-danger">Solo los administradores pueden acceder a esta sección.</div>
                <button type="button" className="btn btn-outline-secondary mt-2"
                        onClick={() => props.onNavegar('/')}>
                    Volver al inicio
                </button>
            </section>
        );
    }

    async function procesar(accion: 'aprobar' | 'rechazar') {
        if (!seleccionado) return;
        setProcesando(true);
        try {
            if (accion === 'aprobar') {
                await api.aprobar(seleccionado.id, observacion);
                props.onMensaje({ tipo: 'success', texto: 'Contribución aprobada correctamente.' });
            } else {
                await api.rechazar(seleccionado.id, observacion);
                props.onMensaje({ tipo: 'success', texto: 'Contribución rechazada.' });
            }
            setObservacion('');
            await cargarPendientes();
        } catch (e: unknown) {
            props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error al procesar' });
        } finally {
            setProcesando(false);
        }
    }

    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-1">Contribuciones pendientes</h2>
            <p className="text-secondary mb-4">
                Revisá y moderá los aportes de los usuarios antes de publicarlos.
            </p>

            {cargando ? (
                <Cargando />
            ) : (
                <div className="row g-4">
                    {/* Lista izquierda */}
                    <div className="col-lg-5">
                        <div className="list-group shadow-sm">
                            {items.length === 0 && (
                                <div className="list-group-item text-secondary">
                                    No hay contribuciones pendientes por revisar.
                                </div>
                            )}
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`list-group-item list-group-item-action ${seleccionado?.id === item.id ? 'active' : ''}`}
                                    onClick={() => { setSeleccionado(item); setObservacion(''); }}
                                >
                                    <div className="fw-semibold">{item.titulo}</div>
                                    <div className="small">{item.tipo} · {formatFecha(item.fechaCreacion)}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Panel derecho */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                {!seleccionado ? (
                                    <div className="text-secondary">
                                        Seleccioná una contribución para revisarla.
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                                            <div>
                                                <h4 className="mb-1">{seleccionado.titulo}</h4>
                                                <div className="text-secondary small">
                                                    {seleccionado.tipo} · Usuario #{seleccionado.usuario?.id}
                                                </div>
                                            </div>
                                            <span className="badge text-bg-warning align-self-start">Pendiente</span>
                                        </div>

                                        <div className="detail-html border rounded p-3 bg-light mb-3"
                                             dangerouslySetInnerHTML={{ __html: seleccionado.contenido ?? '' }} />

                                        <div className="mb-3">
                                            <label className="form-label">Observación del administrador</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={observacion}
                                                onChange={(e) => setObservacion(e.target.value)}
                                                placeholder="Opcional — se mostrará al usuario."
                                            />
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button type="button"
                                                    className="btn btn-success"
                                                    disabled={procesando}
                                                    onClick={() => procesar('aprobar')}>
                                                Aprobar
                                            </button>
                                            <button type="button"
                                                    className="btn btn-danger"
                                                    disabled={procesando}
                                                    onClick={() => procesar('rechazar')}>
                                                Rechazar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminPendientesPage;
