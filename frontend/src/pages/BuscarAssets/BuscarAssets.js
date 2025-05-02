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


const BuscarAssets = () => {

    const [categories, setCategories] = useState([]);
    const [categoriesError, setErrorCategories] = useState(null);

    useEffect(() => {
        document.title = 'Buscar Assets - MoLAMaZoGAMES';
    }, []);

    const { meta } = useParams(); 

    const fetchCategories = async () => {
        try {
        console.log("holaa");
          const result = await getAllCategories({ meta : meta });
          console.log(result);

          if (result.result == "OK") {
            setCategories(result.categories);
            // return result.categories;
          } else {
            throw new Error('Error al obtener las categorías');
          }
        } catch (error) {
            setErrorCategories('Algo salió mal. No se han podido recuperar las categorías. Por favor, prueba a recargar la página.');
        }
    };

    useEffect(async () => {
        console.log("Holaaa");
        await fetchCategories()
    }, [meta]); 

    useEffect(() => {
        // Definir la función asincrónica dentro de useEffect
        const fetchData = async () => {
            try {
                console.log("holaa");
                const result = await getAllCategories({ meta });
                console.log(result);
    
                if (result.result == "OK") {
                    setCategories(result.categories);
                // return result.categories;
                } else {
                throw new Error('Error al obtener las categorías');
                }
            } catch (error) {
                setErrorCategories('Algo salió mal. No se han podido recuperar las categorías. Por favor, prueba a recargar la página.');
            }
        };
    
        fetchData();
      }, [meta]); 
    
    const renderCategories = (categoryList) => {
        return categoryList.map((category) => (
            <div key={category._id} className="category">
                <h3>{category.name}</h3>
                {category.children && category.children.length > 0 && (
                    <div className="subcategories">
                        {renderCategories(category.children)}  {/* Llamada recursiva para mostrar subcategorías */}
                    </div>
                )}
            </div>
        ));
    };

  return (

      <main>
       <h2>{meta}</h2>
       <p>{categories}</p>

       <div className="categories-list">
            {renderCategories(categories)}
        </div>

       {categories.length > 0 ? (
            <div className="categories-list">
                {renderCategories(categories)}
            </div>
        ) : (
            <p>No se han encontrado categorías.</p>
        )}
        
      </main>


  );
};

export default BuscarAssets;
