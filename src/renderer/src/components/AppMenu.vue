<script setup>
import { computed, ref, watch } from "vue";
import { useMenuStore } from "../store/menuStore";
import { usePluginStore } from "../store/PluginStore";

import DefIcon from "../assets/icon/plugin-default-icon.svg";
import testDef from "../assets/icon/cube.svg";
import ListMoveSfx from "../assets/scroll-sound.wav";
import { useSound } from "@vueuse/sound";

import {useGetLocalFile} from "../composables/useGetLocalFile";

import hash from "hash-it";
import { v4 as uuidv4 } from 'uuid';

const { play } = useSound(ListMoveSfx);
const { ResolvePluginPath } = useGetLocalFile()


const menuStore = useMenuStore();
const PluginStore = usePluginStore();


const handleMouseEnter = () => {
  menuStore.setIsHover(true);
};

const handleMouseLeave = () => {
  menuStore.setIsHover(false);
};

const isMenuLocal = computed(() => {
  console.log("local", menuStore.isHover, "menu", menuStore.isMenu);
  if (menuStore.isMenu === false && menuStore.isHover === false) {
    return false;
  } else {
    return true;
  }
});

const apps = ref([]);

watch(
  () => PluginStore.pluginList,
  () => {
    if (PluginStore.pluginList.length < 5) {
      apps.value = [
        ...PluginStore.pluginList,
        ...PluginStore.pluginList,
        ...PluginStore.pluginList,
        ...PluginStore.pluginList,
        ...PluginStore.pluginList,
      ]
    }else{

      apps.value = PluginStore.pluginList;
    }

    var newList = []

    apps.value.forEach(element => {
      newList.push({uuid:uuidv4(),...element})
    });

    console.log(newList);
    apps.value = newList

  }
);




const customStyle = (param) => {
  console.log(param);
  var index = param + 1;

  if (index === 1) {
    const val = -9;
    return `transform: rotate(${val}deg);`;
  } else if (index > 5) {
    // const val = -9*(index+param)
    return `display:none`;
  } else {
    const val = -9 * (index + param);
    return `transform: rotate(${val}deg);`;
  }
};

const customStyleItem = (param) => {
  console.log(param);
  var index = param + 1;

  if (index === 1) {
    const val = 9;
    return `transform: rotate(${val}deg);`;
  } else if (index > 5) {
    // const val = -9*(index+param)
    return `display:none`;
  } else {
    const val = 9 * (index + param);
    return `transform: rotate(${val}deg);`;
  }
};

const moveFirstToLast = (list) => {
  if (list.length === 0) return list;
  const firstItem = list.shift();
  list.push(firstItem);
  return list;
};

const moveLastToFirst = (list) => {
  if (list.length === 0) return list;
  const lastItem = list.pop();
  list.unshift(lastItem);
  return list;
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
    const newList = moveLastToFirst(apps.value);
    apps.value = newList;
    play();
  } else if (e.deltaY > 0) {
    console.log("up scroll");
    const newList = moveFirstToLast(apps.value);

    apps.value = newList;
    play();
  }
}, 30);


const HandleOnWidgit = (item) =>{
  console.log(item,"on widgit");
  PluginStore.addPlugin(item)
  console.log(PluginStore.ActivePlugins)
}


</script>
<template>
  <Transition>
    <div
      id="app-menu-box"
      v-if="isMenuLocal"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousewheel="myMouseScroll"
    >
      <div
        class="app-box"
        v-for="(item, index) in apps"
        :key="item.name+index"
        :style="customStyle(index)"
      >
        <div id="ab-item" :style="customStyleItem(index)" @click="()=>{HandleOnWidgit(item)}"  >
          <img :src="ResolvePluginPath(item.icon.base,item.name)" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
#ab-item {
  height: 30px;
  width: 30px;
  position: absolute;
  top: 15px;
  left: -15px;
  /* background-color: #6DBBDC; */
  border-radius: 100%;
  /* transform: rotate(27deg); */
}
.app-box {
  height: 250px;
  width: 1px;
  right: 0;
  margin-bottom: 13px;
  position: fixed;
  transform-origin: bottom;
  /* background-color: #6DBBDC; */
}

#app-menu-box {
  overflow: hidden;
  position: fixed;
  height: 250px;
  /* background-image: url(../assets/img/guide.svg); */
  background-color: var(--sbgc);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform-origin: bottom right;
  z-index: var(--z-am);
  transition: ease-in-out 400ms;
  right: 0;
  bottom: 0px;
  margin-bottom: 13px;
  width: 250px;
  border-top-left-radius: 300px;
  border-top: 1px solid var(--bdrc);
  border-left: 1px solid var(--bdrc);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
  scale: 1;
  filter: blur(0);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  scale: 0;
  filter: blur(40px);
}

/*
.v-enter-from {
  filter: blur(40px);
  opacity: 0;

  transform: rotate(90deg);
}
.v-enter-to {
  filter: blur(0);
  opacity: 1;

  transform: rotate(0deg);
}

.v-leave-from {
  filter: blur(0);
  opacity: 1;
  transform: rotate(0deg);
}

.v-leave-to {
  filter: blur(40px);
  opacity: 0;

  transform: rotate(-90deg);
} */
</style>
