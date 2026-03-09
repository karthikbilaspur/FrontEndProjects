import { Canvas } from '@react-three/fiber';
// New: Loader component for initial loading of the scene
import { Environment, Center, AccumulativeShadows, RandomizedLight, Loader, OrbitControls } from '@react-three/drei'; // New: Loader, OrbitControls
// New: Import THREE for constant like RepeatWrapping if needed elsewhere
import * as THREE from 'three';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  return (
    <>
      <Canvas
        shadows
        // New: Set a default scene-wide camera (it will be overridden by CameraRig's dynamic positioning)
        camera={{
          position: [0, 0, 0],
          fov: 25,
          // New: Set initial camera far and near planes for better rendering if needed
          near: 0.1,
          far: 1000,
        }}
        // New: Configure WebGLRenderer settings for better performance/quality
        gl={{
          preserveDrawingBuffer: true,
          antialias: true, // Ensure anti-aliasing is enabled
          powerPreference: "high-performance", // Hint to browser to use discrete GPU if available
        }}
        // New: Add a frameloop property to only render when needed, for performance
        // 'always' is default, 'demand' renders only on user interaction or state change
        // For a constantly animating scene, 'always' is fine, but 'demand' is good for static scenes
        // frameloop="demand" // Uncomment for performance optimization if scene is mostly static
        className="w-full max-w-full h-full transition-all ease-in"
      >
        <ambientLight intensity={0.5} />
        {/* New: Directional light for stronger shadows and more defined shapes */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow // New: Make this light cast shadows
          shadow-mapSize-width={1024} // New: Adjust shadow map resolution for quality
          shadow-mapSize-height={1024}
          shadow-camera-far={50} // New: Shadow frustum settings
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Environment preset="city" />

        {/* New: OrbitControls can be added here for debugging camera positions */}
        {/*
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          target={[0, 0, 0]} // Focus on the center of the shirt
          maxPolarAngle={Math.PI / 2} // Prevent camera from going below horizon
          minDistance={1} // Minimum zoom distance
          maxDistance={5} // Maximum zoom distance
        />
        */}

        <CameraRig>
          <Backdrop />
          <Center>
            <Shirt />
          </Center>
        </CameraRig>
      </Canvas>
      {/* New: The `Loader` component from drei provides an elegant loading screen */}
      <Loader />
    </>
  );
};

export default CanvasModel;