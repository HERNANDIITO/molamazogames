import './Perfil.scss';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import perfil from '../../assets/images/perfil.png';
import { FaPlus, FaClock, FaCog } from "react-icons/fa";

import Button from "../../components/Button/Button";
import SearchBar from "../../components/SearchBar/SearchBar";
import DatePicker from "../../components/DatePicker/DatePicker";
import Checkbox from "../../components/Checkbox/Checkbox";

import { getAllMeta } from "../../services/metaServices";

function PerfilContent() {
    const navigate = useNavigate();

    const [metacategorias, setMetacategorias] = useState([]);
    const [checkedMetas, setCheckedMetas] = useState({});

    useEffect(() => {
        async function fetchData() {
            const metas = await getAllMeta();
            setMetacategorias(metas);
        }

        fetchData();
    }, []);

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
                        <img src={perfil} />
                        <Button
                            label="Opciones de perfil"
                            className="btn-mediano botopPer"
                            icon={<FaCog />}
                        />
                    </div>
                    <div className='botonesPerfil'>
                        <Button
                            label="Añadir asset"
                            icon={<FaPlus />}
                            className="botonesModal"
                        />
                        <Button
                            label="Historial de descargas"
                            icon={<FaClock />}
                            className="botonesModal"
                        />
                    </div>
                </div>

                <div className="filtrarPerfil">
                    <div className='upFiltrar'>
                        <p className="tituloFiltrar">Filtrar assets</p>
                        <SearchBar />
                    </div>
                    <div className="tiposFiltro">
                        <div className="filtrarCategoria">
                            <p className="subtituloFiltrar">Categoría</p>

                            {metacategorias.map((meta) => (
                                <div key={meta._id} className="checkboxCategoria">
                                    <Checkbox
                                        label={meta.meta}
                                        checked={!!checkedMetas[meta._id]}
                                        onChange={() => handleCheckboxChange(meta._id)}
                                        size="normal"
                                        showLabel={true}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="filtarFecha">
                            <p className="subtituloFiltrar">Fecha</p>
                            <div className="datePickers">
                                <DatePicker />
                                <DatePicker />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="downPerfil">
                <p>Mis assets</p>
            </div>
        </main>
    );
}

function Perfil() {
    return <PerfilContent />;
}

export default Perfil;
