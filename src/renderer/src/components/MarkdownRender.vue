<script setup>
import '../assets/markdown.css'
// src/renderer/src/assets/markdown.css
import MarkdownItAnchor from 'markdown-it-anchor';
import VueMarkdown from 'vue-markdown-render'

const props = defineProps({
  md:{
    type:String,
    default:""
  }
})



const plugins = [MarkdownItAnchor];

</script>

<template>
  <span class="markdown-content">

    <VueMarkdown :source="props.md" :plugins="plugins" />
  </span>

</template>

<style>
/* @import url(../assets/markdown.css); */
.markdown-content {
  font-family: 'Alef', sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #cdc6f7;
  background: none !important;
  /* margin-bottom: 10vh !important; */
  user-select: text;
}



</style>
