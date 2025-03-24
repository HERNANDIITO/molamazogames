import React from 'react';
import './Header.scss';

import Logo from '../Logo/Logo';
import Profile from '../Profile/Profile'
import Button from '../Button/Button';
import NavBar from '../NavBar/NavBar';
import SearchBar from '../SearchBar/SearchBar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaPlus } from 'react-icons/fa';

const anyadirAsset = () => {
    window.location.href = "#new";
}

const Header = () =>{
    return(
        <header className='App_header'>
            <div class="header_h">
                <Logo isInNav={true}></Logo>
                <SearchBar></SearchBar>
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
            </div>
            <div>
                <NavBar></NavBar>
            </div>
        </header>
    );
}

export default Header;