<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  handleSelector: {
    type: String,
    default: '.drag-handle'
  }
})

const wrapperRef = ref(null)
const isDragging = ref(false)
const position = ref({ x: 0, y: 0 })
const dragStart = ref({ x: 0, y: 0 })
let handle = null

function startDragging(event) {
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  }

  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDragging)
}

function drag(event) {
  if (!isDragging.value) return

  event.preventDefault()

  position.value = {
    x: event.clientX - dragStart.value.x,
    y: event.clientY - dragStart.value.y
  }
}

function stopDragging() {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDragging)
}

onMounted(() => {
  handle = wrapperRef.value.querySelector(props.handleSelector)
  if (!handle) {
    console.warn(`DraggableWrapper: No element found with selector "${props.handleSelector}"`)
    return
  }

  handle.addEventListener('mousedown', startDragging)
})

onBeforeUnmount(() => {
  if (handle) {
    handle.removeEventListener('mousedown', startDragging)
  }
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDragging)
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="draggable-wrapper"
    :style="{
      transform: `translate(${position.x}px, ${position.y}px)`,
      cursor: isDragging ? 'grabbing' : 'auto'
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.draggable-wrapper {
  position: absolute;
  user-select: none;
  touch-action: none;
}
</style>
