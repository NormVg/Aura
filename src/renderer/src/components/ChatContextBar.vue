<script setup >
import { computed, ref } from 'vue';
import ReplyContext from './ReplyContext.vue';
import { useAiStore } from '../store/AIstore';


const AiStore = useAiStore()

const isContextBar = computed(() => {
  return AiStore.AiContextBar.length > 0
})

// const AiStore = useAiStore()

</script>

<template>
<Transition>
  <div id="context-box" v-if="isContextBar">

    <span v-for="item,index in AiStore.AiContextBar" :key="item">

      <ReplyContext v-if="item.type === 'reply'" :item="item" :index="index" />

    </span>


  </div>
</Transition>

</template>

<style scoped>
#context-box{

  max-width: 50vw;
  width: min(50vw , 75%);
  transform: translate(0,-55px);
  height: 40px;
  position: absolute;
  background-color: #1e1e20;
  border-radius: 10px;

  /* padding: 0 10px; */
  overflow-x: auto;
  scrollbar-width: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;

}
</style>
