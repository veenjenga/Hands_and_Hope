import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Log environment variables for debugging
console.log('VITE_API_URL:', (import.meta as any).env?.VITE_API_URL);
console.log('All env vars:', (import.meta as any).env);

createRoot(document.getElementById("root")!).render(<App />);