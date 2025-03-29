<script setup>
import { computed } from "vue";
import { useMenuStore } from "../store/menuStore";

const menuStore = useMenuStore();

const handleMouseEnter = () => {
  menuStore.setIsHover(true);
};

const handleMouseLeave = () => {
  menuStore.setIsHover(false);
};

const isMenuLocal = computed(() => {
  console.log("local", menuStore.isHover, "menu", menuStore.isMenu);
  if (menuStore.isMenu === false && menuStore.isHover === false) {
    return false;
  } else {
    return true;
  }
});
</script>
<template>
  <Transition>
    <div
      id="app-menu-box"
      v-if="isMenuLocal"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    ></div>
  </Transition>
</template>

<style scoped>
#app-menu-box {
  position: fixed;
  height: 250px;
  /* background-image: url(../assets/img/menu-bg.svg); */
  background-color: var(--sbgc);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform-origin: bottom right;

  transition: ease-in-out 400ms;
  right: 0%;
  bottom: 13px;
  width: 250px;
  border-top-left-radius: 300px;
}

#app-menu-box:hover {
  transform: rotate(0deg);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
  scale: 1;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  scale: 0;
}

/*
.v-enter-from {
  filter: blur(40px);
  opacity: 0;

  transform: rotate(90deg);
}
.v-enter-to {
  filter: blur(0);
  opacity: 1;

  transform: rotate(0deg);
}

.v-leave-from {
  filter: blur(0);
  opacity: 1;
  transform: rotate(0deg);
}

.v-leave-to {
  filter: blur(40px);
  opacity: 0;

  transform: rotate(-90deg);
} */
/* .v-enter-active,
.v-leave-active {
  transform: rotate(0deg);
}

.v-enter-from,
.v-leave-to {
  transform: rotate(90deg);
} */
/*
@keyframes rotateAnimationIn {
  from {
    transform: rotate(90deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes rotateAnimationOut {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
} */
</style>
