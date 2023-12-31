import React from 'react';
import {createRoot} from 'react-dom/client';
import * as serviceWorker from './serviceWorker';

import './index.css';
import App from './App/App';

if (process.env.NODE_ENV === 'production') {
  console.log = function () {};
  console.warn = function () {};
  console.error = function () {};
}

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
