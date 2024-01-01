import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import './index.css';
import App from './components/App/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Set the app element
Modal.setAppElement('#root');

root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
