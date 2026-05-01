import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Text3D, Center, Environment, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// 1. Sleek Modern Airplane Component
const SleekAirplane = ({ position, rotation, scale = 1 }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh scale={[1.2, 0.5, 4.5]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]} scale={[1.22, 0.08, 4.51]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 1.6]} rotation={[-0.2, 0, 0]} scale={[0.8, 0.4, 0.8]}>
        <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0} />
      </mesh>
      <mesh scale={[7, 0.08, 1.8]}>
        <boxGeometry />
        <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[2, -0.4, 0.2]} rotation={[Math.PI / 2, 0, 0]} scale={[0.4, 1.2, 0.4]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-2, -0.4, 0.2]} rotation={[Math.PI / 2, 0, 0]} scale={[0.4, 1.2, 0.4]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, -2]} rotation={[0.4, 0, 0]} scale={[0.08, 1.8, 1.2]}>
        <boxGeometry />
        <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// 1.2 Kinetic Ribbon Component
const KineticRibbon = () => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 50; i++) {
      p.push(new THREE.Vector3(i - 25, Math.sin(i * 0.2) * 5, 0));
    }
    return p;
  }, []);

  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = t * 0.2;
      ref.current.rotation.y = Math.sin(t * 0.5) * 0.5;
    }
  });

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  return (
    <group ref={ref}>
      <Line
        points={curve.getPoints(100)}
        color="#0ea5e9"
        lineWidth={2}
        transparent
        opacity={0.3}
      />
      <Line
        points={curve.getPoints(100)}
        color="#ffffff"
        lineWidth={0.5}
        transparent
        opacity={0.5}
      />
    </group>
  );
};

// 1.3 Studio Lighting
const StudioLighting = () => {
  const light1 = useRef();
  const light2 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (light1.current) {
      light1.current.position.set(Math.cos(t) * 50, 20, Math.sin(t) * 50);
    }
    if (light2.current) {
      light2.current.position.set(Math.sin(t) * 50, -20, Math.cos(t) * 50);
    }
  });

  return (
    <>
      <pointLight ref={light1} intensity={10} color="#0ea5e9" />
      <pointLight ref={light2} intensity={8} color="#ffffff" />
    </>
  );
};

// 1.3 Atmospheric Particles
const AtmosphericParticles = () => {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 200;
      p[i * 3 + 1] = (Math.random() - 0.5) * 200;
      p[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return p;
  }, []);

  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.05;
      ref.current.position.y = Math.sin(t * 0.1) * 2;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="#0ea5e9" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

// 2. Cinematic AERO Letter
const AeroLetter = ({ char, position }) => {
  const fontUrl = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json";
  return (
    <group position={position}>
      <Center>
        <Text3D
          font={fontUrl}
          size={12}
          height={4}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.8}
          bevelSize={0.3}
          bevelOffset={0}
          bevelSegments={10}
        >
          {char}
          <meshStandardMaterial 
            color="#0ea5e9" 
            metalness={1} 
            roughness={0.1} 
            emissive="#0ea5e9" 
            emissiveIntensity={0.1} 
          />
        </Text3D>
      </Center>
    </group>
  );
};

// 3. The Animated Scene Content (Hooks used here)
const Scene = ({ onSettled, settled }) => {
  const [phase, setPhase] = useState('PULLING'); 
  const airplanePosRef = useRef(new THREE.Vector3(-80, 0, 0));
  const logoPosRef = useRef(new THREE.Vector3(-130, 0, 0));
  const [airplanePos, setAirplanePos] = useState([-80, 0, 0]);
  const [logoPos, setLogoPos] = useState([-130, 0, 0]);
  const [ropeVisible, setRopeVisible] = useState(true);
  const [logoVisible, setLogoVisible] = useState(true);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (phase === 'PULLING') {
      airplanePosRef.current.x += 0.85;
      airplanePosRef.current.y = 0;
      
      // Logo follows the plane with a fixed distance
      logoPosRef.current.x = airplanePosRef.current.x - 50;
      logoPosRef.current.y = 0;

      if (logoPosRef.current.x >= -0.5) {
        setPhase('SNAPPED');
        setRopeVisible(false);
        if (onSettled) onSettled();
      }
    } else if (phase === 'SNAPPED') {
      airplanePosRef.current.x += 0.8;
      logoPosRef.current.x = THREE.MathUtils.lerp(logoPosRef.current.x, 0, 0.08);
      
      // Floating idle effect
      logoPosRef.current.y = Math.sin(t * 1.5) * 1.2;
    }

    // Update state for rendering
    setAirplanePos([airplanePosRef.current.x, airplanePosRef.current.y, airplanePosRef.current.z]);
    setLogoPos([logoPosRef.current.x, logoPosRef.current.y, logoPosRef.current.z]);
  });

  const sweepRef = useRef();
  useFrame((state) => {
    if (sweepRef.current) {
      sweepRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 60;
    }
  });

  return (
    <>
      <Stars radius={250} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      
      <SleekAirplane 
        position={airplanePos} 
        rotation={[Math.PI / 6, Math.PI / 2, 0]} 
        scale={2.2} 
      />

      {ropeVisible && (
        <Line
          points={[
            [airplanePos[0] - 5, airplanePos[1], airplanePos[2]],
            [logoPos[0] + 25, logoPos[1], logoPos[2]]
          ]}
          color="#000000"
          lineWidth={1}
          transparent
          opacity={0.8}
        />
      )}

      <KineticRibbon />
      <StudioLighting />
      <AtmosphericParticles />
      
      {/* Radial Glow behind text */}
      <mesh position={[0, 0, -5]}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.05} />
      </mesh>

      {/* Light Sweep Effect */}
      <pointLight ref={sweepRef} position={[0, 0, 10]} intensity={50} color="#0ea5e9" distance={100} />

      {logoVisible && (
        <group position={logoPos}>
           <AeroLetter char="A" position={[-21, 0, 0]} />
           <AeroLetter char="E" position={[-7, 0, 0]} />
           <AeroLetter char="R" position={[7, 0, 0]} />
           <AeroLetter char="O" position={[21, 0, 0]} />
        </group>
      )}
    </>
  );
};

const TopAero = () => {
  const [settled, setSettled] = useState(false);

  return (
    <div className="w-full h-screen relative bg-transparent overflow-hidden">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 80]} fov={45} />
        <ambientLight intensity={0.5} />
        <spotLight position={[100, 100, 100]} angle={0.2} penumbra={1} intensity={10} />
        <pointLight position={[-50, -50, 50]} intensity={5} color="#0ea5e9" />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Scene onSettled={() => setSettled(true)} settled={settled} />
        </Suspense>
      </Canvas>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {settled && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-sky-500"
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopAero;
