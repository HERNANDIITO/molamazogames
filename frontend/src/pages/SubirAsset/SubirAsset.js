import './SubirAsset.scss';

import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import { FaPlusCircle, FaCheck, FaTimes, FaUpload } from "react-icons/fa";



import Input from "../../components/Input/Input"
import Textarea from "../../components/Textarea/Textarea"
import Button from "../../components/Button/Button"



function SubirAssetContent() {
    const location = useLocation();




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
                    <Button
                        label="Subir imagen"
                        icon={<FaUpload />}
                        className="mediano-btn"
                    />
                </div>

                <div className="bloque imagen">
                    <h3 className="encabezado lineaBloque">Archivos*:</h3>
                    <Button
                        label="Subir archivo"
                        icon={<FaUpload />}
                        className="mediano-btn"
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
            </main>
    );
}

function SubirAsset() {
    return (
        <SubirAssetContent />
    );
}

export default SubirAsset;