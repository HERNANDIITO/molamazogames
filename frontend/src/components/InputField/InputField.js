import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import './InputField.scss';
import Input from '../Input/Input';
import Textarea from '../Textarea/Textarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

const InputField = ({}) => {
  const divClasses = classNames('dv');
  const inputClasses = classNames('input');
  const textaClasses = classNames('texta');

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('Archivo seleccionado:', file);
    }
  };

  return (
    <div className={divClasses}>
      <Input 
        type="text" 
        name="inpt" 
        id="inpt"
        label="InputField"
        autoFocus
        placeholder="Escribe aquí tu texto"
        className={inputClasses}
      />
      
      <Textarea 
        type="text" 
        name="txtA" 
        id="txtA"
        autoFocus
        placeholder="Escribe aquí tu texto"
        className={textaClasses}
      />

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
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
