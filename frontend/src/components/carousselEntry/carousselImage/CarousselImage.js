import React from 'react';
import './CarousselImage.scss';

const CarousselImage = ({
  path,
  name,
  description
}) => {
  const imageUrl = `https://api.mmg.phg21.es/${path.replace(/\\/g, '/')}`;

  return (
    <div className="carousselEntry">
      <div className="carousselImage">
        <img alt={description || name || ''} src={imageUrl} />
      </div>
      <div className="carousselImageInfo">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export {CarousselImage};
