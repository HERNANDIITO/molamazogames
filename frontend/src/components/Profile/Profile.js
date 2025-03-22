// src/components/Profile/Profile.js

import React, { useState, useEffect, useRef } from 'react';
import './Profile.scss';
import Button from '../Button/Button';
import { getUserByToken } from '../../services/authServices';

const Profile = () => {
    const [isContentVisible, setIsContentVisible] = useState(false);
    const profileImageRef = useRef(null); 
    const profileCardRef = useRef(null); 

    const [userName, setUserName] = useState("");

    // Función para alternar el estado del contenido
    const toggleContent = () => {
        setIsContentVisible(!isContentVisible);
    };

    // Función para manejar el clic fuera del componente
    const handleClickOutside = (event) => {
        if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
            setIsContentVisible(false); 
        }
    };

    // Función para manejar el cambio de foco fuera de profile-container
    const handleFocusOut = (event) => {
        if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
            setIsContentVisible(false); 
        }
    };

    // Función para manejar la interacción por teclado
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ' ') { // Enter o espacio
            toggleContent();
        }
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

  // Agregamos los event listener cuando el componente se monta
  useEffect( () => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('focusin', handleFocusOut, true);

    const token = localStorage.getItem('token');

    getUserByToken(token).then(user => {
        if (user) {
            setUserName(user.displayName);
        }
    });

    // Limpiamos el event listener cuando el componente se desmonta
    return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('focusin', handleFocusOut, true);
    };
    }, []);

    return (
        <div className="profile-container" tabIndex="-1" ref={profileCardRef}> {/* Se agrega tabIndex para permitir que el contenedor tenga el foco */}
        <div
            className="profile-card"
            ref={profileCardRef} // Asignar la referencia al contenedor del perfil
        >
            <header className="profile-header">
            <img
                src="https://randomuser.me/api/portraits/med/men/75.jpg"
                alt="Foto de perfil de Jane Doe"
                className="profile-image"
                onClick={toggleContent} // Manejador de clic
                ref={profileImageRef} // Asignar la referencia a la imagen
                tabIndex="0" // Hacerla accesible por teclado
                onKeyDown={handleKeyPress} // Manejar el evento por teclado
                role="button" // Especificar que la imagen actúa como un botón
            />
            </header>

            {isContentVisible && (
            <>
                <h2 className="profile-name">{userName || "Usuario"}</h2>
                <Button
                    label="Ver Perfil"
                    iconPosition="left"
                    className=""
                    href="h"
                />
                <Button
                    label="Cerrar Sesión"
                    iconPosition="left"
                    className="danger-btn"
                    onClick={handleLogout}
                    href=""
                />
            </>
            )}
        </div>
        </div>
    );
};

export default Profile;
