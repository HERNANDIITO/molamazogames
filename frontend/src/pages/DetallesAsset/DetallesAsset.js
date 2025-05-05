import './DetallesAsset.scss'
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import Button from '../../components/Button/Button.js';
import Input from '../../components/Input/Input.js';
import Profile from '../../components/Profile/Profile.js';
import { FaArrowRight } from 'react-icons/fa';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { getAllCategories } from '../../services/categoriesServices.js';
import { useParams } from 'react-router-dom';
import { LuTag } from "react-icons/lu";
import { getAssetById } from '../../services/assetService.js';
import CarousselController from '../../components/CarousselController/CarousselController.js';


const DetallesAsset = () => {

    const [asset, setAsset] = useState([]);
    const [assetError, setErrorAsset] = useState(null);

    const [previewFiles, setPreviewFiles] = useState([]);
    const [previewFilesError, setErrorPreviewFiles] = useState(null);

    const [selectedCarousselEntry, setSelectedCarousselEntry] = useState([]);
    const [selectedCarousselEntryError, setErrorCarousselEntry] = useState(null);

    const carousselRef = useRef(null);

    const { assetID } = useParams(); 

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const result = await getAssetById({ assetID: assetID });
                const assetToSet = result.asset;
                const previewFilesToSet = result.asset.files.filter( (file) => { return file.preview })
                setAsset(assetToSet);
                setPreviewFiles(previewFilesToSet)
                setSelectedCarousselEntry(0)
            } catch (error) {
                setErrorAsset('Algo salió mal. No se han podido recuperar las categorías. Por favor, prueba a recargar la página.');
            }
        };

        fetchAsset();
    }, []);

    const isSelected = (fileID) => {
        const selectedIndex = previewFiles.findIndex(archivo => archivo._id === fileID);
        if ( selectedIndex == selectedCarousselEntry ) { return " carousselSelectedPhoto" }
        if ( previewFiles[selectedCarousselEntry - 1] && previewFiles[selectedCarousselEntry - 1]._id == fileID ) { return " carousselBlurredPhoto carousselLeft" }
        if ( previewFiles[selectedCarousselEntry + 1] && previewFiles[selectedCarousselEntry + 1]._id == fileID ) { return " carousselBlurredPhoto carousselRight" }
        return " notSelected";
    }

    const renderPreviewImages = () => {

        if ( !previewFiles ) { return "No hay preview files"; }

        console.log("previewFiles", previewFiles)
        return previewFiles.map((file) => (
            <div id={file._id} class={`carousselEntry`}>
                <div class="carousselImage">
                    <img src={`http://localhost:5000\\${file.path}`}></img>
                </div>
                <div class="carousselImageInfo">
                    <h3>{file.name}</h3>
                    <p>{file.description}</p>
                </div>
            </div>
        ));
    };

    const getAssetAuthor = () => {
        if ( asset.author ) { return asset.author.name; }
        return;
    }

    const getAssetSize = () => {
        if ( asset.size ) { return bytesToBigUnit(asset.size); }
        return;
    }

    const formatDate = (dateToFormat) => {
        const fecha = new Date(dateToFormat);

        // Obtener el día, mes y año
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son base 0, por eso sumamos 1
        const año = fecha.getFullYear();

        // Formatear la fecha
        const fechaFormateada = `${dia}/${mes}/${año}`;

        return fechaFormateada;
    }

    const getAssetPublicationDate = () => {
        if ( asset.publicationDate ) { return formatDate(asset.publicationDate); }
        return;
    }

    const getAssetUpdateDate = () => {
        if ( asset.updateDate ) { return formatDate(asset.updateDate); }
        return;
    }

    const getAssetDescription = () => {
        if ( asset.description ) { return asset.description; }
        return;
    }

    function bytesToBigUnit(bytes) {
        const unidades = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; 
        let i = 0;
    
        while (bytes >= 1024 && i < unidades.length - 1) {
            bytes /= 1024;
            i++;
        }

        return `${Math.floor(bytes)} ${unidades[i]}`;
    }

    const renderCategories = () => {
        if ( !asset.categories ) { return; }

        return asset.categories.map((cat) => (
            <Button
                label={cat.name}
                icon={<LuTag />}
                iconPosition="left"
                className="tag"
                href="#"
            />
        ));
    }

    const scroll = (direction) => {
        const caroussel = carousselRef.current;

        if ( !caroussel ) { return; }

        const currentScroll = caroussel.scrollLeft;
        const pxToScroll = currentScroll + (caroussel.clientWidth * direction)

        caroussel.scroll(pxToScroll, 0);  
    }

    const renderTags = () => {
        if ( !asset.tags ) { return; }

        return asset.tags.map((tag) => (
            <Button
                label={tag.name}
                icon={<LuTag />}
                iconPosition="left"
                className="tag"
                href="#"
            />
        ));
    }

    return (

    <main>
        
        <div class="detailsPage">
            <h2 class="decorator assetDetails-assetName">{asset.name}</h2>
            <div class="carousselWrapper">
                <div class="carousselDetallesButtons">
                    <CarousselController
                        id="assetDetailsCarousselControllerLeft"
                        label="Control del carrusel"
                        onClick={() => scroll(-1)}
                    />

                    <CarousselController
                        id="assetDetailsCarousselControllerRight"
                        label="Control del carrusel"
                        onClick={() => scroll(1)}
                        direction='right'
                    />
                </div>
                <div ref={carousselRef} class="carousselDetalles">
                    { renderPreviewImages() }
                </div>
            </div>

            <div class="assetDetails">
                <div class="detailsRow">
                    <div class="info-col">
                        <div class="assetDetailsCard">
                            <h3 class="decorator">Información</h3>
                            <div class="detailsEntry">
                                <h4>Autor</h4>
                                <p>{getAssetAuthor()}</p>
                            </div>
                            <div class="detailsEntry">
                                <h4>Tamaño</h4>
                                <p>{getAssetSize()}</p>
                            </div>
                            <div class="detailsEntry">
                                <h4>Fecha de publicación</h4>
                                <p>{getAssetPublicationDate()}</p>
                            </div>
                            <div class="detailsEntry">
                                <h4>Fecha de actualización</h4>
                                <p>{getAssetUpdateDate()}</p>
                            </div>
                        </div>
                    </div>
                    <div class="tags-col">
                        <div class="assetInteractionButtons" >
                            <Button
                                label= {"Descarga"}
                                onClick= {"any"}
                                icon= {<FontAwesomeIcon icon={faDownload} />}
                                href= {"any"}
                                className={'assetDetails-button assetDetails-downloadButton'}
                            ></Button>
                            <Button
                                label= {""}
                                onClick= {"any"}
                                icon= {<FontAwesomeIcon icon={faBookmark} />}
                                href= {"any"}
                                iconPosition= {"alone"}
                                className={"assetDetails-button secondary-btn"}
                            ></Button>
                        </div>
                        <div class="assetTags assetDetailsCard">
                            <h3 class="decorator">Categorías</h3>
                            <div class="assetTags">
                                {renderCategories()}
                            </div>
                        </div>
                        <div class="assetTags assetDetailsCard">
                            <h3 class="decorator">Etiquetas</h3>
                            <div class="assetTags">
                                {renderTags()}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="assetDescription assetDetailsCard">
                    <h3 class="decorator">Descripción</h3>
                    <p>{getAssetDescription()}</p>
                </div>
            </div>
        </div>

    </main>

  );
};

export default DetallesAsset;
