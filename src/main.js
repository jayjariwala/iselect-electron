const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const splashWindowController = require('./controller/splashWindowController');
// const splashWindowController = require('./controller/')
// const treeLoader = require('./threeloader.js');
// const generateXML =  require('./generateXML.js');
// let mainWindow;
// let splashWindow;
// let BrowseWindow;
app.on('ready', _=> splashWindowController());

// app.on('ready', _=> { })
  // splashWindow = new BrowserWindow({
  //   width: 500,
  //   height: 300,
  // });
  // splashWindow.loadURL(`file://${__dirname}/../views/splash.html`);
  // // mainWindow.loadURL(`file://${__dirname}/../views/navigation.html`);

  // ipc.on('splash_timeout', _=> {
  //   // mainWindow = new BrowserWindow({
  //   //   width: 800,
  //   //   height: 500,
  //   // });
  //   BrowseWindow = new BrowserWindow({
  //     width: 800,
  //     height: 500,
  //   });
  //   splashWindow.close();
  //   BrowseWindow.loadURL(`file://${__dirname}/../views/browse_directory.html`);
  //   const dialog = require('electron').dialog;
  //   const browseFolderPath = dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
  //   console.log("Browse folder path", ...browseFolderPath);

  //   BrowseWindow.on('closed', _=>{
  //     BrowseWindow = null;
  //   })
  // });

  // ipc.on('load_tree_data', _=> {
  //   treeLoader(json => {
  //     mainWindow.webContents.send('jsondata', json);
  //   });
  // })

  // ipc.on('generateXML', (event, jsondata) => {
  //   generateXML(jsondata);
  // })

  // splashWindow.on('closed', _=>{
  //   splashWindow = null;
  // })


