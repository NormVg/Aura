<script setup>
import { computed } from 'vue';
import cancleBtn from '../assets/icon/cancel.svg';
import { useWorkspaceStore } from '../store/WorkSpace';

const props = defineProps({
  item: {
    type: Object,
  },
  index: {
    type: Number,
  },
})


const workspaceStore  = useWorkspaceStore()
const removeWorkspace = ()=>{
  console.log(props.item.name)
  workspaceStore.workspaceExists(props.item.name) ? workspaceStore.removeWorkspaceWithName(props.item.name):0

}

const isActiveStyle = computed(() => {
  return workspaceStore.currentWorkspaceIndex === props.index ? 'border: 1px solid #ba9efe70' : 'border: none';
})


</script>

<template>
<div id="wtab" :style="isActiveStyle" @click="workspaceStore.setCurrentWorkspaceIndex(props.index)" >

  <span>
    {{ props.item.name }}
  </span>


  <div id="img-box">
    <img :src="cancleBtn" @click="removeWorkspace" title="remove" />
  </div>

</div>
</template>

<style scoped>
#wtab{
  height: 30px;
  width: max-content;
  max-width: 200px;
  min-width: 120px;
  font-size: 13px;

  padding: 0 10px;
  background: linear-gradient(to right, #1E1E20, #343438);
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left:5px ;
  margin-right: 5px;
  user-select: none;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
}
#wtab:hover{
  background: #3f3f42;
  cursor: pointer;
}

#img-box{
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid salmon; */
}
img{
  /* position: absolute */
  /* margin-right: 10px; */
  transition: all 0.2s ease-in-out;
  height: 20px;
  opacity: 0;
}


#wtab:hover img:active{
  background-color: #000000;
}

#wtab:hover img{
  opacity: 1;
  cursor: pointer;
  background-color: #3f3f42;
  border-radius: 100%;

}

span{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-left: 5px;
  /* color: whitesmoke; */
}

</style>
