<script setup>
import CubeOutlineIcon from "../assets/icon/cube-outline.svg";
import CubeIcon from "../assets/icon/cube.svg";
import MessageSquareOutlineIcon from "../assets/icon/message-square-outline.svg";
import MessageSquareIcon from "../assets/icon/message-square.svg";
import MicOffIcon from "../assets/icon/mic-off.svg";
import MicIcon from "../assets/icon/mic.svg";
import StopBtn from "../assets/icon/stop.svg";

import ToggleIcon from "./ToggleIcon.vue";

import { useMenuStore } from "../store/menuStore";
import { useAppBasic } from "../store/AppBasicStore";

import { useAudioRecorder } from "../composables/useAudioRecorder";
import { useVoice } from "../composables/useVoice";
import { useAiChat } from "../composables/useAiChat";

import { useAiStore } from "../store/AIstore";

const AiStore = useAiStore();

const menuStore = useMenuStore();
const AppBasic = useAppBasic();

const { startRecording, stopRecording } = useAudioRecorder();

const { GetAiResp, history, GetAiVoiceResp, appendChat } = useAiChat();

const { GoogleSST, TTS, AudioSrc } = useVoice();

const HandleMenu = (params) => {
  // alert(params);
  menuStore.SetIsMenu(params);
};

const HandleChat = async (params) => {
  AppBasic.setIsChatBox(params);
};

const HandleMic = async (param) => {
  if (!param) {
    console.log("STOP");
    await stopRecording();
    AiStore.setIsRunningAi(true)

    const ttsText = await GoogleSST();

    if (ttsText.success === false) {
      console.log("text in voice not found");
      AiStore.setIsRunningAi(false)

      return;
    }

    await GetAiResp(ttsText.transcription);


    await TTS(history.value[history.value.length - 1].content);

    const audioElement = document.getElementById("sst");
    if (audioElement) {
      audioElement.play()
    }
    AiStore.setIsRunningAi(false)
    return;
  }
  console.log("START");

  await startRecording();
};
</script>

<template>
  <div id="sb-bar">
    <audio :src="AudioSrc" id="sst"></audio>
    <div id="sb-list-item">
      <ToggleIcon
        v-if="AiStore.isRunningAi"
        id-name="sb-item"
        :n-icon="StopBtn"
        :t-icon="StopBtn"
      />

      <ToggleIcon
        v-else
        id-name="sb-item"
        :n-icon="MicIcon"
        :t-icon="MicOffIcon"
        @event="HandleMic"
      />

      <ToggleIcon
        id-name="sb-item"
        :n-icon="MessageSquareOutlineIcon"
        :t-icon="MessageSquareIcon"
        @event="HandleChat"
      />
    </div>

    <ToggleIcon
      id-name="sb-apps"
      @event="HandleMenu"
      :n-icon="CubeOutlineIcon"
      :t-icon="CubeIcon"
      :hover="true"
    />
  </div>
</template>

<style scoped>
#sb-bar {
  /* border: 1px solid salmon; */
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

#sb-list-item {
  margin-top: 10px;
  height: 100%;
  /* border: 1px solid salmon; */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

#sb-item {
  display: flex;
  justify-content: center;
  align-items: center;

  /* border: 1px solid green; */
}

#sb-apps {
  /* border: 1px solid green; */
  z-index: var(--z-am-btn);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
