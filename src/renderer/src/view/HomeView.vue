<script setup>
import Aura from '../components/Aura.vue';
import Chat from '../components/Chat.vue';
import Footer from '../components/Footer.vue';
import { useAppBasic } from '../store/AppBasicStore';


const AppBasic = useAppBasic()

</script>

<template>
  <Aura/>
  <Footer/>
  <Transition>
    <Chat  v-if="AppBasic.isChatBox" />
  </Transition>
</template>



<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity var(--ani-time) ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;

}
</style>
