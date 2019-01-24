import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import App from './Components/App/';

WebFont.load({
  google: {
    families: ['Open Sans']
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
