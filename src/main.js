import './assets/main.css'
//import './scss/app.scss'

import { createApp } from 'vue'
import App from './App.vue'
import AR from './js/playcanvasAR.js'
import image1 from './image-targets/magazine-0-cover.json';

const start = async () => {
  try {
    await XR8.loadChunk('slam')
    AR.init();
    await AR.loadScene(() => {}, () => {});
    XR8.XrController.configure({
      imageTargetData: [
        image1
      ],
    })
    console.log(XRExtras)
    AR.app.on('xr:imageupdated', function(evt){console.log(evt)}, {})
  } catch (e) {
    console.warn("error", "start", e);
  }
};

start();

createApp(App).mount('#app');
