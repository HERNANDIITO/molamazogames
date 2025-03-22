// src/components/SearchBar/SearchBar.js

import React, { useState } from 'react';
import './SearchBar.scss';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({
    general = false  // True indica que es la barra principal del header de la web
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchTerm); 
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchTerm); 
  };

  if (general) {
        return (
            <form onSubmit={handleSubmit} className="searchBar">
                <label htmlFor="searchInput" className="sr-only">Buscar por palabras claves del título o descripción de los assets</label> 
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" aria-label="Confirmar busqueda">
                    <FaSearch />
                </button>
            </form>
        );
    } else {
        return (
            <div className="searchBar">
                <label htmlFor="searchInput2" className="sr-only">Buscar por palabras claves del título o descripción de los assets</label> 
                <input
                    type="text"
                    id="searchInput2"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={handleInputChange}
                    required
                />
                <button type="button" id="searchButton" onClick={handleSearch}>
                    <FaSearch /> 
                </button>
            </div>
        );
    };
};

export default SearchBar;