import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import './InputField.scss';
import Input from '../Input/Input';
import Textarea from '../Textarea/Textarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

const InputField = ({
  type = "file",
  onFileSelect,
  onNombreChange,
  onAltChange
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="dv">
      <Input
        type="text"
        name="inpt"
        id="inpt"
        label="Nombre (opcional)"
        placeholder="Escribe aquí el nombre"
        className="input"
        onChange={(e) => onNombreChange?.(e.target.value)}
      />

      <Textarea
        name="txtA"
        id="txtA"
        label={type === "foto" ? "Texto alternativo" : "Descripción (opcional)"}
        placeholder="Escribe aquí el texto"
        className="texta"
        onChange={(e) => onAltChange?.(e.target.value)}
      />

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={type === 'foto' ? '.jpg,.jpeg,.png' : '*'}
        onChange={handleFileChange}
      />

      <div className="upload-container">
        <div className="upload-box" onClick={handleUploadClick}>
          {selectedFile ? (
            <div className="file-name">{selectedFile.name}</div>
          ) : (
            <div className="upload-icon">
              <FontAwesomeIcon icon={faCirclePlus} size="2x" />
            </div>
          )}
        </div>

        <button className="upload-button" onClick={handleUploadClick}>
          {selectedFile ? 'Cambiar archivo' : 'Subir archivo'}
        </button>
      </div>
    </div>
  );
};

export default InputField;
