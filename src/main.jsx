import React from 'react';
import { createRoot } from 'react-dom/client';  // Import createRoot from react-dom/client
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const container = document.getElementById('root');  // Get the root element
const root = createRoot(container);  // Create the root using createRoot

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
