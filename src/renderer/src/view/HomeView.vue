<script setup>
import Aura from "../components/Aura.vue";
import Chat from "../components/Chat.vue";
import Footer from "../components/Footer.vue";
import WorkspaceManager from "../workspace/WorkspaceManager.vue";
import WorkspaceTab from "../workspace/WorkspaceTab.vue";
import WorksapceArea from "../workspace/WorkspaceArea.vue";
import Settings from "../workspace/Settings.vue";
import WorkspaceBar from "../components/WorkspaceBar.vue";
import PopUpComp from "../components/PopUp/PopUpComp.vue";
import WidgitArea from "../components/WidgitArea.vue";


import { useAppBasic } from "../store/AppBasicStore";
import { usePluginStore } from "../store/PluginStore";
import { useWorkspaceStore } from "../store/WorkSpace";
import { onMounted } from "vue";
import { useAiStore } from "../store/AIstore";

const AiStore = useAiStore()
const AppBasic = useAppBasic();
const PluginStore = usePluginStore();
const WorkspaceStore = useWorkspaceStore()


onMounted(async () => {
  const pluginList =  await window.electron.ipcRenderer.invoke('load-plugin')


  PluginStore.setPluginList(pluginList)
})

console.log(WorkspaceStore.AllWorkspace)

</script>

<template>
  <Aura />
  <WorkspaceBar/>

  <Footer />
  <WorkspaceManager>
    <WorkspaceTab v-for="item in WorkspaceStore.AllWorkspace" :key="item" :WinID="item.name">


      <WorksapceArea v-if="item.name === 'settings'">
        <Settings/>
      </WorksapceArea>

      <WorksapceArea v-else>

        <WidgitArea v-for="item,index in PluginStore.ActivePlugins" :key="item.uuid" :item="item" :index="index" />

      </WorksapceArea>
    </WorkspaceTab>
  </WorkspaceManager>
  <Transition>
    <Chat v-if="AppBasic.isChatBox" />
  </Transition>


  <PopUpComp/>
</template>
