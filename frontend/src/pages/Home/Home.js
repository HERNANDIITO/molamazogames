import './Home.scss';

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { getAssets } from '../../services/assetService';

import { FaPlusCircle, FaCheck, FaTimes, FaUpload } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";



import Input from "../../components/Input/Input"
import Textarea from "../../components/Textarea/Textarea"
import Button from "../../components/Button/Button"
import Card from "../../components/Card/Card"



function HomeContent() {

    const [assets, setAssets] = useState([]);
    const [assetsError, setErrorAssets] = useState(null);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const result = await getAssets();
                console.log(result);
                setAssets(result.assets);
            } catch (error) {
                setErrorAssets('Algo salió mal. No se han podido recuperar las categorías. Por favor, prueba a recargar la página.');
            }
        };

        fetchAssets();
    }, []);

    const renderAssets = (assetList) => {
        console.log("assetList", assetList);
        return assetList.map((asset) => (
            <Card
                type={asset.categories[0]?.meta}
                botonTag="tag"
                image={asset.image ? "http://localhost:5000/" + asset.image.path : null}
                tagsAsset={asset.tags.map(tag => tag.name)}
                tituloAsset={asset.name}
            />
        ));
    };






    return (
        <main className="App-content">
            <p className="titulo linea">2D</p>

            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                />

                {renderAssets(assets.filter((asset) => asset.categories[0]?.meta.meta === '2D'))}


                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                />
            </div>

            <p className="titulo linea">3D</p>

            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                />

                {renderAssets(assets.filter((asset) => asset.categories[0]?.meta.meta === '3D'))}

                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                />
            </div>

            <p className="titulo linea">Audio</p>

            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                />

                {renderAssets(assets.filter((asset) => asset.categories[0]?.meta.meta === 'Audio'))}

                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                />
            </div>

            <p className="titulo linea">Video</p>

            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                />

                {renderAssets(assets.filter((asset) => asset.categories[0]?.meta.meta === 'Video'))}

                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                />
            </div>

            <p className="titulo linea">Code</p>

            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                />

                {renderAssets(assets.filter((asset) => asset.categories[0]?.meta.meta === 'Codigo'))}

                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                />
            </div>

            <p className="titulo linea">Otros</p>

            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                />

                {renderAssets(assets.filter((asset) => asset.categories[0]?.meta.meta === 'Otros'))}

                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                />
            </div>

        </main>
    );
}

function Home() {
    return (
        <HomeContent />
    );
}

export default Home;