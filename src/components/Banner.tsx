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
        titulo: 'Dino Portal',
        descripcion: 'Tu enciclopedia de dinosaurios. Explorá, descubrí y guardá tus favoritos.',
        imagen: '/images/pages/incio.png',
        altImagen: 'Inicio',
    },
    '/dinosaurios': {
        eyebrow: 'Catálogo',
        titulo: 'Dinosaurios',
        descripcion: 'Explorá todos los dinosaurios, filtrá por tipo, época o nombre.',
        imagen: '/images/pages/dinosaurios.png',
        altImagen: 'Dinosaurios',
    },
    '/favoritos': {
        eyebrow: 'Mi cuenta',
        titulo: 'Mis favoritos',
        descripcion: 'Los dinosaurios que marcaste como favoritos.',
        imagen: '/images/pages/favoritos.png',
        altImagen: 'Favoritos',
    },
    '/contribuir': {
        eyebrow: 'Mi cuenta',
        titulo: 'Enviar contribución',
        descripcion: 'Aportá un nuevo dinosaurio al portal para que el administrador lo revise.',
        imagen: '/images/pages/contribuciones.png',
        altImagen: 'Contribuir',
    },
    '/mis-contribuciones': {
        eyebrow: 'Mi cuenta',
        titulo: 'Mis contribuciones',
        descripcion: 'Revisá el estado de todo el contenido que enviaste al portal.',
        imagen: '/images/pages/Mis-Contribuciones.png',
        altImagen: 'Mis contribuciones',
    },
    '/admin/pendientes': {
        eyebrow: 'Administración',
        titulo: 'Contribuciones pendientes',
        descripcion: 'Revisá y moderá los aportes de los usuarios antes de publicarlos.',
        imagen: '/images/pages/inicio-sesion.png',
        altImagen: 'Pendientes',
    },
    '/login': {
        eyebrow: 'Acceso',
        titulo: 'Iniciar sesión',
        descripcion: 'Ingresá al portal para guardar favoritos y contribuir contenido.',
        imagen: '/images/pages/inicio-sesion.png',
        altImagen: 'Login',
    },
};

interface BannerProps {
    ruta: string;
}

function Banner(props: BannerProps) {
    // Para rutas dinámicas como /dinosaurios/5 usamos el banner de dinosaurios
    const clave = props.ruta.startsWith('/dinosaurios/') ? '/dinosaurios' : props.ruta;
    const config = configs[clave] ?? configs['/'];

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
