import logo from './assets/images/logo.png';
import './App.css';
import { useEffect, useState } from 'react';

import Button from './components/Button/Button';
import Logo from './components/Logo/Logo';

import { FaArrowRight } from 'react-icons/fa';  

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Registrar from "./pages/Registrar/Registrar";
import SearchBar from './components/SearchBar/SearchBar';
import Profile from './components/Profile/Profile';


function AppContent() {
  const location = useLocation(); // Obtiene la ruta actual

  // Función de ejemplo
  const handleClick = () => {
    alert('¡Botón clicado!');
  };

  return (
    <div className="App">
      <header className="App-header">
        

        <Routes>
          <Route path="/registrar" element={<Registrar />} />
        </Routes>

        {/* Mostrar los botones solo si NO estamos en "/registrar" */}
        {location.pathname !== "/registrar" && (   
          <>
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>

        <Logo></Logo>

        <a
          className=""
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
          <SearchBar general="true"></SearchBar>
          <SearchBar></SearchBar>
          <Profile></Profile>

            <Button
              label="Next"
              icon={<FaArrowRight />}
              iconPosition="left"
              onClick={handleClick}
              className="seleccionable-btn"
              href="#"
            />
            
            <Button
              label="Next"
              icon={<FaArrowRight />}
              iconPosition="alone"
              onClick={handleClick}
              className="enano-btn danger-btn"
              href="#"
            />

            <Button
              label="Next"
              icon={<FaArrowRight />}
              iconPosition="left"
              onClick={handleClick}
              className="mediano-btn warning-btn"
              href="#"
            />

            <Button
              label="Next"
              icon={<FaArrowRight />}
              iconPosition="left"
              onClick={handleClick}
              className="grande-btn"
              href="#"
            />

            <Button
              label="Next"
              icon={<FaArrowRight />}
              iconPosition="left"
              onClick={handleClick}
              className="enorme-btn secondary-btn"
              href="#"
            />

            <Button
              label="Next"
              icon={<FaArrowRight />}
              iconPosition="left"
              onClick={handleClick}
              className="secondary-btn active-btn"
            />

            <Button
              label="Next"
              icon={<FaArrowRight />}
              iconPosition="right"
              onClick={handleClick}
              className="active-btn"
            />

            <Button
              label="Next"
              icon={<FaArrowRight />}
              iconPosition="left"
              onClick={handleClick}
              disabled={true}
              className="seleccionable-btn"
            />
          </>
        )}
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
