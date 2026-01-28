import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import AR from './js/playcanvasAR.js'
import image1 from './image-targets/magazine-0-cover.json';

console.log(image1)

await XR8.loadChunk('slam')

AR.init();
await AR.loadScene(() => {}, () => {});


const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      image1
    ],
  })

  // AR.app.on('xr:imageupdated', function(evt){console.log(evt)}, {})
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)

createApp(App).mount('#app');
