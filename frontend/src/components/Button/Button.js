// src/components/Button/Button.js

import React from 'react';
import classNames from 'classnames'; 
import './Button.scss';  

const Button = ({
  label,                    // Texto del botón, si solo icono enviar para que aparezca como tooltip
  onClick,                  // Función que se ejecuta al hacer clic
  type = 'button',          // Tipo de botón (submit, reset, button) 
  className = '',           // Clases adicionales para el botón
  disabled = false,         // Si el botón está deshabilitado
  icon,                     // El icono que se quiere mostrar (opcional)
  iconPosition = 'left',    // Donde colocar el icono 'left', 'right', 'alone'
  href,                     // Si se envia algo en este campo se renderizara un <a>
  download = false
}) => {

  const buttonClasses = classNames(
    'btn',               // Clase base
    className
  );

  const iconElement = icon ? (
    <span className={`icon ${iconPosition === 'left' ? 'icon-left' : iconPosition === 'right' ? 'icon-right' : 'icon-alone'}`} aria-hidden="true">
      {icon}
    </span>
  ) : null;


  if (href) {
    if ( download ) {
      return (
      <a
        href={href}
        className={buttonClasses}
        onClick = {onClick}
        title={iconPosition === 'alone' ? label : ''}
        aria-label={iconPosition === 'alone' ? label : ''}
        download
        target="_blank"
      >
        {iconPosition === 'left' && iconElement}
        {iconPosition !== 'alone' && <span className="label-text">{label}</span>}
        {iconPosition === 'right' && iconElement}
        {iconPosition === 'alone' && iconElement}
      </a>
      )
    }
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick = {onClick}
        title={iconPosition === 'alone' ? label : ''}
        aria-label={iconPosition === 'alone' ? label : ''}
      >
        {iconPosition === 'left' && iconElement}
        {iconPosition !== 'alone' && <span className="label-text">{label}</span>}
        {iconPosition === 'right' && iconElement}
        {iconPosition === 'alone' && iconElement}
      </a>
    );
  } else {
    return (
        <button
          type = {type}
          className = {buttonClasses}  
          onClick = {onClick}
          disabled = {disabled}
          title = {iconPosition === 'alone' ? label : ''} 
          aria-label = {iconPosition === 'alone' ? label : ''}  
        >
          {iconPosition === 'left' && iconElement}
          {iconPosition !== 'alone' && label}
          {iconPosition === 'right' && iconElement}
          {iconPosition === 'alone' && iconElement}
        </button>
      );
  };

};

export default Button;