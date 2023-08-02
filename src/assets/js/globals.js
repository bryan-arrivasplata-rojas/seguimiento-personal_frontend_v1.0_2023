const { ipcRenderer } = require('electron');
const $ = require('jquery');

let urlApi = localStorage.getItem('urlApi');

verify();
function verify() {
  let token = localStorage.getItem('token');
  if (!token) {
    //ipcRenderer.send("auth/login");
    // window.location.href = "auth/login.ejs";

  }
}

function auth() {
  var title_ = ""
  var message_ = "";
  var type_ = "";
  let code = document.getElementById('code').value;
  let password = document.getElementById('password').value;
  if (code != "") {
    if (password != "") {
      authentication(code, password);
    }else{
      title_ = "¡Información incompleta!";
      message_ = "Falta completar el password";
      type_ = "error";
    }
  }else{
    title_ = "¡Información incompleta!";
    message_ = "Falta completar el codigo";
    type_ = "error";
  }
  if(code=="" || password==""){
    swal(
      {
        title: title_,
        text: message_,
        type: type_,
        showCancelButton: false,
        showSuccessButton: false,
        confirmButtonClass: 'btn btn-success d-none',
        cancelButtonClass: 'btn btn-danger  d-none',
        timer: 4000,
      }
    )
  }
}

function authentication(code, password) {
  let full;
  fetch(urlApi + 'users?code=' + code + '&password=' + password).then(data => {
    //console.log(data);
    return data.json();
  }).then(data => {//Boolean(data.response.flag) ==true
    if (data && data.response && data.response.flag == 1) {
      full=data.response;
      var date = new FormData();
      date.append("idUser", data.response.idUser);
      date.append("idRecognition", 1);
      //console.log(full);
      fetch(urlApi + 'histories', {
        method: "POST",
        body: date
      }).then(data=>{
        ipcRenderer.send("index", full);//ACA ENVIO TODO PARA ARGS
      });
    } else {
      swal(
        {
          title: '¡Usuario no registrado!',
          text: 'Intente nuevamente espere 4 segundos...',
          type: 'warning',
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

function authWithCamera() {
  //run_script("py python/app.py", [], null);
  ipcRenderer.send('auth/login/camera');

}
function authWithQr() {
  //run_script("py python/app.py", [], null);
  ipcRenderer.send('auth/login/qr');

}
function register() {
  code = $('#code').val();
  password = $('#password').val();
  nameReg = $('#name').val();
  lastName = $('#lastName').val();
  birthday = $('#birthDate').val();
  number = $('#celphone').val();
  email = $('#email').val();
  department = $('#department').val();
  var title_ = "";
  var message_ = "";
  var type_ = "";
  var year = parseInt(birthday.substring(0,4))
  if (code != "") {
    if (password != "") {
      if (nameReg != "") {
        if (lastName != "") {
          if (birthday != "" && year>1900 && year<3000) {
            if (number != "") {
              if (email != "" && validarEmail(email)) {
                if (department != "") {
                  var dataProfile = new FormData();
                  dataProfile.append("name", nameReg);
                  dataProfile.append("lastName", lastName);
                  dataProfile.append("birthday", birthday);
                  dataProfile.append("number", number);
                  dataProfile.append("email", email);
                  dataProfile.append("securityResponse", department);
                  fetch(urlApi + 'profiles', {
                    method: "POST",
                    body: dataProfile
                  }).then(data => {
                    return data.json();
                  }).then(data => {
                    if (data && data.response && data.response.flag == 1) {
                      var dataUser = new FormData();
                      dataUser.append("code", code);
                      dataUser.append("password", password);
                      dataUser.append("idProfile", data.response.result.idProfile);
                      fetch(urlApi + 'users', {
                        method: "POST",
                        body: dataUser
                      }).then(data =>{
                        return data.json();
                      }).then(data =>{
                        if (data && data.response && data.response.flag == 1) {
                          title_ = '¡Usuario registrado con éxito!';
                          message_ = 'Todo usuario nuevo tiene rol/cargo user';
                          type_ = 'success';
                        } else {
                          title_ = "¡Error en registro!";
                          message_ = "Codigo ya existente";
                          type_ = "error"
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
                            timer: 4000,
                          }
                        )
                        functionClean();
                      });
                    }else {
                      title_ = "¡Error!";
                      message_ = "Error de parte de DataBase";
                      type_ = "error"
                    }
                  });
                } else {
                  title_ = "¡Campos vacios!";
                  message_ = "Ingresa departamento del padre";
                  type_ = "error"
                }
              } else {
                title_ = "¡Campos vacios/incorrecto!";
                message_ = "Ingresa email válido";
                type_ = "error"
              }
            } else {
              title_ = "¡Campos vacios!";
              message_ = "Ingresa celular";
              type_ = "error"
            }
          } else {
            title_ = "¡Campos vacios!";
            message_ = "Ingresa fecha de nacimiento";
            type_ = "error"
          }
        } else {
          title_ = "¡Campos vacios!";
          message_ = "Ingresa apellidos";
          type_ = "error"
        }
      } else {
        title_ = "¡Campos vacios!";
        message_ = "Ingresa nombres";
        type_ = "error"
      }
    } else {
      title_ = "¡Campos vacios!";
      message_ = "Ingresa password";
      type_ = "error"
    }
  } else {
    title_ = "¡Campos vacios!";
    message_ = "Ingresa codigo";
    type_ = "error"
  }
  if(code=="" ||nameReg==""||lastName==""||birthday==""||number==""||email==""||department=="" || validarEmail(email)==false || year<1900 || year>3000){
    swal(
      {
        title: title_,
        text: message_,
        type: type_,
        showCancelButton: false,
        showSuccessButton: false,
        confirmButtonClass: 'btn btn-success d-none',
        cancelButtonClass: 'btn btn-danger  d-none',
        timer: 3000,
      }
    )
  }
}
function recovery() {
  var code = $("#code").val();
  var securityResponse = $("#department").val();
  var title_ = ""
  var message_ = "";
  var type_ = "";
  if (code == "") {
    title_ = "¡Campos vacios!";
    message_ = "Ingresa codigo";
    type_ = "error"
    //alert("Ingresa codigo");
    //init.inputCode.focus();
  } else if (securityResponse == "") {
    title_ = "¡Campos vacios!";
    message_ = "Ingresa departamento";
    type_ = "error"
    //alert("Ingresa un password");
    //init.inputPassword.focus();
  } else {
    fetch(urlApi + 'users?code=' + code + '&securityResponse=' + securityResponse).then(data => {
      //console.log(data);
      return data.json();
    }).then(data => {//Boolean(data.response.flag) ==true
      if (data && data.response && data.response.flag == 1) {
        //console.log(data.response.password);
        title_ = 'Recuperación Exitosa';
        message_ = 'Su password es : ' + data.response.password;
        type_ = 'success';
        time = 5000;
        //ipcRenderer.send("index", data.response.code);
      } else {
        title_ = '¡Campos incorrectos!';
        message_ = 'Intente nuevamente espere 2 segundos...';
        type_ = 'warning';
        time = 2000;
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
    });
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
      timer: 2000,
    }
  )
}
function functionClean(){
  $('#code').val("");
  $('#password').val("");
  $('#name').val("");
  $('#lastName').val("");
  $('#birthDate').val("");
  $('#celphone').val("");
  $('#email').val("");
  $('#department').val("");
}
function validarEmail(valor) {
  if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)) {
    return true;
  } else {
    return false;
  }
}