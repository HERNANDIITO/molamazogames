import React from 'react';
import './Header.scss';

import Logo from '../Logo/Logo';
import Profile from '../Profile/Profile'
import Button from '../Button/Button';
import NavBar from '../NavBar/NavBar';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FaPlus } from 'react-icons/fa';


// const anyadirAsset = () => {
//     window.location.href = "#new";
// }

const Header = () =>{

    const navigate = useNavigate();
    
    const [isLogged, setIsLogged] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLogged(true);
        }
    }, []);

    return(
        <header className='App_header'>
            <div className={isLogged ? "header_h h_logged" : "header_h"}>
                <Logo isInNav={true}></Logo>
                <SearchBar general={true} />
                {/*{isLogged ? (<SearchBar class="search_logged"></SearchBar>) : (<SearchBar></SearchBar>)}*/}
                { isLogged ? (
                    <div class="but_profile">
                        <Button
                            label="Añadir asset"
                            icon={<FaPlus />}
                            iconPosition="left"
                            href="./upAsset"
                            className="h_but_anadir"
                            onClick={() => navigate("/upAsset", { replace: true })}
                        />
                        <Profile></Profile>
                    </div>
                ) : (
                    <div className='header-buttons'>
                        <Button
                            label={"Registrarse"}
                            className={"secondary-btn mediano-btn get-small"}
                            href={"/registrar"}
                        ></Button>
                        <Button
                            label={"Iniciar sesión"}
                            className={"mediano-btn get-small"}
                            href={"/login"}
                        >
                        </Button>
                    </div>
                )}
            </div>
            <NavBar></NavBar>
        </header>
    );
}

export default Header;