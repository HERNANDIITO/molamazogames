import './BuscarAssets.scss'
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';
import Profile from '../../components/Profile/Profile.js';
import { FaArrowRight } from 'react-icons/fa';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { register } from '../../services/authServices.js';
import { useParams } from 'react-router-dom';


const BuscarAssets = () => {
  useEffect(() => {
    document.title = 'Buscar Assets - MoLAMaZoGAMES';
  }, []);

  const { meta } = useParams(); 

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

      <main>
        <h2>Holaa</h2>
      </main>


  );
};

export default BuscarAssets;
