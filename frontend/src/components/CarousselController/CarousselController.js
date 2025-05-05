import React from 'react';
import classNames from 'classnames'; 
import './CarousselController.scss';  
import { motion } from "framer-motion";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const CarousselController = ({
  id,
  label,
  className,
  onClick,
  disabled = false,
  direction = 'left',
}) => {
  const [expanded, setExpanded] = useState(false);

  const buttonClasses = classNames("arrow", className);
  const xOffset = direction === 'left' ? -10 : 10;
  const icon = direction === 'left' ? faCaretLeft : faCaretRight;

  const handleClick = () => {
    if (onClick) {
      console.log("triggering on click! ")
      onClick();  // Llamamos a la función onClick pasada como prop
    }
  };

  return (

      <motion.button
        id={id}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        disabled={disabled}
        className={buttonClasses}
        onClick={handleClick}  
      >
        <motion.div
          animate={{ x: expanded ? xOffset : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FontAwesomeIcon icon={icon} />
          
        </motion.div>
      </motion.button>
  );
};

export default CarousselController;