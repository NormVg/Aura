import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAiStore = defineStore('ai-store', () => {
  const isRunningAi = ref(false)
  const isLoadingAi = ref(false)

  const setIsLoadingAi = (param) => {
    isLoadingAi.value = param
  }

  const setIsRunningAi = (param )=>{
      isRunningAi.value = param
  }


  return { isRunningAi, setIsRunningAi ,isLoadingAi ,setIsLoadingAi}
})
