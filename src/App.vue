<script setup>
import { ref, onMounted } from "vue";
import image1 from './image-targets/magazine-0-cover.json';
import AR from './js/playcanvasAR.js'

const loaded = ref(false);
const isLinkoutActive = ref(false);
const isScanReticle = ref(false);

onMounted(async () => {
  await new Promise(resolve => {
    setTimeout(resolve, 2000);
  });

  loaded.value = true;
  isScanReticle.value = true;

  XR8.XrController.configure({
    imageTargetData: [
      image1
    ],
  })

  AR.app.once('xr:imageupdated', onFirstImageFound, this);
});

const onFirstImageFound = async function(){
  isScanReticle.value = false;
  await new Promise(resolve => {
    setTimeout(resolve, 5000);
  });

  isLinkoutActive.value = true;
}

const linkout = function(){
  window.open("https://www.bayside-california.com/products/bayside-magazine-issue-01", "_blank")
}

</script>

<template>
  <div class = "fixed-fill">
    <transition name = "fade">
      <div class = "fixed-fill" v-if = "!loaded">
        <div class = "loading-container fixed-fill">
          <div class = "background"></div>
          <img class = "loading-icon" src = "./assets/logo.png">
        </div>
        <div class = "loading-container fixed-fill">
          <div class = "loading-spinner"/>
        </div>
      </div>
    </transition>

    <transition name = "fade">
      <div class = "fixed-fill" v-if = "isScanReticle">
        <div class = "loading-container fixed-fill">
          <div class = "scan-reticle">
            SCAN MAGAZINE COVER
          </div>
        </div>
      </div>
    </transition>

      <div class = "magazine-linkout-area">
    <transition name = "slide-up">
        <div class = "magazine-linkout" v-if = "isLinkoutActive" @click = "linkout">
          BUY A MAGAZINE NOW
        </div>
    </transition>

      </div>
  </div>
</template>

<style scoped scss>

  .fixed-fill{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  .loading-container{
    display: flex;
    justify-content: center;
    align-items: center;

    .background{
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background-color: #008D97;
    }

    .loading-icon{
      position: relative;
      width: 30%
    }

    .loading-spinner{
      position: relative;
      width: 35vw;
      height: 35vw;

      border: 5px solid #FFF;
      border-bottom-color: transparent;
      border-radius: 50%;

      animation: linear spin 3s infinite;
    }

    
  }
  .magazine-linkout-area{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 10vw;
  }

  .magazine-linkout{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
  }

  .scan-reticle{
    position: relative;
    width: 80vw;
    height: 80vw;
    background-image: url("./assets/scan-brackets.png");
    background-size: 100% 100%;
    font-size: 1.5rem;
    text-align: center;
    text-shadow: 1px 1px #777777;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  
</style>
