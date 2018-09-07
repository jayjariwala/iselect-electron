const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const treeLoader = require('../middleware/treeloader.js');
const generateXML = require('../middleware/generateXML.js');
const courseSelectionController = require('../controller/courseSelectionController');
const fetchHtmlFrame = require('../middleware/fetchHtmlFrame.js');

module.exports = function () {
  let splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
  });

  splashWindow.loadURL(`file://${__dirname}/../views/splash.html`);
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

  // ipc.on('splash_timeout', _ => {
  //   courseSelectionController();
  //   splashWindow.close();
  // });

  splashWindow.on('closed', _ => {
    splashWindow = null;
  })

};