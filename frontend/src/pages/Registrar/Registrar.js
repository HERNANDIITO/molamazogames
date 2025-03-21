import './Registrar.scss';
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
    <div className="register-page">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2 className="title">Registrarse</h2>
          <hr />
          <p className="aviso">Los campos obligatorios están marcados con *</p>

          <label>
            Nombre de usuario*<br/>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              autoFocus
              placeholder="Manolo1234"
              className="error"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </label>

          <label>
            Email*<br/>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="usuario@email.com"
              className="error"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </label>

          <label>
            Teléfono<br/>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </label><br/>

          <label>
            Contraseña*  
            <div className="input-container">
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Contraseña_123"
                className="error"
              />
              <FontAwesomeIcon icon={faCircleInfo} className="info-icon" onClick={() => setShowInfo(!showInfo)} />
            </div>
            {errors.password && <p className="error">{errors.password}</p>} 
          </label>

          <label>
            Confirmar contraseña*<br/>
            <input 
              type="password" 
              name="reppass" 
              value={formData.reppass} 
              onChange={handleChange} 
              placeholder="Contraseña_123"
              className="error"
            />
            {errors.reppass && <p className="error">{errors.reppass}</p>}
          </label>
          
          <div className="btn-container">
            <Button
              label="Registrarse"
              icon={<FaArrowRight />}
              className="seleccionable-btn mediano-btn"
              type="submit"
            />
          </div>

          <a href="/login">¿Ya tienes una cuenta? Inicia sesión</a>
        </form>
      </div>

      {showInfo && (
        <div className={`info-text-container ${showInfo ? "show" : ""}`}>
          <p className="info-text">
            La contraseña debe tener al menos un número, una mayúscula, una minúscula y un símbolo. Además, debe contener entre 7 y 15 caracteres.
          </p>
        </div>
      )}
    </div>
  );
};

export default Registrar;
