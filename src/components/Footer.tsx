import React from 'react';

function Footer() {
    return (
        <footer className="text-white py-4 mt-5" style={{ backgroundColor: '#0d1b2a' }}>
            <div className="container text-center small">
                <span>Dino Portal &copy; {new Date().getFullYear()} — Todos los derechos reservados</span>
            </div>
        </footer>
    );
}

export default Footer;
