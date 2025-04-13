import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePluginStore = defineStore('plugin-store', () => {

  const pluginList = ref([])

  const ActivePlugins = ref([])


  const setActivePlugins = (param)=>{
    ActivePlugins.value= param
  }

  const addPlugin = (plugin) => {

      ActivePlugins.value.push(plugin)

  }

  const removePlugin = (index) => {
    ActivePlugins.value.splice(index, 1)
  }


  const setPluginList = (list) => {
    pluginList.value = list
  }



  return {
    pluginList,
    setPluginList,

    setActivePlugins,
    removePlugin,
    addPlugin,
    ActivePlugins
  }

})
