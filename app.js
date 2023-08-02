const {app,BrowserWindow, ipcMain, dialog, ipcRenderer} = require('electron');
const { localStorage, sessionStorage } = require('electron-browser-storage');
const ejse = require("ejs-electron");
const url= require('./config');
const {createWindow}= require('./render');

let urlApi = url;

ejse.data("pathBase", "file://" + __dirname + "/");
ejse.data("pathAssets", "file://" + __dirname + "/src/assets/");
ejse.data("pathViews", "file://" + __dirname + "/src/views/");
ejse.data("pathSrc", "file://" + __dirname + "/src/");
ejse.data("urlApi", urlApi);


ipcMain.on("asynchronous-message", (event, arg) => {
    win.webContents.executeJavaScript("console.log('" + arg + "');");
});

app.whenReady().then(() => {
      // Async/await
    localStorage.setItem('urlApi', urlApi);
    
    // Promises
    sessionStorage.setItem('urlApi', urlApi);

    createWindow();
});