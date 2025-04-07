import { app, shell, BrowserWindow, ipcMain,globalShortcut } from 'electron'
import { join,resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from "fs";
import os from "os"
import path from "path"

const AppResoursePath = app.isPackaged ? join(os.homedir(), `ASD`) : `./resources/`;


const { execFile } = require("child_process");

import {generateSpeech} from "./tts"


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
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  ipcMain.handle('tts', async (event, arg) => {
    console.log('Received request in main process',arg);


    await generateSpeech(arg);

    const fileBuffer = fs.readFileSync("./resources/tts_audio.mp3"); // Read audio file synchronously
    const base64Audio = fileBuffer.toString('base64'); // Convert buffer to base64 string
    return base64Audio; // Return base64 string to the renderer

  });


  ipcMain.handle('sst', async (event, arg) => {
    console.log('Received request in main process');


    const outputJson = await executeSST("./resources/sst", './resources/temp_audio.wav')
    return outputJson
  });



  // Handle saving audio file

// Set up the IPC handler for saving audio
ipcMain.on('save-audio', (event, data) => {
  try {
    const { buffer, filePath, duration } = data;
    const filePathf = path.resolve(process.cwd(), 'resources/temp_audio.wav');

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



//   ipcMain.on('save-audio', (event, buffer) => {
//     // const dbpath = join(AppResoursePath,`/temp_audio.wav`)
//     const filePath = path.resolve(process.cwd(), 'resources/temp_audio.wav');
//     // console.log(dbpath)
//     // const filePath = './resources/temp_audio.wav' //path.join(__dirname, 'resources', 'temp_audio.wav');

//     fs.writeFileSync(filePath, Buffer.from(buffer));
//     console.log(`Audio saved at: ${filePath}`);
// });

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
