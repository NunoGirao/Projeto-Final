import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    const handleLinkClick = () => {
        navigate('/about'); // Navegar para a página "about" ao clicar no link
    };

    return (
        <footer className="bg-black text-white" style={{ width: '100%', marginTop: '20px' }}>
            <p>Este é o footer.</p>
            <a href="#" onClick={handleLinkClick} className="text-white">Sobre</a>
        </footer>
    );
};

export default Footer;