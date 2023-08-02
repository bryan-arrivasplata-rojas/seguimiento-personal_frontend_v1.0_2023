const { ipcRenderer } = require('electron');
const $ = require('jquery');

let urlApi = localStorage.getItem('urlApi');
let code = localStorage.getItem('code');

this.completeData();
this.addUsersCB();

function completeData() {
    document.getElementsByClassName('user-welcome')[0].innerHTML = 'Bienvenido: '+localStorage.getItem('name_role')+' '+localStorage.getItem('name')+' '+localStorage.getItem('lastName');
    document.getElementsByClassName('user-name')[0].innerHTML = localStorage.getItem('name');
    //document.getElementById('user-welcome').innerHTML = 'Bienvenido: '+full_name;
}

if (localStorage.getItem('idRole') == 1) {
    document.getElementById("dashboard-lef-side-bar___current-location").hidden=false;
    document.getElementById("dashboard-lef-side-bar___change-role").hidden=false;
} else {
    document.getElementById("dashboard-lef-side-bar___current-location").hidden=true;
    document.getElementById("dashboard-lef-side-bar___change-role").hidden=true;
}


function addUsersCB() {
    fetch(urlApi + 'users').then(data => { //ia/codes
        return data.json();
    }).then(data => {
        if (data && data.response) {
            //addRolesCB()
            for (let index = 0; index < data.response.length; index++) {
                const element = data.response[index];
                $('select[name="code"] optgroup').append('<option value=' + element[8] + '>' + element[0] + '</option>')
            }
            //selectCode()
        }
        //$('.data-table').DataTable();
    }).then(data=>{
        //addRolesCB();
        selectCode();
    });

    //$('.data-table').DataTable();
    return 0
}

function selectCode() {
    fetch(urlApi + 'profiles?idUser=' + $('select[name="code"]').val()).then(data => {
      return data.json();
    }).then(data => {
      if (data && data.response && data.response.flag == 1) {
        //$('.user-name').text(data.response.name);
        $('#name').val(data.response.name);
        $('#lastname').val(data.response.lastName);
        $('#number').val(data.response.number);
        $('#email').val(data.response.email);
      } else {
        localStorage.removeItem('urlApi')
        localStorage.removeItem('code')
        ipcRenderer.send("auth/login");
      }
    });
  }

function consult() {
    var title_ = ""
    var message_ = "";
    var type_ = "";
    fetch(urlApi + 'histories?idUser=' + $('select[name="code"]').val()).then(data => {
        return data.json();
    }).then(data => {
        if (data && data.response && data.response.flag == 1) {
            const ubication = ubicacion_code_list(data.response.count);
            swal(
                {
                    title: '¡Ubicación de Usuario!',
                    text: ubication[0],
                    type: ubication[1],
                    showCancelButton: false,
                    showSuccessButton: false,
                    confirmButtonClass: 'btn btn-success d-none',
                    cancelButtonClass: 'btn btn-danger  d-none',
                    timer: 3000,
                }
            )
        }
        
    });
}
function ubicacion_code_list(number){
    if(number == 0){
        return ["No marco registro el dia de hoy",'error']
    }else if (number%2 == 0){
        return ["No esta dentro de la facultad",'info']
    }else{
        return ["Esta dentro de la facultad",'success']
    }
}

function go(type) {
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