import React from 'react';
import './CarousselImage.scss';

const CarousselImage = ({
  path,
  name,
  description
}) => {

  return (
    <div class={`carousselEntry`}>
      <div class="carousselImage">
        <img alt=" " src={`https://molamazogames-ctup.onrender.com\\${path}`}></img>
      </div>
      <div class="carousselImageInfo">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export {CarousselImage};
