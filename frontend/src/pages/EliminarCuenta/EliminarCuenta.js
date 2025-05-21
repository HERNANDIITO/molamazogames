import { useState, useEffect } from "react";
import './EliminarCuenta.scss';
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FaCheck } from "react-icons/fa";
import { deleteUser } from "../../services/userServices";
import { getUserByToken } from "../../services/authServices";
import { FaXmark } from "react-icons/fa6";
import { encryptPassword } from "../../utils/pass";

const EliminarCuenta = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await getUserByToken(token);
          setStoredPassword(user.password);
          setUserId(user._id);
        } catch (error) {
          console.error("Error obteniendo usuario:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPass = await encryptPassword(password);
    console.log("hashedPass", hashedPass)
    console.log("hashedPass", password)
    console.log("storedPassword", storedPassword)
    if (hashedPass !== storedPassword) {
      setError("La contraseña actual no es correcta.");
    } else {
      setError("");
      try {
        const result = await deleteUser(userId);
        console.log("result", result)
        localStorage.removeItem("token");
        alert("Tu cuenta ha sido eliminada.");
        window.location.href = "/";
      } catch (err) {
        console.error("Error al eliminar la cuenta:", err);
        setError("Hubo un problema al eliminar tu cuenta.");
      }
    }
  };

  return (
    <main className="fondoOpt">
      <form onSubmit={handleSubmit} className="change-password-form">
        <h2 className="title decorator">Eliminar cuenta</h2>
        <p className="avisoPass" tabIndex="-1">Introduce tu contraseña actual para eliminar la cuenta.</p>
        {error && (
          <p className="login-error">
            <FontAwesomeIcon icon={faTriangleExclamation} /> &nbsp; {error}
          </p>
        )}

        <Input
          type="password"
          name="actualPassword"
          id="actualPassword"
          label="Contraseña actual"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`login ${error ? "error" : ""}`}
        />

        <div className="contenedorBotonesPass">
          <Button
            label="Eliminar cuenta"
            icon={<FaCheck />}
            className="botonesPass"
            type="submit"
          />
          <Button
            label="Cancelar"
            icon={<FaXmark />}
            className="botonesPass danger-btn"
            type="button"
            href={'/useropt'}
          />
        </div>
      </form>
    </main>
  );
};

export default EliminarCuenta;
