import {
  app,
  BrowserWindow
} from 'electron';
const electron = require('electron');
const ipc = electron.ipcMain;
const treeLoader = require('./middleware/treeloader.js');
const generateXML = require('./middleware/generateXML.js');
const courseSelectionController = require('./controller/courseSelectionController');
const fetchHtmlFrame = require('./middleware/fetchHtmlFrame.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/views/splash.html`);
  mainWindow.webContents.openDevTools();

  treeLoader(xmljson => {
    fetchHtmlFrame(html5json => {
      setTimeout(() => {
        courseSelectionController(mainWindow, html5json, xmljson);
      }, 2000);
    });
  });


  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    console.log("on close called ")
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.