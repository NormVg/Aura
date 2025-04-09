<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  nIcon: {
    required: true,
  },
  tIcon: {
    required: true,
  },
  idName: {
    default: "",
  },

  imgStyle: {
    default: "",
  },
  hover: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["event"]);

const currentState = ref(false);

const currentIcon = computed(() => {
  return currentState.value ? props.tIcon : props.nIcon;
});

const toggleState = () => {
  currentState.value = !currentState.value;
  // emit("event", currentState.value);
  emit("event", {"state":currentState.value,"set":setCurrentState});

};

const handleMouseEnter = async () => {
  if (props.hover) {
    currentState.value = true;
    // emit("event", currentState.value);
    emit("event", {"state":currentState.value,"set":()=>{}});

  }
};

const waitOneSecond = async () => {
  return new Promise((resolve) => setTimeout(resolve,100));
};

const setCurrentState = (val)=>{
  currentState.value = val;
}

const handleMouseLeave = async () => {
  if (props.hover){
    await waitOneSecond()
    currentState.value = false;
    emit("event", {"state":currentState.value,"set":()=>{}});
  }
};



</script>

<template>
  <div

    :id="props.idName"
    @click="toggleState"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"

  >
    <img :cstyle="imgStyle" :src="currentIcon" />
  </div>
</template>


<style scoped>
img {
  /* border: 1px solid salmon; */
  cursor: pointer;
  /* height: 100%; */
  width: 100%;
}
</style>

