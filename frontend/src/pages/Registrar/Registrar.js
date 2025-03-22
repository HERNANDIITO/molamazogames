import './Registrar.scss'
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';
import { FaArrowRight } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import { register } from '../../services/authServices.js';

const Registrar = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    reppass: "",
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
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "El formato de correo electrónico no es válido.";
    }
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{7,15}$/.test(formData.password)) {
      newErrors.password = "La contraseña no cumple los requisitos.";
    }
    if (formData.password !== formData.reppass) {
      newErrors.reppass = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Datos enviados:", formData);
      const { email, password: pass, name, phone } = formData;

      try {
        const result = await register({ email, pass, name, phone });

        if ( result.token ) {
          localStorage.setItem('token', result.token);
          window.location.replace('/')

        }
        else {
          throw new Error("Un error ha ocurrido.")
        }
      }
      catch (error) {
        console.error(error.message)
      }

      
    }
  };

  return (
    <>
      {showInfo && (
        <div className={`info-text-container ${showInfo ? "show" : ""}`}>
          <p className="info-text">La contraseña debe cumplir los siguientes requisitos:</p>
            <ul className="password-rules">
              <li>Al menos un número.</li>
              <li>Al menos una mayúscula.</li>
              <li>Al menos una minúscula.</li>
              <li>Al menos un símbolo.</li>
              <li>Entre 7 y 15 caracteres.</li>
            </ul>
        </div>
      )}

      <section className="form-container">
          <h2 className="title">Registrarse</h2>
          <p className="aviso">Los campos obligatorios están marcados con *</p>
        <form onSubmit={handleSubmit} className="register-form">
          
          <Input 
            type="text" 
            name="name" 
            id="name"
            label="Nombre*"
            value={formData.name} 
            onChange={handleChange} 
            autoFocus
            placeholder="Manolo1234"
            className={`login ${errors.name ? "error" : ""}`}
          />
          {errors.name && <p className="register-error">{errors.name}</p>}

            <Input 
              type="email" 
              name="email" 
              id="email"
              label="Email*"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="usuario@email.com"
              className={`login ${errors.email ? "error" : ""}`}
            />
            {errors.email && <p className="register-error">{errors.email}</p>}

            <Input 
              type="tel" 
              name="phone" 
              id="phone"
              label="Teléfono"
              value={formData.phone} 
              onChange={handleChange}
              className="login"
            />

            <div className="input-container">
              <Input 
                type="password" 
                name="password" 
                id="password"
                label="Contraseña*"
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Contraseña_123"
                className={`login pass ${errors.password ? "error" : ""}`}
              />
              <FontAwesomeIcon icon={faCircleInfo} className="info-icon" onClick={() => setShowInfo(!showInfo)} />
            </div>
            {errors.password && <p className="register-error">{errors.password}</p>} 

            <Input 
              type="password" 
              name="reppass" 
              id="reppass"
              label="Repetir contraseña*"
              value={formData.reppass} 
              onChange={handleChange} 
              placeholder="Contraseña_123"
              className={`login ${errors.reppass ? "error" : ""}`}
            />
            {errors.reppass && <p className="register-error">{errors.reppass}</p>}
          
            <Button
              label="Registrarse"
              icon={<FaArrowRight />} 
              className="seleccionable-btn mediano-btn btn-container"
              type="submit"
            />

          <a href="/login">¿Ya tienes una cuenta? Inicia sesión</a>
        </form>
      </section>

      
    </>
  );
};

export default Registrar;
