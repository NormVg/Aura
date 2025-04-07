<script setup>
import LeftCurve from "../assets/img/left-curve.svg";
import RightCurve from "../assets/img/right-curve.svg";
import { useMenuStore } from "../store/menuStore";
import AppMenu from "./AppMenu.vue";
import SideBar from "./SideBar.vue";

import { useWorkspaceStore } from "../store/WorkSpace";
import { useAppBasic } from "../store/AppBasicStore";

import MarkdownRender from "./MarkdownRender.vue";

import { useAiChat } from "../composables/useAiChat";
import { computed, watch, ref } from "vue";
const menuStore = useMenuStore();
const workspaceStore = useWorkspaceStore();
const AppBasic = useAppBasic();

const { history } = useAiChat();

const TextAi = computed(() => {
  if (history.value.length === 0) {
    return "";
  }
  return history.value[history.value.length - 1].content;
});

const isActive = ref(false);

const OnHistoryChange = () => {
  console.log("OnHistoryChange");
  if (TextAi.value === "") {
    isActive.value = false;
  } else if (history.value[history.value.length - 1].role === "assistant") {
    isActive.value = true;
  } else {
    isActive.value = false;
  }
};

let inactivityTimer = null;

const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(() => {
    isActive.value = false;
  }, 10000); // 10 seconds
};

const stopInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
};

const startInactivityWatcher = () => {
  watch(
    () => history.value,
    () => {
      if (
        TextAi.value !== "" &&
        history.value[history.value.length - 1].role === "assistant"
      ) {
        resetInactivityTimer();
      }
    },
    { deep: true }
  );
};

const onMouseEnter = () => {
  stopInactivityTimer();
};

const onMouseLeave = () => {
  if (
    TextAi.value !== "" &&
    history.value[history.value.length - 1].role === "assistant"
  ) {
    resetInactivityTimer();
  }
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const myMouseScroll = debounce((e) => {
  if (e.deltaY < 0) {
    console.log("down scroll");
    workspaceStore.nextWorkspace();

  } else if (e.deltaY > 0) {
    console.log("up scroll");
    workspaceStore.previousWorkspace();

  }
}, 100);

const CalcBallPosition = computed(() => {
  const index = workspaceStore.currentWorkspaceIndex;
  const total = workspaceStore.AllWorkspace.length - 1;

  const bar = document.getElementById("slider-bar");
  const barWidth = bar ? bar.offsetWidth : 0;

  const position = (index / total) * barWidth;

  if (position === 0) {
    return `margin-left: ${position}px`;
  } else if (position === barWidth) {
    return `margin-left: calc(${position - 28}px);`;
  } else {
    return `margin-left: ${position - 12.5}px ;`;
  }
});

startInactivityWatcher();

watch(history.value, OnHistoryChange, { deep: true });
</script>

<template>
  <div id="footer-box">
    <div id="footer-slider">
      <div id="fs-box" @mousewheel="myMouseScroll">
        <div id="slider-bar">
          <div id="slider-ball" :style="CalcBallPosition">
            {{ workspaceStore.currentWorkspaceIndex + 1 }}<span>•</span
            >{{ workspaceStore.AllWorkspace.length }}
          </div>
        </div>
      </div>
      <div id="after-tb"><img :src="RightCurve" /></div>
    </div>

    <Transition>
      <span v-if="isActive">
        <div id="footer-text-box" v-if="!AppBasic.isChatBox">
          <div id="one-before-tb"><img :src="LeftCurve" /></div>
          <div
            id="tb-text"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
          >
            <MarkdownRender :md="TextAi" />
            <!-- {{ TextAi}} -->
          </div>
          <div id="one-after-tb"><img :src="RightCurve" /></div>
        </div>
      </span>
    </Transition>

    <div id="footer-side-bar">
      <div id="before-tb"><img :src="LeftCurve" /></div>
      <SideBar />
      <AppMenu />
    </div>

    <div id="footer-bar"></div>
  </div>
</template>
<style scoped>
#one-before-tb {
  background-color: transparent;
  position: relative;
  bottom: 0px;
  height: 20px;
  width: 20px;
}

#one-before-tb img {
  height: 20px;
  width: 20px;
}

#one-after-tb {
  background-color: transparent;
  position: relative;
  bottom: 0px;
  height: 20px;
  width: 20px;
}

#one-after-tb img {
  height: 20px;
  width: 20px;
}

#fs-box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#slider-bar {
  width: 80%;
  height: 7px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  background-color: var(--sc);
}
#slider-ball {
  height: 15px;
  width: 25px;
  border-radius: 4px;
  background-color: var(--sc);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #18171c;
  padding-top: 2px;
  padding-left: 2px;
  padding-right: 2px;
  transition: all 200ms ease-in-out;
  cursor: pointer;
}

#slider-ball span {
  margin-left: 2px;
  margin-right: 2px;
}

#footer-box {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: var(--z-footer);
  background-color: var(--sbgc);
  height: 13px;

  position: fixed;
  bottom: 0;
}

#footer-text-box {
  /* background-color: var(--sbgc);
  border-top-left-radius: var(--bdr);
  border-top-right-radius: var(--bdr); */
  /* border-radius: 100px; */
  min-height: 40px;
  max-height: 70vh;
  padding-left: 10px;
  padding-right: 10px;
  /* overflow-y: auto; */
  position: fixed;
  bottom: 13px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
}

#tb-text {
  background-color: var(--sbgc);
  /* border-top-left-radius: var(--bdr);
  border-top-right-radius: var(--bdr); */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 20px;
  padding-top: 10px;
  max-width: 65vw;
  max-height: 70vh;

  scrollbar-width: none;
  overflow-y: auto;
  overflow-x: hidden;
  /* min-height: 40px; */
  width: max-content;
  border-top-left-radius: var(--bdr);
  border-top-right-radius: var(--bdr);
}

#before-tb {
  background-color: transparent;
  position: absolute;
  bottom: 0%;
  left: -20px;

  height: 20px;
  width: 20px;
}

#before-tb img {
  height: 20px;
  width: 20px;
  bottom: -13px;
}

#after-tb {
  background-color: transparent;
  position: absolute;
  bottom: 0%;
  right: -20px;

  height: 20px;
  width: 20px;
}

#after-tb img {
  height: 25px;
  width: 25px;
}

#footer-side-bar {
  background-color: var(--sbgc);
  border-top-left-radius: var(--bdr);
  height: 200px;
  width: 50px;
  position: fixed;
  bottom: 13px;
  right: 0;
}

#footer-slider {
  background-color: var(--sbgc);
  border-top-right-radius: var(--bdr);

  height: 40px;
  width: 130px;
  position: fixed;
  bottom: 13px;
  left: 0;
}
</style>
