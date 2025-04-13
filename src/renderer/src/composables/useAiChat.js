// useGlobalCounter.js
import { ref,watch } from "vue";

import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";




// const systemPrompt =  "You are Aura, a highly intelligent and efficient assistant, responding primarily in English, but using basic Hindi for everyday communication and connecting words. Your answers are short, precise, clear, and professional, offering explanations only when asked. You add a touch of wit only when necessary, and your tone remains calm, composed, and always ready to assist—just like a true AI companion.";
const history = ref([]);
const model = "gemini-2.0-flash-lite"//"gemini-2.5-pro-exp-03-25";

const key = "";

const google = createGoogleGenerativeAI({
  apiKey: key,
});



async function generateSystemPrompt() {
  const userData = await window.electron.ipcRenderer.invoke('read-db',"userSettings")

  const { aiName , name, occupation, traits, preferences } = userData;
  console.log(aiName , name, occupation, traits, preferences);
  return `
  You are ${aiName}, an AI assistant.
  Address the user as ${name || "User"}.

  The user is a ${occupation || "curious individual"}. Keep that in mind while assisting them.

  Your personality traits are: ${traits || "helpful, intelligent, and friendly"}.

  Additional preferences to consider: ${preferences || "None specified"}.

  Stay aligned with these guidelines while interacting.
  `;
}

const systemPrompt = ref('')
systemPrompt.value = await generateSystemPrompt()


const scrollToBottom = () => {
  const div = document.getElementById("chat-area");
  if (div) {
    div.scrollTo({
      top: div.scrollHeight + 100,
      behavior: "smooth",
    });

    div.scrollIntoView({ behavior: "smooth", block: "end" });
  }
};



async function processStreaming(result) {
  let botResponse = "";
  history.value.push({ role: "assistant", content: "" });

  for await (const delta of result.textStream) {

    botResponse += delta;
    var message = history.value;
    message[message.length - 1].content = botResponse;
    history.value = message;
    console.log(message);
  }

}

async function processStreamingVoice(result) {
  let botResponse = "";
  for await (const delta of result.textStream) {

    botResponse += delta;
  }
  return botResponse;
}


export function useAiChat() {

    watch(history.value, () => {
    console.log('CHANGED');
    scrollToBottom()
  },{deep:true});

  const appendChat = (role, content) => {
    history.value.push({ role, content });
  };

  const GetAiResp = async (userText) => {
    systemPrompt.value = await generateSystemPrompt()

    history.value.push({ role: "user", content: userText });

    const result = streamText({
      model: google(model),
      system:systemPrompt.value,
      messages: history.value,
    });

    await processStreaming(result);
  };

  const GetAiVoiceResp = async (userText) => {
    systemPrompt.value = await generateSystemPrompt()

    history.value.push({ role: "user", content: userText });

    const result = streamText({
      model: google(model),
      system: systemPrompt.value,
      messages: history.value,
    });

    const resp = await processStreamingVoice(result);
    return resp;
  };


  const PlayAiVoice = () => {
    // setTimeout(() => {
      const audio = document.getElementById("audio-tts");
      console.log("Playing audio",audio.src);
      audio.play();
    // }, 5000);
    // audio.play();
  }

  const StopAiVoice = () => {
    const audio = document.getElementById("audio-tts");
    audio.pause();
  }

  const MuteAiVoice = () => {
    const audio = document.getElementById("audio-tts");

    audio.muted = true;
    // audio.volume = 0;
  };

  const UnmuteAiVoice = () => {
    const audio = document.getElementById("audio-tts");

    audio.muted = false;
    // audio.volume = 1;


  };

  return { history, GetAiResp, GetAiVoiceResp, appendChat ,PlayAiVoice , StopAiVoice, MuteAiVoice, UnmuteAiVoice};
}
