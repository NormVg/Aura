import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePopStore = defineStore('popup-store', () => {
  const isPopUp = ref(false)

  const isWorkspacePop = ref(false)




  const setIsPopUp = (value) => {
    isPopUp.value = value
  }




  const setIsWorkspacePop = (value) => {
    isWorkspacePop.value = value
  }
  return {
    isWorkspacePop,
    setIsWorkspacePop,
    isPopUp,
    setIsPopUp,

   }
})
