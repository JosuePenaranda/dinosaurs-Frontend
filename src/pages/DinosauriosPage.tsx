import React, { useEffect, useState } from 'react';
import Cargando from '../components/Cargando';
import { api } from '../services/api';
import { Dinosaurio, MensajeGlobal, SesionUsuario } from '../types';

interface DinosauriosPageProps {
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
    sesion: SesionUsuario | null;
}

function DinosauriosPage(props: DinosauriosPageProps) {
    const [items, setItems] = useState<Dinosaurio[]>([]);
    const [cargando, setCargando] = useState(true);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [epoca, setEpoca] = useState('');
    const [categoria, setCategoria] = useState('');
    const [nombreDebounced, setNombreDebounced] = useState('');
    const [favoritos, setFavoritos] = useState<Set<number>>(new Set());

    useEffect(() => {
        const t = setTimeout(() => setNombreDebounced(nombre), 300);
        return () => clearTimeout(t);
    }, [nombre]);

    useEffect(() => {
        cargarFavoritos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.sesion]);

    useEffect(() => {
        buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nombreDebounced, tipo, epoca, categoria]);

    async function cargarFavoritos() {
        if (!props.sesion) return;
        try {
            const data = await api.getFavoritos();
            setFavoritos(new Set(data.map(f => f.dinosaurio.id)));
        } catch {}
    }

    async function buscar() {
        setCargando(true);
        try {
            const data = await api.getDinosaurios(nombreDebounced || undefined, tipo || undefined, epoca || undefined, categoria || undefined);
            setItems(data);
        } catch (e: unknown) {
            props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error al cargar' });
        } finally {
            setCargando(false);
        }
    }

    async function toggleFavorito(e: React.MouseEvent, id: number) {
        e.stopPropagation();
        if (!props.sesion) {
            props.onMensaje({ tipo: 'danger', texto: 'Debés iniciar sesión para guardar favoritos.' });
            return;
        }
        try {
            if (favoritos.has(id)) {
                await api.eliminarFavorito(id);
                setFavoritos(prev => { const s = new Set(prev); s.delete(id); return s; });
            } else {
                await api.agregarFavorito(id);
                setFavoritos(prev => new Set(prev).add(id));
            }
        } catch (e: unknown) {
            props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error' });
        }
    }

    if (!props.sesion) {
        return (
            <section className="container py-5">
                <div className="alert alert-warning">Debés iniciar sesión para ver el catálogo de dinosaurios.</div>
                <button type="button" className="btn btn-warning mt-2"
                        onClick={() => props.onNavegar('/login')}>
                    Ir al login
                </button>
            </section>
        );
    }

    return (
        <section className="container py-5">
            <div className="row g-4">
                {/* Sidebar filtros */}
                <div className="col-lg-3">
                    <div className="card border-0 shadow-sm sticky-top" style={{ top: 80 }}>
                        <div className="card-body p-3">
                            <h6 className="fw-bold mb-3" style={{ color: '#0d1b2a' }}>Filtros</h6>
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Buscar</label>
                                <input type="text" className="form-control form-control-sm"
                                       placeholder="Nombre del dinosaurio..."
                                       value={nombre} onChange={e => setNombre(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Tipo</label>
                                <select className="form-select form-select-sm" value={tipo} onChange={e => setTipo(e.target.value)}>
                                    <option value="">Todos</option>
                                    <option value="CARNIVORO">Carnívoro</option>
                                    <option value="HERBIVORO">Herbívoro</option>
                                    <option value="OMNIVORO">Omnívoro</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Época</label>
                                <select className="form-select form-select-sm" value={epoca} onChange={e => setEpoca(e.target.value)}>
                                    <option value="">Todas</option>
                                    <option value="JURASICO">Jurásico</option>
                                    <option value="CRETACICO">Cretácico</option>
                                    <option value="TRIASICO">Triásico</option>
                                    <option value="NEOGENO">Neógeno</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Categoría</label>
                                <select className="form-select form-select-sm" value={categoria} onChange={e => setCategoria(e.target.value)}>
                                    <option value="">Todas</option>
                                    <option value="TERRESTRE">Terrestre</option>
                                    <option value="ACUATICO">Acuático</option>
                                    <option value="AEREO">Aéreo</option>
                                </select>
                            </div>
                            {(nombre || tipo || epoca || categoria) && (
                                <button className="btn btn-sm btn-outline-secondary w-100" type="button"
                                        onClick={() => { setNombre(''); setTipo(''); setEpoca(''); setCategoria(''); }}>
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                <div className="col-lg-9">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-secondary small">{items.length} resultado{items.length !== 1 ? 's' : ''}</span>
                    </div>
                    {cargando ? (
                        <Cargando />
                    ) : items.length === 0 ? (
                        <div className="alert alert-secondary">No se encontraron dinosaurios con esos criterios.</div>
                    ) : (
                        <div className="row g-3">
                            {items.map(dino => (
                                <div className="col-sm-6 col-xl-4" key={dino.id}>
                                    <div className="card h-100 border-0 feature-card"
                                         style={{ cursor: 'pointer' }}
                                         onClick={() => props.onNavegar(`/dinosaurios/${dino.id}`)}>
                                        {dino.imagen && (
                                            <img src={dino.imagen} alt={dino.nombre}
                                                 className="card-img-top section-card-image"
                                                 onError={e => (e.currentTarget.style.display = 'none')} />
                                        )}
                                        <div className="card-body d-flex flex-column p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="card-title mb-0 fw-bold">{dino.nombre}</h6>
                                                <button type="button" className="btn btn-sm p-0 ms-2"
                                                        title={favoritos.has(dino.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                                        onClick={e => toggleFavorito(e, dino.id)}>
                                                    <span style={{ fontSize: '1.2rem', color: favoritos.has(dino.id) ? '#2e6da4' : '#adb5bd' }}>
                                                        {favoritos.has(dino.id) ? '★' : '☆'}
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="d-flex gap-1 mb-2 flex-wrap">
                                                <span className="badge" style={{ backgroundColor: '#2e6da4' }}>{dino.tipo}</span>
                                                <span className="badge bg-secondary">{dino.epoca}</span>
                                            </div>
                                            {dino.descripcion && (
                                                <p className="card-text text-secondary small flex-grow-1" style={{ fontSize: '0.8rem' }}>
                                                    {dino.descripcion.replace(/<[^>]*>/g, '').length > 80
                                                        ? dino.descripcion.replace(/<[^>]*>/g, '').substring(0, 80) + '...'
                                                        : dino.descripcion.replace(/<[^>]*>/g, '')}
                                                </p>
                                            )}
                                            <button type="button"
                                                    className="btn btn-sm mt-auto fw-semibold"
                                                    style={{ backgroundColor: '#0d1b2a', color: 'white', fontSize: '0.8rem' }}
                                                    onClick={e => { e.stopPropagation(); props.onNavegar(`/dinosaurios/${dino.id}`); }}>
                                                Ver detalle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default DinosauriosPage;
