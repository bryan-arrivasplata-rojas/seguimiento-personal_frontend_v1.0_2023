const { ipcRenderer } = require('electron');
const $ = require('jquery');

let urlApi = localStorage.getItem('urlApi');
let code = localStorage.getItem('code');

this.completeData();

function completeData() {
    document.getElementsByClassName('user-welcome')[0].innerHTML = 'Bienvenido: '+localStorage.getItem('name_role')+' '+localStorage.getItem('name')+' '+localStorage.getItem('lastName');
    document.getElementsByClassName('user-name')[0].innerHTML = localStorage.getItem('name');
    document.getElementById('code').value = localStorage.getItem('code');
    //document.getElementById('user-welcome').innerHTML = 'Bienvenido: '+full_name;
}

if (localStorage.getItem('idRole') == 1) {
    document.getElementById("dashboard-lef-side-bar___current-location").hidden=false;
    document.getElementById("dashboard-lef-side-bar___change-role").hidden=false;
    document.getElementById("code").removeAttribute("readonly"  , false)
} else {
    document.getElementById("dashboard-lef-side-bar___current-location").hidden=true;
    document.getElementById("dashboard-lef-side-bar___change-role").hidden=true;
}
function go(type){
    if (type == 'index') {
        ipcRenderer.send(
            "index",
            {
                'code':localStorage.getItem('code'),
                'name':localStorage.getItem('name'),
                'lastName':localStorage.getItem('lastName'),
                'idRole':localStorage.getItem('idRole'),
                'name_role':localStorage.getItem('name_role')
            }
        );

    } else if (type == 'current-location') {
        ipcRenderer.send("current-location", {
            'code':localStorage.getItem('code'),
            'name':localStorage.getItem('name'),
            'lastName':localStorage.getItem('lastName'),
            'idRole':localStorage.getItem('idRole'),
            'name_role':localStorage.getItem('name_role')
        });

    } else if (type == 'change-role') {
        ipcRenderer.send("change-role", {
            'code':localStorage.getItem('code'),
            'name':localStorage.getItem('name'),
            'lastName':localStorage.getItem('lastName'),
            'idRole':localStorage.getItem('idRole'),
            'name_role':localStorage.getItem('name_role')
        });

    } else if (type == 'identity-qr') {
        ipcRenderer.send("identity-qr", {
            'code':localStorage.getItem('code'),
            'name':localStorage.getItem('name'),
            'lastName':localStorage.getItem('lastName'),
            'idRole':localStorage.getItem('idRole'),
            'name_role':localStorage.getItem('name_role')
        });

    } else if (type == 'login') {
        ipcRenderer.send("auth/login");

    }
}