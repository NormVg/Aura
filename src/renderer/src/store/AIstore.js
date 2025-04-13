import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAiStore = defineStore('ai-store', () => {
  const isRunningAi = ref(false)
  const AiVoiceAudio = ref(undefined)

  const AiContextBar = ref([])



  const setAiContextBar = (param) => {
    AiContextBar.value = param
  }

  const AddAiContextBar = (param) => {
    AiContextBar.value.push(param)
  }

  const removeAiContextBar = (param) => {

    AiContextBar.value.splice(param, 1)

  }

  const setAiVoiceAudio = (param) => {
    AiVoiceAudio.value = param
  }


  const setIsRunningAi = (param )=>{
      isRunningAi.value = param
  }


  return {
    isRunningAi, setIsRunningAi,
    AiVoiceAudio, setAiVoiceAudio,

    AiContextBar, setAiContextBar,
    AddAiContextBar,removeAiContextBar

   }
})
