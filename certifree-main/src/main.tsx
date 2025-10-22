import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeEnvironment } from './config/environment'

// Validate environment configuration before rendering
try {
  initializeEnvironment();
} catch (error) {
  console.error('Failed to initialize environment:', error);
  // Optionally show a user-friendly error page instead of crashing
}

createRoot(document.getElementById("root")!).render(<App />);
