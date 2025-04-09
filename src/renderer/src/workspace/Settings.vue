<template>
  <div id="setting-box">

  <div class="customize-container">
    <h1>Customize Aura AI</h1>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">What You what to call Aura AI</label>
        <input
          type="text"
          id="name"
          v-model="formData.aiName"
          placeholder="Enter Aura AI name"
          required
        >
      </div>

      <div class="form-group">
        <label for="name">What should Aura AI call you?</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          placeholder="Enter your name"
          required
        >
      </div>

      <div class="form-group">
        <label for="occupation">What do you do?</label>
        <input
          type="text"
          id="occupation"
          v-model="formData.occupation"
          placeholder="Engineer, student, etc."
          required
        >
      </div>

      <div class="form-group">
        <label for="traits">What traits should Aura AI have?</label>
        <textarea
          id="traits"
          v-model="formData.traits"
          placeholder="Enter Ai traits and personality"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="preferences">Anything else Aura AI should know about you?</label>
        <textarea
          id="preferences"
          v-model="formData.preferences"
          placeholder="Interests, values, or preferences to keep in mind"
          rows="4"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit">Save Preferences</button>
      </div>
    </form>
  </div>
</div>

</template>

<script setup>
import { onMounted,ref } from 'vue';

onMounted( async () => {

  const userData = await window.electron.ipcRenderer.invoke('read-db',"userSettings")
  formData.value.aiName = userData.aiName;
  formData.value.name = userData.name;
  formData.value.occupation = userData.occupation;
  formData.value.traits = userData.traits;
  formData.value.preferences = userData.preferences;

  console.log(formData.value);
});


const formData = ref({
  aiName:'',
  name: '',
  occupation: '',
  traits: '',
  preferences: ''
});

function submitForm() {
  // Here you would typically send the data to an API
  console.log('Form submitted:', formData);
  // You could add an API call here
  // emit('form-submitted', formData);
// const userData = await window.electron.ipcRenderer.invoke('read-db',"userSettings")
  const resp = {
    aiName: formData.value.aiName,
    name: formData.value.name,
    occupation: formData.value.occupation,
    traits: formData.value.traits,
    preferences: formData.value.preferences
  }

  // console.log({name:"userSettings", data:resp},JSON.stringify({name:"userSettings", data:resp}));

  window.electron.ipcRenderer.invoke('write-db', JSON.stringify({name:"userSettings", data:resp}));

  // For demo purposes, show a success message
  alert('Preferences saved successfully!');
}
</script>

<style scoped>
.customize-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #ADACB3;
  /* color: #ADACB3; */
}

#setting-box{
  background-color: #3A3A3E70;
  background-blend-mode: lighten;
  height: 100%;
  width: 100%;
  border: 1px solid #4E4D54;
  border-radius: 15px;
  overflow: auto;
  scrollbar-width: none;
  font-family: var(--font-name);
}


h1 {
  margin-bottom: 2rem;
  color: #CDC6F7;
  font-size: 1.8rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid #2D2C35;
  border-radius: 10px;
  color: #ADACB3;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #CDC6F7;
  box-shadow: 0 0 0 2px rgba(205, 198, 247, 0.2);
}

input::placeholder, textarea::placeholder {
  color: #6C6B73;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

button {
  background-color: #CDC6F7;
  color: #18171C;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #BDB4F2;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}


</style>
