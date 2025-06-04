import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Create and import CSS for styling

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Sobre NeoLayer3D</h3>
            <p>Sua loja especializada em impressão 3D, oferecendo produtos, filamentos e serviços de alta qualidade.</p>
            {/* Add social links if needed */}
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Links Rápidos</h3>
            <ul className="footer-links">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/categorias">Categorias</Link></li>
              {/* <li><Link to="/sobre">Sobre Nós</Link></li> */}
              {/* <li><Link to="/contato">Contato</Link></li> */}
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Registrar</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Categorias Populares</h3>
            <ul className="footer-links">
              {/* Dynamically load popular categories later */}
              <li><Link to="/categorias?id=1">Filamentos PLA</Link></li>
              <li><Link to="/categorias?id=2">Resinas</Link></li>
              <li><Link to="/categorias?id=3">Impressoras FDM</Link></li>
              <li><Link to="/categorias?id=4">Acessórios</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contato</h3>
            <ul className="footer-contact">
              <li><i className="fas fa-map-marker-alt"></i> Rua Exemplo, 123, Cidade, Estado</li>
              <li><i className="fas fa-phone"></i> (XX) XXXX-XXXX</li>
              <li><i className="fas fa-envelope"></i> contato@neolayer3d.com</li>
            </ul>
            {/* Newsletter form can be added here if desired */}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NeoLayer3D. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

