import React from 'react';
import ReactGA from 'react-ga';
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

ReactGA.initialize('UA-84947411-1');
ReactDOM.render(<App />, document.getElementById('root'));
