import React from 'react';
import classNames from 'classnames'; 
import './Input.scss';  

const Input = ({
  type = 'text',                    
  value,
  onChange,           
  disabled = false,         
  autofocus,                     
  placeholder,    
  className,                     
}) => {

  const inputClasses = classNames('input', className);

  return(
    <input
        type = {type}
        value = {value}
        onChange = {onChange}
        disabled = {disabled}
        autofocus = {autofocus}
        placeholder = {placeholder}
        className = {className}
    ></input>

  );
};

export default Input;