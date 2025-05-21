import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import './Caroussel3D.scss';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const Caroussel3D = ({ path, name, description }) => {
  return (
    <div className="carousselEntry">
      <div className="carousselModel3D">
        <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
          <ambientLight />
          <directionalLight position={[2, 2, 2]} />
          <Suspense fallback={null}>
            <Model url={`https://molamazogames-ctup.onrender.com/${path}`} />
            <Environment preset="sunset" />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
      <div className="carousselImageInfo">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export { Caroussel3D };
