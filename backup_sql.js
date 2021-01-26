const fs = require("fs");
const spawn = require("child_process").spawn
const filename = `${Math.round(Date.now()/1000)}.dump.sql`;
const ws = fs.createWriteStream("backups/" + filename);
const dump = spawn("/opt/lampp/bin/mysqldump", ["-u", "root", "chazydes"]);

dump.stdout.pipe(ws).on("finish", function() {
	console.log("backup completed");
}).on("error", function(err) {
	console.log(err);
});
