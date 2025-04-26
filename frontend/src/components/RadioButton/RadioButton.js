// src/components/RadioButton/.js

import React, { useState } from 'react';
import './RadioButton.scss'; 

const RadioButton = ({ label, id, name, isChecked, onChange }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onChange(id); 
    }
  };

  return (
    <>
      <input
        type="radio"
        id={id} 
        name={name}
        checked={isChecked}
        onChange={() => onChange(id)}
        className= "radiobutton-input"
        aria-label={label} 
        aria-checked={isChecked} 
        tabIndex={0}
        onKeyDown={handleKeyDown}
      />

     <label 
        htmlFor={id} 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={label} 
        className="radiobutton-label"
      >
        {label}
      </label>
      
    </>
  ); 
};

export default RadioButton;
