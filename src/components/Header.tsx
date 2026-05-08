import React from 'react';
import { SesionUsuario } from '../types';
import { formatRol } from '../utils/formatters';

interface ElementoNavProps {
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  highlight?: boolean;
}

function ElementoNav({ label, href, onClick, highlight = false }: ElementoNavProps) {
  return (
    <li className="nav-item">
      <a
        className={`nav-link ${highlight ? 'fw-semibold text-warning' : ''}`}
        href={href}
        onClick={onClick}
      >
        {label}
      </a>
    </li>
  );
}

interface Props {
  session: SesionUsuario | null;
  navigate: (ruta: string) => void;
  onLogout: () => void;
}

function Header({ session, navigate, onLogout }: Props) {
  const esAdmin = session?.rol === 'ADMIN';
  const estaLogueado = Boolean(session);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#/">
          <img src="/images/branding/icon.jpg" alt="Icono Dragon Ball Portal" className="brand-icon rounded-circle" />
          <span>Dragon Ball Portal</span>
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <ElementoNav label="Inicio" href="#/" />
            <ElementoNav label="Personajes" href="#/personajes" />
            <ElementoNav label="Sagas" href="#/sagas" />
            <ElementoNav label="Razas" href="#/razas" />
            <ElementoNav label="Comparar" href="#/comparar" />
            {estaLogueado && <ElementoNav label="Contribuir" href="#/contribuir" />}
            {estaLogueado && <ElementoNav label="Mis contribuciones" href="#/mis-contribuciones" />}
            {esAdmin && <ElementoNav label="Pendientes" href="#/admin/pendientes" highlight />}
          </ul>

          <div className="d-flex align-items-center gap-3 text-white small">
            {estaLogueado ? (
              <>
                <div className="text-end d-none d-md-block">
                  <div className="fw-semibold">{session!.username}</div>
                  <div className="text-secondary">{formatRol(session!.rol)}</div>
                </div>
                <button className="btn btn-outline-light btn-sm" onClick={onLogout}>Cerrar sesión</button>
              </>
            ) : (
              <button className="btn btn-warning btn-sm fw-semibold" onClick={() => navigate('/login')}>Iniciar sesión</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
