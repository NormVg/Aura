<script setup>
import AddIcon from '../assets/icon/add-btn.svg'
import { usePopStore } from '../store/PopStore';
import { useWorkspaceStore } from '../store/WorkSpace';
import WorkspaceBarTab from './WorkspaceBarTab.vue';

const workspaceStore = useWorkspaceStore()

const PopStore = usePopStore()

const addWorkspace = () => {
  PopStore.setIsPopUp(true)
  PopStore.setIsWorkspacePop(true)
}

</script>

<template>
<div id="tab-bar" v-if="workspaceStore.isWorksSpaceBar">
  <div id="tab-box">

    <WorkspaceBarTab v-for="item,index in workspaceStore.AllWorkspace" :item="item" :index="index" />


  </div>
    <img :src="AddIcon"  alt="add" @click="addWorkspace" title="Add workspace" />
</div>

</template>

<style scoped>

#tab-box{
  /* width: calc(100% - 40px); */
  width: 100%;
  /* height: 100%; */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  transition: all 0.2s ease-in-out;
  overflow-x: auto;
  scrollbar-width: none;

}

img{
  justify-self: right;
  height: 20px;
  border-radius: 100%;
  margin-left: 10px;
}

img:active{
  background-color: #000000;
}

#tab-bar {
  z-index: var(--z-footer);
  transition: all 0.2s ease-in-out;

  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e20;
  height: 35px;
  max-width: 60vw;
  min-width: 250px;
  padding: 0 10px;
  border-bottom-right-radius: var(--bdr);
  position: fixed;
  top: 0;
  left: 0;
}
</style>
