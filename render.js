const {BrowserWindow, ipcMain} = require('electron');
const { localStorage, sessionStorage } = require('electron-browser-storage');
const {run_script}= require('./script');
const url= require('./config');

const Alert = require("electron-alert");

let urlApi = url;

const createWindow = () => {
    var splash = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: `${__dirname}/preload.js`,
        },
        width: 500, 
        height: 500, 
        fullscreen: false,
        autoHideMenuBar: true,
        alwaysOnTop:true,
        show:true,
        frame:false
    });
    splash.loadFile('splash.html');
    splash.center();
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: `${__dirname}/preload.js`,
        },
        width: 800,
        height: 600,
        fullscreen: true,
        autoHideMenuBar: true,
        alwaysOnTop:false,
        show:false,
        frame:true
    });
    //win.webContents.openDevTools();//DESARROLLO
    win.loadURL('file://' + __dirname + '/src/views/auth/login.ejs');
    setTimeout(function () {
        win.show();
        splash.hide();
        splash.close();
      }, 3000);
    //win.openDevTools();
    ipcMain.on("auth/login/camera", (evt) => {
        run_script("py python/app-image.py", [], (arg) => {
            loginFace(JSON.parse(arg.replaceAll("'", "\"")));
        });
    });

    ipcMain.on("auth/login/qr", (evt) => {
        run_script("py python/app-qr.py", [], (arg) => {
            loginQr(JSON.parse(arg.replaceAll("'", "\"")));
        });
    });
    function loginQr(args){
        let alert = new Alert();
        var title_ = ""
        var message_ = "";
        var type_ = "";
        if(args.flag == 1){
            localStorage.setItem('urlApi', urlApi);
            localStorage.setItem('code',args.code);
            localStorage.setItem('name',args.name);
            localStorage.setItem('lastName',args.lastName);
            localStorage.setItem('idRole',args.idRole);
            localStorage.setItem('name_role',args.name_role);
            localStorage.setItem('args',args);
            win.loadURL("file://" + __dirname + "/src/views/index.ejs");
        }else{
            //win.alert("La crecenciales no fueron correctas");
            //console.log(args.flag);
            if(args.error=='camara'){
                title_= "Camara";
                text_= "Revise su camara este conectada correctamente";
                icon_= "warning";
            }else if(args.error=='detection'){
                title_= "Detection";
                text_= "Supero sus 10 segundos, intentelo nuevamente";
                icon_= "warning";
            }else{
                title_= "¡Usuario no registrado!";
                text_= "Intente nuevamente espere 4 segundos...'";
                icon_= "warning";
            }
            let swalOptions = {
                title: title_,
                text: text_,
                icon: icon_,
                showCancelButton: false,
                timer: 3000,
            };
            let promise = alert.fireWithFrame(swalOptions, title_, null, false);
        }
    }

    function loginFace(args){
        let alert = new Alert();
        var title_ = ""
        var text_ = "";
        var icon_ = "";
        if(args.flag == 1){
            localStorage.setItem('urlApi', urlApi);
            localStorage.setItem('code',args.code);
            localStorage.setItem('name',args.name);
            localStorage.setItem('lastName',args.lastName);
            localStorage.setItem('idRole',args.idRole);
            localStorage.setItem('name_role',args.name_role);
            localStorage.setItem('args',args);
            //console.log(args.name,args.lastName);
            win.loadURL("file://" + __dirname + "/src/views/index.ejs");
        }else{
            //win.alert("La crecenciales no fueron correctas");
            //console.log(args.flag);
            if(args.error=='camara'){
                title_= "Camara";
                text_= "Revise su camara este conectada correctamente";
                icon_= "warning";
            }else if(args.error=='detection'){
                title_= "Detection";
                text_= "Supero sus 10 segundos, intentelo nuevamente";
                icon_= "warning";
            }else{
                title_= "¡Usuario no registrado!";
                text_= "Intente nuevamente espere 4 segundos...'";
                icon_= "warning";
            }
            let swalOptions = {
                title: title_,
                text: text_,
                icon: icon_,
                showCancelButton: false,
                timer: 3000,
            };
            let promise = alert.fireWithFrame(swalOptions, title_, null, false);
        }
    }

    ipcMain.on("auth/login", (event) => {
        localStorage.setItem('urlApi', urlApi);
        win.loadURL("file://" + __dirname + "/src/views/auth/login.ejs");
    });
    ipcMain.on("auth/recovery", (event) => {
        localStorage.setItem('urlApi', urlApi);
        win.loadURL("file://" + __dirname + "/src/views/auth/recovery.ejs");
    });
    ipcMain.on("auth/register", (event) => {
        localStorage.setItem('urlApi', urlApi);
        win.loadURL("file://" + __dirname + "/src/views/auth/register.ejs");
    });

    ipcMain.on("index", (event, args) => {
        localStorage.setItem('urlApi', urlApi);
        localStorage.setItem('code',args.code);
        localStorage.setItem('name',args.name);
        localStorage.setItem('lastName',args.lastName);
        localStorage.setItem('idRole',args.idRole);
        localStorage.setItem('name_role',args.name_role);
        localStorage.setItem('args',args);
        //console.log(args.name,args.lastName);
        win.loadURL("file://" + __dirname + "/src/views/index.ejs");
    });

    ipcMain.on("current-location", (event, args) => {
        localStorage.setItem('urlApi', urlApi);
        localStorage.setItem('code',args.code);
        localStorage.setItem('name',args.name);
        localStorage.setItem('lastName',args.lastName);
        localStorage.setItem('idRole',args.idRole);
        localStorage.setItem('name_role',args.name_role);
        win.loadURL("file://" + __dirname + "/src/views/current-location.ejs");
    });

    ipcMain.on("change-role", (event, args) => {
        //console.log("Respuesta NodeJS: ", args);
        //console.log("Respuesta NodeJS: ", __dirname);
        localStorage.setItem('urlApi', urlApi);
        localStorage.setItem('code',args.code);
        localStorage.setItem('name',args.name);
        localStorage.setItem('lastName',args.lastName);
        localStorage.setItem('idRole',args.idRole);
        localStorage.setItem('name_role',args.name_role);
        win.loadURL("file://" + __dirname + "/src/views/change-role.ejs");
    });

    ipcMain.on("identity-qr", (event, args) => {
        //console.log(args);
        localStorage.setItem('urlApi', urlApi);
        localStorage.setItem('code',args.code);
        localStorage.setItem('name',args.name);
        localStorage.setItem('lastName',args.lastName);
        localStorage.setItem('idRole',args.idRole);
        localStorage.setItem('name_role',args.name_role);
        
        win.loadURL("file://" + __dirname + "/src/views/identity-qr.ejs");
    });
};
module.exports = {createWindow};