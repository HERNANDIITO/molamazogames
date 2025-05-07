// src/components/Checkbox/.js

import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import './Checkbox.scss'; 


const Checkbox = ({ label, size = 'normal', showLabel = true, id, checked, onChange, parent, className }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if(onChange) {
        e.preventDefault(); 
        if (typeof e.target.click === 'function') {
          e.target.click();
        }
      } else {
        setIsChecked(!isChecked); 
      }
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id={id} 
        checked={checked ? checked : isChecked}
        onChange={onChange ? onChange : handleCheckboxChange}
        className={`checkbox-input ${size} ${parent ? parent : ''}`}
        aria-label={label} 
        aria-checked={checked ? checked : isChecked} 
        tabIndex={0}
        onKeyDown={handleKeyDown}
      />

     <label 
        htmlFor={id} 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={label} 
        className={`checkbox-label ${className} ${size} ${parent ? parent : ''}`} 
      >
        {showLabel ? label : ''}
      </label>
      
      {checked && <FaCheck className={`checkbox-icon ${size} ${parent ? parent : ''}`} onClick={onChange ? onChange : handleCheckboxChange} />}
    </>
  ); 
};

export default Checkbox;
