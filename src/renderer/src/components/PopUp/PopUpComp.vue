<template>
  <Transition>
    <div v-if="PopStore.isPopUp" class="popup-overlay">


      <PopNewWorkspace v-if="PopStore.isWorkspacePop"  />

      <div class="close-btn">
        <img :src="CloseBtn" @click="closePopup" alt="x" />
      </div>

    </div>
  </Transition>
</template>

<script setup>

import CloseBtn from "../../assets/icon/cancel.svg";
import PopNewWorkspace from "./PopNewWorkspace.vue";
import { usePopStore } from "../../store/PopStore";

const PopStore = usePopStore();


function closePopup() {
  PopStore.setIsPopUp(false)

  if (PopStore.isWorkspacePop) {
    PopStore.setIsWorkspacePop(false)
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  width: max-content;
  max-width: 50vw;
  max-height: 50vh;
  height: max-content;
  background: #1e1e20;
  border-radius: var(--bdr);
  padding: 10px;
  border: 1px solid #ba9efe70;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transform: translate(-50%, -50%);
  padding-right: 20px;
}

.close-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  color: red;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin: 5px;
}

img {
  transition: all 0.2s ease-in-out;
  height: 20px;
  opacity: 0;
}

img:active {
  background-color: #000000;
}

.popup-overlay:hover img {
  opacity: 1;
  cursor: pointer;
  border-radius: 100%;
}
</style>
