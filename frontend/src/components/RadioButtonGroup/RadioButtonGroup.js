// src/components/RadioButtonGroup/.js

import React, { useState } from 'react';
import RadioButton from '../RadioButton/RadioButton';

const RadioButtonGroup = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleRadioButtonChange = (id) => {
    setSelectedValue(id); 
  };

  return (
    <form>
      <RadioButton
        label="Aceptar los términos y condiciones"
        id="terms5"
        name="pregunta"
        isChecked={selectedValue === 'terms5'}
        onChange={handleRadioButtonChange}
      />
      <RadioButton
        label="Aceptar los términos y condiciones"
        id="terms6"
        name="pregunta"
        isChecked={selectedValue === 'terms6'}
        onChange={handleRadioButtonChange}
      />
      <RadioButton
        label="Aceptar los términos y condiciones"
        id="terms7"
        name="pregunta"
        isChecked={selectedValue === 'terms7'}
        onChange={handleRadioButtonChange}
      />
    </form>
  );
};

export default RadioButtonGroup;
