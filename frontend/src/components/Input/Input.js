import React from 'react';
import classNames from 'classnames'; 
import './Input.scss';  

const Input = ({
  type = 'text',
  name,                    
  value,
  id,
  label,
  onChange,           
  disabled = false,         
  autofocus,                     
  placeholder,    
  className,                     
}) => {

  const inputClasses = classNames('inpt', className);
  const labelClasses = classNames('lbl', className);
  const divClasses = classNames('dv', className);

  return(
    <>
    <div className={divClasses}>
    <label htmlFor={id} className={labelClasses}>{label}</label>
      <input
          type = {type}
          value = {value}
          name={name}
          id = {id}
          onChange = {onChange}
          disabled = {disabled}
          autofocus = {autofocus}
          placeholder = {placeholder}
          className = {inputClasses}
      ></input>
    </div>  
    </>

  );
};

export default Input;