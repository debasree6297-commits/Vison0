import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Extend react-three-fiber to include all THREE namespace elements,
// making them available as JSX elements (e.g., <mesh>, <ambientLight>).
// This is the essential runtime configuration for the 3D scene.
// FIX: The `extend` function can fail when passed the entire THREE namespace
// if it contains non-constructor properties. We filter the namespace to only
// include objects that are likely constructors (i.e., functions) to prevent
// runtime errors during initialization.
const catalogue = Object.fromEntries(
  Object.entries(THREE).filter(([, value]) => typeof value === 'function')
);
extend(catalogue);
