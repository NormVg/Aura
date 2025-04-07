<script setup>
import { provide , computed} from 'vue'
import { useWorkspaceStore } from '../store/WorkSpace'


const workspaceStore = useWorkspaceStore()

const TabNow = computed(()=>{
    return workspaceStore.currentWorkspaceIndex

})
const TabList = computed(()=>{
    return workspaceStore.AllWorkspace

})


const removeTab =(tab)=>{

  // workspaceStore.setAllWorkspace(
  //   workspaceStore.AllWorkspace.filter(rr => rr !== tab)
  // )

}

const registerTab =(tab)=>{
  // var asd = workspaceStore.AllWorkspace
  // asd.push(tab)
  // workspaceStore.setAllWorkspace(asd)
}

provide("tab-manager",{TabNow,TabList,registerTab,removeTab});
</script>

<template>
<slot></slot>
</template>

<style scoped>

</style>
