<template>
<div class="registration">
	<div>
		<b-jumbotron
			header="Registration"
			:lead="lead"
			class="text-center"
			fluid
			header-level="4"
			bg-variant="info"
			text-variant="white">
		</b-jumbotron>
	</div>

	<SignUp v-if="page_num == 1" :form="form" />
	<UploadImage v-if="page_num == 2" :driver="driver" />
	<Vehicle v-if="page_num == 3" :vehicle="vehicle" />
	<License v-if="page_num == 4" :license="license" :on_final="on_final" />

	<div class="overflow-auto">
		<div class="mt-3">
			<b-pagination-nav
				:link-gen="link_gen" :number-of-pages="4"
				@change="on_page_change"
				hide-goto-end-buttons
				use-router
				size="lg"
				align="center">
			</b-pagination-nav>
		</div>
	</div>
</div>
</template>

<script>
import SignUp from "@/components/sign_up.vue"
import UploadImage from "@/components/upload_image.vue"
import License from "@/components/license.vue"
import Vehicle from "@/components/vehicle.vue"

const Axios = require("axios");

export default {
	name: "Registration",
	components: {
		SignUp,
		UploadImage,
		License,
		Vehicle,
	},

	mounted: function() {
		this.page_num = this.$route.query.page || 1;
		const saved_form = this.$localStorage.get("form");
		const saved_driver = this.$localStorage.get("driver");
		const saved_vehicle = this.$localStorage.get("vehicle");
		const saved_license = this.$localStorage.get("license");

		if (saved_form)
			this.form = JSON.parse(saved_form);
		else if (process.env.NODE_ENV == "development") {
			this.form = {
				email: "test2@gmail.com",
				password: "12345678",
				confirm_password: "12345678",
				fname: "fname",
				mname: "mname",
				lname: "lname",
				birthdate: "2020-10-20",
				sex: "male",
				address: "general trias",
				status: "single",
				contact_number: "12345678900",
				weight: 55.5,
				height: 1.75,
			}
		}

		if (saved_driver) this.driver = JSON.parse(saved_driver);
		if (saved_vehicle) this.vehicle = JSON.parse(saved_vehicle);
		if (saved_license) this.license = JSON.parse(saved_license);
	},

	methods: {
		link_gen: function(page_num) {
			return page_num === 1 ? "?" : `?page=${page_num}`;
		},
		on_page_change: function(current_page) {
			this.page_num = current_page;
		},
		on_final: async function() {
			const saved_form = this.$localStorage.get("form");
			const saved_driver = this.$localStorage.get("driver");
			const saved_vehicle = this.$localStorage.get("vehicle");
			const saved_license = this.$localStorage.get("license");
			const form = JSON.parse(saved_form);
			const driver = JSON.parse(saved_driver);
			const vehicle = JSON.parse(saved_vehicle);
			const license = JSON.parse(saved_license);
			const ids = {d_id: driver.data.results.insertId};

			const r_add_license = await Axios.post("/add_license", {
				license_img_id: license.data.results.insertId,
				date_issued: license.date_issued,
				restrictions: license.res.join(", "),
				agency: license.agency,
			});

			ids.lic_id = r_add_license.data.results.insertId;

			const r_new_reg = await  Axios.post("/new_registration", {
				registration_number: vehicle.registration_number,
				make: vehicle.make,
				motor_number: vehicle.motor_number,
				chassis_number: vehicle.chassis_number,
				date_issued: vehicle.date_issued,
			});

			ids.reg_id = r_new_reg.data.results.insertId;

			const r_vehicle = await Axios.post("/new_vehicle", {
				kind: vehicle.kind,
				terminal_id: vehicle.terminal,
				reg_id: ids.reg_id,
				body_number: vehicle.body_number,
				plate_number: vehicle.plate_number,
			});

			let tricycle_id;
			let bukyo_id;

			if (vehicle.kind)
				tricycle_id = r_vehicle.data.results.insertId;
			else
				bukyo_id = r_vehicle.data.results.insertId;

			const r_sign_up = await Axios.post("/sign_up", {
				email: form.email,
				password: form.password,
				fname: form.fname,
				mname: form.mname,
				lname: form.lname,
				birthdate: form.birthdate,
				sex: form.sex,
				address: form.address,
				status: form.status,
				contact_number: form.contact_number,
				weight: form.weight,
				height: form.height,
				driver_id: ids.d_id,
				license_id: ids.lic_id,
				tricycle_id: tricycle_id,
				bukyo_id: bukyo_id,
			});

			if (r_sign_up.data.success) {
				this.$localStorage.remove("form");
				this.$localStorage.remove("driver");
				this.$localStorage.remove("vehicle");
				this.$localStorage.remove("license");

				window.location.href = "/sign_in?wait_verification=1";
			} else {
				throw new Error("Failed registration");
			}
		},
	},

	computed: {
		lead: function() {
			let str = "";
			if (this.page_num == 1)
				str = "Basic Information";
			else if (this.page_num == 2)
				str = "Upload Image";
			else if (this.page_num == 3)
				str = "Vehicle";
			else if (this.page_num == 4)
				str = "License";

			return str;
		}
	},

	data: function() {
		return {
			page_num: 1,
			form: {
				email: "",
				password: "",
				confirm_password: "",
				fname: "",
				mname: "",
				lname: "",
				birthdate: "",
				sex: null,
				address: "",
				status: null,
				contact_number: "",
				weight: 0,
				height: 0,
			},
			driver: {
				data: null,
			},
			license: {
				data: null,
				res: [],
				date_issued: null,
				agency: "",
			},
			vehicle: {
				kind: true,
				registration_number: null,
				make: null,
				motor_number: null,
				chassis_number: null,
				date_issued: null,
				body_number: null,
				plate_number: null,
				terminal: null,
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.registration {
	padding: 16px;
}
</style>
