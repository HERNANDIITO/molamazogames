import React from 'react';
import Checkbox from '../../components/Checkbox/Checkbox.js';

const DropdownCheckboxes = ({ categories }) => {
  return categories.map((category) => {

    if (category.children && category.children.length > 0) {
      // Si tiene hijos
      return (
        <details key={category._id}>
          <summary>
            <Checkbox
                label={category.name} 
                id={category._id}
                value={category._id}
                size="normal"
                showLabel={true}
            />
          </summary>

          <div style={{ paddingLeft: '20px' }}>
            <DropdownCheckboxes categories={category.children} />
          </div>
        </details>
      );
    } else {
        // Si no tiene hijos
        return (
            <Checkbox
                label={category.name} 
                id={category._id}
                value={category._id}
                size="normal"
                showLabel={true}
            />
        );
        }
  });
};

export default DropdownCheckboxes;
