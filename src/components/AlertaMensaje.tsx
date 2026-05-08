import React from 'react';
import { MensajeGlobal } from '../types';

interface AlertaMensajeProps {
    mensaje: MensajeGlobal | null;
    onCerrar: () => void;
}

function AlertaMensaje(props: AlertaMensajeProps) {
    if (!props.mensaje) return null;

    return (
        <div className="container pt-3">
            <div className={`alert alert-${props.mensaje.tipo} alert-dismissible fade show`} role="alert">
                {props.mensaje.texto}
                <button type="button" className="btn-close" onClick={props.onCerrar}></button>
            </div>
        </div>
    );
}

export default AlertaMensaje;
