import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
// import 'semantic-ui-css/semantic.min.css';
import './index.scss';
import App from './Components/App/';

WebFont.load({
  google: {
    families: ['Open Sans']
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
