import React, { useState } from 'react';
import './Modal.scss';

import InputField from '../InputField/InputField';
import Button from '../Button/Button';

import { FaCheck, FaTimes } from "react-icons/fa";

const Modal = ({ type = 'subir', onClose, onImageUpload }) => {
  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState('');
  const [alt, setAlt] = useState('');

  const getTitle = () => {
    switch (type) {
      case 'add':
        return 'Añadir foto';
      case 'edit':
        return 'Modificar foto';
      default:
        return 'Subir archivo';
    }
  };

  const inputFieldType = (type === 'add' || type === 'edit') ? 'foto' : 'file';

  const handleAceptar = () => {
    if (onImageUpload && file) {
      onImageUpload(file, nombre, alt);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContorno" onClick={(e) => e.stopPropagation()}>
        <p className="titModal">{getTitle()}</p>

        <InputField
          type={inputFieldType}
          onFileSelect={setFile}
          onNombreChange={setNombre}
          onAltChange={setAlt}
        />

        <div className="contbotonesModal">
          <Button label="Aceptar" icon={<FaCheck />} className="botonesModal" onClick={handleAceptar} />
          <Button label="Cancelar" icon={<FaTimes />} className="danger-btn botonesModal" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
