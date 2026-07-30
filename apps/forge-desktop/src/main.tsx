import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './panels/editor/monaco-config';
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('ForgeDesktop: Root element #root not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
