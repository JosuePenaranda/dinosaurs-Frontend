import React, { useEffect, useState } from 'react';
import BuscadorEntidades from '../components/BuscadorEntidades';
import Cargando from '../components/Cargando';
import DetalleEntidad from '../components/DetalleEntidad';
import ListaEntidades from '../components/ListaEntidades';

interface Item {
    id: number;
    nombre: string;
    contenidoHtml?: string;
    [key: string]: unknown;
}

interface CatalogoPageProps {
    titulo: string;
    placeholder: string;
    badge: string;
    textoVacio: string;
    cargarItems: (nombre?: string) => Promise<Item[]>;
}

function CatalogoPage(props: CatalogoPageProps) {
    const [busqueda, setBusqueda] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [seleccionado, setSeleccionado] = useState<Item | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargar = async (nombre?: string) => {
        try {
            setCargando(true);
            setError('');
            const datos = await props.cargarItems(nombre);
            setItems(datos);
            setSeleccionado(datos[0] ?? null);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error desconocido');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleBuscar(e: React.FormEvent) {
        e.preventDefault();
        cargar(busqueda);
    }

    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-1">{props.titulo}</h2>
            <p className="text-secondary mb-4">
                Usá el buscador para filtrar por nombre y seleccioná un elemento para ver su detalle.
            </p>

            <BuscadorEntidades
                valor={busqueda}
                onChange={setBusqueda}
                onBuscar={handleBuscar}
                placeholder={props.placeholder}
            />

            {cargando ? (
                <Cargando />
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-4">
                        <ListaEntidades
                            items={items}
                            seleccionado={seleccionado}
                            onSeleccionar={setSeleccionado}
                            textoVacio={props.textoVacio}
                        />
                    </div>
                    <div className="col-lg-8">
                        <DetalleEntidad item={seleccionado} badge={props.badge} />
                    </div>
                </div>
            )}
        </section>
    );
}

export default CatalogoPage;
