import { SesionUsuario } from '../types';

const CLAVE = 'dbp.sesion';

export function obtenerSesion(): SesionUsuario | null {
    const raw = sessionStorage.getItem(CLAVE);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as SesionUsuario;
    } catch {
        sessionStorage.removeItem(CLAVE);
        return null;
    }
}

export function guardarSesion(datos: SesionUsuario): void {
    sessionStorage.setItem(CLAVE, JSON.stringify(datos));
}

export function limpiarSesion(): void {
    sessionStorage.removeItem(CLAVE);
}

export function obtenerToken(): string | null {
    return obtenerSesion()?.token ?? null;
}
