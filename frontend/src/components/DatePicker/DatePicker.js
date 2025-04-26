import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import './DatePicker.scss';
import Input from '../Input/Input';
import DatePickerLib from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ value, onChange = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const toggleCalendar = () => setIsOpen(!isOpen);

  const formatDate = (val) => {
    if (!val) return '';
    const date = new Date(val);
    if (isNaN(date)) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map((part) => parseInt(part, 10));
    
    if (day > 0 && month > 0 && month <= 12 && year > 0) {
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    return null;
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const selectedDate = parseDate(inputValue);

    if (selectedDate) {
      if (onChange) onChange(selectedDate);
    } else {
      console.log('Fecha no válida');
    }
  };

  const inputClasses = classNames('fecha');
  const contenedorClasses = classNames('contenedor');
  const iconocalendarioClasses = classNames('calendarIcon');
  const calendarioClasses = classNames('calendario');

  return (
    <div className={contenedorClasses}>
      <Input
        type="text"
        value={formatDate(value)}
        onChange={handleInputChange}
        placeholder="DD/MM/AAAA"
        className={inputClasses}
        ref={inputRef}
      />
      <div className={iconocalendarioClasses} onClick={toggleCalendar}>
        <FontAwesomeIcon icon={faCalendarDays} />
      </div>

      {isOpen && (
        <div className={calendarioClasses}>
          <DatePickerLib
            selected={value}
            onChange={(date) => {
              if (onChange) {
                const localDate = new Date(date);
                localDate.setHours(0, 0, 0, 0); // Asegurar 00:00 local
                onChange(localDate);
              }
              setIsOpen(false);
            }}
            inline
            dateFormat="dd/MM/yyyy"
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
