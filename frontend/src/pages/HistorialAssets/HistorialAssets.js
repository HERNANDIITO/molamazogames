import './HistorialAssets.scss';

import React, { useEffect, useState } from 'react';
import DatePicker from '../../components/DatePicker/DatePicker';
import HistoryElement from '../../components/HistoryElement/HistoryElement';
import { getHistoryByUser } from '../../services/historyServices';


const HistorialAssets = () => {
    
    const [history, setHistory] = useState([]);
    const [errorHistory, setErrorHistory] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const result = await getHistoryByUser({});
                setHistory(result.responseFormats);
                console.log("history:", history);
            } catch (error) {
                setErrorHistory('Algo salió mal. No se han podido recuperar los assets del historial');
            }
        };

        fetchHistory();
    }, []);

    return (
        <>
        <h1>Holaa</h1>
        <HistoryElement
            id={1}
            name="Logo"
            value="34,6 MB"
            time= "22:34"
           // imgAsset={}
        />
        </>
    );
};

export default HistorialAssets;
