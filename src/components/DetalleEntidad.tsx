import React from 'react';

interface Item {
    id: number;
    nombre: string;
    contenidoHtml?: string;
    imagenUrl?: string;
    [key: string]: unknown;
}

interface DetalleEntidadProps {
    item: Item | null;
    badge?: string;
}

function DetalleEntidad(props: DetalleEntidadProps) {
    if (!props.item) {
        return (
            <div className="card shadow-sm h-100">
                <div className="card-body text-secondary">
                    Seleccioná un elemento de la lista para ver el detalle.
                </div>
            </div>
        );
    }

    const item = props.item;
    const html = (item.contenidoHtml ?? '<p>Sin contenido.</p>')
        .replace(/^\s*<h[1-6][^>]*>.*?<\/h[1-6]>\s*/i, '');

    // Fallback de imágenes por nombre normalizado
    const nombreNorm = item.nombre
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const fallbacks: Record<string, string> = {
        'goku':    '/images/personajes/goku.jpg',
        'vegeta':  '/images/personajes/vegeta.jpg',
        'gohan':   '/images/personajes/gohan.jpg',
        'piccolo': '/images/personajes/piccolo.jpg',
        'freezer': '/images/personajes/freezer.jpg',
        'frieza':  '/images/personajes/freezer.jpg',
    };

    const imagenSrc = item.imagenUrl || fallbacks[nombreNorm] || '';

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <h4 className="card-title mb-0">{item.nombre}</h4>
                    {props.badge && (
                        <span className="badge text-bg-warning">{props.badge}</span>
                    )}
                </div>

                {imagenSrc && (
                    <div className="detail-image-shell mb-4">
                        <div className="detail-image-frame">
                            <img
                                src={imagenSrc}
                                alt={item.nombre}
                                className="detail-main-image"
                                onError={(e) => {
                                    const shell = (e.currentTarget as HTMLElement)
                                        .closest('.detail-image-shell') as HTMLElement | null;
                                    if (shell) shell.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="detail-html"
                     dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    );
}

export default DetalleEntidad;
