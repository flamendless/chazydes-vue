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

const LOW_THRESHOLD = 10;

const multer = require("multer");
const disk_storage = multer.diskStorage({
	destination: "client/src/uploads/",
	filename: function(req, file, cb) {
		let ext;
		if (file.mimetype == "image/png")
			ext = ".png";
		else if (file.mimetype == "image/jpeg")
			ext = ".jpeg";

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

app.post("/remove_item_image", (req, res) => {
	const args = req.body;
	const params = [args.item_id, args.filename];
	const query = `DELETE FROM tbl_image WHERE image_id = ? AND filename = ?`;

	DB.query(query, params).then(data => {
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

app.get("/get_item/:item_id", (req, res) => {
	const args = req.params;
	const query = `SELECT
			item.item_id,
			item.name,
			item.code,
			item.qty,
			item.orig_price,
			item.ret_price,
			item.supplier_id,
			supplier.name AS supplier_name,
			image.image_id,
			image.filename
		FROM tbl_item as item
		LEFT JOIN tbl_image as image ON item.item_id = image.item_id
		LEFT JOIN tbl_supplier as supplier ON item.supplier_id = supplier.supplier_id
		WHERE item.item_id = ${args.item_id}`;

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
			supplier.name AS supplier_name,
			image.image_id,
			image.filename,
			image.path
		FROM tbl_item as item
		LEFT JOIN tbl_image as image ON item.item_id = image.item_id
		LEFT JOIN tbl_supplier as supplier ON item.supplier_id = supplier.supplier_id
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

app.get("/get_items_low", (req, res) => {
	const args = req.params;
	const query = `SELECT
		item_id, name, code, qty, orig_price, ret_price
		FROM tbl_item WHERE qty > 0 AND qty < ${LOW_THRESHOLD}`;

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

app.get("/get_items_out", (req, res) => {
	const args = req.params;
	const query = `SELECT
		item_id, name, code, qty, orig_price, ret_price
		FROM tbl_item WHERE qty = 0`;

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

app.get("/get_all_transactions", (req, res) => {
	const args = req.params;
	const query = `SELECT
			t.transaction_id,
			DATE_FORMAT(t.transaction_dt, '%m/%d/%Y') AS date,
			DATE_FORMAT(t.transaction_dt, '%h:%i:%s %p') AS time,
			t.type,
			c.customer_id,
			c.fullname,
			c.address
		FROM tbl_transaction as t
		INNER JOIN tbl_customer as c ON t.customer_id = c.customer_id`;

	DB.query(query)
	.then(data => {
		if (data.success) res.json(data);
		else res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
})

app.post("/get_transactions_range", (req, res) => {
	const args = req.body;

	const query = `SELECT
			t.transaction_id,
			DATE_FORMAT(t.transaction_dt, '%m/%d/%Y') AS date,
			DATE_FORMAT(t.transaction_dt, '%h:%i:%s %p') AS time,
			t.type,
			c.customer_id,
			c.fullname AS customer_name,
			c.address AS customer_address,
			sold.item_sold_id,
			sold.item_id,
			sold.qty_sold,
			sold.total_price,
			sold.profit,
			i.item_id,
			i.name AS item_name,
			i.code AS item_code
		FROM tbl_transaction as t
		INNER JOIN tbl_customer as c ON t.customer_id = c.customer_id
		INNER JOIN tbl_item_sold as sold ON t.transaction_id = sold.transaction_id
		INNER JOIN tbl_item as i ON i.item_id = sold.item_id
		WHERE t.transaction_dt BETWEEN ? AND ?`;

	DB.query(query, [args.date_from, args.date_to])
	.then(data => {
		if (data.success) res.json(data);
		else res.json({success: false});
	}).catch(err => res.json({
		success: false,
		err: err,
	}));
})

app.get("/get_transaction/:t_id", (req, res) => {
	const args = req.params;
	const query = `SELECT
			t.transaction_id,
			DATE_FORMAT(t.transaction_dt, '%m/%d/%Y') AS date,
			DATE_FORMAT(t.transaction_dt, '%h:%i:%s %p') AS time,
			t.type,
			c.customer_id,
			c.fullname,
			c.address,
			sold.item_sold_id,
			sold.item_id,
			sold.qty_sold,
			sold.total_price,
			sold.profit,
			i.item_id,
			i.name,
			i.code
		FROM tbl_transaction as t
		INNER JOIN tbl_customer as c ON t.customer_id = c.customer_id
		INNER JOIN tbl_item_sold as sold ON t.transaction_id = sold.transaction_id
		INNER JOIN tbl_item as i ON i.item_id = sold.item_id
		WHERE t.transaction_id = ${args.t_id};`

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

app.get("/get_image_by_item_id/:item_id", (req, res) => {
	const args = req.params;
	const query = `SELECT * FROM tbl_image WHERE item_id = ${args.item_id}`;

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

app.post("/update_item", (req, res) => {
	const args = req.body;
	const params = [args.name, args.code, args.qty,
		args.orig_price, args.ret_price, args.supplier_id];
	const query = `UPDATE tbl_item SET
			name = ?,
			code = ?,
			qty = ?,
			orig_price = ?,
			ret_price = ?,
			supplier_id = ?
		WHERE item_id = ${args.item_id}`;

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
		VALUES(NOW(), ?, ?)`;

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
