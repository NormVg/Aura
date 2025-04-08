
<script setup>

</script>


<template>
<div class="workspace-area">
  <slot></slot>
</div>
</template>

<style scoped >

.workspace-area {
  /* border: 1px solid red; */
  width: 98vw;
  height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

</style>
