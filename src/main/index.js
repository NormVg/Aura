import { app, shell, BrowserWindow, ipcMain,globalShortcut } from 'electron'
import { join,resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from "fs";
import os from "os"
import path from "path"

const { execFile } = require("child_process");
import {generateSpeech} from "./tts"


const userDataPath = app.getPath('userData');
const inDevPath = `./userData/`
const AppResoursePath = app.isPackaged ? userDataPath : inDevPath;
const pluginPath = join(AppResoursePath, 'plugins');
console.log(AppResoursePath)




function ensurePathExists(targetPath) {
  console.log("Ensuring path exists:", targetPath);
  const dirPath = path.dirname(targetPath);

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // If it's a file path, ensure the file exists
  if (!fs.existsSync(targetPath)) {


    if (path.basename(targetPath) === "userSettings.json") {
      fs.writeFileSync(
        targetPath,
        JSON.stringify({
          aiName: "",
          name: "",
          occupation: "",
          traits: "",
          preferences: ""
        }, null, 2)
      );
    }
      else {
      fs.writeFileSync(targetPath, '');
    }

  }

  return targetPath;
}


function executeSST(filePath, audioFile) {
  return new Promise((resolve, reject) => {
    execFile(filePath, [audioFile], (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }

      try {
        const outputJson = JSON.parse(stdout);
        console.log("Output JSON:", outputJson.success);
        resolve(outputJson);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError.message);
        reject(parseError);
      }
    });
  });
}



function ReadWebAppDb(name) {


  var  dbpath = join(AppResoursePath, `aura_db/${name}.json`);
  dbpath = ensurePathExists(dbpath);



  var data = fs.readFileSync(dbpath, "utf8");
  var output = JSON.parse(data);
  console.log(output);
  return output;
}

function WriteWebAppDb(name, output) {
  var dbpath = join(AppResoursePath,`aura_db/${name}.json`)

  dbpath = ensurePathExists(dbpath);

    let data = JSON.stringify(output, null, 2);
    fs.writeFileSync(dbpath, data);
  }


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      webviewTag: true,
      contextIsolation:false,
      // allowRunningInsecureContent: true,
      webSecurity:false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })


ipcMain.handle('get-user-data-path', async () => {
  console.log('Received request for DB path in main process',AppResoursePath);
  return AppResoursePath
})

  ipcMain.handle('tts', async (event, arg) => {

    var dbpath = join(AppResoursePath,`aura_files/tts_audio.mp3`)
    dbpath = ensurePathExists(dbpath);

    console.log('Received request in main process',arg);


    await generateSpeech(arg,join(AppResoursePath,'aura_files'))

    dbpath = path.resolve(process.cwd(), dbpath);

    return dbpath

    // const fileBuffer = fs.readFileSync(dbpath); // Read audio file synchronously
    // const base64Audio = fileBuffer.toString('base64'); // Convert buffer to base64 string
    // return base64Audio; // Return base64 string to the renderer

  });


  ipcMain.handle('sst', async (event, arg) => {
    console.log('Received request in main process');

    var dbpath = join(AppResoursePath,`aura_files/temp_audio.wav`)
    dbpath = ensurePathExists(dbpath);

    const outputJson = await executeSST("./resources/sst", dbpath)
    return outputJson
  });


  ipcMain.handle("read-db", async (e, r) => {
    const reply = ReadWebAppDb(r);
    return reply

  });

  ipcMain.handle("write-db", async (e, r) => {
    const data = JSON.parse(r);
    WriteWebAppDb(data.name, data.data);

    return data.data
  });


ipcMain.handle("load-plugin", async (e, r) => {

  const pluginsList = fs.readdirSync(pluginPath);
  var PluginData = []

  pluginsList.forEach(element => {
    const configPath = join(pluginPath, element,'config.aura.json')
    const configPathExists = fs.existsSync(configPath);
    if (configPathExists) {
      const configData = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configData);
      PluginData.push(config)
      console.log("Plugin Config:", config);
    } else {
      console.error(`Config file does not exist: ${configPath}`);
    }
  });

  console.log("Plugins loaded:", pluginsList);

  return PluginData
})

  // Handle saving audio file

// Set up the IPC handler for saving audio
ipcMain.on('save-audio', (event, data) => {

  var dbpath = join(AppResoursePath,`aura_files/temp_audio.wav`)
  dbpath = ensurePathExists(dbpath);

  try {
    const { buffer, filePath, duration } = data;
    const filePathf = path.resolve(process.cwd(), dbpath);

    // Convert array back to Buffer
    const audioBuffer = Buffer.from(buffer);

    // Write file to disk
    // fs.writeFileSync(filePathf, audioBuffer);
    fs.writeFileSync(filePathf, audioBuffer, { flag: 'w' });
    // Send success response
    event.sender.send('save-audio-response', {
      success: true,
      filePath,
      duration
    });
  } catch (error) {
    console.error('Error saving audio file:', error);
    // Send error response
    event.sender.send('save-audio-response', {
      success: false,
      error: error.message
    });
  }
});




  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')


  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // globalShortcut.register('CommandOrControl+Shift+M', () => {
  //   console.log('Win key + I detected!');
  // });


  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
