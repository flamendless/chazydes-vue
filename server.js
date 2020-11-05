const express = require("express");
const app = express();
const PORT = 4000;

const MySQL = require("mysql");
const Database = require("./database");
const DB = new Database();

const cors = require("cors");
app.use(cors());

const multer = require("multer");
const disk_storage = multer.diskStorage({
	destination: "client/src/uploads/",
	filename: function(req, file, cb) {
		let ext;
		if (file.mimetype == "image/png")
			ext = ".png";
		else if (file.mimetype == "image/jpeg")
			ext = ".jpeg"

		const u = Date.now() + Math.round(Math.random() * 1E9);
		cb(null, u + ext);
	}
});
const upload = multer({storage: disk_storage});

const BodyParser = require("body-parser");
app.use(BodyParser.urlencoded({extended: true}));
app.use(BodyParser.json());

app.get("/validate_email/:email", (req, res) => {
	const args = req.params;
	const params = [args.email];
	const query = `SELECT email FROM Driver WHERE email = ?`

	DB.query(query, params).then(data => {
		if (data.success)
			res.json(data);
		else
			res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/sign_in", (req, res) => {
	const args = req.body;
	const params = [args.email, args.password];
	const query = `SELECT * FROM Driver WHERE email = ? AND password = ?`;

	DB.query(query, params).then(data => {
		data.email = args.email;
		if (data.success)
			res.json(data);
		else
			res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/verify_account", (req, res) => {
	const args = req.body;
	const query = `UPDATE Driver SET verified = 1 WHERE email = ?`

	DB.query(query, [args.email]).then(data => {
		if (data.success)
			res.json(data);
		else
			res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/delete_driver", (req, res) => {
	const args = req.body;
	const query = `DELETE FROM Driver WHERE id = ?`;

	DB.query(query, [args.driver_id]).then(data => {
		if (data.success)
			res.json(data);
		else
			res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.listen(PORT, () => {
	console.log(`server listening at http://localhost:${PORT}`)
});
