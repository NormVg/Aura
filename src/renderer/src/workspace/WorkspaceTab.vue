<script setup>
import { computed, inject, onMounted, onUnmounted } from "vue";

const prop = defineProps({
  WinID: {},
  cstyle: {
    typeof: String,
    default: "",
  },
});

const { TabNow, TabList, registerTab, removeTab } = inject("tab-manager");

onMounted(() => {
  registerTab(prop.WinID);

});

onUnmounted(() => {
  removeTab(prop.WinID);

});

const isActive = computed(() => {

  return TabList.value.findIndex(tab => tab.name === prop.WinID) === TabNow.value
    ? true : false;
});


// const isActive = computed(() => {
//   return TabList.value.indexOf(prop.WinID) === TabNow.value
//     ? prop.cstyle + "display:block;"
//     : prop.cstyle + "display: none;";
// });

</script>

<template>
  <Transition >
    <div class="tab-manager-child"  v-if="isActive">
      <slot> </slot>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  /* transition-delay:  1s ; */

  transition: opacity var(--ani-time) ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
