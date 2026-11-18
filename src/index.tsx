import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Global design system: tokens, shared component classes, animations.
import './styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
