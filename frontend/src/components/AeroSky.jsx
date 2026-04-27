import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Clouds, Cloud, Sky, Float, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

const SkyMover = () => {
  const group = useRef();
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(scrolled || 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.02 + scrollProgress * 1.5;
      group.current.position.y = Math.sin(t * 0.1) * 2 - scrollProgress * 20;
      group.current.position.z = scrollProgress * 10;
    }
  });

  return (
    <group ref={group}>
      <Clouds material={THREE.MeshLambertMaterial}>
        <Cloud seed={1} scale={4} volume={8} color="#f0f9ff" fade={150} speed={0.1} />
        <Cloud seed={2} scale={5} volume={12} color="#e0f2fe" position={[20, 10, -20]} fade={200} speed={0.2} />
        <Cloud seed={3} scale={4} volume={10} color="#ffffff" position={[-20, 15, -30]} fade={200} speed={0.15} />
        <Cloud seed={4} scale={6} volume={15} color="#f8fafc" position={[30, -5, -40]} fade={250} speed={0.1} />
        <Cloud seed={5} scale={7} volume={20} color="#bae6fd" position={[-30, -15, -50]} fade={300} speed={0.05} />
        <Cloud seed={6} scale={3} volume={6} color="#ffffff" position={[0, 25, -60]} fade={150} speed={0.3} />
        <Cloud seed={7} scale={8} volume={25} color="#7dd3fc" position={[50, 0, -80]} fade={400} speed={0.02} />
      </Clouds>
      
      {/* Distant Particle Grid */}
      <points>
        <sphereGeometry args={[100, 64, 64]} />
        <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.2} />
      </points>
    </group>
  );
};

const AtmosphericFX = () => {
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.FogExp2('#e0f2fe', 0.015);
  }, [scene]);
  return null;
};

export const AeroSky = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-400 via-sky-100 to-white">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }} dpr={[1, 2]}>
        <Sky 
          sunPosition={[100, 10, 100]} 
          turbidity={0.05} 
          rayleigh={0.2} 
          mieCoefficient={0.005} 
          mieDirectionalG={0.8} 
        />
        <AtmosphericFX />
        <ambientLight intensity={1} />
        <pointLight position={[20, 20, 20]} intensity={1.5} color="#bae6fd" />
        <pointLight position={[-20, -20, -20]} intensity={1} color="#6366f1" />
        
        <Stars radius={150} depth={50} count={2000} factor={6} saturation={0} fade speed={1} />
        <SkyMover />
        <Environment preset="city" />
      </Canvas>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
    </div>
  );
};
