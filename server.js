const express = require("express");
const app = express();
const PORT = 4000;

const MySQL = require("mysql");
const Database = require("./database");
const DB = new Database();

const cors = require("cors");
app.use(cors());

const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 8;

const BodyParser = require("body-parser");
app.use(BodyParser.urlencoded({extended: true}));
app.use(BodyParser.json());

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

app.post("/upload_item_images", upload.array("img_items"), function(req, res) {
	const files = req.files;
	const body = req.body;
	const params = [];
	const query = `INSERT INTO tbl_image(item_id, filename, path) VALUES ?`;

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		params.push([body.item_id, file.filename, file.path]);
	}

	DB.query(query, [params]).then(data => {
		res.json(data);
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.get("/validate_email/:email", (req, res) => {
	const args = req.params;
	const params = [args.email];
	const query = `SELECT user_id FROM tbl_user WHERE email = ?`

	DB.query(query, params).then(data => {
		res.json(data);
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/register_user", (req, res) => {
	const args = req.body;
	const pw_hash = bcrypt.hashSync(args.password, SALT_ROUNDS);

	const q_user = `INSERT INTO tbl_user(email, pw_hash) VALUES(?, ?)`;
	const q_acc = `INSERT INTO tbl_account(fname, mname, lname, birthdate) VALUES(?, ?, ?, ?)`;

	DB.query(q_user, [args.email, pw_hash])
	.then(data => {
		if (data.success) {
			DB.query(q_acc, [args.fname, args.mname, args.lname, args.birthdate])
			.then(data => {
				if (data.success)
					res.json(data);
				else res.json({success: false});
			});
		} else res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/sign_in", (req, res) => {
	const args = req.body;
	const query = `SELECT email, pw_hash FROM tbl_user WHERE email = ?`;

	DB.query(query, [args.email])
	.then(data => {
		if (data.success && data.results.length > 0) {
			const match = bcrypt.compareSync(args.password, data.results[0].pw_hash);
			res.json({
				email: data.results[0].email,
				success: match,
			});
		} else res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/get_profile", (req, res) => {
	const args = req.body;
	const query = `SELECT fname, mname, lname, birthdate
		FROM tbl_account
		INNER JOIN tbl_user
		ON tbl_account.account_id = tbl_user.user_id
		WHERE email = ?`;

	DB.query(query, [args.email])
	.then(data => {
		if (data.success)
			res.json(data);
		else
			res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.get("/get_items", (req, res) => {
	const args = req.params;
	const query = `SELECT
			item.item_id,
			item.name,
			item.code,
			item.qty,
			item.orig_price,
			item.ret_price,
			item.supplier_id,
			image.image_id,
			image.filename,
			image.path
		FROM tbl_item as item
		LEFT JOIN tbl_image as image ON item.item_id = image.item_id
		GROUP BY item.item_id`;

	DB.query(query)
	.then(data => {
		if (data.success)
			res.json(data);
		else
			res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.get("/get_items/:limit", (req, res) => {
	const args = req.params;
	const query = `SELECT * FROM tbl_item LIMIT ${args.limit}`;

	DB.query(query)
	.then(data => {
		if (data.success)
			res.json(data);
		else
			res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.get("/get_items_list", (req, res) => {
	const args = req.params;
	const query = `SELECT
		item_id, name, code, qty, orig_price, ret_price
		FROM tbl_item`;

	DB.query(query)
	.then(data => {
		if (data.success)
			res.json(data);
		else
			res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.get("/get_customers", (req, res) => {
	const args = req.params;
	const query = `SELECT * FROM tbl_customer`;

	DB.query(query)
	.then(data => {
		if (data.success) res.json(data);
		else res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
})

app.get("/get_suppliers", (req, res) => {
	const args = req.params;
	const query = `SELECT * FROM tbl_supplier`;

	DB.query(query)
	.then(data => {
		if (data.success) res.json(data);
		else res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
})

app.post("/upload_item", (req, res) => {
	const args = req.body;
	const params = [args.name, args.code, args.qty,
		args.orig_price, args.ret_price, args.supplier_id];
	const query = `INSERT INTO
		tbl_item(name, code, qty, orig_price, ret_price, supplier_id)
		VALUES(?, ?, ?, ?, ?, ?)`;

	DB.query(query, params).then(data => {
		res.json(data);
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/new_supplier", (req, res) => {
	const args = req.body;
	const params = [args.name];
	const query = `INSERT INTO tbl_supplier(name) VALUES(?)`;

	DB.query(query, params).then(data => {
		res.json(data);
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/new_customer", (req, res) => {
	const args = req.body;
	const params = [args.fullname, args.address];
	const query = `INSERT INTO tbl_customer(fullname, address) VALUES(?, ?)`;

	DB.query(query, params).then(data => {
		res.json(data);
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/new_transaction", (req, res) => {
	const args = req.body;
	const params = [args.type, args.customer_id];
	const query = `INSERT INTO tbl_transaction(transaction_dt, type, customer_id)
		VALUES(now(), ?, ?)`;

	DB.query(query, params).then(data => {
		res.json(data);
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.post("/add_item_sold", (req, res) => {
	const args = req.body;
	const params = [];
	const query = `INSERT INTO
		tbl_item_sold(item_id, qty_sold, total_price, profit, transaction_id)
		VALUES ?`;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		params.push([
			arg.item_id, arg.qty_sold, arg.total_price,
			arg.profit, arg.transaction_id
		]);
	}

	DB.query(query, [params]).then(data => {
		res.json(data);
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
});

app.listen(PORT, () => {
	console.log(`server listening at http://localhost:${PORT}`)
});
