// FIX: Import 'three-init' at the very top to ensure react-three-fiber is extended before any R3F components are loaded.
import "./three-init";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Get root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Create root and render App
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);