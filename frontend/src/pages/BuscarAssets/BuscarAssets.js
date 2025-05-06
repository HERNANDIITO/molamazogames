import './BuscarAssets.scss'
import { useState, useEffect } from "react";

import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';

import { getAllCategories } from '../../services/categoriesServices.js';
import { getAllFormats } from '../../services/formatsServices.js';
import { useParams } from 'react-router-dom';
import FullDropdown from '../../components/FullDropdown/FullDropdown.js';
import { useSearchParams } from "react-router-dom";
import './BuscarAssets.scss'



const BuscarAssets = () => {

    useEffect(() => {
        document.title = 'Buscar Assets - MoLAMaZoGAMES';
    }, []);

    const [categories, setCategories] = useState([]);
    const [categoriesError, setErrorCategories] = useState(null);
    const [formats, setFormats] = useState([]);
    const [formatsError, setErrorFormats] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get("searchBar");

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

    useEffect(() => {
        const fetchFormats = async () => {
            try {
                const result = await getAllFormats({ meta: meta });
                setFormats(result.responseFormats);
            } catch (error) {
                setErrorFormats('Algo salió mal. No se han podido recuperar los formatos. Por favor, prueba a recargar la página.');
            }
        };

        fetchFormats();
    }, [meta]);

    const getCategoryGroups = () => {
        if (categories && Array.isArray(categories) && categories.length > 0) {
            const groupedByMetaCategories = categories.reduce((acc, category) => {
                if (!category || !category.meta) { return acc; }
                const metaValue = category.meta.meta;
                if (!acc[metaValue]) {
                    acc[metaValue] = [];
                }
                acc[metaValue].push(category);
                return acc;
            }, {});
            return groupedByMetaCategories;
        }
        return {};
    }

    const categoryGroups = getCategoryGroups();

    const getFormatsGroups = () => {
        if (formats && Array.isArray(formats) && formats.length > 0) {
            const groupedByMetaFormats = formats.reduce((acc, format) => {
                if (!format || !format.meta) { return acc; }
                const metaValue = format.meta;
                if (!acc[metaValue]) {
                    acc[metaValue] = [];
                }
                acc[metaValue].push(format);
                return acc;
            }, {});
            console.log(groupedByMetaFormats);
            return groupedByMetaFormats;
        }
        return {};
    }

    const formatsGroups = getFormatsGroups();
    
  return (
    <main class="buscarsssets-main-container">  
        <section>
        <h2>{meta ? (meta) : ( searchTerm ? ( '"' + searchTerm + '"' ) : ("Todos los assets"))}</h2>
        </section>

        <aside>
        <form>
            {!meta ? (
                <>
                {!categoryGroups ? (
                    <p>Cargando...</p>
                ) : (
                    // Si ya están cargadas las categorías, mostramos el dropdown
                    <details className="details-fulldropdown details-super-fulldropdown">
                    <summary className="summary-fulldropdown summary-super-fulldropdown">Categorías</summary>
                    {
                        Object.entries(categoryGroups).map(([key, value]) => (
                        <FullDropdown
                            key={key}
                            categories={value}
                            nameDropdown={key}
                        />
                        ))
                    }
                    </details>
                )}
                

                {!formatsGroups ? (
                    <p>Cargando...</p>
                ) : (
                    // Si ya están cargadas los formatos, mostramos el dropdown
                    <details className="details-fulldropdown details-super-fulldropdown">
                    <summary className="summary-fulldropdown summary-super-fulldropdown">Formatos</summary>
                    {
                        Object.entries(formatsGroups).map(([key, value]) => (
                        <FullDropdown
                            key={key}
                            categories={value}
                            nameDropdown={key}
                        />
                        ))
                    }
                    </details>
                )}

                </>
            ) : (
                <>
                    <FullDropdown
                        categories={categories}
                        nameDropdown={"Categoría"}
                    />

                    <FullDropdown
                        categories={formats}
                        nameDropdown={"Formato"}
                    />
                </>
            )}
        </form>
        </aside>
    
      </main>


  );
};

export default BuscarAssets;
