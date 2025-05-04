import React from 'react';
import DropdownCheckboxes from '../../components/DropdownCheckboxes/DropdownCheckboxes.js';

const FullDropdown = ({ categories, nameDropdown }) => {
    return (
        <details>
            <summary>{nameDropdown}</summary>
            <DropdownCheckboxes categories={categories} />
        </details> 
      );
};

export default FullDropdown;
