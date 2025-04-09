import ElevenLabs from "elevenlabs-node";

import {markdownToTxt} from 'markdown-to-txt';

import { EdgeTTS } from '@andresaya/edge-tts';

// Function to clean Markdown and remove unnecessary elements
function cleanMarkdown(md) {
  return md
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks (``` code ```)
       // Replace inline code (`code`) with normal words
       .replace(/`[^`]+`/g, (match) => match.slice(1, -1))
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images (![alt](url))
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // Remove links but keep text [text](url) → text
      .replace(/^>\s?/gm, '') // Remove blockquotes ("> text")
      .replace(/\s+/g, ' ') // Remove extra whitespace
      .trim(); // Trim leading/trailing whitespace
}

export async function generateSpeech(md) {

  const tts = new EdgeTTS();

  const cleanedMarkdown = cleanMarkdown(md);
  const NormalText = markdownToTxt(cleanedMarkdown)

  await tts.synthesize(NormalText, 'hi-IN-MadhurNeural', {
      rate: '18%',
      volume: '0%',
      pitch: '-2Hz'
  });



  await tts.toFile("./resources/tts_audio");

}


export async function generateSpeech11Labs(textInput) {
  const NormalText = markdownToTxt(textInput)


  const apiKey = "sk_36f1538e756de3a7374976dd79eec39a8d6da472d507e18f";
  const voiceId = "ypnkIsDASPgHZuanrF0q";
  const fileName = "./resources/tts_audio.mp3";


  const voice = new ElevenLabs({
    apiKey: apiKey, // Your API key from Elevenlabs
    voiceId: voiceId, // A Voice ID from Elevenlabs
  });

  return await voice.textToSpeech({
    // Required Parameters
    fileName: fileName, // The name of your audio file
    textInput: NormalText,
    speed:1.15,
    stability: 0.5, // The stability for the converted speech
    similarityBoost: 0.5, // The similarity boost for the converted speech
    modelId: "eleven_multilingual_v2", // The ElevenLabs Model ID
    style: 1, // The style exaggeration for the converted speech
    speakerBoost: true,
  });
}

// // Example usage
// generateSpeech(
//   "audio.mp3",
//   "Sir, koi naye emails aaye hain jo aapke admit card se related ho sakte hain. Aap chahenge ki main aapke unread emails ki list fetch karun ya aapko sirf most relevant mail bataun?"
// ).then((res) => {
//   console.log(res);
// });
