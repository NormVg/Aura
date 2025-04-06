// useAudioRecorder.js
import { ref, onUnmounted } from 'vue';

export function useAudioRecorder() {
  const isRecording = ref(false);
  const audioChunks = ref([]);
  const mediaRecorder = ref(null);
  const recordingTime = ref(0);
  const timerInterval = ref(null);
  const audioContext = ref(null);

  // Audio settings
  const sampleRate = 44100; // Standard sample rate
  const channelCount = 1;   // Mono recording for simplicity

  // Initialize the media recorder and audio context
  const initRecorder = async () => {
    try {
      // Create audio context
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: sampleRate
      });

      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: channelCount,
          sampleRate: sampleRate,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Create media recorder with specified MIME type
      mediaRecorder.value = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'  // Use a widely supported format for recording
      });

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data);
        }
      };

      return true;
    } catch (error) {
      console.error('Error initializing audio recorder:', error);
      return false;
    }
  };

  // Start recording
  const startRecording = async () => {
    if (mediaRecorder.value === null) {
      const initialized = await initRecorder();
      if (!initialized) return false;
    }

    audioChunks.value = [];
    recordingTime.value = 0;

    timerInterval.value = setInterval(() => {
      recordingTime.value += 1;
    }, 1000);

    mediaRecorder.value.start(100); // Collect data every 100ms
    isRecording.value = true;

    return true;
  };

  // Create WAV file header
  const createWavHeader = (audioData) => {
    const bytesPerSample = 2; // 16-bit audio
    const dataSize = audioData.length;
    const fileSize = 44 + dataSize; // 44 bytes for header + data size

    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');                   // ChunkID
    view.setUint32(4, fileSize - 8, true);          // ChunkSize
    writeString(view, 8, 'WAVE');                   // Format

    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');                  // SubchunkID
    view.setUint32(16, 16, true);                   // SubchunkSize (16 for PCM)
    view.setUint16(20, 1, true);                    // AudioFormat (1 for PCM)
    view.setUint16(22, channelCount, true);         // NumChannels
    view.setUint32(24, sampleRate, true);           // SampleRate
    view.setUint32(28, sampleRate * bytesPerSample * channelCount, true); // ByteRate
    view.setUint16(32, bytesPerSample * channelCount, true);  // BlockAlign
    view.setUint16(34, bytesPerSample * 8, true);   // BitsPerSample

    // "data" sub-chunk
    writeString(view, 36, 'data');                  // SubchunkID
    view.setUint32(40, dataSize, true);             // SubchunkSize

    return new Uint8Array(header);
  };

  // Helper to write strings to DataView
  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Convert recorded audio to a WAV file
  const convertToWav = async (audioBlob) => {
    // First decode the audio data from the blob
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioData = await audioContext.value.decodeAudioData(arrayBuffer);

    // Get raw PCM data
    const channels = [];
    for (let i = 0; i < channelCount; i++) {
      channels.push(audioData.getChannelData(i));
    }

    // Interleave channels and convert to 16-bit
    const interleaved = new Int16Array(audioData.length * channelCount);
    let index = 0;

    for (let i = 0; i < audioData.length; i++) {
      for (let channel = 0; channel < channelCount; channel++) {
        // Convert float32 [-1,1] to int16 [-32768,32767]
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        interleaved[index++] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      }
    }

    // Create WAV header
    const wavHeader = createWavHeader(interleaved.buffer);

    // Combine header and audio data
    const wavFile = new Uint8Array(wavHeader.length + interleaved.buffer.byteLength);
    wavFile.set(wavHeader);
    wavFile.set(new Uint8Array(interleaved.buffer), wavHeader.length);

    return wavFile;
  };

  // Stop recording and save to file via IPC
  const stopRecording = async () => {
    if (!mediaRecorder.value || mediaRecorder.value.state === 'inactive') {
      return null;
    }

    return new Promise((resolve) => {
      mediaRecorder.value.onstop = async () => {
        clearInterval(timerInterval.value);

        try {
          // Combine audio chunks and convert to WAV
          const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm;codecs=opus' });

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const tempDir = window.os.tmpdir();
          const filePath = window.path.join(tempDir, `recording-${timestamp}.wav`);

          // Convert recording to WAV format with proper headers
          const wavData = await convertToWav(audioBlob);

          // Send data to main process via IPC
          window.electron.ipcRenderer.send('save-audio', {
            buffer: Array.from(wavData),  // Convert to array for IPC transfer
            filePath,
            duration: recordingTime.value
          });

          // Set up a one-time listener for the response
          window.electron.ipcRenderer.once('save-audio-response', (_, response) => {
            isRecording.value = false;
            resolve(response);
          });
        } catch (error) {
          console.error('Error processing audio:', error);
          isRecording.value = false;
          resolve({
            success: false,
            error: error.message || 'Failed to process audio recording'
          });
        }
      };

      mediaRecorder.value.stop();
    });
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
      mediaRecorder.value.pause();
      clearInterval(timerInterval.value);
      return true;
    }
    return false;
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorder.value && mediaRecorder.value.state === 'paused') {
      mediaRecorder.value.resume();
      timerInterval.value = setInterval(() => {
        recordingTime.value += 1;
      }, 1000);
      return true;
    }
    return false;
  };

  // Cleanup on unmount
  onUnmounted(() => {
    if (mediaRecorder.value) {
      if (mediaRecorder.value.state !== 'inactive') {
        mediaRecorder.value.stop();
      }

      // Stop all tracks of the stream
      mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    }

    if (timerInterval.value) {
      clearInterval(timerInterval.value);
    }

    // Close audio context
    if (audioContext.value) {
      audioContext.value.close();
    }

    // Remove any event listeners
    window.electron.ipcRenderer.removeAllListeners('save-audio-response');
  });

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
  };
}
