import React from 'react';
import { SesionUsuario } from '../types';
import { formatRol } from '../utils/formatters';

interface NavbarProps {
    sesion: SesionUsuario | null;
    onNavegar: (ruta: string) => void;
    onLogout: () => void;
}

function Navbar(props: NavbarProps) {
    const esAdmin = props.sesion?.rol === 'ADMIN';
    const logueado = props.sesion !== null;

    function link(ruta: string, texto: string, extra?: string) {
        return (
            <li className="nav-item">
                <a className={`nav-link${extra ? ` ${extra}` : ''}`} href={`#${ruta}`}
                   onClick={(e) => { e.preventDefault(); props.onNavegar(ruta); }}>
                    {texto}
                </a>
            </li>
        );
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div className="container">
                <a className="navbar-brand fw-bold d-flex align-items-center gap-2"
                   href="#/"
                   onClick={(e) => { e.preventDefault(); props.onNavegar('/'); }}>
                    <img src="/images/branding/icon.png"
                         alt="Dino Portal"
                         className="brand-icon rounded-circle" />
                    <span>Dino Portal</span>
                </a>

                <button className="navbar-toggler" type="button"
                        data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menuPrincipal">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {link('/', 'Inicio')}
                        {link('/dinosaurios', 'Dinosaurios')}
                        {logueado && link('/favoritos', 'Favoritos')}
                        {logueado && link('/contribuir', 'Contribuir')}
                        {logueado && link('/mis-contribuciones', 'Mis contribuciones')}
                        {esAdmin && link('/admin/pendientes', 'Pendientes', 'fw-semibold text-warning')}
                    </ul>

                    <div className="d-flex align-items-center gap-3 text-white small">
                        {logueado ? (
                            <>
                                <div className="text-end d-none d-md-block">
                                    <div className="fw-semibold">{props.sesion!.username}</div>
                                    <div className="text-secondary">{formatRol(props.sesion!.rol)}</div>
                                </div>
                                <button className="btn btn-outline-light btn-sm"
                                        type="button" onClick={props.onLogout}>
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-warning btn-sm fw-semibold"
                                    type="button"
                                    onClick={() => props.onNavegar('/login')}>
                                Iniciar sesión
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
