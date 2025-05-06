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
  const labelClasses = classNames('lbl lbl-select', className);
  const divClasses = classNames('dv', className);

  return (
    <>
      <div className={divClasses}>
        {label && (
          <label htmlFor={id} className={labelClasses}>{label}</label>
        )}
        <select
          value={value}
          name={name}
          id={id}
          onChange={onChange}
          disabled={disabled}
          autoFocus={autoFocus}
          className={selectClasses}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) =>
            opt.options ? (
              <optgroup key={opt.label} label={opt.label}>
                {opt.options.map((subOpt) => (
                  <option key={`${subOpt.value}-${subOpt.label}`} value={subOpt.value}>
                    {subOpt.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              <option key={`${opt.value}-${opt.label}`} value={opt.value}>
                {opt.label}
              </option>
            )
          )}



        </select>
      </div>
    </>

  );
};

export default Select;