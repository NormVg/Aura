
<script setup>

import AuraChar from "../assets/img/auraCar.svg"
import AudioVisualizer from "./AudioVisualizer.vue";
import TestMusic from "../assets/test-music.mp3";
import MuteIcon from "../assets/icon/mute.svg";
import {useAiStore} from "../store/AIstore";
import {useAiChat} from "../composables/useAiChat";
import { ref } from "vue";


const AiStore = useAiStore();
const {MuteAiVoice,UnmuteAiVoice} = useAiChat();

const MuteState = ref(false);
const VisualAudioState = ref(false);



function toggleMute() {
  MuteState.value = !MuteState.value;
  if (MuteState.value) {
    console.log("Mute");

    MuteAiVoice()
    VisualAudioState.value = false;

  } else {
    UnmuteAiVoice()

    const audioElement = document.getElementById("audio-tts");
    if (audioElement && !audioElement.paused) {
      console.log("Audio is playing");
      // PlayAiVoice();
      VisualAudioState.value = false;
      VisualAudioState.value = true;

    } else {
      console.log("Audio is not playing");
    }


  }

}



const startVisualization = () => {
  VisualAudioState.value = true;
  console.log("start");
};

const stopVisualization = () => {
  VisualAudioState.value = false;
  console.log("stop");
};

</script>


<template>
  <div @click="toggleMute">

    <audio :src="AiStore.AiVoiceAudio"  ref="audioRef"   id="audio-tts" @play="startVisualization" @pause="stopVisualization"></audio>

    <img :src="AuraChar" alt="Aura logo"  />

    <div id="visual-sound" >
      <img :src="MuteIcon" alt="Aura mute" id="mute-btn"  v-if="MuteState" />
      <AudioVisualizer :TTSplaying="VisualAudioState" v-else/>

    </div>
  </div>
</template>

<style scoped>
div{
  z-index: var(--z-logo);
  cursor: pointer;
}

#mute-btn{
  position: fixed;
  right: 60px;
  top: 0px;
  width: 25px;
}

#visual-sound{
  position: fixed;
  right: 90px;
  top: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}

img{
  height: 50px;
  position: fixed;
  right: 0;
  margin: 30px;
  z-index: var(--z-logo);

}
</style>
