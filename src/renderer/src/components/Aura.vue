
<script setup>

import AuraChar from "../assets/img/auraCar.svg"
</script>


<template>
  <div>
    <img :src="AuraChar" alt="Aura logo">
  </div>
</template>

<style scoped>
div{
  z-index: var(--z-logo);
}
img{
  height: 50px;
  position: fixed;
  right: 0;
  margin: 30px;
  z-index: var(--z-logo);

}
</style>
