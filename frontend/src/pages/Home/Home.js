import './Home.scss';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAssets } from '../../services/assetService';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";
import { motion, AnimatePresence } from 'framer-motion';

function HomeContent() {
    const [assets, setAssets] = useState([]);
    const [assetsError, setErrorAssets] = useState(null);
    const [assetPage, setAssetPage] = useState({});
    const [slideDirection, setSlideDirection] = useState("next");

    const [modalType, setModalType] = useState('token');
    const [showModal, setShowModal] = useState(false);

    const [itemsPerPage, setItemsPerPage] = useState(3);

    const navigate = useNavigate();

    const abrirModalToken = () => setShowModal(true);
    const cerrarModal = () => setShowModal(false);

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

    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width < 800) {
                setItemsPerPage(1);
            } else if (width < 1025) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(3);
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);
        return () => window.removeEventListener("resize", updateItemsPerPage);
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
        const start = page * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
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
        const maxPage = Math.floor((filtered.length - 1) / itemsPerPage);
        setAssetPage(prev => ({
            ...prev,
            [category]: Math.min(maxPage, (prev[category] || 0) + 1)
        }));
    };

    const renderAssets = (category) => {
        const paginated = getPaginatedAssets(category);
        const isNext = slideDirection === "next";
        console.log(paginated)

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${category}-${assetPage[category]}`}
                    initial={{ x: isNext ? 300 : -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: isNext ? 300 : -300, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="cardsRow"
                >
                    {paginated.map(asset => (
                        <Card
                            key={asset._id}
                            type={asset.categories[0]?.meta._id}
                            botonTag="tag"
                            alt={asset.image.description ? asset.image.description : ""}
                            image={asset.image ? "https://molamazogames-ctup.onrender.com/" + asset.image.path : null}
                            tagsAsset={asset.tags.map(tag => tag.name)}
                            tituloAsset={asset.name}
                            onClick={() => handleCardClick(asset._id)}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        );
    };

    const categories = ["2D", "3D", "Audio", "Video", "Codigo", "Otros"];

    return (
        <main className="App-content">
            {assetsError && <p className="error">{assetsError}</p>}

            {categories.map((category) => (
                <div key={category}>
                    <p className="titulo linea">{category}</p>
                    <div className='contAssets'>
                        <Button
                            label="Ver assets anteriores"
                            icon={<IoIosArrowBack />}
                            iconPosition="alone"
                            className="enano-btn round-btn flechas izq"
                            onClick={() => handlePrev(category)}
                        />
                        {renderAssets(category)}
                        <Button
                            label="Ver assets siguientes"
                            icon={<IoIosArrowForward />}
                            iconPosition="alone"
                            className="enano-btn round-btn flechas drch"
                            onClick={() => handleNext(category)}
                        />
                    </div>
                </div>
            ))}

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
