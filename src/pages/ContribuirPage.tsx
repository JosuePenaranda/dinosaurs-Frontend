import React, { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { MensajeGlobal, SesionUsuario } from '../types';

declare global {
    interface Window { Quill: any; }
}

interface ContribuirPageProps {
    sesion: SesionUsuario | null;
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
}

function ContribuirPage(props: ContribuirPageProps) {
    const [tipo, setTipo] = useState('CARNIVORO');
    const [epoca, setEpoca] = useState('JURASICO');
    const [categoria, setCategoria] = useState('TERRESTRE');
    const [titulo, setTitulo] = useState('');
    const [habitat, setHabitat] = useState('');
    const [alimentacion, setAlimentacion] = useState('');
    const [tamanio, setTamanio] = useState('');
    const [curiosidades, setCuriosidades] = useState('');
    const [contenidoHtml, setContenidoHtml] = useState('');
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);
    const [quillListo, setQuillListo] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);
    const inputImagenRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const check = setInterval(() => {
            if (typeof window.Quill !== 'undefined') {
                setQuillListo(true);
                clearInterval(check);
            }
        }, 100);
        return () => clearInterval(check);
    }, []);

    useEffect(() => {
        if (!quillListo || !editorRef.current || quillRef.current) return;
        const quill = new window.Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Describí el dinosaurio...',
            modules: {
                toolbar: [
                    [{ header: [2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'clean'],
                ],
            },
        });
        const qlEditor = editorRef.current.querySelector('.ql-editor') as HTMLElement | null;
        if (qlEditor) qlEditor.style.minHeight = '150px';
        quill.on('text-change', () => setContenidoHtml(quill.root.innerHTML));
        quillRef.current = quill;
    }, [quillListo]);

    if (!props.sesion) {
        return (
            <section className="container py-5">
                <div className="alert alert-warning">Debés iniciar sesión para enviar contribuciones.</div>
                <button type="button" className="btn btn-warning mt-2" onClick={() => props.onNavegar('/login')}>
                    Ir al login
                </button>
            </section>
        );
    }

    function handleImagenChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setImagenFile(file);
        setImagenPreview(file ? URL.createObjectURL(file) : null);
    }

    const esVacio = (html: string) => html.replace(/<[^>]*>/g, '').replace(/\s/g, '').length === 0;

    async function handleEnviar(e: React.FormEvent) {
        e.preventDefault();
        if (!titulo.trim()) { props.onMensaje({ tipo: 'danger', texto: 'El título es requerido.' }); return; }
        if (esVacio(contenidoHtml)) { props.onMensaje({ tipo: 'danger', texto: 'El contenido no puede estar vacío.' }); return; }

        setCargando(true);
        try {
            let imagenRuta = '';
            if (imagenFile) {
                imagenRuta = await api.subirImagenContribucion(imagenFile);
            }
            await api.crearContribucion({
                tipo, epoca, categoria, titulo,
                habitat, alimentacion, tamanio, curiosidades,
                imagen: imagenRuta, contenido: contenidoHtml,
            });
            props.onMensaje({ tipo: 'success', texto: 'Contribución enviada para revisión.' });
            setTitulo('');
            setHabitat('');
            setAlimentacion('');
            setTamanio('');
            setCuriosidades('');
            setImagenFile(null);
            setImagenPreview(null);
            if (inputImagenRef.current) inputImagenRef.current.value = '';
            setTipo('CARNIVORO');
            setEpoca('JURASICO');
            setCategoria('TERRESTRE');
            setContenidoHtml('');
            if (quillRef.current) quillRef.current.setText('');
        } catch (e: unknown) {
            props.onMensaje({ tipo: 'danger', texto: e instanceof Error ? e.message : 'Error desconocido' });
        } finally {
            setCargando(false);
        }
    }

    return (
        <section className="container py-5">
            <div className="row g-4">
                {/* Formulario */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div style={{ width: 4, height: 28, backgroundColor: '#2e6da4', borderRadius: 2 }} />
                                <h4 className="fw-bold mb-0">Enviar contribución</h4>
                            </div>

                            <form className="row g-3" onSubmit={handleEnviar}>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Nombre del dinosaurio</label>
                                    <input type="text" className="form-control" value={titulo}
                                           onChange={e => setTitulo(e.target.value)}
                                           placeholder="Ej: Tyrannosaurus Rex..." required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Tipo</label>
                                    <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                                        <option value="CARNIVORO">Carnívoro</option>
                                        <option value="HERBIVORO">Herbívoro</option>
                                        <option value="OMNIVORO">Omnívoro</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Época</label>
                                    <select className="form-select" value={epoca} onChange={e => setEpoca(e.target.value)}>
                                        <option value="JURASICO">Jurásico</option>
                                        <option value="CRETACICO">Cretácico</option>
                                        <option value="TRIASICO">Triásico</option>
                                        <option value="NEOGENO">Neógeno</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-semibold">Categoría</label>
                                    <select className="form-select" value={categoria} onChange={e => setCategoria(e.target.value)}>
                                        <option value="TERRESTRE">Terrestre</option>
                                        <option value="ACUATICO">Acuático</option>
                                        <option value="AEREO">Aéreo</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-semibold">Alimentación</label>
                                    <input type="text" className="form-control" value={alimentacion}
                                           onChange={e => setAlimentacion(e.target.value)}
                                           placeholder="Ej: Carne, plantas..." />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-semibold">Tamaño</label>
                                    <input type="text" className="form-control" value={tamanio}
                                           onChange={e => setTamanio(e.target.value)}
                                           placeholder="Ej: 12 metros..." />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-semibold">Hábitat</label>
                                    <input type="text" className="form-control" value={habitat}
                                           onChange={e => setHabitat(e.target.value)}
                                           placeholder="Ej: Bosques de Norteamérica..." />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-semibold">Curiosidades</label>
                                    <textarea className="form-control" rows={2} value={curiosidades}
                                              onChange={e => setCuriosidades(e.target.value)}
                                              placeholder="Datos curiosos sobre el dinosaurio..." />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-semibold">Descripción</label>
                                    <div style={{ border: '1px solid #dee2e6', borderRadius: 6, background: '#fff' }}>
                                        {quillListo ? (
                                            <div ref={editorRef} />
                                        ) : (
                                            <div className="p-3 text-secondary small">Cargando editor...</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-12 d-flex gap-2 justify-content-end mt-2">
                                    <button type="button" className="btn btn-outline-secondary"
                                            onClick={() => props.onNavegar('/')}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn fw-semibold" disabled={cargando}
                                            style={{ backgroundColor: '#2e6da4', color: 'white' }}>
                                        {cargando ? 'Enviando...' : 'Enviar contribución'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body p-3">
                            <h6 className="fw-bold mb-3">Imagen del dinosaurio</h6>
                            <input type="file" className="form-control form-control-sm" accept="image/*"
                                   onChange={handleImagenChange} ref={inputImagenRef} />
                            {imagenPreview ? (
                                <img src={imagenPreview} alt="preview"
                                     className="mt-3 rounded w-100"
                                     style={{ maxHeight: 180, objectFit: 'cover' }} />
                            ) : (
                                <div className="mt-3 rounded d-flex align-items-center justify-content-center"
                                     style={{ height: 120, backgroundColor: '#e8f0f7', color: '#6c757d', fontSize: '0.85rem' }}>
                                    Sin imagen seleccionada
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card border-0 shadow-sm" style={{ backgroundColor: '#e8f0f7' }}>
                        <div className="card-body p-3">
                            <h6 className="fw-bold mb-2" style={{ color: '#0d1b2a' }}>Recomendaciones</h6>
                            <ul className="text-secondary small mb-0 ps-3">
                                <li className="mb-1">Usá un título claro y específico.</li>
                                <li className="mb-1">Describí con el mayor detalle posible.</li>
                                <li className="mb-1">El admin revisará tu aporte antes de publicarlo.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContribuirPage;
