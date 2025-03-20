// src/components/Button/Button.js

import React from 'react';
import './Logo.scss';
import logo from '../../assets/images/logo.png';



function Logo() {
    return (
      <a className='logo'>
        <img src={logo} alt="logo de molamazogames, un mando de consola de videojuegos retro." />
        <h1>MoLaMaZoGAMES</h1>
      </a>
    );
  }
  
export default Logo;