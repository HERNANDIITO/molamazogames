// src/components/SearchBar/SearchBar.js

import React, { useState } from 'react';
import './SearchBar.scss';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const SearchBar = ({
    general = false  // True indica que es la barra principal del header de la web
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchTerm); 
  };


    const handleSubmitBusquedaGeneral = (e) => {
        e.preventDefault();
        if (searchTerm && searchTerm.trim() !== "") {
        navigate(`/buscarAssets?searchBar=${encodeURIComponent(searchTerm)}`);
        } else {
        navigate("/buscarAssets");
        }
    };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchTerm); 
  };

  if (general) {
        return (
            <form onSubmit={handleSubmitBusquedaGeneral} className="searchBar">
                <label htmlFor="searchInput" className="sr-only">Buscar por palabras claves del título o descripción de los assets</label> 
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={handleInputChange}
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
                <button type="button" id="searchButton" onClick={handleSearch} aria-label="Confirmar búsqueda">
                    <FaSearch /> 
                </button>
            </div>
        );
    };
};

export default SearchBar;