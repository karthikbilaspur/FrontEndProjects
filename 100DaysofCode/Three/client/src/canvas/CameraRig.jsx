import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // 1. Set the target position of the camera based on state and screen size
    let targetPosition = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      // If not in intro, apply different camera logic (e.g., follow mouse or orbit)
      if (isMobile) targetPosition = [0, 0, 2.5];
      else targetPosition = [0, 0, 2]; // Default camera position for non-intro state
    }

    // New: Allow for a subtle camera orbit when not in intro mode, or when mouse is not moving
    // This adds a gentle motion when the user isn't interacting
    if (!snap.intro) {
      // Small horizontal orbit based on time, for ambient movement
      targetPosition = [
        targetPosition[0] + Math.sin(state.clock.elapsedTime * 0.05) * 0.2, // Subtle X orbit
        targetPosition[1],
        targetPosition[2] + Math.cos(state.clock.elapsedTime * 0.05) * 0.2, // Subtle Z orbit
      ];
    }

    // Smoothly move camera towards the target position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // 2. Set the model rotation smoothly based on pointer position
    // New: Introduce a small "dead zone" or a slower easing for pointer to prevent jitter
    // Also, ensure rotation only happens if intro is false (i.e., user is interacting with product)
    const pointerX = state.pointer.x * (snap.intro? 0 : 1); // Disable pointer rotation during intro
    const pointerY = state.pointer.y * (snap.intro? 0 : 1); // Disable pointer rotation during intro

    easing.dampE(
      group.current.rotation,
      [pointerY / 10, -pointerX / 5, 0], // Scale down pointer effect for less dramatic rotation
      0.25,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;