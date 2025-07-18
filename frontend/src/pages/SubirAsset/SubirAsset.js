import './SubirAsset.scss';

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaCheck, FaTimes, FaUpload, FaTag } from "react-icons/fa";

import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Select from "../../components/Select/Select";
import UploadedFile from "../../components/UploadedFile/UploadedFile";

import { uploadFile } from '../../services/fileService';
import { postAsset } from '../../services/assetService';
import { getAllMeta } from "../../services/metaServices";
import { getAllCategories } from "../../services/categoriesServices";
import { getUserByToken } from "../../services/authServices";

function SubirAssetContent() {
    const navigate = useNavigate();

    const [imagen, setImagen] = useState(null);
    const [imagenURL, setImagenURL] = useState(null);
    const [imagenNombre, setImagenNombre] = useState('');
    const [imagenAlt, setImagenAlt] = useState('');

    const [nombreAsset, setNombreAsset] = useState('');
    const [descripcionAsset, setDescripcionAsset] = useState('');

    const [archivosSubidos, setArchivosSubidos] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('subir');

    const [etiquetaInput, setEtiquetaInput] = useState('');
    const [etiquetasAnadidas, setEtiquetasAnadidas] = useState([]);

    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [categoriasAnadidas, setCategoriasAnadidas] = useState([]);

    const [mensaje, setMensaje] = useState('');
    const [assetId, setAssetId] = useState(null);

    const fileInputRef = useRef(null);

    const abrirModalFoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };



    const abrirModalArchivo = () => {
        setModalType('subir');
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
    };

    const handleModalUpload = (file, nombre, alt) => {
        if (modalType === 'subir') {
            if (file) {
                setArchivosSubidos(prev => [...prev, {
                    file,
                    name: nombre || file.name,
                    desc: alt,
                    isPreview: false
                }]);
            }
        } else if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            setImagen(file);
            setImagenNombre(nombre);
            setImagenAlt(alt);
            reader.onloadend = function () {
                setImagenURL(reader.result);
            };
            reader.readAsDataURL(file);
        }
        cerrarModal();
    };

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const userData = await getUserByToken(token);
                console.log("Usuario autenticado:", userData);

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
                console.error("Error cargando datos:", error);
                navigate("/login");
            }
        };

        cargarDatosIniciales();
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
            /^[a-zA-Z0-9]+$/.test(etiquetaLimpia) &&
            !etiquetasAnadidas.includes(etiquetaLimpia)
        ) {
            setEtiquetasAnadidas([...etiquetasAnadidas, etiquetaLimpia]);
            setEtiquetaInput('');
        }
    };

    const uploadAsset = async () => {
        const asset = {
            name: nombreAsset,
            description: descripcionAsset ? descripcionAsset : " ",
            categories: [],
            tags: etiquetasAnadidas,
            files: [],
            image: ""
        };

        for (const category of categoriasAnadidas) {
            asset.categories.push(category.key);
        }

        try {
            for (const archivo of archivosSubidos) {
                const formData = new FormData();
                formData.append('file', archivo.file);
                console.log('FILE:', archivo.file)
                formData.append('name', archivo.name || "Sin nombre");
                console.log('NAME:', archivo.name)
                formData.append('description', archivo.desc || " ");
                console.log('DESCRIPTION:', archivo.desc)
                formData.append('isPreview', archivo.isPreview);
                console.log('PREVIEW:', archivo.isPreview)

                const result = await uploadFile(formData);
                asset.files.push(result.file._id);
            }
        } catch (error) {
            console.error(error);
            setMensaje("Error al subir los archivos.");
            return;
        }

        try {
            const imgFormData = new FormData();
            imgFormData.append('file', imagen);
            imgFormData.append('name', imagenNombre || "Sin nombre");
            imgFormData.append('description', imagenAlt || " ");
            imgFormData.append('isPreview', true);

            const result = await uploadFile(imgFormData);
            asset.image = result.file._id;
        } catch (error) {
            console.error(error);
            setMensaje("Error al subir la imagen de portada.");
            return;
        }

        try {
            const response = await postAsset(asset);

            setAssetId(response._id);
            setModalType('exito');
            setShowModal(true);

        } catch (error) {
            console.error(error);
            setMensaje("Error al subir el asset.");
        }
    };

    const descartarAsset = () => {
        setNombreAsset('');
        setDescripcionAsset('');
        setImagen(null);
        setImagenURL(null);
        setImagenNombre('');
        setImagenAlt('');
        setArchivosSubidos([]);
        setCategoriaSeleccionada('');
        setCategoriasAnadidas([]);
        setEtiquetaInput('');
        setEtiquetasAnadidas([]);
        setMensaje('');
    };

    return (
        <main className="App-content">
            <h2 className="titulo linea">Subir asset</h2>
            <p className="informacionUpAsset">Los campos marcados con (*) son obligatorios. Además se debe subir un archivo y añadir una categoría como mínimo.</p>

            <div className="bloque nombre">
                <h3 className="encabezado lineaBloque">Nombre*:</h3>
                <Input name="nombreAsset" onChange={(e) => setNombreAsset(e.target.value)} value={nombreAsset} placeholder="Nombre" className="inputUpAsset" />
            </div>

            <div className="bloque descripcion">
                <h3 className="encabezado lineaBloque">Descripción:</h3>
                <Textarea name="descAsset" onChange={(e) => setDescripcionAsset(e.target.value)} value={descripcionAsset} placeholder="Descripción del asset" className="textareaUpAsset" />
            </div>

            <div className="catEti">
                <div className="categoriaEtiqueta catego">
                    <h3 className="encabezado lineaBloque">Categorías*:</h3>
                    <Select
                        placeholder="Selecciona una categoría"
                        options={categorias}
                        name="categoria"
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    />
                    <Button label="Añadir categoría" icon={<FaPlusCircle />} iconPosition="left" className="tag" onClick={anadirCategoria} />
                    <div className="categoriasAdds">
                        {categoriasAnadidas.map(cat => (
                            <Button key={cat.value} className="tag tag-delete cats" label={cat.label} onClick={() => {
                                setCategoriasAnadidas(categoriasAnadidas.filter(c => c.value !== cat.value));
                            }} />
                        ))}
                    </div>
                </div>
                <div className="categoriaEtiqueta eti">
                    <h3 className="encabezado lineaBloque">Etiquetas:</h3>
                    <Input type="text" className="input-etiqueta" placeholder="Escribe una etiqueta" value={etiquetaInput} onChange={(e) => setEtiquetaInput(e.target.value)} />
                    <Button label="Añadir etiqueta" icon={<FaPlusCircle />} iconPosition="left" className="tag" onClick={anadirEtiqueta} />
                    <div className="categoriasAdds">
                        {etiquetasAnadidas.map((tag, index) => (
                            <Button key={index} icon={<FaTag />} iconPosition="left" className="tag tag-delete cats" label={tag} onClick={() => setEtiquetasAnadidas(etiquetasAnadidas.filter(t => t !== tag))} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bloque imagen">
                <h3 className="encabezado lineaBloque">Imagen de portada:</h3>
                {imagen && (
                    <>
                        <img src={imagenURL} alt={imagenAlt} className="preview-imagen" />
                    </>
                )}
                <Button
                    label={imagen ? "Cambiar imagen" : "Subir imagen"}
                    icon={<FaUpload />}
                    className="mediano-btn"
                    onClick={abrirModalFoto}
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            setImagen(file);
                            setImagenNombre('');
                            setImagenAlt('');
                            reader.onloadend = function () {
                                setImagenURL(reader.result);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />
            </div>


            <div className="bloque imagen">
                <h3 className="encabezado lineaBloque">Archivos*:</h3>
                <div className="archivos-subidos">
                    {archivosSubidos.map((archivo, index) => (
                        <UploadedFile
                            key={index}
                            name={archivo.name}
                            isPreview={archivo.isPreview}
                            onTogglePreview={() => {
                                setArchivosSubidos(prev =>
                                    prev.map((a, i) =>
                                        i === index ? { ...a, isPreview: !a.isPreview } : a
                                    )
                                );
                            }}
                            onRemove={() => setArchivosSubidos(prev =>
                                prev.filter((_, i) => i !== index)
                            )}
                        />
                    ))}
                </div>
                <Button label="Subir archivo" icon={<FaUpload />} className="mediano-btn" onClick={abrirModalArchivo} />
            </div>

            <div className="botones">
                <Button onClick={uploadAsset} label="Subir asset" icon={<FaCheck />} className="botonesFinales ocultar-label" />
                <Button onClick={descartarAsset} label="Descartar asset" icon={<FaTimes />} className="danger-btn botonesFinales ocultar-label" />
            </div>

            {mensaje && <p className="mensaje-subida">{mensaje}</p>}

            {showModal && (
                <Modal
                    type={modalType}
                    onClose={cerrarModal}
                    onImageUpload={handleModalUpload}
                    assetId={assetId}
                    onGoHome={() => navigate('/home')}
                    onGoUpload={() => {
                        cerrarModal();
                        descartarAsset();
                    }}
                    onGoDetails={() => navigate(`/detallesAsset/${assetId}`)}
                />
            )}
        </main>
    );
}

function SubirAsset() {
    return <SubirAssetContent />;
}

export default SubirAsset;
