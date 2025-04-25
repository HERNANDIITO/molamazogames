// src/components/Checkbox/.js

import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import './Checkbox.scss'; 

const Checkbox = ({ label, size = 'normal', showLabel = true, id }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsChecked(!isChecked); 
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id={id} 
        checked={isChecked}
        onChange={handleCheckboxChange}
        className={`checkbox-input ${size}`}
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
        className={`checkbox-label ${size}`} 
      >
        {showLabel ? label : ''}
      </label>
      
      {isChecked && <FaCheck className={`checkbox-icon ${size}`} onClick={handleCheckboxChange} />}
    </>
  ); 
};

export default Checkbox;
