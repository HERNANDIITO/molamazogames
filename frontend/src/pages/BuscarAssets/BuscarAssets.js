import './BuscarAssets.scss'
import { useState, useEffect, useRef } from "react";

import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';

import { getAssets } from '../../services/assetService.js';
import { getAllCategories } from '../../services/categoriesServices.js';
import { getAllFormats } from '../../services/formatsServices.js';
import { useParams } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

import FullDropdown from '../../components/FullDropdown/FullDropdown.js';
import Checkbox from '../../components/Checkbox/Checkbox.js';
import SearchBar from '../../components/SearchBar/SearchBar.js';
import Select from "../../components/Select/Select";
import Card from "../../components/Card/Card"


import { FiDelete } from "react-icons/fi";
import { HiOutlineFilter } from 'react-icons/hi'
import { HiPuzzle } from 'react-icons/hi'


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
    const [ordenSeleccionado, setOrdenSeleccionado] = useState('1');

    const [etiquetasAnadidas, setEtiquetasAnadidas] = useState([]);
    const [etiquetaInput, setEtiquetaInput] = useState('');

    const [autoresAnadidos, setAutoresAnadidos] = useState([]);
    const [autorInput, setAutorInput] = useState('');

    const [nameInput, setNameInput] = useState('');

    const [searchMode, setSearchMode] = useState(false);

    const [checkedCategories, setCheckedCategories] = useState({});
    const [checkedFormats, setCheckedFormats] = useState({});

    const [assets, setAssets] = useState([]);
    const [numbreAssets, setNumberAssets] = useState('');
    const [assetsError, setErrorAssets] = useState(null);

    const [areFilters, setAreFilters] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const size = {}

    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         search();
    //     }, 500);

    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [searchTerm, etiquetasAnadidas, autoresAnadidos, ordenSeleccionado, searchMode, checkedCategories, checkedFormats, meta, searchMode, size]); 

    const timeoutRef = useRef(null);

    useEffect(() => {
        // Limpiar el timeout previo
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Establecer un nuevo timeout
        timeoutRef.current = setTimeout(() => {
            search();
        }, 200);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [searchTerm, etiquetasAnadidas, autoresAnadidos, ordenSeleccionado, searchMode, checkedCategories, checkedFormats, meta, nameInput]);


    const navigate = useNavigate();
  
    const handleCardClick = (id) => {
        navigate(`/detallesAsset/${id}`);
    };

    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         search();
    //     }, 500);

    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [etiquetasAnadidas]); 
    

    const search = async () => {
        console.log("me han llamado")
        let orderby
        switch ( ordenSeleccionado ) {
            case '1':
                orderby = {"updateDate": 1}
                break;
            case '2':
                orderby = {"updateDate": -1}
                break;
            case '3':
                orderby = {"name": 1}
                break;
            case '4':
                orderby = {"name": -1}
                break;
            case '5':
                orderby = {"publicationDate": 1}
                break;
            case '6':
                orderby = {"publicationDate": -1}
                break;
        }

        console.log("checkedCategories: ", ) ;
        console.log("checkedFormats: ", checkedFormats);

        const categoryKeys = [];
        const formatsKeys = [];

        for (const key of Object.keys(checkedCategories)) {
            if ( checkedCategories[key] ) {
                categoryKeys.push(key);
            }
        }

        for (const key of Object.keys(checkedFormats)) {
            if ( checkedFormats[key] ) {
                formatsKeys.push(key);
            }
        }

        let searchWord = nameInput ? nameInput : searchTerm;

        const params = {
            orderBy: orderby,
            searchBar: searchWord,
            tags: etiquetasAnadidas,
            author: autoresAnadidos,
            category: categoryKeys,
            format: formatsKeys,
            size: null,
            meta: [meta],
            isStrict: searchMode
        }

        console.log("params", params)

       try {
            const result = await getAssets(params);
            console.log(result);
            setAssets(result.assets);
            setNumberAssets(result.results);
        } catch (error) {
            setErrorAssets('Algo salió mal. No se han podido recuperar las categorías. Por favor, prueba a recargar la página.');
        }

        if(ordenSeleccionado != '1' || searchMode || etiquetasAnadidas.length != 0 || 
           autoresAnadidos.length != 0 || (Object.keys(checkedFormats).length != 0 &&
           !Object.values(checkedFormats).every(value => value === undefined || value === false))
           || (Object.keys(checkedCategories).length != 0 &&
            !Object.values(checkedCategories).every(value => value === undefined || value === false)) ||
        nameInput != '') {
            setAreFilters(true)
        } else {
            setAreFilters(false)
        }

        console.log('ordenSeleccionado:', ordenSeleccionado);
        console.log('searchMode:', searchMode);
        console.log('autoresAnadidos', autoresAnadidos);
        console.log('checkedCategories:', checkedCategories);
        console.log('checkedFormats:', checkedFormats);


        // console.log('checkedCategories:', checkedCategories);

    }

    const resetFilters = () => {
        if(ordenSeleccionado != '1' ) {
            setOrdenSeleccionado(['1'])
        }
    
        setSearchMode(false)
        setEtiquetasAnadidas([])
        setAutoresAnadidos([])
        setCheckedCategories({})
        setCheckedFormats({})
        setNameInput('')
    };

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
            label: 'Nombre descendente Z-A',
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

