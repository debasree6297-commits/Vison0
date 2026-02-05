// FIX: The local triple-slash directive for R3F types was removed as it was causing a resolution error.
// The types are now loaded globally from `three-init.tsx`.
import React, { useRef, useLayoutEffect, useMemo, useEffect } from 'react';
// FIX: The 'three-init' import for runtime extension is now handled globally in index.tsx, so the redundant local import has been removed.
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

const vertexShader = `
  varying vec3 v_position;
  varying vec3 v_normal;
  uniform float uTime;

  void main() {
    v_normal = normal;
    v_position = position;

    float displacement = sin(position.x * 2.5 + uTime * 0.4)
                       * sin(position.y * 3.5 + uTime * 0.5)
                       * sin(position.z * 2.0 + uTime * 0.3) * 0.15;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 v_position;
  varying vec3 v_normal;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - v_position);
    float dotProduct = dot(v_normal, viewDirection);
    float intensity = 1.0 - max(dotProduct, 0.0);

    vec3 color = mix(uColorA, uColorB, intensity * 1.2 + sin(uTime * 0.2) * 0.1);

    float fresnel = pow(1.0 - max(dotProduct, 0.0), 4.0);
    vec3 finalColor = color + fresnel * 0.7;

    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

// REFACTOR: Converted from an imperative, side-effect-driven component to a
// declarative, JSX-based component. This aligns with react-three-fiber best
// practices and avoids potential lifecycle issues that can cause cryptic
// runtime errors.
const Crystal = () => {
  const mesh = useRef<THREE.Mesh<THREE.IcosahedronGeometry, THREE.ShaderMaterial>>(null!);
  const { theme } = useTheme();

  const uniforms = useMemo(() => {
    const colors = theme === 'default'
      ? { a: new THREE.Color('#D4AF37'), b: new THREE.Color('#FFD7BE') }
      : { a: new THREE.Color('#00D9FF'), b: new THREE.Color('#A855F7') };
    
    return {
      uTime: { value: 0 },
      uColorA: { value: colors.a },
      uColorB: { value: colors.b },
    };
  }, [theme]);

  useFrame((state) => {
    if (!mesh.current) return;
    const { clock, mouse } = state;

    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, mouse.y * 0.4, 0.05);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, -mouse.x * 0.6, 0.05);
    mesh.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;

    if (mesh.current.material.uniforms.uTime) {
      mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[2.5, 3]} />
      <shaderMaterial
        key={theme} // Re-create material on theme change
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
};

// REFACTOR: Replaced imperative scene manipulation with a declarative JSX
// component for adding lights. This is cleaner, less error-prone, and lets
// react-three-fiber manage the object lifecycle.
const Lights = () => {
  const { theme } = useTheme();
  const pointLightColor = theme === 'default' ? '#FFD7BE' : '#A855F7';
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight color="white" intensity={1.5} position={[10, 10, 10]} />
      <pointLight color={pointLightColor} intensity={0.8} position={[-10, -10, -10]} />
    </>
  );
};

const FlowingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { theme } = useTheme();
  const scrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const particleCount = 3000;
  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const yRange = 30;
    const xzRange = 30;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * xzRange; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * yRange; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * xzRange; // z
    }
    return { positions: pos, originalPositions: new Float32Array(pos) };
  }, [particleCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const { clock } = state;
    const time = clock.getElapsedTime();
    const posAttribute = pointsRef.current.geometry.attributes.position;
    const yRange = 30;
    const halfYRange = yRange / 2;

    const scrollOffset = scrollY.current * 0.005;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      const driftX = Math.sin(time * 0.1 + origX * 0.5) * 0.15;
      const driftZ = Math.cos(time * 0.1 + origZ * 0.5) * 0.15;

      const totalY = origY - scrollOffset;
      const wrappedY = ((totalY + halfYRange) % yRange) - halfYRange;

      posAttribute.setX(i, origX + driftX);
      posAttribute.setY(i, wrappedY);
      posAttribute.setZ(i, origZ + driftZ);
    }
    posAttribute.needsUpdate = true;
  });

  const particleColor = theme === 'default' ? '#D4AF37' : '#00D9FF';

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={particleColor}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        transparent
        opacity={0.7}
      />
    </points>
  );
};

const Scene = () => {
  return (
    <div className="w-full h-full accelerated" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Lights />
        <Crystal />
        <FlowingParticles />
        <Stars
          radius={120}
          depth={60}
          count={4000}
          factor={5}
          saturation={0}
          fade
          speed={1.2}
        />
      </Canvas>
    </div>
  );
};

export default Scene;