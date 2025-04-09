<template>
  <div class="visualizer-container">
    <div class="visualizer" >
      <div
        v-for="(bar, index) in bars"
        :key="index"
        class="bar"
        :style="{ height: `${bar}px` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const bars = ref([3, 3, 3, 3, 3]);
const isPlaying = ref(false);
let animationId = null;


const props = defineProps({
  TTSplaying : {
    type: Boolean,
    default: false,
  },
});

function generateRandomHeight() {
  // Random height between 3 (min) and 35 (max)
  return Math.max(3, Math.floor(Math.random() * 28) + 3);
}

function animate() {
  if (isPlaying.value) {
    // Update bar heights with random values
    bars.value = bars.value.map(() => generateRandomHeight());

    // Continue animation
    animationId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 150);
  }
}

function togglePlay() {
  // console.log('asda')
  isPlaying.value = props.TTSplaying;

  if (isPlaying.value) {
    animate();
  } else {
    if (animationId) {
      clearTimeout(animationId);
      animationId = null;
    }
    // Reset bars to minimum height when stopped
    bars.value = bars.value.map(() => 3);
  }
}


watch(()=> props.TTSplaying, togglePlay);

onMounted(() => {
  // Initial state with minimum height
  bars.value = bars.value.map(() => 3);
  if (props.TTSplaying){
    togglePlay()
  }
});

onBeforeUnmount(() => {
  // Clean up animation frame if component is destroyed
  if (animationId) {
    clearTimeout(animationId);
  }
});
</script>

<style>
.visualizer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visualizer {
  width: 30px;
  height: 35px;
  /* background-color: black; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
  cursor: pointer;
}

.bar {
  width: 3px;
  background-color: #ADACB3;
  border-radius: 5px;
  transition: height 700ms ease;
  transform-origin: center;
  position: relative;
  /* margin-right: 1px; */
}

.bar::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: transparent;
}
</style>
