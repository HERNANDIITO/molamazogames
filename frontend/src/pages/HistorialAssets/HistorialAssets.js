import './HistorialAssets.scss';

import React, { useEffect, useState } from 'react';
import DatePicker from '../../components/DatePicker/DatePicker';
import HistoryElement from '../../components/HistoryElement/HistoryElement';
import { getHistoryByUser } from '../../services/historyServices';
import Button from '../../components/Button/Button.js';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { getAssetById } from '../../services/assetService';

const HistorialAssets = () => {
    
    const [history, setHistory] = useState([]);
    const [errorHistory, setErrorHistory] = useState(null);
    const [fullAssets, setFullAssets] = useState([]);

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
            } catch (error) {
                setErrorHistory('Error cargando detalles completos de los assets.');
            }
        };

        fetchFullAssets();
    }, [history]);


    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/detallesAsset/${id}`);
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
                console.log("history:", history);

    }, [history]);

    useEffect(() => {
                console.log("fullAssets:", fullAssets);

    }, [fullAssets]);

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

        {
            Array.isArray(fullAssets) && fullAssets.length > 0 ? (
                <div className="history-asset-list">
                {fullAssets.map(asset => (
                    <HistoryElement
                    key={asset.historyId}               
                    id={asset.historyId}                 
                    name={asset.name}
                    value={bytesToBigUnit(asset.size)} 
                    time={getEuropeanTime(asset.historyDate)}
                    imgAsset={asset.image ? "https://molamazogames-ctup.onrender.com/" + asset.image.path : null}
                    href={`https://molamazogames-ctup.onrender.com/asset/download?assetID=${asset._id}`}
                    />
                ))}
                </div>
            ) : (
                <p>Tu historial está vacío. ¡Empieza a descargar!</p>
            )
        }

        </>
    );
};

export default HistorialAssets;
