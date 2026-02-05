import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

const torusVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const torusFragmentShader = `
  uniform float uOpacity;
  uniform vec3 uColor1; // Light Gold
  uniform vec3 uColor2; // Medium Gold
  uniform vec3 uColor3; // Soft Cream

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    // Fresnel effect for a glowing edge
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDirection), 0.0), 3.0);
    
    // Gradient based on vertical position
    float gradientFactor = smoothstep(-2.5, 2.5, vPosition.y);
    vec3 color = mix(uColor1, uColor2, gradientFactor);
    
    // Mix in the fresnel glow
    color = mix(color, uColor3, fresnel * 1.2);
    
    float finalAlpha = uOpacity * (0.8 + fresnel * 0.2);
    
    gl_FragColor = vec4(color, finalAlpha);
  }
`;

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;


const FragmentedTorus = () => {
    const { theme } = useTheme();
    const { viewport } = useThree();
    const groupRef = useRef<THREE.Group>(null!);
    const scrollProgress = useRef(0);
    
    // --- Responsive Sizing ---
    const isMobile = viewport.width < 7;
    const torusArgs: [number, number, number, number] = isMobile ? [2.5, 0.3, 24, 60] : [3.5, 0.4, 32, 100];
    const maxDispersion = isMobile ? 3 : 5;
    
    // --- Scroll Listener ---
    useEffect(() => {
        const handleScroll = () => {
            const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.current = window.scrollY / scrollMax;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Create Fragments ---
    const fragments = useMemo(() => {
        const fragmentCount = isMobile ? 12 : 16;
        const baseGeometry = new THREE.TorusGeometry(...torusArgs);
        const fragmentGeometries = [];
        
        const faceCount = baseGeometry.index!.count / 3;
        const facesPerFragment = Math.floor(faceCount / fragmentCount);

        for (let i = 0; i < fragmentCount; i++) {
            const vertices = [];
            const normals = [];
            const uvs = [];

            const startFace = i * facesPerFragment;
            const endFace = (i + 1) * facesPerFragment;

            for (let j = startFace; j < endFace; j++) {
                const iA = baseGeometry.index!.getX(j * 3);
                const iB = baseGeometry.index!.getX(j * 3 + 1);
                const iC = baseGeometry.index!.getX(j * 3 + 2);
                
                const faceVertices = [iA, iB, iC];
                faceVertices.forEach(idx => {
                    vertices.push(baseGeometry.attributes.position.getX(idx), baseGeometry.attributes.position.getY(idx), baseGeometry.attributes.position.getZ(idx));
                    normals.push(baseGeometry.attributes.normal.getX(idx), baseGeometry.attributes.normal.getY(idx), baseGeometry.attributes.normal.getZ(idx));
                    uvs.push(baseGeometry.attributes.uv.getX(idx), baseGeometry.attributes.uv.getY(idx));
                });
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            fragmentGeometries.push(geo);
        }
        
        return fragmentGeometries.map((geo, i) => ({
            geometry: geo,
            angle: (i / fragmentCount) * Math.PI * 2,
            randomAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
            randomRotationSpeed: Math.random() * 0.5 + 0.2
        }));
    }, [isMobile, torusArgs]);

    const uniforms = useMemo(() => {
        const colors = theme === 'default'
          ? { c1: new THREE.Color('#E8C547'), c2: new THREE.Color('#C9A961'), c3: new THREE.Color('#F5E8D0') }
          : { c1: new THREE.Color('#00D9FF'), c2: new THREE.Color('#A855F7'), c3: new THREE.Color('#FFFFFF') };
          
        return {
            uOpacity: { value: 0 },
            uColor1: { value: colors.c1 },
            uColor2: { value: colors.c2 },
            uColor3: { value: colors.c3 },
        };
    }, [theme]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const t = easeInOutCubic(scrollProgress.current);

        // --- Opacity Animation ---
        const opacityThreshold = 0.9;
        let targetOpacity = 0.5;
        if (t > opacityThreshold) {
            targetOpacity = lerp(0.5, 0, (t - opacityThreshold) / (1 - opacityThreshold));
        } else {
            targetOpacity = lerp(0, 0.5, t / opacityThreshold);
        }
        uniforms.uOpacity.value = lerp(uniforms.uOpacity.value, targetOpacity, 0.1);

        // --- Animation Phases ---
        // Phase 1 -> 2: Initial fracture
        const fractureProgress = Math.min(1, t / 0.3);
        // Phase 3 -> 4: Dispersion
        const dispersionProgress = Math.max(0, Math.min(1, (t - 0.3) / 0.4));
        // Phase 5 -> 7: Reassembly
        const reassemblyProgress = Math.max(0, Math.min(1, (t - 0.7) / 0.3));

        const currentDispersion = lerp(0, maxDispersion, dispersionProgress) - lerp(0, maxDispersion, reassemblyProgress);
        
        // --- Group Animation ---
        groupRef.current.position.y = lerp(0, -viewport.height * 0.5, t);
        groupRef.current.rotation.y += delta * 0.05;

        // --- Fragment Animation ---
        groupRef.current.children.forEach((mesh, i) => {
            const fragment = fragments[i];
            
            const dispersionVec = new THREE.Vector3(
                Math.cos(fragment.angle) * currentDispersion,
                Math.sin(fragment.angle) * currentDispersion,
                Math.sin(fragment.angle * 2) * currentDispersion * 0.5
            );
            
            // Apply dispersion
            mesh.position.lerp(dispersionVec, 0.1);
            
            // Apply rotation
            const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(
                fragment.randomAxis,
                currentDispersion * fragment.randomRotationSpeed
            );
            mesh.quaternion.slerp(targetQuaternion, 0.1);
        });
    });

    return (
        <group ref={groupRef}>
            {fragments.map((frag, i) => (
                <mesh key={i} geometry={frag.geometry}>
                    <shaderMaterial
                        vertexShader={torusVertexShader}
                        fragmentShader={torusFragmentShader}
                        uniforms={uniforms}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
};

const Lights = () => {
  const { theme } = useTheme();
  const color = theme === 'default' ? '#E8C547' : '#A855F7';
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight color={color} position={[0, 10, 10]} intensity={0.5} />
      <directionalLight color="#FFFFFF" position={[-10, -5, -10]} intensity={0.2} />
    </>
  );
};

const Scene = () => {
  return (
    <div className="w-full h-full accelerated" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
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
        <FragmentedTorus />
      </Canvas>
    </div>
  );
};

export default Scene;
