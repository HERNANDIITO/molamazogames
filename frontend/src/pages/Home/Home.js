import './Home.scss';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAssets } from '../../services/assetService';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 3;

function HomeContent() {
    const [assets, setAssets] = useState([]);
    const [assetsError, setErrorAssets] = useState(null);
    const [assetPage, setAssetPage] = useState({});
    const [slideDirection, setSlideDirection] = useState("next");

    const [modalType, setModalType] = useState('token');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const abrirModalToken = () => {
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const result = await getAssets();
                setAssets(result.assets);

                const initialPages = {};
                ["2D", "3D", "Audio", "Video", "Codigo", "Otros"].forEach(cat => {
                    initialPages[cat] = 0;
                });
                setAssetPage(initialPages);
            } catch (error) {
                setErrorAssets('Algo salió mal. No se han podido recuperar los assets. Por favor, prueba a recargar la página.');
            }
        };

        fetchAssets();
    }, []);

    const handleCardClick = (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            abrirModalToken();
            return;
        }

        navigate(`/detallesAsset/${id}`);
    };


    const getPaginatedAssets = (category) => {
        const filtered = assets.filter(asset => asset.categories[0]?.meta.meta === category);
        const page = assetPage[category] || 0;
        const start = page * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    };

    const handlePrev = (category) => {
        setSlideDirection("prev");
        setAssetPage(prev => ({
            ...prev,
            [category]: Math.max(0, (prev[category] || 0) - 1)
        }));
    };

    const handleNext = (category) => {
        setSlideDirection("next");
        const filtered = assets.filter(asset => asset.categories[0]?.meta.meta === category);
        const maxPage = Math.floor((filtered.length - 1) / ITEMS_PER_PAGE);
        setAssetPage(prev => ({
            ...prev,
            [category]: Math.min(maxPage, (prev[category] || 0) + 1)
        }));
    };

    const renderAssets = (category) => {
        const paginated = getPaginatedAssets(category);
        const isNext = slideDirection === "next";

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${category}-${assetPage[category]}`}
                    initial={{ x: isNext ? 300 : -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: isNext ? 300 : -300, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="cards-row"
                    style={{ display: 'flex', gap: '1rem' }}
                >
                    {paginated.map(asset => (
                        <Card
                            key={asset._id}
                            type={asset.categories[0]?.meta}
                            botonTag="tag"
                            image={asset.image ? "http://localhost:5000/" + asset.image.path : null}
                            tagsAsset={asset.tags.map(tag => tag.name)}
                            tituloAsset={asset.name}
                            onClick={() => handleCardClick(asset._id)}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <main className="App-content">
            {assetsError && <p className="error">{assetsError}</p>}
            <p className="titulo linea">2D</p>
            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                    //onClick={() => handlePrev("2D")}
                    onClick={() => handleCardClick(3)}
                />
                {renderAssets("2D")}
                <Button
                    label="Ver assets siguientes"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                    onClick={() => handleNext("2D")}
                />
            </div>

            <p className="titulo linea">3D</p>
            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                    onClick={() => handlePrev("3D")}
                />
                {renderAssets("3D")}
                <Button
                    label="Ver assets siguientes"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                    onClick={() => handleNext("3D")}
                />
            </div>

            <p className="titulo linea">Audio</p>
            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                    onClick={() => handlePrev("Audio")}
                />
                {renderAssets("Audio")}
                <Button
                    label="Ver assets siguientes"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                    onClick={() => handleNext("Audio")}
                />
            </div>

            <p className="titulo linea">Video</p>
            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                    onClick={() => handlePrev("Video")}
                />
                {renderAssets("Video")}
                <Button
                    label="Ver assets siguientes"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                    onClick={() => handleNext("Video")}
                />
            </div>

            <p className="titulo linea">Código</p>
            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                    onClick={() => handlePrev("Codigo")}
                />
                {renderAssets("Codigo")}
                <Button
                    label="Ver assets siguientes"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                    onClick={() => handleNext("Codigo")}
                />
            </div>

            <p className="titulo linea">Otros</p>
            <div className='contAssets'>
                <Button
                    label="Ver assets anteriores"
                    icon={<IoIosArrowBack />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas izq"
                    onClick={() => handlePrev("Otros")}
                />
                {renderAssets("Otros")}
                <Button
                    label="Ver assets siguientes"
                    icon={<IoIosArrowForward />}
                    iconPosition="alone"
                    className="enano-btn round-btn flechas drch"
                    onClick={() => handleNext("Otros")}
                />
            </div>

            {showModal && (
    <Modal
        type="token"
        onClose={cerrarModal}
    />
)}
        </main>
    );
}

function Home() {
    return <HomeContent />;
}

export default Home;
