import './BuscarAssets.scss'
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';
import Profile from '../../components/Profile/Profile.js';
import { FaArrowRight } from 'react-icons/fa';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { getAllCategories } from '../../services/categoriesServices.js';
import { useParams } from 'react-router-dom';
import FullDropdown from '../../components/FullDropdown/FullDropdown.js';



const BuscarAssets = () => {

    useEffect(() => {
        document.title = 'Buscar Assets - MoLAMaZoGAMES';
    }, []);

    const [categories, setCategories] = useState([]);
    const [categoriesError, setErrorCategories] = useState(null);

    const { meta } = useParams();
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getAllCategories({ meta: meta });
                setCategories(result.categories);
            } catch (error) {
                setErrorCategories('Algo salió mal. No se han podido recuperar las categorías. Por favor, prueba a recargar la página.');
            }
        };

        fetchCategories();
    }, [meta]);


    const getCategoryGroups = () => {
        if (categories && Array.isArray(categories)) {
            const groupedByMeta = categories.reduce((acc, category) => {
                const metaValue = category.meta.meta;
                if (!acc[metaValue]) {
                    acc[metaValue] = [];
                }
                acc[metaValue].push(category);
                return acc;
            }, {});
            console.log(groupedByMeta);
            return groupedByMeta;
        }
        return {};
    }
    
  return (
    <>  
        <main>
        <h2>{meta}</h2>
        </main>

        <aside>
        {!meta ? (
            Object.entries(getCategoryGroups()).map(([key, value]) => (
            <FullDropdown
                categories={value}
                nameDropdown={key} 
            />
            ))
        ) : (
            <FullDropdown
            categories={categories}
            nameDropdown={"Categoría"}
            />
        )}
        </aside>

      </>


  );
};

export default BuscarAssets;
