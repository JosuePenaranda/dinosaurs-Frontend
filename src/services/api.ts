import { obtenerToken } from './authService';
import { SesionUsuario, Personaje, Saga, Raza, Contribucion, ContribucionRequest } from '../types';

const BASE = 'http://localhost:8080/api';

// Función genérica: agrega Authorization: Bearer <token> si hay sesión activa
async function solicitar<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
    const token = obtenerToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(opciones.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const respuesta = await fetch(`${BASE}${ruta}`, { ...opciones, headers });

    const texto = await respuesta.text();
    let datos: unknown = null;
    try { datos = texto ? JSON.parse(texto) : null; } catch { datos = texto; }

    if (!respuesta.ok) {
        const msg = typeof datos === 'string'
            ? datos
            : (datos as any)?.message ?? 'Error en la solicitud';
        throw new Error(msg);
    }

    return datos as T;
}

export const api = {
    // Auth
    login: (cuerpo: { username: string; password: string }) =>
        solicitar<SesionUsuario>('/auth/login', { method: 'POST', body: JSON.stringify(cuerpo) }),

    register: (cuerpo: { username: string; password: string }) =>
        solicitar<string>('/auth/register', { method: 'POST', body: JSON.stringify(cuerpo) }),

    // Catálogos públicos
    getPersonajes: (nombre?: string) =>
        solicitar<Personaje[]>(`/personajes${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),

    getSagas: (nombre?: string) =>
        solicitar<Saga[]>(`/sagas${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),

    getRazas: (nombre?: string) =>
        solicitar<Raza[]>(`/razas${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),

    // Contribuciones de usuario
    crearContribucion: (cuerpo: ContribucionRequest) =>
        solicitar<string>('/contribuciones', { method: 'POST', body: JSON.stringify(cuerpo) }),

    getMisContribuciones: () =>
        solicitar<Contribucion[]>('/contribuciones/mias'),

    // Admin
    getPendientes: () =>
        solicitar<Contribucion[]>('/admin/pendientes'),

    aprobar: (id: number, observacionAdmin: string) =>
        solicitar<string>(`/admin/contribuciones/${id}/aprobar`, {
            method: 'POST',
            body: JSON.stringify({ observacionAdmin }),
        }),

    rechazar: (id: number, observacionAdmin: string) =>
        solicitar<string>(`/admin/contribuciones/${id}/rechazar`, {
            method: 'POST',
            body: JSON.stringify({ observacionAdmin }),
        }),
};
