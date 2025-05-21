import React, { useState } from 'react';
import './Modal.scss';

import InputField from '../InputField/InputField';
import Button from '../Button/Button';

import { FaCheck, FaTimes } from "react-icons/fa";

const Modal = ({ type = "subir", onClose, onImageUpload, onGoDetails, onGoUpload, onGoHome }) => {
  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState("");
  const [alt, setAlt] = useState("");

  const getTitle = () => {
    switch (type) {
      case "add":
        return "Añadir foto";
      case "edit":
        return "Modificar foto";
      case "exito":
        return "¡Asset subido con éxito!";
      case "token":
        return "Acceso restringido";
      default:
        return "Subir archivo";
    }
  };

  const inputFieldType = type === "add" || type === "edit" ? "foto" : "file";

  const handleAceptar = () => {
    if (onImageUpload && file) {
      onImageUpload(file, nombre, alt);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      {type === "exito" ? (
        <div className="modalExito" onClick={(e) => e.stopPropagation()}>
          <p className="titModal">{getTitle()}</p>
          <div className="contbotonesExito">
            <div className="filaBotones">
              <Button
                label="Detalles del asset"
                onClick={onGoDetails}
                className="botonesModal"
              />
              <Button
                label="Subir otro asset"
                onClick={onGoUpload}
                className="botonesModal"
              />
            </div>
            <div className="filaBotones">
              <Button
                label="Volver a inicio"
                onClick={onGoHome}
                className="botonesModal secondary-btn"
              />
            </div>
          </div>
        </div>
      ) : type === "token" ? (
        <div className="modalContornoToken" onClick={(e) => e.stopPropagation()}>
          <p className="titModal">{getTitle()}</p>
          <p className="mensajeModal">Para ver los detalles del asset necesitas iniciar sesión.</p>
          <div className="contbotonesModal">
            <Button
              label="Iniciar sesión"
              className="botonesModal"
              href="/login"
            />
            <Button
              label="Cerrar"
              className="danger-btn botonesModal"
              onClick={onClose}
            />
          </div>
        </div>
      ) : (
        <div className="modalContorno" onClick={(e) => e.stopPropagation()}>
          <p className="titModal">{getTitle()}</p>
          <InputField
            type={inputFieldType}
            onFileSelect={setFile}
            onNombreChange={setNombre}
            onAltChange={setAlt}
          />
          <div className="contbotonesModal">
            <Button
              label="Aceptar"
              icon={<FaCheck />}
              className="botonesModal"
              onClick={handleAceptar}
            />
            <Button
              label="Cancelar"
              icon={<FaTimes />}
              className="danger-btn botonesModal"
              onClick={onClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;