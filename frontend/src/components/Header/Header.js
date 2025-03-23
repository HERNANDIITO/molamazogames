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

const Header = () =>{
    return(
        <header>
            <div class="header_h">
                <Logo isInNav={true}></Logo>
                <SearchBar></SearchBar>
                <Button
                    label="Añadir asset"
                    icon={<FaPlus />}
                    iconPosition="left"
                    //onClick={handleClick}
                    //disabled={true}
                    className="seleccionable-btn"
                />
                <Profile></Profile>
            </div>
            <div>
                <NavBar></NavBar>
            </div>
        </header>
    );
}

export default Header;