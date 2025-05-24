import './App.css';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registrar from "./pages/Registrar/Registrar";
import Login from "./pages/Login/Login";
import Perfil from "./pages/Perfil/Perfil";
import UserOpt from "./pages/UserOpt/UserOpt";
import SubirAsset from "./pages/SubirAsset/SubirAsset";
import EditarAssets from "./pages/EditarAssets/EditarAssets";
import Home from "./pages/Home/Home";
import BuscarAssets from "./pages/BuscarAssets/BuscarAssets";
import DetallesAsset from './pages/DetallesAsset/DetallesAsset';
import CambiarPass from './pages/CambiarPass/CambiarPass';
import EliminarCuenta from './pages/EliminarCuenta/EliminarCuenta';
import HistorialAssets from './pages/HistorialAssets/HistorialAssets';
import Header from './components/Header/Header';

function AppContent() {
  // Función de ejemplo
  const handleClick = () => {
    alert('¡Botón clicado!');
  };

  return (
    <div className="App">
      <Header></Header>

      <Routes>
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upAsset" element={<SubirAsset />} />
        <Route path="/editAsset/:id" element={<EditarAssets />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/buscarAssets/" element={<BuscarAssets />} />
        <Route path="/buscarAssets/:meta" element={<BuscarAssets />} />
        <Route path="/detallesAsset/:assetID" element={<DetallesAsset />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/useropt" element={<UserOpt />} />
        <Route path="/cambiarPass" element={<CambiarPass />} />
        <Route path="/eliminarCuenta" element={<EliminarCuenta />} />
        <Route path="/historialAssets" element={<HistorialAssets />} />
      </Routes>

      <Footer></Footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App;
