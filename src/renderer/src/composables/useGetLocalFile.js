import { ref } from "vue";

const pluginPath = ref(undefined);

window.electron.ipcRenderer
.invoke("get-user-data-path")
.then((dbPath) => {
  return window.path.join(dbPath, "plugins");
})
.then((filePathPart) => {
  const fullPath = window.path.resolve(filePathPart);

  pluginPath.value = fullPath;
});

export function useGetLocalFile() {



  const GetLocalFile = (filePath) => {
    const file = "file://" + filePath + "?time=" + new Date().getTime();
    return file;
  };

  const ResolvePluginPath = (filePath, name) => {
    const file = `file://${pluginPath.value}/${name}/${filePath}`;

    // console.log("Resolved file path:", file);
    return file
  };

  return { GetLocalFile, ResolvePluginPath };
}
