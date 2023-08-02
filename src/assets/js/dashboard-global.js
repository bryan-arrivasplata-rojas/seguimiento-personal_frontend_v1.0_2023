const { ipcRenderer } = require('electron');
var $ = jQuery = require('jquery');
//var $ = require( "jquery" );
const { jsPDF } = require("jspdf");

let urlApi = localStorage.getItem('urlApi');
let code = localStorage.getItem('code');
this.completeData();

function completeData() {
    document.getElementsByClassName('user-welcome')[0].innerHTML = 'Bienvenido: '+localStorage.getItem('name_role')+' '+localStorage.getItem('name')+' '+localStorage.getItem('lastName');
    document.getElementsByClassName('user-name')[0].innerHTML = localStorage.getItem('name');
    //document.getElementById('user-welcome').innerHTML = 'Bienvenido: '+full_name;
}
if (localStorage.getItem('idRole') == 1) {
    document.getElementById("index___card").hidden=false;
    document.getElementById("dashboard-lef-side-bar___current-location").hidden=false;
    document.getElementById("dashboard-lef-side-bar___change-role").hidden=false;
    addHistory();
    //setTimeout(formatTable, 1000)
} else {
    document.getElementById("index___card").hidden=true;
    document.getElementById("dashboard-lef-side-bar___current-location").hidden=true;
    document.getElementById("dashboard-lef-side-bar___change-role").hidden=true;
}
function addHistory() {
    fetch(urlApi + 'histories').then(data => { //ia/codes
        return data.json();
    }).then(data => {
        if (data && data.response) {
            for (let index = 0; index < data.response.length; index++) {
                const element = data.response[index];
                let fechaActual = fecha(element[10]);
                var body = "<tr value=" + element[0] + ">";
                body += "<td>" + element[2] + "</td>";
                body += "<td>" + element[4] + "</td>";
                body += "<td>" + element[5] + "</td>";
                body += "<td>" + fechaActual + "</td>";
                body += "<td>" + element[9] + "</td>";
                body += "<td>" + element[7] + "</td>";
                body += "</tr>";
                $('.table-history').append(body)
            }
        }
    }).then(data=>{
        setTimeout(formatTable, 1000)
    });
    return 0
}

function fecha(date){
    const formatFullDate = new Intl.DateTimeFormat('es-PE', { dateStyle: 'full', timeStyle: 'long'}).format(new Date(date));
    return formatFullDate.substring(0,formatFullDate.length - 6);
}

function formatTable() {
    $('.data-table').DataTable({
        responsive: true,
        "order":[[3,"desc"]],
        dom: 'Bfrtip',
        buttons: {
            dom: {
                button: {
                    className: 'btn'
                }
            },
            buttons: [
                {
                    text: 'Refrescar',
                    className: 'btn btn-outline-primary',
                    exceStyles: {
                        template: 'header_blue'
                    },
                    action: function (e, dt, node, config) {
                        location.reload();
                    }

                },
                {
                    text: 'Exportar a Excel',
                    className: 'btn btn-outline-success',
                    exceStyles: {
                        template: 'header_blue'
                    },
                    action: function (e, dt, node, config) {
                        exportToExcel('date-table')
                    }

                },
                {
                    text: 'Imprimir',
                    className: 'btn btn-outline-danger',
                    exceStyles: {
                        template: 'header_blue'
                    },
                    action: function (e, dt, node, config) {
                        exportToPDF('date-table')
                    }

                }
            ]
        }
    });
}
function exportToExcel(tableId) {
    let tableData = document.getElementById(tableId).outerHTML;
    tableData = tableData.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tableData = tableData.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tableData = tableData.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    let a = document.createElement('a');
    const d = new Date();

    a.href = `data:application/vnd.ms-excel, ${encodeURIComponent(tableData)}`;
    a.download = 'history-login.' + d.toLocaleTimeString() + '.xls';
    a.click();
}
function exportToPDF(tableId) {
    var divContents = document.getElementById(tableId).outerHTML;

    var windowUrl = 'about:blank';
    var uniqueName = new Date();
    var windowName = 'Print' + uniqueName.getTime();

    var printWindow = window.open(windowUrl, windowName,'left=0,top=50000,width=0,height=0');
    printWindow.document.write('<html><head><title>DIV Contents</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}
function getRandomNumbers() {
    let dateObj = new Date()
    let dateTime = `${dateObj.getHours()}${dateObj.getMinutes()}${dateObj.getSeconds()}`

    return `${dateTime}${Math.floor((Math.random().toFixed(2) * 100))}`
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