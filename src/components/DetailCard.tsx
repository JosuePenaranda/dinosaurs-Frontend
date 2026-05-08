import React from 'react';

interface Item {
  [key: string]: unknown;
}

interface Props {
  item: Item | null;
  titleField?: string;
  badge?: string;
  emptyText?: string;
}

function DetailCard({ item, titleField = 'nombre', badge, emptyText = 'Seleccioná un elemento para ver el detalle.' }: Props) {
  const titulo = item ? String(item[titleField] ?? '') : '';
  const imagenSrc = item
    ? String(item.imagenUrl ?? item.imagen_url ?? item.imageUrl ?? item.image_url ?? '')
    : '';

  const tituloNormalizado = titulo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const fallbackPorNombre: Record<string, string> = {
    'goku':    '/images/personajes/goku.jpg',
    'vegeta':  '/images/personajes/vegeta.jpg',
    'gohan':   '/images/personajes/gohan.jpg',
    'piccolo': '/images/personajes/piccolo.jpg',
    'freezer': '/images/personajes/freezer.jpg',
    'frieza':  '/images/personajes/freezer.jpg',
  };

  const imagenFinal = imagenSrc || fallbackPorNombre[tituloNormalizado] || '';

  const html = (() => {
    const crudo = item ? String(item.contenidoHtml ?? '<p>Sin contenido.</p>') : '<p>Sin contenido.</p>';
    return crudo.replace(/^\s*<h[1-6][^>]*>.*?<\/h[1-6]>\s*/i, '');
  })();

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        {!item ? (
          <div className="text-secondary">{emptyText}</div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <h4 className="card-title mb-0">{titulo}</h4>
              {badge && <span className="badge text-bg-warning">{badge}</span>}
            </div>

            {imagenFinal && (
              <div className="detail-image-shell mb-4">
                <div className="detail-image-frame">
                  <img
                    src={imagenFinal}
                    alt={titulo}
                    className="detail-main-image"
                    onError={(e) => {
                      const contenedor = (e.currentTarget as HTMLElement).closest('.detail-image-shell') as HTMLElement | null;
                      if (contenedor) contenedor.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="detail-html" dangerouslySetInnerHTML={{ __html: html }} />
          </>
        )}
      </div>
    </div>
  );
}

export default DetailCard;
