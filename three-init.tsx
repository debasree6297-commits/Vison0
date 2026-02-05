import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Extend react-three-fiber to include all THREE namespace elements,
// making them available as JSX elements (e.g., <mesh>, <ambientLight>).
// This is the essential runtime configuration for the 3D scene.
// FIX: Reverted to passing the entire THREE namespace to `extend`.
// Manual filtering is brittle and can cause type inference issues. The `extend`
// function is designed to handle the THREE namespace directly, which is the
// standard and most robust approach.
extend(THREE);
