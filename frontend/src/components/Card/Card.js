import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './Card.scss';

import { FiEdit, FiTrash2, FiTag, FiUpload } from 'react-icons/fi';

import Button from '../Button/Button';
import { getAllMeta } from '../../services/metaServices';

import { useNavigate } from 'react-router-dom';
import Modal from "../../components/Modal/Modal";


const Card = ({
  idAsset,
  tituloAsset,
  tagsAsset,
  image,
  type,
  alt,
  botonTag,
  onClick,
}) => {
  const [metaMap, setMetaMap] = useState({});

  const [deleted, setDeleted] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('eliminar');

  const navigate = useNavigate();


  useEffect(() => {
    async function fetchMeta() {
      try {
        const metas = await getAllMeta();
        const newMetaMap = {};
        metas.forEach((meta) => {
          newMetaMap[meta._id] = meta.meta.toLowerCase();
        });
        setMetaMap(newMetaMap);
      } catch (err) {
        console.error("Error cargando metacategorías:", err);
      }
    }

    fetchMeta();
  }, []);

  const cerrarModal = () => {
    setShowModal(false);
  };


  const getDefaultImage = (typeId) => {
    const typeName = metaMap[typeId];

    switch (typeName) {
      case '2d':
        return require('../../assets/imagesDefault/2Ddefecto.png');
      case '3d':
        return require('../../assets/imagesDefault/3Ddefecto.png');
      case 'video':
        return require('../../assets/imagesDefault/Videodefecto.png');
      case 'audio':
        return require('../../assets/imagesDefault/Audiodefecto.png');
      case 'code':
        return require('../../assets/imagesDefault/Codedefecto.png');
      case 'otros':
        return require('../../assets/imagesDefault/Otrosdefecto.png');
      case 'subir':
        return require('../../assets/imagesDefault/subirArchivo.png');
      default:
        return require('../../assets/imagesDefault/Otrosdefecto.png');
    }
  };

  const [validImage, setValidImage] = useState(true);

  const imageToShow =
    (image && validImage) ? image :
      (Object.keys(metaMap).length > 0 ? getDefaultImage(type) : null);


  const renderTags = () => {
    if (!tagsAsset || tagsAsset.length === 0) return null;

    const maxVisibleTags = 1;
    const visibleTags = tagsAsset.slice(0, maxVisibleTags);
    const remainingCount = tagsAsset.length - maxVisibleTags;

    return (
      <div className="tagsVisibles">
        {visibleTags.map((tag, index) => {
          const truncated = tag.length > 9 ? tag.slice(0, 9) + '…' : tag;
          return (
            <Button
              key={index}
              label={truncated}
              icon={<FiTag />}
              iconPosition="left"
              className="tag"
              title={tag}
            />
          );
        })}

      </div>
    );
  };

  const abrirModalEliminar = () => {
    setModalType('eliminar');
    setShowModal(true);
  };

  const eliminarCard = () => {
    setDeleted(true);
  }

  return (
          <div className={classNames("contorno", deleted ? "deleted" : "")}>
            <img
              src={imageToShow}
              alt={`${alt}`}
              className="imagenAsset"
              onClick={onClick}
              onError={() => setValidImage(false)}
              style={{ cursor: 'pointer' }}
            />

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
                <div className='divTag'>
                  <p
                    className='tituloCard'
                    onClick={onClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {tituloAsset}
                  </p>
                  {renderTags()}
                </div>
              )}

              {botonTag === 'botonYtags' && (
                <>
                  <div className='divTag'>
                    <p
                      className='tituloCard'
                      onClick={onClick}
                      style={{ cursor: 'pointer' }}
                    >
                      {tituloAsset}
                    </p>
                    <div className='tagsYbotones'>
                      {renderTags()}
                      <div className='contDeBotones'>
                        <Button
                          icon={<FiEdit />}
                          iconPosition="left"
                          className="warning-btn enano-btn"
                          onClick={() => navigate(`/editAsset/${idAsset}`)}
                        />
                        <Button
                          icon={<FiTrash2 />}
                          iconPosition="left"
                          className="danger-btn enano-btn"
                          onClick={() => abrirModalEliminar()}
                        />
                      </div>
                    </div>
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

            {showModal && (
              <Modal
                idAsset={idAsset}
                type={modalType}
                onClose={cerrarModal}
                onGoHome={() => navigate('/home')}
                onGoUpload={() => {
                  cerrarModal();
                }}
                onGoDelete={() => {
                  eliminarCard();
                }}
              />
            )}
          </div>
  );
};

export default Card;
