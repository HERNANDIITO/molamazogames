import React from 'react';
import classNames from 'classnames';
import './UploadedFile.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import Checkbox from "../Checkbox/Checkbox";

const UploadedFile = ({
  name,
  isPreview,
  onTogglePreview,
  onRemove,
}) => {
  const containerClasses = classNames('cont');
  const formatoClasses = classNames('formato');
  const iconoClasses = classNames('icono');
  const botonClasses = classNames('boton');

  return (
    <div className={containerClasses}>
      <span className={iconoClasses}>
        <FontAwesomeIcon icon={faCode} />
      </span>
      <span className={formatoClasses}>{name}</span>
      <Checkbox
        label="Preview"
        id={`preview-${name}`}
        checked={isPreview}
        onChange={onTogglePreview}
        className="previewChck"
      />
      <button type="button" className={botonClasses} onClick={onRemove}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
    </div>
  );
};

export default UploadedFile;
