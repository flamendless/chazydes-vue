const fs = require("fs");
const child_process = require("child_process");
const filename = `${Math.round(Date.now()/1000)}.dump.sql`;
const dir = "backups";
const username = "root";
const pw = "useruser";

if (!fs.existsSync(dir)) {
	fs.mkdir(dir, function(err) {
		if (err) console.log(`Unable to create ${dir}`);
		else console.log(`Created ${dir} successfuly!`);
	});
}

const cmd = `/usr/bin/mysqldump -u ${username} -p${pw} chazydes > ${dir}/${filename}`;
const dump = child_process.exec(cmd, [], function(err, stdout) {
	if (err) console.log(err);
	else console.log(stdout);
});
