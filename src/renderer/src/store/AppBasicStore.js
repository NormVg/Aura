import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppBasic = defineStore('app-basic-store', () => {
  const isMiddleAiText = ref(false)
  const isChatBox = ref(false)

  const MiddleAiText = ref("")
  
  const setIsChatBox = (param)=>{
    isChatBox.value = param
  }

  const setIsMiddleAiText = (param)=>{
    isMiddleAiText.value = param
  }

  const setMiddleAiText = (param) => {
    MiddleAiText.value = param
  }

  return {
    isMiddleAiText,
    isChatBox,


    MiddleAiText,

    setMiddleAiText,
    setIsMiddleAiText,
    setIsChatBox
  }

})
