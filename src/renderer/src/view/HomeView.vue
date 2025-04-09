<script setup>
import Aura from "../components/Aura.vue";
import Chat from "../components/Chat.vue";
import Footer from "../components/Footer.vue";
import { useAppBasic } from "../store/AppBasicStore";
import { useWorkspaceStore } from "../store/WorkSpace";
import WorkspaceManager from "../workspace/WorkspaceManager.vue";
import WorkspaceTab from "../workspace/WorkspaceTab.vue";
import WorksapceArea from "../workspace/WorkspaceArea.vue";
import Settings from "../workspace/Settings.vue";


const AppBasic = useAppBasic();
const WorkspaceStore = useWorkspaceStore()


console.log(WorkspaceStore.AllWorkspace)

</script>

<template>
  <Aura />
  <Footer />
  <WorkspaceManager>
    <WorkspaceTab v-for="item in WorkspaceStore.AllWorkspace" :key="item" :WinID="item.name">


      <WorksapceArea v-if="item.name === 'settings'">
        <Settings/>
      </WorksapceArea>

      <WorksapceArea v-else>
        <!-- {{ item.name }} -->
      </WorksapceArea>
    </WorkspaceTab>
  </WorkspaceManager>
  <Transition>
    <Chat v-if="AppBasic.isChatBox" />
  </Transition>
</template>
