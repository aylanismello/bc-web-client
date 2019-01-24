import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from './config';
import './index.scss';
import App from './Components/App/';

if (!baseUrl.includes('localhost')) {
  console.log('RUNNING HOT JAR SHIT')
  (function (h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: 1172097, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  }(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv="));
}

WebFont.load({
  google: {
    families: ['Open Sans']
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
