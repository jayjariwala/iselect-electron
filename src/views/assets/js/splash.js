const fs = require('fs');
const electron = require('electron');
const ipc = electron.ipcRenderer;

// function splashTimeout() {
//   ipc.send('splash_timeout');
// }

ipc.send('load_tree_data');

// setTimeout(splashTimeout, 3000);