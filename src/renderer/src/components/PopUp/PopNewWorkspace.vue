<script setup>
import { onUnmounted, ref } from 'vue';
import { computed } from 'vue';

import { usePopStore } from "../../store/PopStore";
import { useWorkspaceStore } from '../../store/WorkSpace';

const PopStore = usePopStore();
const workspaceStore = useWorkspaceStore()


const workspaceName = ref('');


const isValidWorkspaceName = computed(() => {
  return workspaceStore.AllWorkspace.every((workspace) => workspace.name !== workspaceName.value);
});

function handleSubmit() {
  if (!isValidWorkspaceName.value) {
    console.error('Workspace name already exists');
    return;
  }
  console.log('Workspace Name:', workspaceName.value);
  workspaceStore.addWorkspace({name:workspaceName.value})
  PopStore.setIsPopUp(false);
}

onUnmounted(() => {
  PopStore.setIsWorkspacePop(false);
});

</script>

<template>

  <form @submit.prevent="handleSubmit">
    <label for="workspaceName">New Workspace Name:</label>
    <input type="text" id="workspaceName" v-model="workspaceName" required />
    <span v-if="workspaceName">
      <div class="wst"  v-if="isValidWorkspaceName">Workspace name is available</div>
      <div class="wsf"  v-else>Workspace name already exists</div>
    </span>
    <button type="submit">Submit</button>
  </form>


</template>


<style scoped>

.wst{
  color: #56FFAE;
  font-size: 13px;
}

.wsf{
  color: #FF565D;
  font-size: 13px;

}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* width: ; */
  margin: 10px auto;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: whitesmoke;
}

input {
  width: 300px;


  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid #2D2C35;
  border-radius: 10px;
  color: #ADACB3;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #CDC6F7;
  box-shadow: 0 0 0 2px rgba(205, 198, 247, 0.2);
}

input::placeholder {
  color: #6C6B73;
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
