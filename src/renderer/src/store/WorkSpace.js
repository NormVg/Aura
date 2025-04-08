import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWorkspaceStore = defineStore('workspace-store', () => {
  const AllWorkspace = ref([{"name":'home'}])
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

  const removeWorkspaceWithIndex = (index) => {
    AllWorkspace.value.splice(index, 1)
  }

  const removeWorkspaceWithName = (workspaceName) => {
    const index = AllWorkspace.value.findIndex(workspace => workspace.name === workspaceName)
    if (index !== -1) {
      AllWorkspace.value.splice(index, 1)
    }
    setCurrentWorkspaceIndex(index - 1)
  }

  const workspaceExists = (workspaceName) => {
    return AllWorkspace.value.some(workspace => workspace.name === workspaceName)
  }

  const getWorkspaceIndexByName = (workspaceName) => {
    return AllWorkspace.value.findIndex(workspace => workspace.name === workspaceName)
  }

  const setCurrentWorkspaceByName = (workspaceName) => {
    const index = getWorkspaceIndexByName(workspaceName)
    if (index !== -1) {
      currentWorkspaceIndex.value = index
    }
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
    removeWorkspaceWithIndex,
    removeWorkspaceWithName,
    workspaceExists,
    nextWorkspace,
    previousWorkspace,
    getWorkspaceIndexByName,
    setCurrentWorkspaceByName
  }
})
