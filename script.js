const child_process = require("child_process");

const run_script = (command, args, callback) => {
    var child = child_process.spawn(command, args, {
        encoding: "utf8",
        shell: true,
    });
    child.stdout.pipe(process.stdout);
    child.on("error", (error) => {
        dialog.showMessageBox({
            title: "Title",
            type: "warning",
            message: "Error occured.\r\n" + error,
        });
    });
    child.stdout.on("data", (response) => {
        let data = response.toString().replace(/\s/g, "");
        //console.log("Respuesta NodeJS: ", data);
        if (typeof callback === "function") {
            callback(data);
        }
    });

    child.on("close", (code) => {
    });
}
module.exports = {run_script};