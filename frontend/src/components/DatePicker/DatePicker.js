import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import './DatePicker.scss';
import Input from '../Input/Input';
import DatePickerLib from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ value, onChange = () => { } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatDate(value));
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function formatDate(val) {
    if (!val) return '';
    const date = new Date(val);
    if (isNaN(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (day > 0 && month > 0 && month <= 12 && year > 0) {
      const date = new Date(year, month - 1, day);
      if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
        date.setHours(0, 0, 0, 0);
        return date;
      }
    }
    return null;
  }

  const toggleCalendar = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const parsed = parseDate(newValue);
    if (!newValue.trim()) {
      setError(null); // no mostrar error si el input está vacío
    } else if (parsed) {
      setError(null);
      onChange(parsed);
    } else {
      setError('Formato no válido');
    }
  };

  const handleCalendarChange = (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    setInputValue(formatDate(localDate));
    onChange(localDate);
    setError(null);
    setIsOpen(false);
  };

  const inputClasses = classNames('fecha', { error: !!error });
  const contenedorClasses = classNames('contenedor');
  const iconoCalendarioClasses = classNames('calendarIcon', { error: !!error });
  const calendarioClasses = classNames('calendario');

  // Obtener la fecha actual o la introducida por el usuario (si es válida) para marcar en el calendario
  const calendarDate = parseDate(inputValue) || new Date();

  return (
    <div className={contenedorClasses}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="DD/MM/AAAA"
        className={inputClasses}
        ref={inputRef}
      />

      <div className={iconoCalendarioClasses} onClick={toggleCalendar}>
        <FontAwesomeIcon icon={faCalendarDays} />
      </div>
      {error && <p className="error">{error}</p>}

      {isOpen && (
        <div className={calendarioClasses}>
          <DatePickerLib
            selected={calendarDate}
            onChange={handleCalendarChange}
            inline
            dateFormat="dd/MM/yyyy"
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;