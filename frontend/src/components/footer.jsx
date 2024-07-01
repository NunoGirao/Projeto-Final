import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaFacebookF />, url: 'https://www.facebook.com/profile.php?id=61560524894232', label: 'Facebook' },
    { icon: <FaTwitter />, url: 'https://x.com/NoBolso24', label: 'Twitter' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/nobolso24/', label: 'Instagram' },
  ];

  const quickLinks = [
    { name: 'Teatro & Arte', path: '/teatroarte' },
    { name: 'Música & Festivais', path: '/musicafestival' },
    { name: 'Família', path: '/familia' },
    { name: 'Desporto & Aventura', path: '/desportoaventura' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">NoBolso</h2>
            <p className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              ISCAC, Quinta Agrícola – Bencanta
            </p>
            <p className="flex items-center">
              <FaEnvelope className="mr-2" />
              <a href="mailto:nobolso24@gmail.com" className="hover:text-blue-400 transition-colors">
                nobolso24@gmail.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Segue-nos</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>&copy; {currentYear} NoBolso. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;