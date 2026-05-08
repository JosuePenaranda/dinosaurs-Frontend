import React, { useEffect, useState } from 'react';
import DetailCard from '../components/DetailCard';
import EntityList from '../components/EntityList';
import LoadingBlock from '../components/LoadingBlock';
import SearchPanel from '../components/SearchPanel';
import SectionTitle from '../components/SectionTitle';

interface Item {
  id: number;
  [key: string]: unknown;
}

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  placeholder?: string;
  loadEntities: (nombre?: string) => Promise<Item[]>;
  emptyText?: string;
  badge?: string;
}

function EntityCatalogPage({ eyebrow, title, description, placeholder, loadEntities, emptyText, badge }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [elementos, setElementos] = useState<Item[]>([]);
  const [seleccionado, setSeleccionado] = useState<Item | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarElementos = async (nombre: string = '') => {
    try {
      setCargando(true);
      setError('');
      const datos = await loadEntities(nombre);
      setElementos(datos);
      setSeleccionado(datos[0] ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarElementos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    cargarElementos(busqueda);
  };

  return (
    <section className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <SectionTitle eyebrow={eyebrow} title={title} description={description} />
          <SearchPanel value={busqueda} onChange={setBusqueda} onSearch={manejarBusqueda} placeholder={placeholder} />
        </div>
      </div>

      {cargando ? (
        <LoadingBlock />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-4">
            <EntityList items={elementos} onSelect={setSeleccionado} emptyText={emptyText} />
          </div>
          <div className="col-lg-8">
            <DetailCard item={seleccionado} badge={badge} />
          </div>
        </div>
      )}
    </section>
  );
}

export default EntityCatalogPage;
