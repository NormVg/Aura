import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu-store', () => {
  const isMenu = ref(false)
  const isHover = ref(false)

  const setIsHover = (params) => {
    isHover.value = params
  }
  const SetIsMenu =  (params) => {
    isMenu.value = params
  }

  return { isMenu,SetIsMenu,isHover,setIsHover }
})
