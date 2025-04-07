import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWorkspaceStore = defineStore('workspace-store', () => {
  const AllWorkspace = ref([{"name":'home'},{"name":'settings'}])
  const currentWorkspaceIndex = ref(0)

  const setAllWorkspace = (workspaces) => {
    AllWorkspace.value = workspaces
  }

  const setCurrentWorkspaceIndex = (index) => {
    currentWorkspaceIndex.value = index
  }

  const addWorkspace = (workspace) => {
    AllWorkspace.value.push(workspace)
  }
  const removeWorkspace = (index) => {
    AllWorkspace.value.splice(index, 1)
  }

  const nextWorkspace = () => {
    if (currentWorkspaceIndex.value < AllWorkspace.value.length - 1) {
      currentWorkspaceIndex.value++
    } else {
      currentWorkspaceIndex.value = 0 // Cycle back to the first workspace
    }
  }

  const previousWorkspace = () => {
    if (currentWorkspaceIndex.value > 0) {
      currentWorkspaceIndex.value--
    } else {
      currentWorkspaceIndex.value = AllWorkspace.value.length - 1 // Cycle back to the last workspace
    }
  }

  return {
    AllWorkspace,
    currentWorkspaceIndex,
    setAllWorkspace,
    setCurrentWorkspaceIndex,
    addWorkspace,
    removeWorkspace,
    nextWorkspace,
    previousWorkspace
  }
})
