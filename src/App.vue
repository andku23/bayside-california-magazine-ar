<script setup>
import { ref, onMounted } from "vue";
const loaded = ref(false);

onMounted(async () => {
  await new Promise(resolve => {
    setTimeout(resolve, 2000);
  });

  loaded.value = true;
});

</script>

<template>
  <transition name = "fade">
    <div v-if = "!loaded">
      <div class = "loading-container">
        <div class = "background"></div>
        <img class = "loading-icon" src = "./assets/logo.png">
      </div>
      <div class = "loading-container">
        <img class = "loading-spinner" src = "./assets/loading-spinner.png">
      </div>
    </div>
  </transition>
</template>

<style scoped scss>
  .loading-container{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;

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
      width: 40%;
      animation: linear spin 3s infinite;
    }

    
  }

  
</style>
