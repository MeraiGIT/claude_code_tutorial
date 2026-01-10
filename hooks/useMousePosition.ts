'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface Mouse3D {
  x: number;
  y: number;
  worldPosition: THREE.Vector3;
}

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<Mouse3D>({
    x: 0,
    y: 0,
    worldPosition: new THREE.Vector3(0, 0, 0),
  });

  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      mouseRef.current = { x, y };

      // Calculate world position (assuming camera at z=10)
      const worldX = x * 6; // Adjust for viewport width
      const worldY = y * 4; // Adjust for viewport height
      const worldZ = 0;

      setMousePosition({
        x,
        y,
        worldPosition: new THREE.Vector3(worldX, worldY, worldZ),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePosition;
};
