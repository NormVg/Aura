<script setup>
import { useResizeObserver } from '@vueuse/core'
import { onMounted, ref, useTemplateRef } from 'vue'

import CloseBtn from "../assets/icon/cancel.svg";
import ResizeBtn from "../assets/icon/resize.svg";

import GrabBtn from "../assets/icon/grab.svg";
import { usePluginStore } from "../store/PluginStore";
import DraggableWrapper from "./DraggableWrapper.vue";
import {useGetLocalFile} from "../composables/useGetLocalFile"

const {ResolvePluginPath} = useGetLocalFile()

const PluginStore = usePluginStore()

const props = defineProps({
  item:{
    type:Object

  },
  index:{
    type:Number
  }
})


const el = useTemplateRef('el')
const asdTest= ref('')



const onHover = ref(false)

const RemovePlugin = () => {
  PluginStore.removePlugin(props.index)
}

onMounted(() => {
  readFile()
  const container = el.value;
  const resizer = container.querySelector('.resize-handle');

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  const initResize = (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = container.offsetWidth;
    startHeight = container.offsetHeight;

    container.style.pointerEvents = 'none'; // Prevent interaction issues
    document.body.style.cursor = 'nwse-resize'; // Optional: show resize cursor globally

    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', stopResize);

    // Optional: capture pointer for more consistent behavior
    if (resizer.setPointerCapture) {
      resizer.setPointerCapture(e.pointerId);
    }
  };

  const onResize = (e) => {
    if (!isResizing) return;

    requestAnimationFrame(() => {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);

      // Clamp values if needed (to prevent shrinking too much)
      container.style.width = `${Math.max(newWidth, 100)}px`;
      container.style.height = `${Math.max(newHeight, 100)}px`;
    });
  };

  const stopResize = () => {
    isResizing = false;
    container.style.pointerEvents = ''; // Restore pointer events
    document.body.style.cursor = ''; // Reset cursor

    window.removeEventListener('mousemove', onResize);
    window.removeEventListener('mouseup', stopResize);
  };

  resizer.addEventListener('mousedown', initResize);
});

const replacePluginPath = (htmlContent) => {
  const pluginPath = ResolvePluginPath('', props.item.name);
  return htmlContent.replace(/%PLUGIN_PATH%/g, pluginPath);
};

const readFile = () => {
  var filePath = ResolvePluginPath(props.item.main, props.item.name);
  filePath = filePath.startsWith("file://") ? filePath.slice(7) : filePath;

  const fs = window.fs;

  if (!fs) {
    console.error("window.fs is not available");
    return;
  }

  fs.promises.readFile(filePath, 'utf-8')
    .then((data) => {
      console.log("File content before replacement:", data);

      const updatedContent = replacePluginPath(data);
      console.log("File content after replacement:", updatedContent);

      asdTest.value = updatedContent;
      return updatedContent;
    })
    .catch((error) => {
      console.error("Error reading file:", error);
    });
};




</script>

<template>

  <Transition>
      <DraggableWrapper handleSelector=".handle-btn">

        <div class="widgit-overlay" ref="el" @mouseenter="onHover = true" @mouseleave="onHover = false">

          <div class="web-boxx">

            <!-- <iframe :src="ResolvePluginPath(props.item.main,props.item.name)" ></iframe> -->

            <div id="asd" v-html="asdTest" >

            </div>

            <!-- <webview :src="" ></webview> -->


          </div>

          <Transition>

            <div id="cont-btn" v-show="onHover">

              <div class="close-btn"  @click="RemovePlugin">
                <img :src="CloseBtn"  alt="x"   />
              </div>

              <div class="handle-btn" >
                <img :src="GrabBtn"  alt="x" ref="handleDrag"   />
              </div>
              <div class="resize-handle" >
                <img :src="ResizeBtn"  alt="x" ref="handleDrag"   />
              </div>

            </div>
          </Transition>


        </div>
      </DraggableWrapper>
  </Transition>
</template>



<style scoped>

.widgit-overlay .web-boxx {


  position: absolute;
  height: calc(100% - 20px);
  width: calc(100% - 20px);

}



.web-boxx #asd {
  /* position: absolute; */
  scrollbar-width: none;

  overflow: auto;
  height: 100%;
  width: 100%;
}
.widgit-overlay:hover{
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  /* z-index: 3; */
}
.widgit-overlay {
  transition: box-shadow ease-i/n-out 200ms;
  position: fixed;
  top: 50%;
  left: 50%;
  width: max-content;
  max-width: 70vw;
  max-height: 70vh;
  width: 200px;
  min-height: 200px;
  height: max-content;
  background: #1e1e20;
  border-radius: var(--bdr);
  /* padding: 20px 30px; */
  border: 1px solid #ba9efe70;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  transform: translate(-50%, -50%);
  padding: 10px;
  scrollbar-width: none;
}

#cont-btn{
  position: absolute;
  bottom: -15px;
  right: 0px;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  /* opacity: 0; */
  display: flex;
  height: 0px;
  transition: all 0.2s ease-in-out;

}

.close-btn {
  /* position: absolute;
  top: 0px;
  right: 0px; */
  background: none;
  border: none;
  cursor: pointer;
  margin: 5px;
}

.handle-btn {
  /* position: absolute;
  bottom: 0px;
  right: 0px; */
  background: none;
  border: none;
  margin: 5px;
  user-select: none;

  cursor: grab;
}

.handle-btn:active {
  cursor: grabbing;

}

img {
  -webkit-user-drag: none;
  user-select: none;


}

img {

  user-select: none;
  transition: all 0.2s ease-in-out;
  height: 20px;
  border-radius: 100%;

}

img:active {
  background-color: #000000;
}


</style>
