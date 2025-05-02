import React, { useState } from 'react';
import classNames from 'classnames';
import './SliderField.scss';

const SliderField = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultMinValue = 0,
  defaultMaxValue = 100,
  id,
  className,
  texto = 'giga',
}) => {
  const [minValue, setMinValue] = useState(defaultMinValue);
  const [maxValue, setMaxValue] = useState(defaultMaxValue);

  const labelClasses = classNames('lbl', className);
  const descClasses = classNames('desc', className);
  const divClasses = classNames('dv', className);
  const thumbClasses = classNames('tmb', className);
  const tamano = texto === 'mega' ? 'MB' : texto === 'tera' ? 'TB' : 'GB';

  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= maxValue) {
      setMinValue(newMin);
    }
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= minValue) {
      setMaxValue(newMax);
    }
  };

  return (
    <div className={divClasses}>
      <label htmlFor={id} className={labelClasses}>{label}</label>
      <div className="slider-container">
        <div className="slider-track"></div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className={thumbClasses}
          style={{ left: '-5px' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className={thumbClasses}
          style={{ top: '-19px' }}
        />

        <div
          className="slider-range"
          style={{
            left: `${(minValue - min) / (max - min) * 100}%`,
            width: `${(maxValue - minValue) / (max - min) * 100}%`,
          }}
        />

        <div className={descClasses}>
          {minValue} - {maxValue} {tamano}
        </div>
      </div>
    </div>
  );
};

export default SliderField;
