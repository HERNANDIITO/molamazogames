import logo from './assets/images/logo.png';
import './App.css';
import { useEffect, useState } from 'react';

import Button from './components/Button/Button';
import { FaArrowRight } from 'react-icons/fa';  

function App() {

  // Funncion de ejemplo, estaria mejor en un archivo separado
  const handleClick = () => {
    alert('¡Botón clicado!');
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
    
        <a
          className=""
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>


        <Button
          label="Siguiente"
          icon={<FaArrowRight />}
          iconPosition="left"
          onClick={handleClick}
          className="primary-btn"
        />
    
      </header>
    </div>
  );
}

export default App;
