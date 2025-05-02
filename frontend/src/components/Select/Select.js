import React from 'react';
import classNames from 'classnames'; 
import './Select.scss';  

const Select = ({
  name,                    
  value,
  id,
  label,
  onChange,           
  disabled = false,         
  autoFocus,                     
  placeholder,    
  className,
  options = [],                     
}) => {

  const selectClasses = classNames('slct', className);
  const labelClasses = classNames('lbl', className);
  const divClasses = classNames('dv', className);

  return(
    <>
    <div className={divClasses}>
    <label htmlFor={id} className={labelClasses}>{label}</label>
      <select
          value = {value}
          name={name}
          id = {id}
          onChange = {onChange}
          disabled = {disabled}
          autoFocus = {autoFocus}
          className = {selectClasses}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}

      </select>
    </div>  
    </>

  );
};

export default Select;