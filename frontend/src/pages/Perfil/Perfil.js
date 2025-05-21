import './Perfil.scss';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import perfil from '../../assets/images/perfil.png';
import { FaPlus, FaClock, FaCog } from "react-icons/fa";

import Button from "../../components/Button/Button";
import SearchBar from "../../components/SearchBar/SearchBar";
import DatePicker from "../../components/DatePicker/DatePicker";
import Checkbox from "../../components/Checkbox/Checkbox";
import Card from "../../components/Card/Card";

import { getAllMeta } from "../../services/metaServices";
import { getUserByToken } from "../../services/authServices";
import { getAssets } from "../../services/assetService";

function PerfilContent() {

    const navigate = useNavigate();

    const [metacategorias, setMetacategorias] = useState([]);
    const [checkedMetas, setCheckedMetas] = useState({});
    const [userName, setUserName] = useState('');
    const [userAssets, setUserAssets] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");

                if (token) {
                    const userData = await getUserByToken(token);
                    console.log(userData);
                    setUserName(userData.name);
                    
                    const allAssets = await getAssets();

                    const myAssets = allAssets.assets.filter(asset => asset.author._id === userData._id);
                    setUserAssets(myAssets);
                }

                const metas = await getAllMeta();
                setMetacategorias(metas);

            } catch (error) {
                console.error("Error cargando datos:", error.error);
                navigate("/login");
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        console.log("checkedMetas:", checkedMetas);
    }, [checkedMetas]);

    const handleCardClick = (assetId) => {
        navigate(`/detallesAsset/${assetId}`);
    };

    const handleCheckboxChange = (metaId) => {
        setCheckedMetas((prev) => ({
            ...prev,
            [metaId]: !prev[metaId]
        }));
    };

    return (
        <main className="App-content">
            <div className="upPerfil">
                <div className="perfilBotones">
                    <div className='imgOpciones'>
                        <img src={perfil} className='imgPerfil' />
                        <Button
                            label="Opciones perfil"
                            className="botonPer"
                            icon={<FaCog />}
                            href={'/useropt'}
                        />
                    </div>
                    <div className='infoPerfil'>
                        <p className='nombreUser'>{userName}</p>
                        <div className='botonesPerfil'>
                            <Button
                                label="Añadir asset"
                                icon={<FaPlus />}
                                className="btnPerfil"
                                href={'/upAsset'}
                            />
                            <Button
                                label="Historial descargas"
                                icon={<FaClock />}
                                className="btnPerfil"
                            />
                        </div>
                    </div>

                </div>

                <div className="filtrarPerfil">
                    <div className='upFiltrar'>
                        <p className="tituloFiltrar decoratorFiltrosTitulo">Filtrar assets</p>
                        <div className='buscaFilt'>
                            <SearchBar 
                                placeholderText="Buscar"
                            />
                        </div>

                    </div>
                    <div className="tiposFiltro">
                        <div className="filtrarCategoria">
                            <p className="subtituloFiltrar decoratorFiltros">Categoría</p>

                            {metacategorias.length > 0 && (
                                <div className="checkboxGrid">
                                    <div className="checkboxColumn">
                                        {metacategorias.slice(0, 3).map((meta) => (
                                            <div key={meta._id} className="checkboxCategoria">
                                                <Checkbox
                                                    id={`meta-${meta._id}`} 
                                                    label={meta.meta}
                                                    checked={!!checkedMetas[meta._id]} 
                                                    onChange={() => handleCheckboxChange(meta._id)}
                                                    size="normal"
                                                    showLabel={true}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="checkboxColumn">
                                        {metacategorias.slice(3, 6).map((meta) => (
                                            <div key={meta._id} className="checkboxCategoria">
                                                <Checkbox
                                                    id={`meta-${meta._id}`} 
                                                    label={meta.meta}
                                                    checked={!!checkedMetas[meta._id]} 
                                                    onChange={() => handleCheckboxChange(meta._id)}
                                                    size="normal"
                                                    showLabel={true}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                        <div className="filtarFecha">
                            <p className="subtituloFiltrar decoratorFiltros">Fecha</p>
                            <div className="datePickers">
                                <DatePicker />
                                <DatePicker />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="downPerfil">
                <p className='tituloFiltrar decoratorDown'>Mis assets</p>
                <div className="cardsAssetsPerfil">
                    <div className="cardsAssetsPerfil">
                        {userAssets.map(asset => (
                            <Card
                                idAsset={asset._id}
                                type={asset.categories[0]?.meta._id}
                                botonTag="botonYtags"
                                image={asset.image ? "https://molamazogames-ctup.onrender.com/" + asset.image.path : null}
                                tagsAsset={asset.tags.map(tag => tag.name)}
                                tituloAsset={asset.name}
                                onClick={() => handleCardClick(asset._id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

function Perfil() {
    return <PerfilContent />;
}

export default Perfil;
