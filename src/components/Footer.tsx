import React from 'react';

function Footer() {
    return (
        <footer className="bg-dark text-white py-4 mt-5">
            <div className="container text-center small">
                <span>Dino Portal &copy; {new Date().getFullYear()}</span>
            </div>
        </footer>
    );
}

export default Footer;
