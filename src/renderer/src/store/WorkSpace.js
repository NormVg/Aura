import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWorkspaceStore = defineStore('workspace-store', () => {
  const AllWorkspace = ref([{"name":'main'}])
  const currentWorkspaceIndex = ref(0)

  const setAllWorkspace = (workspaces) => {
    AllWorkspace.value = workspaces
  }

  const setCurrentWorkspaceIndex = (index) => {
    currentWorkspaceIndex.value = index
  }

  return {
    AllWorkspace,
    currentWorkspaceIndex,
    setAllWorkspace,
    setCurrentWorkspaceIndex
  }
})
