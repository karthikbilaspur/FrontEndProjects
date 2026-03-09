import React from 'react'; // React is always needed
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
// New: Add useGLTF's `loader` for better loading state handling
import { Decal, useGLTF, useTexture, Html } from '@react-three/drei'; // New: Html for loading feedback

import state from '../store';

const Shirt = () => {
  const snap = useSnapshot(state);
  // New: `useGLTF` returns `scene` and `materials` directly, but also `nodes` for geometry access
  // Also, add `gltf` itself for potential metadata or other access
  const { nodes, materials, gltf } = useGLTF('/shirt_baked.glb');

  // New: Handle loading states for textures
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  // New: Optional - pre-process textures if they need specific settings (e.g., repeating, encoding)
  // For example, if you want fullTexture to repeat:
  // if (fullTexture) {
  // fullTexture.wrapS = fullTexture.wrapT = THREE.RepeatWrapping;
  // fullTexture.repeat.set(0.1, 0.1); // Adjust as needed
  // fullTexture.needsUpdate = true;
  // }

  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));

  // Key for React to re-render the group when state changes, ensuring decals update
  const stateString = JSON.stringify(snap);

  // New: Check if the model or textures are still loading
  // useGLTF returns `gltf.loaded` (or simply `nodes` will be undefined until loaded)
  // useTexture returns a texture object, which will be undefined or a placeholder until loaded.
  // We'll use a simple check for `nodes` and `fullTexture`/`logoTexture`
  const isShirtLoaded =!!nodes.T_Shirt_male; // Check if the geometry exists
  const isFullTextureLoaded = snap.isFullTexture?!!fullTexture : true; // True if not applied
  const isLogoTextureLoaded = snap.isLogoTexture?!!logoTexture : true; // True if not applied

  if (!isShirtLoaded ||!isFullTextureLoaded ||!isLogoTextureLoaded) {
    // New: Display a loading indicator centered over where the shirt will be
    return (
      <Html center position={[0, 0, 0]}>
        <div style={{ color: 'white', fontSize: '1.2em', fontFamily: 'sans-serif' }}>
          Loading Shirt...
        </div>
      </Html>
    );
  }

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        // New: Adjust material properties for better visual quality
        material-roughness={0.9} // Slightly less roughness, more subtle sheen
        material-metalness={0.1} // A tiny bit of metalness can make it look more fabric-like
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]} // Explicitly set scale as an array
            map={fullTexture}
            // New: Enhance decal properties
            map-anisotropy={16} // High quality filtering for textures
            depthTest={true} // Keep depthTest true for realistic decal layering
            depthWrite={false} // Prevents decal from affecting depth of other objects behind it
            polygonOffset // New: Helps prevent z-fighting (flickering) with underlying mesh
            polygonOffsetFactor={-4} // New: Push decal slightly forward to prevent z-fighting
            renderOrder={1} // New: Ensure decals render after the main shirt mesh
            // blendMode={THREE.NormalBlending} // New: Explicit blend mode for texture if needed (requires THREE import)
          />
        )}

        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={[0.15, 0.15, 0.15]} // Explicitly set scale as an array
            map={logoTexture}
            // New: Enhance decal properties for logo
            map-anisotropy={16}
            depthTest={true} // Keep depthTest true for realistic decal layering
            depthWrite={false}
            polygonOffset // New: Helps prevent z-fighting
            polygonOffsetFactor={-4} // New: Push decal slightly forward
            renderOrder={1} // New: Ensure decals render after the main shirt mesh
            // blendMode={THREE.NormalBlending} // New: Explicit blend mode
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;