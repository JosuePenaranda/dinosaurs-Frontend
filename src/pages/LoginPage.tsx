import React, { useState } from 'react';
import { api } from '../services/api';
import { guardarSesion } from '../services/authService';
import { MensajeGlobal, SesionUsuario } from '../types';

interface LoginPageProps {
    onSesion: (sesion: SesionUsuario) => void;
    onNavegar: (ruta: string) => void;
    onMensaje: (msg: MensajeGlobal) => void;
}

type Modo = 'login' | 'register';

function LoginPage(props: LoginPageProps) {
    const [modo, setModo] = useState<Modo>('login');
    const [username, setUsername] = useState(localStorage.getItem('dp.username') ?? '');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [recordar, setRecordar] = useState(localStorage.getItem('dp.recordar') === 'true');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setCargando(true);
        try {
            const sesion = await api.login({ username, password });

            if (recordar) {
                localStorage.setItem('dp.recordar', 'true');
                localStorage.setItem('dp.username', username);
            } else {
                localStorage.removeItem('dp.recordar');
                localStorage.removeItem('dp.username');
            }

            guardarSesion(sesion);
            props.onSesion(sesion);
            props.onMensaje({ tipo: 'success', texto: `Bienvenido, ${sesion.username}.` });
            props.onNavegar('/');
        } catch {
            setError('Usuario o contraseña incorrectos.');
        } finally {
            setCargando(false);
        }
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setCargando(true);
        try {
            await api.register({ username, correo, password });
            setExito(`Usuario ${username} creado correctamente.`);
            setError('');
            setUsername('');
            setCorreo('');
            setPassword('');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error al registrar');
            setExito('');
        } finally {
            setCargando(false);
        }
    }

    return (
        <section className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-xl-5">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-4 p-md-5">
                            <h2 className="fw-bold mb-1">
                                {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                            </h2>
                            <p className="text-secondary mb-4">
                                {modo === 'login'
                                    ? 'Ingresá tus credenciales para acceder al portal.'
                                    : 'Completá el formulario para registrarte.'}
                            </p>

                            {exito && (
                                <div className="alert alert-success py-2 px-3 mb-3" role="alert">
                                    {exito}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={modo === 'login' ? handleLogin : handleRegister}
                                  className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                        required
                                    />
                                </div>



                                {modo === 'register' && (
                                    <div className="col-12">
                                        <label className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="col-12">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                        required
                                    />
                                </div>

                                {modo === 'login' && (
                                    <div className="col-12 d-flex align-items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="recordar"
                                            className="form-check-input m-0"
                                            checked={recordar}
                                            onChange={(e) => setRecordar(e.target.checked)}
                                        />
                                        <label htmlFor="recordar" className="form-check-label">
                                            Recordar credenciales
                                        </label>
                                    </div>
                                )}

                                <div className="col-12 d-grid mt-2">
                                    <button type="submit"
                                            className="btn btn-warning fw-semibold"
                                            disabled={cargando}>
                                        {cargando
                                            ? 'Procesando...'
                                            : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
                                    </button>
                                </div>
                            </form>

                            <hr className="my-4" />

                            <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() => { setModo(modo === 'login' ? 'register' : 'login'); setError(''); setExito(''); }}>
                                {modo === 'login'
                                    ? '¿No tenés cuenta? Registrate aquí.'
                                    : '¿Ya tenés cuenta? Iniciá sesión.'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LoginPage;
