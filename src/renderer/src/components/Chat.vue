<script setup>
import { makeDestructurable, useTextareaAutosize } from "@vueuse/core";
import LeftCurve from "../assets/img/left-curve.svg";
import RightCurve from "../assets/img/right-curve.svg";
import EnterBtn from "../assets/icon/enterBtn.svg";
import StopBtn from "../assets/icon/stop.svg";

import { onMounted, ref, watch } from "vue";
import { useAiChat } from "../composables/useAiChat";

import MarkdownRender from "./MarkdownRender.vue";

const { textarea, input } = useTextareaAutosize();
const { history, GetAiResp } = useAiChat();


import {useAiStore} from "../store/AIstore"

const AiStore = useAiStore()

onMounted(() => {
  const scrollToBottom = () => {
    const div = document.getElementById("chat-area");
    console.log(div.scrollHeight);
    if (div) {
      div.scrollTo({
        top: div.scrollHeight + 100,
        behavior: "smooth",
      });

      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  watch(
    history.value,
    () => {
      console.log("CHANGED");
      scrollToBottom();
    },
    { deep: true }
  );
});

const copyText = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
};

const handleSend = async () => {
  if (!input.value.trim() || AiStore.isRunningAi) {
    console.log("NOT HAPPNING");
    return;
  }

  AiStore.setIsRunningAi(true)
  const ques = input.value;
  input.value = "";
  await GetAiResp(ques);
  AiStore.setIsRunningAi(false)


};

onMounted(async () => {
  const resizable = document.getElementById("chat-box");
  const leftResizer = document.getElementById("leftResizer");

  function updateWidth() {
    const currentWidth = resizable.offsetWidth;
    const maxWidth = window.innerWidth * 0.95; // 96vw
    const minWidth = window.innerWidth * 0.5; // 35vw

    // Ensure width stays within min-max bounds
    if (currentWidth < minWidth) resizable.style.width = minWidth + "px";
    if (currentWidth > maxWidth) resizable.style.width = maxWidth + "px";
  }

  leftResizer.addEventListener("mousedown", (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = resizable.offsetWidth;
    const maxWidth = window.innerWidth * 0.95; // 96vw
    const minWidth = window.innerWidth * 0.5; // 35vw

    function resize(e) {
      const newWidth = startWidth - (e.clientX - startX);

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        resizable.style.width = newWidth + "px";
      }
    }

    function stopResize() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    }

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  });

  // Auto-adjust width when the browser is resized
  window.addEventListener("resize", updateWidth);

  document
    .getElementsByClassName("resize-none")[0]
    .addEventListener("keydown", async function (e) {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        await handleSend();
      }
    });
});
</script>

<template>
  <div id="chat-box">
    <div class="left-resizer" id="leftResizer"></div>

    <div id="chat-area">
      <div
        v-for="item in history"
        :key="item"
        :id="item.role === 'user' ? 'user-msg' : 'ai-msg'"
      >
        <div>
          <MarkdownRender :md="item.content" />
        </div>
      </div>



      <div id="loader-wala" v-if="AiStore.isRunningAi">
        <div class="loader"></div>
      </div>

    </div>

    <div id="chat-inp-box-con">
      <div id="before-tb"><img :src="LeftCurve" /></div>
      <div id="chat-inp-box">
        <textarea
          ref="textarea"
          v-model="input"
          class="resize-none"
          placeholder="What's on your mind?"
        />
        <div id="send-btn" @click="handleSend">
          <img :src="StopBtn" v-if="AiStore.isRunningAi" />
          <img :src="EnterBtn" v-else />
        </div>
      </div>
      <div id="after-tb"><img :src="RightCurve" /></div>
    </div>
  </div>
</template>

<style scoped>
#loader-wala {
  height: 30px;
  width: 99%;
}

/* HTML: <div class="loader"></div> */
.loader {
  width: 30px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, #cdc6f7 90%, #0000);
  background:
    var(--_g) 0% 50%,
    var(--_g) 50% 50%,
    var(--_g) 100% 50%;
  background-size: calc(100% / 3) 50%;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  20% {
    background-position:
      0% 0%,
      50% 50%,
      100% 50%;
  }
  40% {
    background-position:
      0% 100%,
      50% 0%,
      100% 50%;
  }
  60% {
    background-position:
      0% 50%,
      50% 100%,
      100% 0%;
  }
  80% {
    background-position:
      0% 50%,
      50% 50%,
      100% 100%;
  }
}

#ai-msg {
  /* border:1px solid salmon ; */
  width: 99%;
  height: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #cdc6f7;
}

#ai-msg div {
  text-align: left;
  /* border: 1px solid salmon; */
  height: 100%;
  width: 100%;
}

#user-msg {
  /* border:1px solid salmon ; */
  width: 99%;
  height: max-content;
  display: flex;
  justify-content: right;
  align-items: center;
  /* justify-items: flex-start; */
}

#user-msg > div {
  width: max-content;
  height: max-content;
  background-color: var(--sbgc);
  padding: 10px;
  padding-bottom: 0;
  border-radius: 10px;
  text-align: left;
}

.left-resizer {
  width: 2px;
  height: 100%;
  background: #333;
  position: absolute;
  left: 0;
  top: 0;
  cursor: ew-resize;
  transition: all ease-in var(--ani-time);
}

.left-resizer:hover {
  width: 3px;
  background-color: whitesmoke;
}

#chat-area {
  height: calc(100% - 200px);
  width: 80%;
  margin: 0 auto;
  margin-top: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  scrollbar-width: none;
  padding-bottom: 100px;
  margin-bottom: 10px;
}

#send-btn {
  user-select: none;
  background-color: #a1a0a030;
  background-blend-mode: soft-light;
  height: 30px;
  width: 30px;
  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;
}
#send-btn:active {
  scale: 0.95;
}
#send-btn:hover {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 1px solid whitesmoke;
}

#send-btn img {
  /* background-color: #f6f6f613; */
  height: 25px;
  width: 25px;
}

textarea {
  /* outline: 1px solid salmon; */

  -ms-overflow-style: none;
  scrollbar-width: none;
  resize: none;
  max-height: 175px;

  /* height: 200px; */
  width: 85%;
  margin-bottom: 5px;
  margin-top: 5px;
  margin-left: 5px;
  background-color: transparent;
  border: none;
  /* color: var(--font-color); */
  color: white;
  /* padding: 10px; */
  font-family: var(--font-name);
}

textarea:focus {
  outline: none;
}

textarea::-webkit-scrollbar {
  display: none;
}

#chat-inp-box-con {
  /* border: 1px solid salmon; */
  /* max-width: 80%; */
  min-width: 35vw;
  width: max(35vw, 80%);

  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 13px;
}

#before-tb {
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
}

#before-tb img {
  height: 20px;
  width: 20px;
}

#after-tb {
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
}

#after-tb img {
  height: 20px;
  width: 20px;
}

#chat-inp-box {
  background-color: #1e1e20;
  /* border: 1px solid salmon; */
  max-height: 200px;
  min-height: 70px;
  max-width: 50vw;
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10px;
}

#chat-box {
  background-color: #f6f6f613;
  height: 100vh;
  width: 50vw;
  position: fixed;
  top: 0;
  right: 0;
  /* border: 1px solid salmon; */
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  justify-content: space-between;
  /* justify-content:jus; */
  align-items: center;
  flex-direction: column;
  /* border: 1px solid green; */
}
</style>
