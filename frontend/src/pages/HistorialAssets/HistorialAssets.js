import './HistorialAssets.scss';

import React, { useEffect, useState } from 'react';
import HistoryElement from '../../components/HistoryElement/HistoryElement';
import { getHistoryByUser } from '../../services/historyServices';
import Button from '../../components/Button/Button.js';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { getAssetById } from '../../services/assetService';
import { getAllMeta } from "../../services/metaServices";
import SearchBar from "../../components/SearchBar/SearchBar";
import DatePicker from "../../components/DatePicker/DatePicker";
import Checkbox from "../../components/Checkbox/Checkbox";

const HistorialAssets = () => {
    
    const [history, setHistory] = useState([]);
    const [errorHistory, setErrorHistory] = useState(null);
    const [fullAssets, setFullAssets] = useState([]);
    const [fiteredFullAssets, setFilteredFullAssets] = useState([]);

    const [metacategorias, setMetacategorias] = useState([]);
    const [checkedMetas, setCheckedMetas] = useState({});
    const [searchText, setSearchText] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [selectedAssets, setSelectedAssets] = useState(new Set());

    const toggleSelectAsset = (assetID) => {
        setSelectedAssets(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(assetID)) {
                newSelected.delete(assetID);
            } else {
                newSelected.add(assetID);
            }
            return newSelected;
        });
    };

    const descargarAssetsSeleccionados = () => {
        if (selectedAssets.size === 0) {
            alert("No has seleccionado ningún asset para descargar.");
            return;
        }
        selectedAssets.forEach(assetID => {
            const url = `https://molamazogames-ctup.onrender.com/asset/download?assetID=${assetID}`;
            const link = document.createElement('a');
            link.href = url;
            // Esto fuerza descarga en navegadores que lo permiten
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const result = await getHistoryByUser();
                setHistory(result.history);
                console.log("history:", history);
            } catch (error) {
                setErrorHistory('Algo salió mal. No se han podido recuperar los assets del historial');
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        const fetchFullAssets = async () => {
        if (history.length === 0) return;
            try {
                const assetsData = await Promise.all(
                    history.map(item => getAssetById({ assetID: item.asset }))
                );

                // assetsData es un array de respuestas, extraemos el asset de cada respuesta
                const assets = assetsData.map(res => res.asset);

                // Opcional: puedes combinar con fecha o id del historial
                // Por ejemplo: juntar la fecha con el asset completo
                const combined = history.map((item, index) => ({
                    ...assets[index],
                    historyDate: item.date,
                    historyId: item._id,
                }));

                setFullAssets(combined);
                setFilteredFullAssets(fiteredFullAssets);
            } catch (error) {
                setErrorHistory('Error cargando detalles completos de los assets.');
            }
        };

        fetchFullAssets();
    }, [history]);


    useEffect(() => {
        async function fetchMetaCategories() {
            try {
                const metas = await getAllMeta();
                setMetacategorias(metas);

            } catch (error) {
                console.error("Error cargando datos:", error.error);
            }
        }

        fetchMetaCategories();
    }, []);

    const handleCheckboxChange = (metaId) => {
        setCheckedMetas((prev) => ({
            ...prev,
            [metaId]: !prev[metaId]
        }));
    };


    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/detallesAsset/${id}`);
    };

    useEffect(() => {
        filterAssets();
    }, [fullAssets, checkedMetas, searchText, startDate, endDate]);

    const filterAssets = () => {
        let filtered = [...fullAssets];

        // Filtrar por texto (name o description)
        if (searchText.trim() !== '') {
            const lowerSearch = searchText.toLowerCase();
            filtered = filtered.filter(asset => 
            (asset.name && asset.name.toLowerCase().includes(lowerSearch)) ||
            (asset.description && asset.description.toLowerCase().includes(lowerSearch))
            );
        }

        // Filtrar por metas seleccionadas (checkedMetas)
        const checkedMetaIds = Object.keys(checkedMetas).filter(key => checkedMetas[key]);
        if (checkedMetaIds.length > 0) {
            filtered = filtered.filter(asset => {
            if (!asset.meta) return false; 
            return asset.meta.some(m => checkedMetaIds.includes(m._id));
            });
        }

        // Filtrar por rango de fechas
        if ((startDate instanceof Date && !isNaN(startDate)) || (endDate instanceof Date && !isNaN(endDate))) {
            filtered = filtered.filter(asset => {
            if (!asset.historyDate) return false;
            const assetDate = new Date(asset.historyDate);

            console.log("assetDate", assetDate);
            console.log("startDate", startDate);
            console.log("endDate", endDate);

            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999);

            if (startDate && assetDate < new Date(startDate)) return false;
            if (endDate && adjustedEndDate && assetDate > new Date(adjustedEndDate)) return false;

            return true;
        });
    }
    filtered.sort((a, b) => new Date(b.historyDate) - new Date(a.historyDate));
    setFilteredFullAssets(filtered);
};


    const getEuropeanTime = (isoDate) => {
        console.log(isoDate);

        if (!isoDate) return "";
        const date = new Date(isoDate);
        console.log(date);
        const formatter = new Intl.DateTimeFormat('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Madrid',
            hour12: false
        });
        return formatter.format(date);
    };

    function bytesToBigUnit(bytes) {
        if (!bytes) return '0 bytes';
        const unidades = ['bytes', 'KB', 'MB', 'GB', 'TB'];
        let i = 0;
        while (bytes >= 1024 && i < unidades.length - 1) {
            bytes /= 1024;
            i++;
        }
        return `${Math.round(bytes * 10) / 10} ${unidades[i]}`;
    }

    useEffect(() => {
                console.log("fullAssets:", fullAssets);
    }, [fullAssets]);


    const formatDateDDMMYYYY = (isoDate) => {
        const d = new Date(isoDate);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Agrupar assets por fecha (DD/MM/AAAA)
    const groupedAssets = fiteredFullAssets.reduce((groups, asset) => {
        const dateKey = formatDateDDMMYYYY(asset.historyDate);
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(asset);
        return groups;
    }, {});


    return (
        <>
        <Button
            label="Volver a mi perfil"
            icon={ <IoReturnDownBackSharp />}
            iconPosition="left"
            className="grande-btn volver-perfil-btn-historial-assets"
            href="/perfil"
        />
        <h2 className="decoratorTituloHitorial">Historial de descargas</h2>
        <div className="historial-assets-content">
        <main>
            {
                    fiteredFullAssets.length > 0 ? (
                        <div className="history-asset-list">
                            {Object.entries(groupedAssets).map(([date, assetsOfDay]) => (
                                <div key={date} className="assets-group-by-date">
                                    <h3>{date}</h3>
                                    {assetsOfDay.map(asset => (
                                        <div key={asset.historyId} className="asset-with-checkbox">
                                            <HistoryElement
                                                id={asset.historyId}
                                                name={asset.name}
                                                value={bytesToBigUnit(asset.size)}
                                                time={getEuropeanTime(asset.historyDate)}
                                                imgAsset={asset.image ? "https://molamazogames-ctup.onrender.com/" + asset.image.path : null}
                                                href={`https://molamazogames-ctup.onrender.com/asset/download?assetID=${asset._id}`}
                                                checked={selectedAssets.has(asset._id)}
                                                onChange={() => toggleSelectAsset(asset._id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>¡Vaya no hay ningún assset para mostrar!</p>
                    )
                }
        </main>

        <aside>
            <div className='aside-filtros-historial-assets'>
                <h3>Buscar en el historial</h3>
                <SearchBar
                    placeholderText="Buscar"
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
                />

                <div className="filtrarCategoria">
                <p className="bold-form-section-title">Tipo:</p>
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
                <p className="bold-form-section-title">Rango fechas:</p>
                <div className="filtarFecha">
                    <div className="datePickers">
                        <DatePicker value={startDate} onChange={setStartDate} />
                        <DatePicker value={endDate} onChange={setEndDate} />
                    </div>
                </div>
            </div>
            <Button
                label="Descargar selecionados"
                icon={ <FaDownload />}
                iconPosition="left"
                className="grande-btn volver-perfil-btn-historial-assets"
                onClick={() => descargarAssetsSeleccionados()}
            />
        </div>
        </aside>
        </div>  
        </>
    );
};

export default HistorialAssets;
