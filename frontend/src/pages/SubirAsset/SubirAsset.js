import './SubirAsset.scss';

import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { FaPlusCircle, FaCheck, FaTimes, FaUpload, FaTag } from "react-icons/fa";

import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Select from "../../components/Select/Select";

import { getAllMeta } from "../../services/metaServices";
import { getAllCategories } from "../../services/categoriesServices";

function SubirAssetContent() {

    const [imagen, setImagen] = useState(null);
    const fileInputRef = useRef();

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('subir');

    const [etiquetaInput, setEtiquetaInput] = useState('');
    const [etiquetasAnadidas, setEtiquetasAnadidas] = useState([]);


    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [categoriasAnadidas, setCategoriasAnadidas] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagen(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const abrirModalArchivo = () => {
        setModalType('subir');
        setShowModal(true);
    };

    const abrirModalFoto = () => {
        setModalType(imagen ? 'edit' : 'add');
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const cargarCategoriasAgrupadas = async () => {
            try {
                const resMeta = await getAllMeta();
                const metas = resMeta || [];

                const grupos = await Promise.all(
                    metas.map(async (meta) => {
                        const resCat = await getAllCategories({ meta: meta.meta });
                        const categorias = resCat.categories || [];

                        return {
                            label: meta.meta,
                            options: categorias.map(cat => ({
                                value: cat._id,
                                label: cat.name,
                                key: cat._id
                            }))
                        };
                    })
                );

                grupos.sort((a, b) => a.label.localeCompare(b.label));
                setCategorias(grupos);
            } catch (error) {
                console.error("Error al cargar categorias agrupadas:", error.message);
            }
        };

        cargarCategoriasAgrupadas();
    }, []);

    const anadirCategoria = () => {
        if (
            categoriaSeleccionada &&
            !categoriasAnadidas.some(cat => cat.value === categoriaSeleccionada)
        ) {
            const encontrada = categorias.flatMap(group => group.options)
                .find(cat => cat.value === categoriaSeleccionada);

            if (encontrada) {
                setCategoriasAnadidas([...categoriasAnadidas, encontrada]);
            }
        }
    };

    const anadirEtiqueta = () => {
        const etiquetaLimpia = etiquetaInput.trim();

        if (
            etiquetaLimpia &&
            /^[a-zA-Z0-9]+$/.test(etiquetaLimpia) && // Solo letras y números
            !etiquetasAnadidas.includes(etiquetaLimpia)
        ) {
            setEtiquetasAnadidas([...etiquetasAnadidas, etiquetaLimpia]);
            setEtiquetaInput('');
        }
    };

    return (
        <main className="App-content">
            <h2 className="titulo linea">Subir asset</h2>
            <p className="informacionUpAsset">Los campos marcados con (*) son obligatorios. Además se debe subir un archivo y anadir una categoria como minimo.</p>

            <div className="bloque nombre">
                <h3 className="encabezado lineaBloque">Nombre*:</h3>
                <Input
                    name="nombreAsset"
                    placeholder="Nombre"
                    className="inputUpAsset"
                />
            </div>

            <div className="bloque descripcion">
                <h3 className="encabezado lineaBloque">Descripcion:</h3>
                <Textarea
                    name="descAsset"
                    placeholder="Descripcion del asset"
                    className="textareaUpAsset"
                />
            </div>

            <div className="catEti">
                <div className="categoriaEtiqueta catego">
                    <h3 className="encabezado lineaBloque">Categorias*:</h3>
                    <Select
                        placeholder="Selecciona una categoria"
                        options={categorias}
                        name="categoria"
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    />
                    <Button
                        label="Anadir categoria"
                        icon={<FaPlusCircle />}
                        iconPosition="left"
                        className="tag"
                        onClick={anadirCategoria}
                    />
                    <div className="categoriasAdds">
                        {categoriasAnadidas.map(cat => (
                            <Button
                                key={cat.value}
                                className="tag tag-delete cats"
                                label={cat.label}
                                onClick={() => {
                                    setCategoriasAnadidas(categoriasAnadidas.filter(c => c.value !== cat.value));
                                }}
                            />
                        ))}
                    </div>

                </div>
                <div className="categoriaEtiqueta eti">
                    <h3 className="encabezado lineaBloque">Etiquetas:</h3>
                    <Input
                        type="text"
                        className="input-etiqueta"
                        placeholder="Escribe una etiqueta"
                        value={etiquetaInput}
                        onChange={(e) => setEtiquetaInput(e.target.value)}
                    />

                    <Button
                        label="Anadir etiqueta"
                        icon={<FaPlusCircle />}
                        iconPosition="left"
                        className="tag"
                        onClick={anadirEtiqueta}
                    />

                    <div className="categoriasAdds">
                        {etiquetasAnadidas.map((tag, index) => (
                            <Button
                                key={index}
                                icon={<FaTag />}
                                iconPosition="left"
                                className="tag tag-delete cats"
                                label={tag}
                                onClick={() => setEtiquetasAnadidas(etiquetasAnadidas.filter(t => t !== tag))}
                            />
                        ))}
                    </div>

                </div>
            </div>

            <div className="bloque imagen">
                <h3 className="encabezado lineaBloque">Imagen de portada:</h3>
                {imagen && (
                    <img
                        src={imagen}
                        alt="Vista previa"
                        className="preview-imagen"
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                />
                <Button
                    label={imagen ? "Cambiar imagen" : "Subir imagen"}
                    icon={<FaUpload />}
                    className="mediano-btn"
                    onClick={abrirModalFoto}
                />
            </div>

            <div className="bloque imagen">
                <h3 className="encabezado lineaBloque">Archivos*:</h3>
                <Button
                    label="Subir archivo"
                    icon={<FaUpload />}
                    className="mediano-btn"
                    onClick={abrirModalArchivo}
                />
            </div>

            <div className="botones">
                <Button
                    label="Subir asset"
                    icon={<FaCheck />}
                    className="botonesFinales ocultar-label"
                />
                <Button
                    label="Descartar asset"
                    icon={<FaTimes />}
                    className="danger-btn botonesFinales ocultar-label"
                />
            </div>

            {showModal && (
                <Modal type={modalType} onClose={cerrarModal} />
            )}
        </main>
    );
}

function SubirAsset() {
    return (
        <SubirAssetContent />
    );
}

export default SubirAsset;