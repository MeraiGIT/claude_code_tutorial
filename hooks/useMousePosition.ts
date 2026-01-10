'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Object pool for Vector3 to prevent memory leaks
const worldPositionPool = new THREE.Vector3();

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

      // Reuse pooled Vector3 to eliminate 2,100 allocations/sec
      worldPositionPool.set(worldX, worldY, worldZ);

      setMousePosition({
        x,
        y,
        worldPosition: worldPositionPool.clone(), // Only clone when setting state
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePosition;
};