const anadirAutor = () => {
    const autorLimpio = autorInput.trim();

    if (
        autorLimpio 
    ) {
        setAutoresAnadidos([...autoresAnadidos, autorLimpio]);
        setAutorInput('');
    }
};
    
  return (
    <main className="buscarsssets-main-container">  
        <section>
        <div className='section-header'>
            <div className='section-first-header'>
                <h2>{meta ? (meta) : ( searchTerm ? ( '"' + searchTerm + '"' ) : ("Todos los assets"))}</h2>
                <Button
                    label={sidebarOpen ? "Ver assets" : "Filtrar assets"}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    icon={sidebarOpen ? <HiPuzzle /> : <HiOutlineFilter />}
                    iconPosition="left"
                    className="mediano-btn aling-right btn-filters"
                />
            </div>

            <div className='section-second-header'>
                <p class="aling-right btn-filters">
                    <span id="contador-resultados-numero">
                        {numbreAssets - (
                            Object.keys(checkedFormats).length !== 0 &&
                            !Object.values(checkedFormats).every(value => value === undefined || value === false)
                                ? 1
                                : 0
                        )}
                    </span> 
                    {(numbreAssets - (
                        Object.keys(checkedFormats).length !== 0 &&
                        !Object.values(checkedFormats).every(value => value === undefined || value === false)
                            ? 1
                            : 0
                    )) === 1 ? ' resultado' : ' resultados'}
                </p>
                <Button
                    label="Resetear filtros"
                    onClick={resetFilters}
                    icon={<FiDelete />}
                    iconPosition="left"
                    className="mediano-btn aling-right btn-filters"
                    disabled={!areFilters}
                />
            </div>
        </div>
        {
            Array.isArray(assets) && assets.length > 0 && assets.filter(asset => asset.name).length > 0 ? (
                <div className={`cards ${sidebarOpen ? 'cards-closed' : 'cards-open'}`}>
                {assets.filter(asset => asset.name).map(asset => (
                    console.log(asset),
                    <Card
                        key={asset._id}
                        type={Array.isArray(asset.categories) && asset.categories.length > 0 ? asset.categories[0].meta : ""}
                        botonTag="tag"
                        image={asset.image ? "https://molamazogames-ctup.onrender.com/" + asset.image.path : null}
                        tagsAsset={Array.isArray(asset.tags) ? asset.tags.map(tag => tag.name) : []}
                        tituloAsset={asset.name}
                        alt={asset.image.description ? asset.image.description : ""}
                        onClick={() => handleCardClick(asset._id)}
                    />
                ))}
                </div>
            ) : (
                // <p>No assets found</p> 
                !sidebarOpen && <p>No se han encontrado assets</p>
            )
        }
        
        </section>

        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <form>
            <div class="right-elemets">
                <p class="aling-right">
                    <span id="contador-resultados-numero">
                        {numbreAssets - (
                            Object.keys(checkedFormats).length !== 0 &&
                            !Object.values(checkedFormats).every(value => value === undefined || value === false)
                                ? 1
                                : 0
                        )}
                    </span> 
                    {/* {numbreAssets === 1 ? ' resultado' : ' resultados'} */}
                    {(numbreAssets - (
                        Object.keys(checkedFormats).length !== 0 &&
                        !Object.values(checkedFormats).every(value => value === undefined || value === false)
                            ? 1
                            : 0
                    )) === 1 ? ' resultado' : ' resultados'}
                </p>
                <Button
                    label="Resetear filtros"
                    onClick={resetFilters}
                    icon={<FiDelete />}
                    iconPosition="left"
                    className="mediano-btn aling-right"
                    disabled={!areFilters}
                />
                {/* {areFilters && (
                    <Button
                        label="Resetear filtros"
                        icon={<FiDelete />}
                        iconPosition="left"
                        className="mediano-btn aling-right"
                    />
                )} */}
            </div>

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
                    <Button key={index} className="tag tag-delete tag-solid" label={tag} icon={<RxCross2 />}  iconPosition="right" onClick={() => {
                        setEtiquetasAnadidas(etiquetasAnadidas.filter(t => t !== tag));
                    }} />
                ))}
            </div>
            <SearchBar
                labelText = "Filtrar por autor"
                placeholderText = "Escribe un autor..."
                id = "searchBar-autor"
                buttonId = "searchBarButton-autor"
                onClick = {anadirAutor}
                onChange = {(e) => setAutorInput(e.target.value)}
                value={autorInput}
            />
            <div className="autoresAdds">
                {autoresAnadidos.map((tag, index) => (
                    <Button key={index} className="tag tag-delete tag-solid" label={tag} icon={<RxCross2 />}  iconPosition="right" onClick={() => {
                        setAutoresAnadidos(autoresAnadidos.filter(t => t !== tag));
                    }} />
                ))}
            </div>

            {meta && (
                <SearchBar
                    labelText="Filtrar por nombre o descripción"
                    placeholderText="Nombre o descripción..."
                    id="searchBar-nombre"
                    buttonId="searchBarButton-nombre"
                    onChange={(e) => setNameInput(e.target.value)}
                    value={nameInput}
                />
            )}

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
                            checked={checkedCategories}
                            setChecked={setCheckedCategories}
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
                            checked={checkedFormats}
                            setChecked={setCheckedFormats}
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
                        checked={checkedCategories}
                        setChecked={setCheckedCategories}
                    />

                    <FullDropdown
                        categories={formats}
                        nameDropdown={"Formato"}
                        checked={checkedFormats}
                        setChecked={setCheckedFormats}
                    />
                </>
            )}
        </form>
        </aside>
    
      </main>


  );
};

export default BuscarAssets;
