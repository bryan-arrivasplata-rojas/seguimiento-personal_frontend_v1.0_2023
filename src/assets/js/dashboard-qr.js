
//const $ = require('jquery');

$(document).ready(function () {
  var codeQR = new QRCode(document.getElementById("codeQR"));
  //new QRCode(document.getElementById("codeQR"));

  let init = {
    btnGenerateQr: $("#btn-generate-qr"),
    btnDownloadQr: $("#btn-download-qr"),
    inputCode: $("#code"),
    inputPassword: $("#password"),
  };
  init.btnGenerateQr.on("click", function () {
    var code = init.inputCode.val();
    var password = init.inputPassword.val();
    var title_ = ""
    var message_= "";
    var type_ = "";
    if (code == "") {
      title_ = "¡Campos vacios!";
      message_ = "Ingresa codigo";
      type_ = "error"
      //alert("Ingresa codigo");
      //init.inputCode.focus();
    } else if (password == "") {
      title_ = "¡Campos vacios!";
      message_ = "Ingresa contraseña";
      type_ = "error"
      //alert("Ingresa un password");
      //init.inputPassword.focus();
    } else {
      //init.btnDownloadQr.css("display", "inline-block");
      title_ = "¡QR Generado!";
      message_ = "Exito en generar QR";
      type_ = "success"
      codeQR.makeCode(code + '|' + password);
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
  });

  init.btnDownloadQr.on("click", function () {
    var canvas = $("#codeQR canvas")[0];
    var context = canvas.getContext('2d');
    const base64Canvas = canvas.toDataURL("image/jpeg");
    init.btnDownloadQr.attr('href', base64Canvas);
    init.btnDownloadQr.attr('download', "codeQR.png");
    init.btnDownloadQr.trigger("click");
  });
});