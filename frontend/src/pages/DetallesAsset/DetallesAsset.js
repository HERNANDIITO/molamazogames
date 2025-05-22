import './DetallesAsset.scss'
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faDownload, faFilm, faFolder, faHeart, faImage, faComment, faMusic, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faBookmark, faFileCode } from '@fortawesome/free-regular-svg-icons';
import Button from '../../components/Button/Button.js';
import { useParams } from 'react-router-dom';
import { LuTag } from "react-icons/lu";
import { getAssetById } from '../../services/assetService.js';
import CarousselController from '../../components/CarousselController/CarousselController.js';
import { getUserByToken } from '../../services/authServices';
import Textarea from '../../components/Textarea/Textarea.js';
import perfil from '../../assets/images/perfil.png';
import { CarousselImage } from '../../components/carousselEntry/carousselImage/CarousselImage.js'
import { Caroussel3D } from '../../components/carousselEntry/caroussel3D/Caroussel3D.js';
import { getAssetFavs, getUserFavs } from '../../services/favService.js';
import { postFav } from "../../services/favService.js"
import { postNewHistoryEntry } from '../../services/historyServices.js';
import { getCommentByAssetID, postComment, deleteComment } from '../../services/commentService.js';


const DetallesAsset = () => {

    const [asset, setAsset] = useState([]);
    const [assetError, setErrorAsset] = useState(null);

    const [previewFiles, setPreviewFiles] = useState([]);
    const [previewFilesError, setErrorPreviewFiles] = useState(null);

    const [downloadableFiles, setDownloadableFiles] = useState([]);
    const [downloadableFilesError, setErrorDownloadableFiles] = useState(null);

    const [userLikes, setUserLikes] = useState(false);
    const [userLikesError, setErrorUserLikes] = useState(false);

    const [ pageLoaded, setPageLoaded ] = useState(false);
    const [ userID, setUserID ] = useState("");
    const [ comments, setComments ] = useState([]);
    const [ comment, setComment ] = useState("");

    const carousselRef = useRef(null);

    const { assetID } = useParams();

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const result = await getAssetById({ assetID: assetID });
                const assetToSet = result.asset;
                const previewFilesToSet = result.asset.files.filter((file) => file.preview);
                const downloadableFilesToSet = result.asset.files;
                setAsset(assetToSet);
                setPreviewFiles(previewFilesToSet);
                setDownloadableFiles(downloadableFilesToSet);

                const token = localStorage.getItem('token');
                const user = await getUserByToken(token);
                setUserID(user._id);

                const resultAssetFavs = await getAssetFavs({ assetID: assetID });
                setUserLikes(resultAssetFavs.users.some(item => item._id === user._id));

                const resultComments = await getCommentByAssetID({assetID: assetID});
                setComments(resultComments.comments)

            } catch (error) {
                console.error(error);
            }
            setPageLoaded(true); // Marca que la página ha sido cargada
        };

        fetchAsset();
    }, [assetID]); // Este `useEffect` solo se ejecuta al cargar el asset


    const registrarHistorial = async () => {
        const lastVisited = localStorage.getItem("lastVisitedAsset");

        if (assetID && lastVisited !== assetID) {
            try {
                localStorage.setItem("lastVisitedAsset", assetID);
                await postNewHistoryEntry({"assetID": assetID });
            } catch (error) {
                console.error("Error registrando historial:", error);
            }
        }
    };

    const renderPreviewImages = () => {
        if (!previewFiles || previewFiles.length === 0) {
            return;
        }

        const modelos3D = [
            "model/gltf+json",
            "model/gltf-binary",
            "application/octet-stream",
            "application/stl",
            "application/ply",
            "application/x-3ds"
        ];

        return previewFiles.map((entry) => {
            const tipo = entry.mimetype.split("/")[0];

            if (tipo === "image") {
                return (
                    <CarousselImage
                        key={entry.name}
                        path={entry.path}
                        name={entry.name}
                        description={entry.description}
                    />
                );
            }

            if (modelos3D.includes(entry.mimetype)) {
                return (
                    <Caroussel3D
                        key={entry.name}
                        path={entry.path}
                        name={entry.name}
                        description={entry.description}
                    />
                );
            }

            return null;
        });
    };


    const getAssetAuthor = () => {
        if (asset.author) { return asset.author.name; }
        return;
    }

    const getAssetSize = () => {
        if (asset.size) { return bytesToBigUnit(asset.size); }
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
        if (asset.publicationDate) { return formatDate(asset.publicationDate); }
        return;
    }

    const getAssetUpdateDate = () => {
        if (asset.updateDate) { return formatDate(asset.updateDate); }
        return;
    }

    const getAssetDescription = () => {
        if (asset.description) { return asset.description; }
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
        if (!asset.categories) { return; }

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

        if (!caroussel) { return; }

        const currentScroll = caroussel.scrollLeft;
        const pxToScroll = currentScroll + (caroussel.clientWidth * direction)

        caroussel.scroll(pxToScroll, 0);
    }

    const renderDownloadableFiles = () => {
        if (!downloadableFiles) { return "No hay downloadable files"; }
        return downloadableFiles.map((file) => (
            <div class="downloadableFile">
                <span class="fileType" >
                    {(() => {
                        switch (file.mimetype.split("/")[0]) {
                            case "image":
                                return <FontAwesomeIcon icon={faImage} />;
                            case "video":
                                return <FontAwesomeIcon icon={faFilm} />;
                            case "audio":
                                return <FontAwesomeIcon icon={faMusic} />;
                            case "text":
                                return <FontAwesomeIcon icon={faCode} />;
                            case "application":
                                return <FontAwesomeIcon icon={faFolder} />;
                            default:
                                return "Unsupported file type"; 
                        }
                    })()}
                </span>
                <span class="fileName" >{file.originalName}</span>
                <span class="fileDesc" >{file.description}</span>
                <Button
                    label={file.originalName}
                    icon={<FontAwesomeIcon icon={faDownload} />}
                    iconPosition="alone"
                    className="round-btn secondary-btn enano-btn fileDownload"
                    href={`https://molamazogames-ctup.onrender.com/file/download?fileID=${file._id}`}
                    onClick={registrarHistorial}
                />
            </div>
        ))
    }

    function getDate(dateStr) {
        const dateObj = new Date(dateStr);

        const day = String(dateObj.getDate()).padStart(2, '0');       
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    }

    const deleteCommentHandler = async (id) => {
        await deleteComment({commentID: id});
        const newComments = await getCommentByAssetID({assetID: assetID});
        setComments(newComments.comments);
    }

    const renderComments = () => {
        if ( !comments ) { return; }

        return comments.map( (comment) => (
            <div class="comment" key={comment._id}>
                <div class="userInfo">
                    <img class="userPfp" src={perfil}></img>
                    <p class="userName">{comment.author.name}</p>
                </div>

                <p class="commentContent">{comment.content}</p>
                <p class="commentDate">{getDate(comment.publicationDate)}</p>

                {
                    comment.author._id === userID && (
                        <Button
                            label={""}
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            iconPosition="alone"
                            className="danger-btn enano-btn borrar-comment-btn"
                            href="#"
                            onClick={() => deleteCommentHandler(comment._id)}
                        />
                    )
                }
            </div>
        ))
    }


    const renderTags = () => {
        if (!asset.tags) { return; }

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

    const renderCarousselController = () => {
        if (!previewFiles || previewFiles.length === 0) {
            return;
        }
            return (
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
                        {renderPreviewImages()}
                    </div>
                </div>


            )
        
    }

    // Función para manejar el like del post
    const likeThisPost = async () => {
        if (!pageLoaded) return; 

        const newLikeStatus = !userLikes; 
        setUserLikes(newLikeStatus); 

        try {
            await postFav({ userID, assetID });
        } catch (error) {
            console.error("Error al actualizar el like:", error);
        }

    };

    const handleCommentPost = async (e) => {
        const result = await postComment({
            assetID: assetID,
            content: comment
        });

        const resultComments = await getCommentByAssetID({assetID: assetID});
        setComments(resultComments.comments)
    };

    return (

        <main>
 
            <div class="detailsPage">
                <h2 class="decorator assetDetails-assetName">{asset.name}</h2>
                {previewFiles.length > 0 && renderCarousselController()}

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
                                    label={"Descarga"}
                                    icon={<FontAwesomeIcon icon={faDownload} />}
                                    href={`https://molamazogames-ctup.onrender.com/asset/download?assetID=${assetID}`}
                                    onClick={registrarHistorial}
                                    className={'assetDetails-button assetDetails-downloadButton'}
                                ></Button>
                                <Button
                                    label={""}
                                    icon={<FontAwesomeIcon icon={ userLikes ? faHeart : faRegularHeart } />}
                                    iconPosition={"alone"}
                                    className={"assetDetails-button secondary-btn"}
                                    onClick={likeThisPost}
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
                    <div class="assetDownloads assetDetailsCard">
                        <h3 class="decorator">Descargas</h3>
                        <p class="downloadableFileList">{renderDownloadableFiles()}</p>
                    </div>
                    <div class="assetComments assetDetailsCard">
                        <h3 class="decorator">Comentarios</h3>
                        <form>
                            <Textarea
                                type="text"
                                name="content"
                                id="content"
                                label="Escribe aquí lo que piensas:"
                                autoFocus
                                placeholder="Escribe aquí tu comentario"
                                className="texto"
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                            />
                            <Button
                                label={"Comentar"}
                                icon={<FontAwesomeIcon icon={faComment} />}
                                className={'comment-button'}
                                onClick={handleCommentPost}
                            ></Button>
                        </form>
                        <div class="decorator"></div>
                        <div class="comments">{renderComments()}</div>
                    </div>
                </div>
            </div>

        </main>

    );
};

export default DetallesAsset;
