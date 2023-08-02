const { ipcRenderer } = require('electron');
const $ = require('jquery');

let urlApi = localStorage.getItem('urlApi');
let code = localStorage.getItem('code');
//console.log(urlApi);
this.completeData();
this.addUsersCB();
//this.addRolesCB();
function completeData() {
    document.getElementsByClassName('user-welcome')[0].innerHTML = 'Bienvenido: '+localStorage.getItem('name_role')+' '+localStorage.getItem('name')+' '+localStorage.getItem('lastName');
    document.getElementsByClassName('user-name')[0].innerHTML = localStorage.getItem('name');
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
    addRolesCB();
  });

  //$('.data-table').DataTable();
  return 0
}
function addRolesCB() {
  fetch(urlApi + 'roles').then(data => {
    return data.json();
  }).then(data => {
    if (data && data.response) {
      selectCode();
      for (let index = 0; index < data.response.length; index++) {
        const element = data.response[index];
        $('select[name="role"] optgroup').append('<option value=' + element[0] + '>' + element[1] + '</option>')
      }
    }
  });
  return 0;
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
      document.getElementById("role").value = data.response.idRole;
      //$('#role').val(data.response.name_role);
    } else {
      localStorage.removeItem('urlApi')
      localStorage.removeItem('code')
      ipcRenderer.send("auth/login");
    }
  });
}


function save() {
  var title_ = ""
  var message_ = "";
  var type_ = "";
  var dataUser = new FormData();
  dataUser.append("idUser", $('select[name="code"]').val());
  dataUser.append("idRole", $('select[name="role"]').val());
  console.log($('select[name="code"]').val());
  fetch(urlApi + 'users', {
    method: 'PUT',
    body: dataUser
  }).then(data => {
    //console.log(urlApi + 'update-role?code=' + $('select[name="code"]').val() + '&role=' + $('select[name="role"]').val());
    return data.json();
  }).then(data => {
    if (data && data.response && data.response.flag == 1) {
      //console.log(data.response.password);
      title_ = 'Actualización';
      message_ = 'Usuario fue actualizado correctamente';
      type_ = 'success';
      time = 3000;
      //ipcRenderer.send("index", data.response.code);
    } else {
      title_ = '¡Actualización!';
      message_ = 'Intente nuevamente espere 2 segundos...';
      type_ = 'warning';
      time = 3000;
    }
    swal(
      {
        title: title_,
        text: message_,
        type: type_,
        showCancelButton: false,
        showSuccessButton: false,
        confirmButtonClass: 'btn btn-success d-none',
        cancelButtonClass: 'btn btn-danger  d-none',
        timer: time,
      }
    )
    //const ubication = ubicacion_code_list(data.response.cont);

  });
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