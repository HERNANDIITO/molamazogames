import { useState, useEffect } from "react";
import './CambiarPass.scss';
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FaCheck } from "react-icons/fa";
import { getUserByToken, updateUser } from "../../services/authServices";
import { FaXmark } from "react-icons/fa6";

const CambiarPass = () => {
  const [formData, setFormData] = useState({
    actualPassword: "",
    newPassword: "",
    newPassword2: ""
  });

  const [showInfo, setShowInfo] = useState(false);
  const [errors, setErrors] = useState({});
  const [storedPassword, setStoredPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await getUserByToken(token);
          setStoredPassword(user.password);
        } catch (error) {
          console.error("Error obteniendo usuario:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    const { actualPassword, newPassword, newPassword2 } = formData;

    if (storedPassword && actualPassword !== storedPassword) {
      newErrors.actualPassword = "La contraseña actual no es correcta.";
    }

    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{7,15}$/.test(newPassword)) {
      newErrors.newPassword = "La contraseña no cumple los requisitos.";
    }

    if (newPassword !== newPassword2) {
      newErrors.newPassword2 = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const token = localStorage.getItem("token");
        await updateUser({ oldPassword: formData.actualPassword, newPassword: formData.newPassword }, token);
        alert("Contraseña actualizada correctamente.");
        setFormData({ actualPassword: "", newPassword: "", newPassword2: "" });
      } catch (err) {
        setErrors({ global: err.message || "Error actualizando contraseña" });
      }
    }
  };

  return (
    <main className="fondoOpt">
      <form onSubmit={handleSubmit} className="change-password-form">
        <h2 className="title decorator">Cambiar contraseña</h2>
        <p className="avisoPass" tabIndex="-1">Todos los campos son obligatorios</p>
        {errors.global && <p className="login-error"><FontAwesomeIcon icon={faTriangleExclamation} /> &nbsp; {errors.global}</p>}

        <Input
          type="password"
          name="actualPassword"
          id="actualPassword"
          label="Contraseña actual"
          value={formData.actualPassword}
          onChange={handleChange}
          className={`login ${errors.actualPassword ? "error" : ""}`}
        />
        {errors.actualPassword && <p className="register-error">{errors.actualPassword}</p>}

        <div className="input-container register-pass-container">
          <div className="pass-container">
            <Input
              type="password"
              name="newPassword"
              id="newPassword"
              label="Nueva contraseña"
              value={formData.newPassword}
              onChange={handleChange}
              className={`login pass ${errors.newPassword ? "error" : ""}`}
            />
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="info-icon"
              onClick={() => setShowInfo(!showInfo)}
              tabIndex="0"
            />
          </div>
          {errors.newPassword && <p className="register-error">{errors.newPassword}</p>}
          {showInfo && (
            <div className="info-text-container show">
              <ul className="password-rules">La contraseña debe contener:
                <li>Entre 7 y 15 caracteres</li>
                <li>Al menos una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
                <li>Un símbolo</li>
              </ul>
            </div>
          )}
        </div>

        <Input
          type="password"
          name="newPassword2"
          id="newPassword2"
          label="Repetir nueva contraseña"
          value={formData.newPassword2}
          onChange={handleChange}
          className={`login ${errors.newPassword2 ? "error" : ""}`}
        />
        {errors.newPassword2 && <p className="register-error">{errors.newPassword2}</p>}

        <div className="contenedorBotonesPass">
          <Button
            label="Guardar cambios"
            icon={<FaCheck />}
            className="botonesPass"
            type="submit"
          />

          <Button
            label="Cancelar"
            icon={<FaXmark />}
            className="botonesPass danger-btn"
            href={'/useropt'}
          />
        </div>
      </form>
    </main>

  );
};

export default CambiarPass;
