import './Registrar.scss';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/Button.js';
import { FaArrowRight } from 'react-icons/fa'; 

const Registrar = () => {
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      reppass: "",
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Datos enviados:", formData);
    };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
            <p className="title">
              Registrarse
            </p>
            <hr />
            <p className="aviso">
              Los campos obligatorios están marcados con *
            </p>
            <label>
              Nombre de usuario*<br/>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
              Email*<br/>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
              Teléfono<br/>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </label>
            <label>
              Contraseña*  
              <div className="input-container">
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
              </div>
            </label>
      
            <label>
              Confirmar contraseña*<br/>
              <input type="password" name="reppass" value={formData.reppass} onChange={handleChange} required />
            </label>
            <Button
              label="Registrarse"
              icon={<FaArrowRight />}
              iconPosition=""
              onClick=''
              className="seleccionable-btn"
              href="#"
            />
          </form>
    </div>
  );
};

export default Registrar;
