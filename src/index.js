import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron';
const ipc = ipcMain;
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
let splashWindow;

const createWindow = () => {
  // Create the browser window.
  splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
  });

  splashWindow.loadURL(`file://${__dirname}/views/splash.html`);
  ipc.on('load_tree_data', _ => {
    treeLoader(xmljson => {
      fetchHtmlFrame(html5json => {
        setTimeout(() => {
          courseSelectionController(html5json, xmljson);
          splashWindow.close();
        }, 2000);
      });
    });
  })

  // Emitted when the window is closed.
  splashWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    splashWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);