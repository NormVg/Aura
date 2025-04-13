<script setup>
import { computed, ref,watch } from "vue";

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
  idImg: {
    default: "",
  },
  hover: {
    type: Boolean,
    default: false,
  },
  watcher: {
    type: Boolean,
    default: undefined,
  },
});

const emit = defineEmits(["event"]);




const currentState = ref(false);


if (typeof props.watcher === "boolean") {
  watch(() => props.watcher,() => currentState.value = props.watcher);
}

// const currentIcon = computed(() => {
//   return currentState.value ? props.tIcon : props.nIcon;
// });

const toggleState = () => {
  currentState.value = !currentState.value;
  emit("event", currentState.value);
};

const handleMouseEnter = async () => {
  if (props.hover) {
    currentState.value = true;
    emit("event", currentState.value);
  }
};

const waitOneSecond = async () => {
  return new Promise((resolve) => setTimeout(resolve,100));
};

const handleMouseLeave = async () => {
  if (props.hover){
    await waitOneSecond()
    currentState.value = false;
    emit("event", currentState.value);
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

  <!-- <Transition name="bounce"> -->
    <img :src="props.tIcon" v-if="currentState"  />
    <img :src="props.nIcon" v-else />
  <!-- </Transition> -->


  </div>
</template>

<style scoped>
img {
  width: 25px;
}



</style>
