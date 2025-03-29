<script setup>
import CubeOutlineIcon from "../assets/icon/cube-outline.svg";
import CubeIcon from "../assets/icon/cube.svg";
import MessageSquareOutlineIcon from "../assets/icon/message-square-outline.svg";
import MessageSquareIcon from "../assets/icon/message-square.svg";
import MicOffIcon from "../assets/icon/mic-off.svg";
import MicIcon from "../assets/icon/mic.svg";

import ToggleIcon from "./ToggleIcon.vue";

import { useMenuStore } from "../store/menuStore";

const menuStore = useMenuStore();

const HandleMenu = (params) => {
  // alert(params);
  menuStore.SetIsMenu(params);
};


</script>

<template>
  <div id="sb-bar">
    <div id="sb-list-item">
      <ToggleIcon id-name="sb-item" :n-icon="MicIcon" :t-icon="MicOffIcon" />

      <ToggleIcon
        id-name="sb-item"
        :n-icon="MessageSquareOutlineIcon"
        :t-icon="MessageSquareIcon"
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
  z-index: 26;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
