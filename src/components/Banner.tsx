import React from 'react';

interface BannerConfig {
    eyebrow: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    altImagen: string;
}

const configs: Record<string, BannerConfig> = {
    '/': {
        eyebrow: 'Bienvenido',
        titulo: 'Dragon Ball Portal',
        descripcion: 'Tu enciclopedia del universo Dragon Ball. Explorá personajes, sagas y razas.',
        imagen: '/images/pages/inicio.jpg',
        altImagen: 'Inicio',
    },
    '/personajes': {
        eyebrow: 'Catálogo',
        titulo: 'Personajes',
        descripcion: 'Héroes, villanos y guerreros legendarios del universo Dragon Ball.',
        imagen: '/images/pages/personajes.png',
        altImagen: 'Personajes',
    },
    '/sagas': {
        eyebrow: 'Catálogo',
        titulo: 'Sagas',
        descripcion: 'Las historias más importantes de la franquicia Dragon Ball.',
        imagen: '/images/pages/sagas.jpg',
        altImagen: 'Sagas',
    },
    '/razas': {
        eyebrow: 'Catálogo',
        titulo: 'Razas',
        descripcion: 'Descubrí el origen de cada guerrero y su raza en el universo Dragon Ball.',
        imagen: '/images/pages/goku.jpg',
        altImagen: 'Razas',
    },
    '/comparar': {
        eyebrow: 'Herramienta',
        titulo: 'Comparar',
        descripcion: 'Seleccioná dos elementos y comparalos lado a lado.',
        imagen: '/images/pages/personajes.png',
        altImagen: 'Comparar',
    },
    '/contribuir': {
        eyebrow: 'Mi cuenta',
        titulo: 'Enviar contribución',
        descripcion: 'Aportá contenido nuevo al portal para que el administrador lo revise.',
        imagen: '/images/pages/contribuir.jpg',
        altImagen: 'Contribuir',
    },
    '/mis-contribuciones': {
        eyebrow: 'Mi cuenta',
        titulo: 'Mis contribuciones',
        descripcion: 'Revisá el estado de todo el contenido que enviaste al portal.',
        imagen: '/images/pages/mis-contribuciones.jpg',
        altImagen: 'Mis contribuciones',
    },
    '/admin/pendientes': {
        eyebrow: 'Administración',
        titulo: 'Contribuciones pendientes',
        descripcion: 'Revisá y moderá los aportes de los usuarios antes de publicarlos.',
        imagen: '/images/pages/pendientes.jpg',
        altImagen: 'Pendientes',
    },
    '/login': {
        eyebrow: 'Acceso',
        titulo: 'Iniciar sesión',
        descripcion: 'Ingresá al portal para contribuir o administrar contenido.',
        imagen: '/images/pages/login.jpg',
        altImagen: 'Login',
    },
};

interface BannerProps {
    ruta: string;
}

function Banner(props: BannerProps) {
    const config = configs[props.ruta] ?? configs['/'];

    return (
        <section className="global-banner py-5">
            <div className="container">
                <div className="row align-items-center g-4">
                    <div className="col-lg-7">
                        <div className="text-warning fw-semibold text-uppercase mb-2 small">
                            {config.eyebrow}
                        </div>
                        <h1 className="display-5 fw-bold mb-3">{config.titulo}</h1>
                        <p className="lead mb-0" style={{opacity: 0.9}}>{config.descripcion}</p>
                    </div>
                    <div className="col-lg-5">
                        <div className="banner-image-card shadow-lg">
                            <img src={config.imagen} alt={config.altImagen} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Banner;
