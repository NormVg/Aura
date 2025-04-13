<script setup>
import MarkdownRender from "./MarkdownRender.vue";

import clipIcon from "../assets/icon/clip.svg";
import clipOutlineIcon from "../assets/icon/clip-outline.svg";
import replyIcon from "../assets/icon/reply.svg";
import speakIcon from "../assets/icon/speak.svg";
import dltIcon from "../assets/icon/dlt.svg";
import dltOutlineIcon from "../assets/icon/dlt-outline.svg";
import StopBtn from "../assets/icon/stop.svg";

import { ref } from "vue";
import { useAiStore } from "../store/AIstore";
import { useVoice } from "../composables/useVoice";
import { useAiChat } from "../composables/useAiChat";
import { useGetLocalFile } from "../composables/useGetLocalFile";

const AiStore = useAiStore()

const  {  TTS  ,AudioSrc} = useVoice()
const { PlayAiVoice ,StopAiVoice}  = useAiChat()

const { GetLocalFile} = useGetLocalFile()

const props = defineProps({
  role: {
    type: String,
  },
  content: {
    type: String,
  },
  index: {
    type: Number,
  }
});

const ActiveClip = ref(false);
const ActiveSpeak = ref(false);
const ActiveDelete = ref(false);

const handleClip = () => {
  ActiveClip.value = true;
  navigator.clipboard
    .writeText(props.content)
    .then(() => {
      console.log("Content copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy content: ", err);
    });

  setTimeout(() => {
    ActiveClip.value = false;
  }, 400);
};

const handleReply = () => {
  console.log("reply");

  const existingItem = AiStore.AiContextBar.find(
    (item) => item.type === "reply" && item.id === props.index
  );

  if (!existingItem) {
    console.log("Item not exists in the context bar");

    AiStore.AddAiContextBar({
    type: "reply",
    text: props.content,
    id: props.index,
      });
  }



};

const handleSpeak = async () => {
  ActiveSpeak.value = true;
  console.log("speak");

  await TTS(props.content);

// AiStore.setAiVoiceAudio(AudioSrc.value);
  await StopAiVoice()
  await AiStore.setAiVoiceAudio(GetLocalFile(AudioSrc.value))

  await PlayAiVoice()
  ActiveSpeak.value = false;
};

const handleDelete = () => {
  console.log("delete");
};


</script>

<template>
  <div :id="props.role === 'user' ? 'user-msg' : 'ai-msg'">
    <div id="msg-box">
      <MarkdownRender :md="props.content" />
    </div>

    <div id="img-btn-box" v-if="!AiStore.isRunningAi">
      <div id="img-btn" @click="handleClip">
        <img v-if="ActiveClip" :src="clipIcon" />
        <img v-else :src="clipOutlineIcon" />
      </div>

      <!-- <div id="img-btn" @click="handleDelete">
        <img v-if="ActiveDelete" :src="dltIcon" />
        <img v-else :src="dltOutlineIcon" />
      </div> -->

      <div id="img-btn" @click="handleSpeak">
        <img v-if="ActiveSpeak" :src="StopBtn" />
        <img v-else :src="speakIcon" />
      </div>

      <div id="img-btn" @click="handleReply">
        <img :src="replyIcon" />
      </div>



    </div>
  </div>
</template>

<style scoped>
#img-btn-box {
  /* border: 1px solid salmon; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: max-content;
  height: max-content;
}

#img-btn {
  width: 20px;
  transition: all ease-in-out 200ms;
  margin-right: 10px;
}
#img-btn img {
  /* border: 1px solid salmon; */
  width: 100%;
}
#img-btn:hover {
  scale: 1.051;
}
#img-btn:active {
  scale: 0.9;
}

#ai-msg {
  /* border:1px solid salmon ; */
  width: 99%;
  height: max-content;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: #cdc6f7;
  flex-direction: column;
}

#ai-msg #msg-box {
  text-align: left;
  /* border: 1px solid salmon; */
  height: 100%;
  width: 100%;
}

#user-msg {
  /* border:1px solid salmon ; */
  width: 99%;
  /* overflow-x: scroll; */
  height: max-content;
  display: flex;
  justify-content: right;
  align-items: center;

  align-items: flex-end;
  color: #cdc6f7;
  flex-direction: column;
  /* justify-items: flex-start; */
}

#user-msg > #msg-box {
  max-width: 96%;
  width: max-content;
  /* overflow: scroll; */
  height: max-content;
  background-color: var(--sbgc);
  padding: 10px;
  padding-bottom: 0;
  border-radius: 10px;
  text-align: left;
  min-width: 110px;
  margin-bottom: 5px;
}
</style>
