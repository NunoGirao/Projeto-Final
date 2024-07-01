import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    const handleLinkClick = (path) => {
        navigate(path);
    };

    return (
        <footer className="bg-black text-white" style={{ width: '100%', marginTop: '20px', padding: '20px 0' }}>
            <div className="footer-container" style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div className="footer-section">
                    <h4>NoBolso</h4>
                    <p>ISCAC, Quinta Agrícola – Bencanta</p>
                    <p>Email: nobolso24@gmail.com</p>
                </div>
                <div className="footer-section">
                    <h4>Links Rápidos</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li>
                            <a href="#" onClick={() => handleLinkClick('/teatroarte')} className="text-white">Teatro & Arte</a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleLinkClick('/musicafestival')} className="text-white">Música & Festivais</a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleLinkClick('/familia')} className="text-white">Família</a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleLinkClick('/desportoaventura')} className="text-white">Desporto & Aventura</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Segue-nos nas nossas redes sociais!</h4>
                    <ul className="social-icons" style={{ display: 'flex', gap: '10px', listStyle: 'none', padding: 0 }}>
                        <li>
                            <a href="https://www.facebook.com/profile.php?id=61560524894232" target="_blank" rel="noopener noreferrer">
                                <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook" style={{ width: '24px', height: '24px' }} />
                            </a>
                        </li>
                        <li>
                            <a href="https://x.com/NoBolso24" target="_blank" rel="noopener noreferrer">
                                <img src="https://store-images.s-microsoft.com/image/apps.60673.9007199266244427.4d45042b-d7a5-4a83-be66-97779553b24d.5d82b7eb-9734-4b51-b65d-a0383348ab1b?h=464" alt="Twitter" style={{ width: '24px', height: '24px' }} />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/nobolso24/" target="_blank" rel="noopener noreferrer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/800px-Instagram_logo_2022.svg.png" alt="Instagram" style={{ width: '24px', height: '24px' }} />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom" style={{ backgroundColor: '#222', color: '#bbb', textAlign: 'center', padding: '10px 0', fontSize: '14px' }}>
                <p>&copy; 2024 NoBolso.</p>
            </div>
        </footer>
    );
};

export default Footer;