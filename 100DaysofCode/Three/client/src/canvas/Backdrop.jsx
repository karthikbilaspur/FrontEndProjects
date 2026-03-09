import React, { useRef } from 'react';
import { easing } from 'maath'; // Keep maath for potential future smooth transitions
import { useFrame } from '@react-three/fiber';
// Add a helper for dynamic light positions
import { AccumulativeShadows, RandomizedLight, useHelper } from '@react-three/drei';
// Import a light type for helper visualization if needed
import { DirectionalLightHelper } from 'three'; // New import for debugging

const Backdrop = () => {
  const shadows = useRef();
  // Ref for one of the randomized lights to potentially adjust dynamically
  const light1Ref = useRef();

  // Uncomment the line below to visualize the first RandomizedLight during development
  // useHelper(light1Ref, DirectionalLightHelper, 1, 'red'); // New: Light helper for debugging

  useFrame((state, delta) => {
    // Optional: Gently animate light position or intensity over time for subtle dynamism
    // For example, to make the first light subtly rotate around the scene
    // easing.dampE(light1Ref.current.rotation, [state.clock.elapsedTime * 0.05, state.clock.elapsedTime * 0.02, 0], 0.1, delta);
    // easing.damp3(light1Ref.current.position, [Math.sin(state.clock.elapsedTime * 0.1) * 8, 5, Math.cos(state.clock.elapsedTime * 0.1) * -10], 0.1, delta);
  });

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      // Add blend parameter for smoother shadow fading
      blend={2} // New: Controls how quickly shadows accumulate/fade
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight
        ref={light1Ref} // New: Add ref to potentially control this light
        amount={4}
        radius={9}
        intensity={0.75} // Enhanced intensity slightly
        ambient={0.25}
        position={[5, 5, -10]}
        castShadow // New: Ensure this light casts shadows for better effect
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.35} // Enhanced intensity slightly
        ambient={0.55}
        position={[-5, 5, -9]}
        castShadow // New: Ensure this light casts shadows
      />
      {/* New: Add a third, softer light for more complex illumination */}
      <RandomizedLight
        amount={2}
        radius={7}
        intensity={0.15}
        ambient={0.1}
        position={[0, -5, 5]} // Positioned from below/behind for fill light
        castShadow
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;