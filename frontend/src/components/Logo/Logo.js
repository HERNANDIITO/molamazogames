// src/components/Button/Button.js

import React from 'react';
import './Logo.scss';
import logo from '../../assets/images/logo.png';
import Button from '../Button/Button';

const Logo = ({
  isInNav = false
}) => {
  return (
    <>
      {isInNav ? (
        <>
          <Button
            label="Saltar al contenido principal"
            iconPosition="left"
            className="grande-btn saltar-contenido-principal-btn"
            // href=".contenido-principal"
            onClick={() => {
              const contenido = document.querySelector('.contenido-principal');
              if (contenido) {
                contenido.focus();
                contenido.scrollIntoView({ behavior: 'smooth' }); 
              }
            }}
          />
          <a className="logo" href="./">
            <img src={logo} alt="Ir al menú principal de Molamazogames" />
            <h1 aria-hidden="true">MoLaMaZoGAMES</h1>
          </a>
        </>
      ) : (
        <a className="logo" href="./">
          <img src={logo} alt="Ir al menú principal de Molamazogames" />
          <h2 aria-hidden="true">MoLaMaZoGAMES</h2>
        </a>
      )}
    </>
  );
}
export default Logo;