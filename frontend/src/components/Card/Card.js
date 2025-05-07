import React, { useState } from 'react';
import classNames from 'classnames';
import './Card.scss';

import { FiEdit, FiTrash2, FiTag, FiUpload } from 'react-icons/fi';

import Button from '../Button/Button';

const Card = ({
  tituloAsset,
  tagsAsset,
  image,
  type,
  botonTag,
  onClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  const contornoClasses = classNames("contorno");


  // Función para obtener imagen por defecto según el tipo
  const getDefaultImage = (type) => {
    switch (type) {
      case '6816347d134bd7d986168374':
        return require('../../assets/imagesDefault/2Ddefecto.png');
      case '6816347d134bd7d986168377':
        return require('../../assets/imagesDefault/3Ddefecto.png');
      case '6816347d134bd7d98616837d':
        return require('../../assets/imagesDefault/Videodefecto.png');
      case '6816347d134bd7d98616837a':
        return require('../../assets/imagesDefault/Audiodefecto.png');
      case '6816347d134bd7d986168380':
        return require('../../assets/imagesDefault/Codedefecto.png');
      case '6816347d134bd7d986168383':
        return require('../../assets/imagesDefault/Otrosdefecto.png');
      case 'Subir':
        return require('../../assets/imagesDefault/subirArchivo.png');
    }
  };

  const imageToShow = image || getDefaultImage(type);

  const renderTags = () => {
    if (!tagsAsset || tagsAsset.length === 0) return null;

    const maxVisibleTags = 2;
    const visibleTags = tagsAsset.slice(0, maxVisibleTags);
    const remainingCount = tagsAsset.length - maxVisibleTags;

    return (
      <>
        <div className="tagsVisibles">
          {visibleTags.map((tag, index) => (
            <Button
              key={index}
              label={tag}
              icon={<FiTag />}
              iconPosition="left"
              className="tag"
            />
          ))}
        

        {remainingCount > 0 && (
          <span className="tagRestante">({remainingCount} +)</span>
        )}
        </div>
      </>
    );
  };


  return (
    <div className={contornoClasses}>
      <img src={imageToShow} alt={`${type} preview`} className="imagenAsset" onClick={onClick} style={{ cursor: 'pointer' }}/>

      <section
        className={classNames('bottag', {
          'centrado': ['boton', 'subir'].includes(botonTag),
          'izquierda': botonTag === 'tag',
        })}
      >
        {botonTag === 'boton' && (
          <>
            <Button
              label="Modificar"
              icon={<FiEdit />}
              iconPosition="left"
              className="warning-btn mediano-btn"
            />

            <Button
              label="Eliminar"
              icon={<FiTrash2 />}
              iconPosition="left"
              className="danger-btn mediano-btn"
            />
          </>
        )}

        {botonTag === 'tag' && (
          <>
            <div className='divTag'>

              <p className='tituloCard' onClick={onClick} style={{ cursor: 'pointer' }}>{tituloAsset}</p>

              {renderTags()}

            </div>
          </>
        )}

        {botonTag === 'subir' && (
          <Button
            label="Subir foto"
            icon={<FiUpload />}
            iconPosition="left"
            className="mediano-btn"
          />
        )}
      </section>

    </div>
  );
};

export default Card;
