import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Banner from './components/Banner';
import AlertaMensaje from './components/AlertaMensaje';
import InicioPage from './pages/InicioPage';
import LoginPage from './pages/LoginPage';
import DinosauriosPage from './pages/DinosauriosPage';
import DetalleDinosaurioPage from './pages/DetalleDinosaurioPage';
import FavoritosPage from './pages/FavoritosPage';
import ContribuirPage from './pages/ContribuirPage';
import MisContribucionesPage from './pages/MisContribucionesPage';
import AdminPendientesPage from './pages/AdminPendientesPage';
import { obtenerSesion, limpiarSesion } from './services/authService';
import { MensajeGlobal, SesionUsuario } from './types';

function obtenerRuta(): string {
    const hash = window.location.hash || '#/';
    const ruta = hash.replace('#', '');
    return ruta.startsWith('/') ? ruta : `/${ruta}`;
}

function App() {
    const [ruta, setRuta] = useState<string>(obtenerRuta);
    const [sesion, setSesion] = useState<SesionUsuario | null>(obtenerSesion);
    const [mensaje, setMensaje] = useState<MensajeGlobal | null>(null);

    useEffect(() => {
        const handler = () => setRuta(obtenerRuta());
        window.addEventListener('hashchange', handler);
        return () => window.removeEventListener('hashchange', handler);
    }, []);

    function navegar(destino: string) {
        window.location.hash = destino;
    }

    function handleLogout() {
        limpiarSesion();
        setSesion(null);
        setMensaje({ tipo: 'success', texto: 'Sesión cerrada correctamente.' });
        navegar('/');
    }

    function renderPagina() {
        // Ruta dinámica: /dinosaurios/:id
        const matchDetalle = ruta.match(/^\/dinosaurios\/(\d+)$/);
        if (matchDetalle) {
            return (
                <DetalleDinosaurioPage
                    id={Number(matchDetalle[1])}
                    onNavegar={navegar}
                    onMensaje={setMensaje}
                    sesion={sesion}
                />
            );
        }

        switch (ruta) {
            case '/login':
                return (
                    <LoginPage
                        onSesion={setSesion}
                        onNavegar={navegar}
                        onMensaje={setMensaje}
                    />
                );
            case '/dinosaurios':
                return (
                    <DinosauriosPage
                        onNavegar={navegar}
                        onMensaje={setMensaje}
                        sesion={sesion}
                    />
                );
            case '/favoritos':
                return (
                    <FavoritosPage
                        sesion={sesion}
                        onNavegar={navegar}
                        onMensaje={setMensaje}
                    />
                );
            case '/contribuir':
                return (
                    <ContribuirPage
                        sesion={sesion}
                        onNavegar={navegar}
                        onMensaje={setMensaje}
                    />
                );
            case '/mis-contribuciones':
                return (
                    <MisContribucionesPage
                        sesion={sesion}
                        onNavegar={navegar}
                        onMensaje={setMensaje}
                    />
                );
            case '/admin/pendientes':
                return (
                    <AdminPendientesPage
                        sesion={sesion}
                        onNavegar={navegar}
                        onMensaje={setMensaje}
                    />
                );
            default:
                return (
                    <InicioPage
                        onNavegar={navegar}
                        onMensaje={setMensaje}
                        sesion={sesion}
                    />
                );
        }
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-body-tertiary">
            <Navbar
                sesion={sesion}
                onNavegar={navegar}
                onLogout={handleLogout}
            />

            <Banner ruta={ruta} />

            <AlertaMensaje mensaje={mensaje} onCerrar={() => setMensaje(null)} />

            <main className="flex-grow-1">
                {renderPagina()}
            </main>

            <Footer />
        </div>
    );
}

export default App;
