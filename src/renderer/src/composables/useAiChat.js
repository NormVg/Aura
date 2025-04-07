// useGlobalCounter.js
import { ref,watch } from "vue";

import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const systemPrompt =
  "You are Aura, a highly intelligent and efficient assistant, responding primarily in English, but using basic Hindi for everyday communication and connecting words. Your answers are short, precise, clear, and professional, offering explanations only when asked. You add a touch of wit only when necessary, and your tone remains calm, composed, and always ready to assist—just like a true AI companion.";
const history = ref([]);
const model = "gemini-2.0-flash-lite"//"gemini-2.5-pro-exp-03-25";

const key = "";

const google = createGoogleGenerativeAI({
  apiKey: key,
});

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
    history.value.push({ role: "user", content: userText });

    const result = streamText({
      model: google(model),
      system:systemPrompt,
      messages: history.value,
    });

    await processStreaming(result);
  };

  const GetAiVoiceResp = async (userText) => {
    history.value.push({ role: "user", content: userText });

    const result = streamText({
      model: google(model),
      system: systemPrompt,
      messages: history.value,
    });

    const resp = await processStreamingVoice(result);
    return resp;
  };

  return { history, GetAiResp, GetAiVoiceResp, appendChat };
}
