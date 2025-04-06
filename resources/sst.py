import speech_recognition as sr
import sys
import json



def recognize_speech_from_wav(file_path):
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(file_path) as source:
            print("Processing audio...")
            audio_data = recognizer.record(source)  # Read the entire file

            # Perform speech recognition using Google Web Speech API
            text = recognizer.recognize_google(audio_data)
            print("Recognized Text:")
            print(text)


        print(json.dumps({"success": True, "transcription": text}))
    except sr.UnknownValueError:
        print(json.dumps({"success": False, "error": "Could not understand audio"}))
    except sr.RequestError:
        print(json.dumps({"success": False, "error": "API request failed"}))




if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: sst <path_to_wav_file>")
    else:
        recognize_speech_from_wav(sys.argv[1])


