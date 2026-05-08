import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Banner from './components/Banner';
import AlertaMensaje from './components/AlertaMensaje';
import InicioPage from './pages/InicioPage';
import LoginPage from './pages/LoginPage';
import PersonajesPage from './pages/PersonajesPage';
import SagasPage from './pages/SagasPage';
import RazasPage from './pages/RazasPage';
import ContribuirPage from './pages/ContribuirPage';
import MisContribucionesPage from './pages/MisContribucionesPage';
import AdminPendientesPage from './pages/AdminPendientesPage';
import CompararPage from './pages/CompararPage';
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
        switch (ruta) {
            case '/login':
                return (
                    <LoginPage
                        onSesion={setSesion}
                        onNavegar={navegar}
                        onMensaje={setMensaje}
                    />
                );
            case '/personajes':
                return <PersonajesPage />;
            case '/sagas':
                return <SagasPage />;
            case '/razas':
                return <RazasPage />;
            case '/comparar':
                return <CompararPage />;
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
