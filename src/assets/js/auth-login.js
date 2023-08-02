const $ = require('jquery');

function authWithQr(){
    document.getElementById('id01').style.display='block'
    $("#reader").html5_qrcode(
      function (response) {

        let data = response.split('|');
        if(data==2){
          console.log(data)
          let code = data[0];
          let password = data[1];
          authentication(code,password)
          $("#result").html(data);
          document.getElementById('id01').style.display='none'
        }
      },
      function (error) {
        $("#error").html("Scanning...");
      },
      function (videoError) {
        $("#error").html("Camera error.");
      }
    );
}