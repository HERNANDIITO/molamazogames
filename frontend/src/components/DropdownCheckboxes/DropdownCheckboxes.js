import React, {useState} from 'react';
import Checkbox from '../../components/Checkbox/Checkbox.js';

const DropdownCheckboxes = ({ fullcategories, categories, checked, setChecked }) => {
  const [openDetails, setOpenDetails] = useState({});

  const handleChange = (isChecked, category) => {
    setChecked((prev) => {
      const newState = { ...prev, [category._id]: isChecked };

      const updateChildren = (category) => {
        if(category.children) {
          category.children.forEach((child) => {
            newState[child._id] = isChecked;
            updateChildren(child);
          });
        }
      };

      const updateParents = (category, categories) => {
        const findParent = (id, tree) => {
          for (const item of tree) {
            if (item.children?.some((child) => child._id == id)) {
              return item;
            }
            const found = item.children && findParent(id, item.children);
            if (found) return found;
          }
          return null;
        };

        let parent = findParent(category._id, categories);
        while (parent) {
          const allChildrenChecked = parent.children.every(
            (child) => newState[child._id]
          );
          newState[parent._id] = allChildrenChecked;
          parent = findParent(parent._id, categories);
        }
      };

      updateChildren(category);
      updateParents(category, fullcategories);

      return newState;
    });

    if (category.children && isChecked) {
      setOpenDetails((prev) => ({ ...prev, [category._id]: true }));
    }
  };

  return categories.map((category) => {

    if (category.children && category.children.length > 0) {
      // Si tiene hijos
      return (
        <details 
          key={category._id} 
          open={openDetails[category._id]}
          onToggle={e => {
            // Sincroniza el estado si el usuario abre/cierra manualmente
            setOpenDetails((prev) => ({
              ...prev,
              [category._id]: e.target.open
            }));
          }}
        >
          <summary>
            <Checkbox
                label={category.name} 
                id={category._id}
                value={category._id}
                size="normal"
                showLabel={true}
                checked={checked[category._id] || false}
                onChange={(e) => handleChange(e.target.checked, category)}
            />
          </summary>

          <div style={{ paddingLeft: '20px' }}>
            <DropdownCheckboxes 
              fullcategories={categories}
              categories={category.children} 
              checked={checked}
              setChecked={setChecked}
            />
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
                checked={checked[category._id] || false}
                onChange={(e) => handleChange(e.target.checked, category)}
            />
        );
        }
  });
};

export default DropdownCheckboxes;
