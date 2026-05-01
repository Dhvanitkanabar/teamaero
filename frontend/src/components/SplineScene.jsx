import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

const AtmosphericVoid = () => {
  const groupRef = useRef();

  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      temp.push({
        position: [
          (Math.random() * 20 + 15) * side,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 10
        ],
        size: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.5 + 0.2
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, 10, 0]}>
      <Stars radius={50} depth={50} count={500} factor={2} saturation={0} fade speed={1} />
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed} rotationIntensity={1} floatIntensity={2}>
          <mesh position={node.position}>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} transparent opacity={0.15} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const SplineScene = () => {
  return (
    <div className="w-full h-full relative bg-transparent overflow-hidden rounded-[40px]">
      <Canvas dpr={[1, 2]} alpha>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={45} />
        <ambientLight intensity={1.5} />
        <pointLight position={[20, 20, 20]} intensity={3} color="#0ea5e9" />
        
        <Suspense fallback={null}>
          <AtmosphericVoid />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SplineScene;
