import React from 'react';
import classNames from 'classnames'; 
import './Input.scss';  

const Input = ({
  type = 'text',                    
  value,
  id,
  label,
  onChange,           
  disabled = false,         
  autofocus,                     
  placeholder,    
  className,                     
}) => {

  const inputClasses = classNames('input', className);

  return(
    <>
      <label htmlFor={id}>{label}</label>
      <input
          type = {type}
          value = {value}
          id = {id}
          onChange = {onChange}
          disabled = {disabled}
          autofocus = {autofocus}
          placeholder = {placeholder}
          className = {inputClasses}
      ></input>
    </>

  );
};

export default Input;