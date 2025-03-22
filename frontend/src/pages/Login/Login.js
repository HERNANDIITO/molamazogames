import './Login.scss';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"; 
import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';
import { FaArrowRight } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';

import { login } from '../../services/authServices.js';

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showInfo, setShowInfo] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
  
    if (!formData.name.trim()) {
      newErrors.name = "El nombre de usuario no puede quedar vacío.";
    }
  
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña no puede quedar vacía.";
    }

    if (Object.keys(newErrors).length > 0) {
      newErrors.global = "El usuario o la contraseña es incorrecta.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        console.log("Datos enviados:", formData);
        const {name: email, password: pass} = formData;
  
        const result = await login({ email, pass });
        
        if ( result.token ) {
          localStorage.setItem('token', result.token)
          window.location.replace('/')
        }
        else {
          throw new Error("Un error ha ocurrido");
        }
      }
      
    } catch (error) {
      console.error("ERROR LOGIN", error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2 className="title">Iniciar sesión</h2>
            <p className={`aviso ${Object.keys(errors).length > 0 ? "aviso-error" : ""}`}>
            Los campos obligatorios están marcados con *
            </p>
            {errors.global && <p className="login-error"><FontAwesomeIcon icon={faTriangleExclamation} /> &nbsp; {errors.global}</p>}
          
          <Input 
            type="text" 
            name="name" 
            id="name"
            label="Nombre*"
            value={formData.name} 
            onChange={handleChange} 
            autoFocus
            placeholder="Manolo1234"
            className="login"
          />

          <Input 
              type="password" 
              name="password" 
              id="password"
              label="Contraseña*"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Contraseña_123"
              className="login pass"
            />
 
          <div className="btn-container">
            <Button
              label="Iniciar sesión"
              icon={<FaArrowRight />}
              className="seleccionable-btn mediano-btn"
              type="submit"
            />
          </div>

          <a href="/registrar">¿No tienes cuenta? Crea una</a>
        </form>
      </div>
    </div>
  );
};

export default Login;
