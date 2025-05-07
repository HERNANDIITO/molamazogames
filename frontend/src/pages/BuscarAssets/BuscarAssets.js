import './BuscarAssets.scss'
import { useState, useEffect } from "react";

import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';

import { getAllCategories } from '../../services/categoriesServices.js';
import { getAllFormats } from '../../services/formatsServices.js';
import { useParams } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

import FullDropdown from '../../components/FullDropdown/FullDropdown.js';
import Checkbox from '../../components/Checkbox/Checkbox.js';
import SearchBar from '../../components/SearchBar/SearchBar.js';
import Select from "../../components/Select/Select";

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

    const [ordenes, setOrden] = useState([]);
    const [ordenSeleccionado, setOrdenSeleccionado] = useState('');

    const [etiquetasAnadidas, setEtiquetasAnadidas] = useState([]);
    const [etiquetaInput, setEtiquetaInput] = useState('');

    const [searchMode, setSearchMode] = useState(false);

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
                const metaValue = format.meta.meta;
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

    useEffect(() => {
        const options = [
        {
            label: 'Actualizaciones nuevas',
            value: '1',
        },
        {
            label: 'Actualizaciones más antiguas',
            value: '2',
        },
        {
            value: '3',
            label: 'Nombre ascendente A-Z',
        },
        {
            label: 'Nombre descendente A-Z',
            value: '4',
        },
        {
            label: 'Publicaciones nuevas',
            value: '5',
        },
        {
            label: 'Publicaciones más antiguas',
            value: '6',
        }
    ];

    setOrden(options);
  }, []);
      
  const anadirEtiqueta = () => {
    console.log(etiquetaInput);
    const etiquetaLimpia = etiquetaInput.trim();

    if (
        etiquetaLimpia &&
        /^[a-zA-Z0-9]+$/.test(etiquetaLimpia) &&
        !etiquetasAnadidas.includes(etiquetaLimpia)
    ) {
        setEtiquetasAnadidas([...etiquetasAnadidas, etiquetaLimpia]);
        setEtiquetaInput('');
    }
};
    
  return (
    <main class="buscarsssets-main-container">  
        <section>
        <h2>{meta ? (meta) : ( searchTerm ? ( '"' + searchTerm + '"' ) : ("Todos los assets"))}</h2>
        </section>

        <aside>
        <form>
            <Checkbox 
                label="Búsqueda exclusiva"
                id="modo-busqueda"
                value="1"
                size="normal"
                showLabel={true}
                checked={searchMode}
                onChange={() => setSearchMode(!searchMode)}
            />
            <Select
                label="Ordenar por"
                options={ordenes}
                name="orden"
                value={ordenSeleccionado}
                onChange={(e) => setOrdenSeleccionado(e.target.value)}
            />
            <SearchBar
                labelText = "Filtrar por etiquetas"
                placeholderText = "Escribe una etiqueta..."
                id = "searchBar-etiquetas"
                buttonId = "searchBarButton-etiquetas"
                onClick = {anadirEtiqueta}
                onChange = {(e) => setEtiquetaInput(e.target.value)}
                value={etiquetaInput}
            />
            <div className="etiquetasAdds">
                {etiquetasAnadidas.map((tag, index) => (
                    <Button key={index} className="tag tag-delete" label={tag} onClick={() => {
                        setEtiquetasAnadidas(etiquetasAnadidas.filter(t => t !== tag));
                    }} />
                ))}
            </div>
            <SearchBar
                labelText = "Filtrar por autor"
                placeholderText = "Escribe un autor..."
                id = "searchBar-autor"
                buttonId = "searchBarButton-autor"
                // onClick = {(e) => }
            />
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
