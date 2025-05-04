import React, {useState, useEffect} from 'react';
import DropdownCheckboxes from '../../components/DropdownCheckboxes/DropdownCheckboxes.js';

const FullDropdown = ({ categories, nameDropdown }) => {
    const [checked, setChecked] = useState({});

    return (
        <details>
            <summary>{nameDropdown}</summary>
            <DropdownCheckboxes 
                fullcategories={categories}
                categories={categories} 
                checked={checked}
                setChecked={setChecked}
            />
        </details> 
      );
};

export default FullDropdown;
