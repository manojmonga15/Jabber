import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import actioncable from 'actioncable';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const CABLE_URL = process.env.REACT_APP_CABLE_URL || 'ws://localhost:3001/cable'
const CableApp = {}
CableApp.cable = actioncable.createConsumer(CABLE_URL)

ReactDOM.render(
  <React.StrictMode>
      <App cable={CableApp.cable} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
