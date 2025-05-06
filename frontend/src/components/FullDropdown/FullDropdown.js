import React, {useState, useEffect} from 'react';
import DropdownCheckboxes from '../../components/DropdownCheckboxes/DropdownCheckboxes.js';
import './FullDropdown.scss'; 

const FullDropdown = ({ categories, nameDropdown }) => {
    const [checked, setChecked] = useState({});

    return (
        <details class="details-fulldropdown">
            <summary class="summary-fulldropdown">{nameDropdown}</summary>
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
