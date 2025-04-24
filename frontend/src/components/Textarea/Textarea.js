import React from 'react';
import classNames from 'classnames'; 
import './Textarea.scss';  

const Textarea = ({
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

  const textareaClasses = classNames('txta');
  const labelClasses = classNames('lbl');
  const divClasses = classNames('dv', className);

  return(
    <>
    <div className={divClasses}>
    {label && <label htmlFor={id} className={labelClasses}>{label}</label>}
      <textarea
          type = {type}
          value = {value}
          name={name}
          id = {id}
          onChange = {onChange}
          disabled = {disabled}
          autoFocus = {autoFocus}
          placeholder = {placeholder}
          className = {textareaClasses}
      ></textarea>
    </div>  
    </>

  );
};

export default Textarea;