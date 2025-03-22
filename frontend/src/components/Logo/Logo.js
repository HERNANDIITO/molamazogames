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
    {
      isInNav && (
        <Button
          label="Saltar al contenido principal"
          iconPosition="left"
          className="grande-btn saltar-contenido-principal-btn"
          href=".contenido-principal"
        />
      )
    }
      <a className="logo" href='index.html'>
        <img src={logo} alt="Ir al menú principal de Molamazogames" />
        <h1 aria-hidden="true">MoLaMaZoGAMES</h1>
      </a>
    </>
  );
}

  
export default Logo;