
<script setup>
import { useAiStore } from '../store/AIstore';
import cancleBtn from '../assets/icon/cancel.svg';

const AiStore = useAiStore()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})


console.log(props.index);

const HandleDelete = () => {
  console.log("delete",props.index);
  AiStore.removeAiContextBar(props.index)
};


</script>

<template>

    <div id="reply-context" :title="props.item.text" >
      replying <span>{{ props.item.text }}</span>
      <div id="img-box">

        <img :src="cancleBtn" @click="HandleDelete" title="remove" />
      </div>
    </div>
</template>

<style scoped>
#img-box{
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid salmon; */
}
img{
  position: absolute;
  margin-right: 10px;
  transition: all 0.2s ease-in-out;
  height: 20px;
  opacity: 0;
}


#reply-context:hover img:active{
  background-color: #000000;
}

#reply-context:hover img{
  opacity: 1;
  cursor: pointer;
  background-color: #3f3f42;
  border-radius: 100%;

}

#reply-context{
  height: 30px;
  width: max-content;
  max-width: 200px;
  min-width: 100px;
  font-size: 13px;

  padding: 0 10px;
  background: linear-gradient(to right, #1E1E20, #343438);
  /* background: #343438; */

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

span{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-left: 5px;
  color: whitesmoke;
}

#reply-context:hover{
  background: #3f3f42;
  cursor: pointer;
}

</style>
