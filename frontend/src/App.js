import logo from './assets/images/logo.png';
import './App.css';
import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";

import Button from './components/Button/Button';
import Footer from './components/Footer/Footer';
import Logo from './components/Logo/Logo';

import { FaArrowRight } from 'react-icons/fa';  
import { LuTag } from "react-icons/lu";
import { LuCirclePlus } from "react-icons/lu";
import { FiDelete } from "react-icons/fi";

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Registrar from "./pages/Registrar/Registrar";
import Login from "./pages/Login/Login";
import SearchBar from './components/SearchBar/SearchBar';
import Profile from './components/Profile/Profile';
import NavBar from './components/NavBar/NavBar';
import Header from './components/Header/Header';
import Textarea from './components/Textarea/Textarea';
import Select from './components/Select/Select';
import CarousselController from './components/CarousselController/CarousselController';


function AppContent() {
  const location = useLocation(); // Obtiene la ruta actual

  //Cosa pal select
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');

  // Función de ejemplo
  const handleClick = () => {
    alert('¡Botón clicado!');
  };

  return (
    <div className="App">
      <Header></Header>
      <main className="App-content">
        <Routes>
          <Route path="/registrar"  element={<Registrar />} />
          <Route path="/login"      element={<Login />}     />
        </Routes>

        {location.pathname !== "/registrar" && location.pathname !== "/login" &&(   
            <>
          
{/* 
        <Logo isInNav={true}></Logo>*/

        <>
        <Textarea 
              type="text" 
              name="textarea" 
              id="textarea"
              label="Textarea*"
              autoFocus
              placeholder="Escribe aquí tu texto"
              className="texto"
        />

        <Select
          id="select"
          name="select"
          label="Selecciona una opción"
          value={opcionSeleccionada}
          onChange={(e) => setOpcionSeleccionada(e.target.value)}
          placeholder="Selecciona una opción"
          options={[
            { value: 'opcion1', label: 'Opción 1' },
            { value: 'opcion2', label: 'Opción 2' },
            { value: 'opcion3', label: 'Opción 3' },
          ]}
          className="texto"
        />

        <CarousselController
          id="carousselController"
          label="Control del carrusel"
          onClick={() => console.log("Botón del carrusel presionado")}
        />

        <CarousselController
          id="carousselController"
          label="Control del carrusel"
          onClick={() => console.log("Botón del carrusel presionado")}
          direction='right'
        />

        
            <Button
              label="Next"
              icon={<LuTag />}
              iconPosition="left"
              onClick={handleClick}
              className="tag"
              href="#"
            />

            <Button
              label="Caracolaaa"
              icon={<FiDelete />}
              iconPosition="left"
              onClick={handleClick}
              className="tag tag-delete"
              href="#"
            />

            <Button
              label="Bonito"
              icon={<LuCirclePlus />}
              iconPosition="left"
              onClick={handleClick}
              className="tag"
              href="#"
            />
        </>

        

        /*<a
          className=""
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
          <SearchBar general="true"></SearchBar>
          <SearchBar></SearchBar>

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

              <NavBar></NavBar> */}
          
            </>
          )}
      </main>
      <Footer>
        
      </Footer>
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
