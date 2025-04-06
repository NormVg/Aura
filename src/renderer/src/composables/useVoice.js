import { ref } from "vue";



export function useVoice() {

  const AudioSrc = ref(null)

  const GoogleSST = async () => {
    const resp = await window.electron.ipcRenderer.invoke("sst");
    console.log(resp);
    return resp;

  };

  const TTS = async (text) => {


    const resp = await window.electron.ipcRenderer.invoke("tts", text);
    console.log(resp)

    AudioSrc.value = `data:audio/mp3;base64,${resp}`;
    // AudioSrc.value = resp

  };

  return { GoogleSST, TTS ,AudioSrc};
}
