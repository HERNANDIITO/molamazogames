import React from 'react';
import './Header.scss';

import Logo from '../Logo/Logo';
import Profile from '../Profile/Profile'
import Button from '../Button/Button';
import NavBar from '../NavBar/NavBar';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect } from "react";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaPlus } from 'react-icons/fa';


const anyadirAsset = () => {
    window.location.href = "#new";
}

const Header = () =>{
    
    const [isLogged, setIsLogged] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLogged(true);
        }
    }, []);

    return(
        <header className='App_header'>
            <div class="header_h">
                <Logo isInNav={true}></Logo>
                <SearchBar></SearchBar>
                { isLogged ? (
                    <div class="but_profile">
                        <Button
                            label="Añadir asset"
                            icon={<FaPlus />}
                            iconPosition="left"
                            onClick={anyadirAsset}
                            //disabled={true}
                            className="h_but_anadir"
                        />
                        <Profile></Profile>
                    </div>
                ) : (
                    <div className='header-buttons'>
                        <Button
                            label={"Registrarse"}
                            className={"secondary-btn"}
                            href={"/registrar"}
                        ></Button>
                        <Button
                            label={"Iniciar sesión"}
                            href={"/login"}
                        >
                        </Button>
                    </div>
                )}
            </div>
            <div>
                <NavBar></NavBar>
            </div>
        </header>
    );
}

export default Header;