import './Login.scss';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';

import { login } from '../../services/authServices.js';

const Login = () => {

  useEffect(() => {
    document.title = 'Iniciar Sesión - MoLAMaZoGAMES';
  }, []);

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
      newErrors.global = "El nombre de usuario o la contraseña son incorrectos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        const { name, password: pass } = formData;

        const result = await login({ name, pass });

        if (result && result.token) {
          localStorage.setItem('token', result.token)
          window.location.replace('/')
        }
        else {
          throw new Error(result.message);
        }
      }

    } catch (error) {
      setErrors({ global: error.message });
    }
  };

  return (
      <main className="mainLogin">
        <div className="register-page">
          <div className="login-form-container">
            <form onSubmit={handleSubmit} className="register-form">
              <h2 className="title decorator">Iniciar sesión</h2>
              <p className={`contenido-principal aviso ${Object.keys(errors).length > 0 ? "aviso-error" : ""}`} tabIndex="-1">
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
                className="login"
              />

              <Button
                label="Iniciar sesión"
                icon={<FaArrowRight />}
                className="seleccionable-btn mediano-btn btn-container"
                type="submit"
              />

              <a href="/registrar">¿No tienes cuenta? Crea una</a>

            </form>
          </div>
        </div>
      </main>

  );
};

export default Login;
