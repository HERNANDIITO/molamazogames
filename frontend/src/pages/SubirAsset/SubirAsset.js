import './SubirAsset.scss';

import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";

import { FaPlusCircle, FaCheck, FaTimes, FaUpload } from "react-icons/fa";

import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";

function SubirAssetContent() {
    const location = useLocation();

    const [imagen, setImagen] = useState(null);
    const fileInputRef = useRef();

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('subir'); // 'subir' | 'add' | 'edit'

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

    return (
        <main className="App-content">
            <h2 className="titulo linea">Subir asset</h2>
            <p className="informacionUpAsset">Los campos marcados con (*) son obligatorios. Además se debe subir un archivo y añadir una categoría como mínimo.</p>

            <div className="bloque nombre">
                <h3 className="encabezado lineaBloque">Nombre*:</h3>
                <Input
                    name="nombreAsset"
                    placeholder="Nombre"
                    className="inputUpAsset"
                />
            </div>

            <div className="bloque descripcion">
                <h3 className="encabezado lineaBloque">Descripción:</h3>
                <Textarea
                    name="descAsset"
                    placeholder="Descripción del asset"
                    className="textareaUpAsset"
                />
            </div>

            <div className="catEti">
                <div className="categoriaEtiqueta catego">
                    <h3 className="encabezado lineaBloque">Categorías*:</h3>
                    <Button
                        label="Añadir categoría"
                        icon={<FaPlusCircle />}
                        iconPosition="left"
                        className="tag"
                    />
                </div>
                <div className="categoriaEtiqueta eti">
                    <h3 className="encabezado lineaBloque">Etiquetas:</h3>
                    <Button
                        label="Añadir etiqueta"
                        icon={<FaPlusCircle />}
                        iconPosition="left"
                        className="tag"
                    />
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
