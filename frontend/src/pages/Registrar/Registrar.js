import './Registrar.scss'
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';
import Profile from '../../components/Profile/Profile.js';
import { FaArrowRight } from 'react-icons/fa';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { register } from '../../services/authServices.js';


const Registrar = () => {
  useEffect(() => {
    document.title = 'Registrarse - MoLAMaZoGAMES';
  }, []);

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

  const handleChangePassword = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    let passwordError = null;

    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{7,15}$/.test(e.target.value)) {
      passwordError = "La contraseña no cumple los requisitos.";
    }
    setErrors({ ...errors, password: passwordError });
  };

  const handleChangeRePassword = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    let passwordError = null;

    const password = document.querySelector('#password').value;

    if (password !== e.target.value) {
      passwordError = "Las contraseñas no coinciden.";
    }

    setErrors({ ...errors, reppass: passwordError });
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

    console.log("tlf: ", formData.phone.trim())

    if (formData.phone != "") {
      if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
        newErrors.phone = "El teléfono debe seguir el formato: +34678564738";
      }
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
      const { email, password: pass, name, phone } = formData;

      try {
        const result = await register({ email, pass, name, phone });

        if (result && result.token) {
          localStorage.setItem('token', result.token);
          window.location.replace('/')
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        setErrors({ global: error.message });
      }
    }
  };

  return (

      <main className="mainLogin">
        <section className="form-container">
          <form onSubmit={handleSubmit} className="register-form">
            <h2 className="title decorator">Registrarse</h2>
            <p className="aviso contenido-principal" tabIndex="-1">Los campos obligatorios están marcados con *</p>
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
              className={`login ${errors.name ? "error" : ""}`} />
            {errors.name && <p className="register-error">{errors.name}</p>}

            <Input
              type="email"
              name="email"
              id="email"
              label="Email*"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@email.com"
              className={`login ${errors.email ? "error" : ""}`} />
            {errors.email && <p className="register-error">{errors.email}</p>}

            <Input
              type="tel"
              name="phone"
              id="phone"
              label="Teléfono"
              placeholder="+34694783456"
              value={formData.phone}
              onChange={handleChange}
              className={`login ${errors.phone ? "error" : ""}`} />
            {errors.phone && <p className="register-error">{errors.phone}</p>}

            <div className="input-container register-pass-container">
              <div className="pass-container">
                <Input
                  type="password"
                  name="password"
                  id="password"
                  label="Contraseña*"
                  value={formData.password}
                  onChange={handleChangePassword}
                  placeholder="Contraseña_123"
                  className={`login pass ${errors.password ? "error" : ""}`} />
                {errors.password && <p className="register-error">{errors.password}</p>}
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="info-icon"
                  aria-label="Información sobre los requisitos de la contraseña"
                  tabIndex="0"
                  onClick={() => setShowInfo(!showInfo)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowInfo(!showInfo);
                    }
                    const info = document.querySelector('.info-icon');
                    if (info) {
                      info.focus();
                    }
                  }}
                />
              </div>
              {showInfo && (
                <div tabIndex="0" className={`info-text-container ${showInfo ? "show" : ""}`}>
                  <ul className="password-rules">La contraseña debe contener: </ul>
                  <li className="password-rules">Entre 7 y 15 caracteres.</li>
                  <li className="password-rules">Al menos una letra mayúscula.</li>
                  <li className="password-rules">Al menos una letra minúscula.</li>
                  <li className="password-rules">Al menos un número.</li>
                  <li className="password-rules">Al menos un símbolo.</li>
                </div>
              )}
            </div>

            <Input
              type="password"
              name="reppass"
              id="reppass"
              label="Repetir contraseña*"
              value={formData.reppass}
              onChange={handleChangeRePassword}
              placeholder="Contraseña_123"
              className={`login ${errors.reppass ? "error" : ""}`} />
            {errors.reppass && <p className="register-error">{errors.reppass}</p>}

            <Button
              label="Registrarse"
              icon={<FaArrowRight />}
              className="seleccionable-btn mediano-btn btn-container"
              type="submit" />
          </form>
          <a href="/login" className='enlaceLogin'>¿Ya tienes una cuenta? Inicia sesión</a>
        </section>
      </main>


  );
};

export default Registrar;
