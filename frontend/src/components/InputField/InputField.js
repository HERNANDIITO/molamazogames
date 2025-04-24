import React, { useRef } from 'react';
import classNames from 'classnames';
import './InputField.scss';
import Input from '../Input/Input';
import Textarea from '../Textarea/Textarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';


const InputField = ({
  className, 

}) => {
  const divClasses = classNames('dv', className);
  const inputClasses = classNames('input', className);
  const textaClasses = classNames('texta', className);

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Archivo seleccionado:', file);
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
        accept="image/*"
      />

      <div className={divClasses && "upload-container"}>

        <div className={divClasses && "upload-box"}  onClick={handleUploadClick}>
          <div className={divClasses && "upload-icon"}>
            <FontAwesomeIcon icon={faCirclePlus} size="2x" />
          </div>
        </div>

        <button className={divClasses && "upload-button"} onClick={handleUploadClick}>
          Subir archivo
        </button>

      </div>

    </div>
  );
};

export default InputField;
