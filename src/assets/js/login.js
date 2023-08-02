this.getHourNow();

this.getDateNow();

function getHourNow() {
    let hourNow = getDate().getHours() + ':' + getDate().getMinutes() + ':' + getDate().getSeconds();
    document.getElementById('hourNow').innerHTML = hourNow;
}

function getDateNow() {
    let allMonths = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    let dateNow = getDate().getDate() + " de " + allMonths[getDate().getMonth()] + " de " + getDate().getFullYear();
    document.getElementById('dateNow').innerHTML = dateNow;
}


setInterval(() => this.getHourNow(), 1000);

function getDate() {
    return new Date();
}
