import { obtenerToken } from './authService';
import { SesionUsuario, Dinosaurio, Contribucion, ContribucionRequest } from '../types';

const BASE = process.env.REACT_APP_API_URL ?? 'http://localhost:8080/api';

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
    try { datos = texto ? JSON.parse(texto) : null; } catch { datos = texto || null; }

    if (!respuesta.ok) {
        const msg = typeof datos === 'object' && datos !== null && 'message' in datos
            ? (datos as { message: string }).message
            : 'Error en la solicitud';
        throw new Error(msg);
    }

    return datos as T;
}

export const api = {
    // Auth
    login: (cuerpo: { username: string; password: string }) =>
        solicitar<SesionUsuario>('/auth/login', { method: 'POST', body: JSON.stringify(cuerpo) }),

    register: (cuerpo: { username: string; correo: string; password: string }) =>
        solicitar<string>('/auth/register', { method: 'POST', body: JSON.stringify(cuerpo) }),

    // Dinosaurios
    getDinosaurios: (nombre?: string, tipo?: string, epoca?: string) => {
        const params = new URLSearchParams();
        if (nombre) params.append('nombre', nombre);
        if (tipo)   params.append('tipo', tipo);
        if (epoca)  params.append('epoca', epoca);
        const query = params.toString();
        return solicitar<Dinosaurio[]>(`/dinosaurios${query ? `?${query}` : ''}`);
    },

    getDinosaurio: (id: number) =>
        solicitar<Dinosaurio>(`/dinosaurios/${id}`),

    // Favoritos
    getFavoritos: () =>
        solicitar<{ id: number; dinosaurio: Dinosaurio }[]>('/favoritos'),

    agregarFavorito: (dinosaurioId: number) =>
        solicitar<string>(`/favoritos/${dinosaurioId}`, { method: 'POST' }),

    eliminarFavorito: (dinosaurioId: number) =>
        solicitar<string>(`/favoritos/${dinosaurioId}`, { method: 'DELETE' }),

    // Contribuciones
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
