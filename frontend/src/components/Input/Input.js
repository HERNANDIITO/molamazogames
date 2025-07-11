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
  autoFocus,                     
  placeholder,    
  className,                     
}) => {

  const inputClasses = classNames('inpt', className);
  const labelClasses = classNames('lbl');
  const divClasses = classNames('dv', className);

  return(
    <>
    <div className={divClasses}>
    {label && (
      <label htmlFor={id} className={`inpName ${labelClasses}`}>
        {label}
      </label>
    )}
      <input
          type = {type}
          value = {value}
          name={name}
          id = {id}
          onChange = {onChange}
          disabled = {disabled}
          autoFocus = {autoFocus}
          placeholder = {placeholder}
          className = {inputClasses}
      ></input>
    </div>  
    </>

  );
};

export default Input;