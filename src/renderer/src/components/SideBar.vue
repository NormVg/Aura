<script setup>
import CubeOutlineIcon from "../assets/icon/cube-outline.svg";
import CubeIcon from "../assets/icon/cube.svg";
import MessageSquareOutlineIcon from "../assets/icon/message-square-outline.svg";
import MessageSquareIcon from "../assets/icon/message-square.svg";
import MicOffIcon from "../assets/icon/mic-off.svg";
import MicIcon from "../assets/icon/mic.svg";
import StopBtn from "../assets/icon/stop.svg";
import SettingsIcon from "../assets/icon/settings.svg";
import SettingsOutlineIcon from "../assets/icon/settings-outline.svg";
import SidebarToggleIcon from "./SidebarToggleIcon.vue";


import { useAudioRecorder } from "../composables/useAudioRecorder";
import {  useGetLocalFile } from "../composables/useGetLocalFile";
import { useVoice } from "../composables/useVoice";
import { useAiChat } from "../composables/useAiChat";

import { useAiStore } from "../store/AIstore";
import { useWorkspaceStore } from "../store/WorkSpace";
import { useMenuStore } from "../store/menuStore";
import { useAppBasic } from "../store/AppBasicStore";
import { computed } from "vue";



const AiStore = useAiStore();
const menuStore = useMenuStore();
const AppBasic = useAppBasic();
const workspaceStore = useWorkspaceStore();



const { startRecording, stopRecording } = useAudioRecorder();
const { GetLocalFile } = useGetLocalFile()

const { GetAiResp, history,PlayAiVoice ,StopAiVoice} = useAiChat();

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

    // AiStore.setAiVoiceAudio(AudioSrc.value);
    // console.log(AudioSrc.value,"HEHEH 0")

    await AiStore.setAiVoiceAudio(GetLocalFile(AudioSrc.value))

    StopAiVoice()
    await PlayAiVoice()
    // console.log("AUDIO", AiStore.AiVoiceAudio);
    AiStore.setIsRunningAi(false)
    return;
  }
  console.log("START");

  await startRecording();
};


const HandleSettings = async () => {
  // workspaceStore.addWorkspace({name:'settings'})
  workspaceStore.workspaceExists('settings') ? workspaceStore.removeWorkspaceWithName('settings') :  workspaceStore.addWorkspace({name:'settings'})
  workspaceStore.setCurrentWorkspaceByName('settings')

};

const SettingsWatch = computed(() => {
  return workspaceStore.workspaceExists('settings');
});

</script>

<template>
  <div id="sb-bar">



    <div id="sb-list-item">
      <SidebarToggleIcon
        v-if="AiStore.isRunningAi"
        id-name="sb-item"
        :n-icon="StopBtn"
        :t-icon="StopBtn"
      />

      <SidebarToggleIcon
        v-else
        id-name="sb-item"
        :n-icon="MicIcon"
        :t-icon="MicOffIcon"
        @event="HandleMic"
      />

      <SidebarToggleIcon
        id-name="sb-item"
        :n-icon="MessageSquareOutlineIcon"
        :t-icon="MessageSquareIcon"
        @event="HandleChat"
      />

      <SidebarToggleIcon
        id-name="sb-item"
        :n-icon="SettingsOutlineIcon"
        :t-icon="SettingsIcon"
        @event="HandleSettings"
        :watcher="SettingsWatch"

      />
    </div>

    <SidebarToggleIcon
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
