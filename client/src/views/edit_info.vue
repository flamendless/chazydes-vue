<template>
<div class="edit_info">
	<b-card>
		<b-card-header style="font-size: 1.75em;">
			Edit {{ type }}#{{ item.id }}
		</b-card-header>

		<b-card-body style="font-size: 1.25em;">
			<UploadImage v-if="type == 'driver'" :driver="form_img" is_edit />
			<SignUp v-if="type == 'driver'" :override_submit="override_submit"
				:form="form" is_edit />
			<Vehicle v-if="type == 'vehicle'" :override_submit="override_submit"
				:vehicle="form" :terminal_only="terminal_only" is_edit />
			<License v-if="type == 'license'" :override_submit="override_submit"
				:license="form" is_edit />
		</b-card-body>
	</b-card>
</div>
</template>

<script>
import SignUp from "@/components/sign_up.vue"
import UploadImage from "@/components/upload_image.vue"
import Vehicle from "@/components/vehicle.vue"
import License from "@/components/license.vue"

const Axios = require("axios");

export default {
	name: "EditInfo",
	props: {
		info: Object,
	},
	components: {
		SignUp,
		UploadImage,
		Vehicle,
		License,
	},

	mounted: function() {
		const params = this.$route.params;

		if (params.item == null) {
			return this.$router.push({
				name: "Dashboard"
			});
		}

		this.item = params.item;
		this.type = params.type;
		this.terminal_only = params.terminal_only;

		const item = this.item;
		if (this.type == "driver") {
			this.form = {
				email: item.email,
				password: "",
				confirm_password: "",
				fname: item.fname,
				mname: item.mname,
				lname: item.lname,
				birthdate: null,
				sex: item.sex,
				address: item.address,
				status: item.status,
				contact_number: item.contact_number,
				weight: item.weight,
				height: item.height,
			}

			this.form_img.picture_id = item.picture_id;
		} else if (this.type == "license") {
			this.form = {
				changed: false,
				data: null,
				picture_id: item.picture_id,
				res: item.restrictions.split(", "),
				date_issued: null,
				agency: item.agency,
			}
		} else if (this.type == "vehicle") {
			this.form = {
				registration_number: item.registration_number,
				make: item.make,
				motor_number: item.motor_number,
				chassis_number: item.chassis_number,
				date_issued: null,
				body_number: item.body_number,
				plate_number: item.plate_number,
				terminal: item.terminal_name,
			}
		}
	},

	methods: {
		override_submit: async function(child) {
			if (this.type == "driver") {
				const form = this.form;

				let picture_id = this.item.picture_id;

				if (this.form_img.changed) {
					const fd = new FormData();
					fd.append("img_driver", this.form_img.img_driver);

					const r_img = await Axios({
						method: "post",
						url: "/upload_driver",
						data: fd,
						headers: {"Content-Type": "multipart/form-data"}
					})

					if (r_img.data.success)
						picture_id = r_img.data.results.insertId;
				}

				const r_driver = await Axios.post("/update_driver", {
					id: this.item.id,
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
					picture_id: picture_id,
				});

				if (r_driver.data.success) {
					const next_url = `/view_info?driver=1&id=${this.item.id}`;
					this.ask_proceed(next_url, 0);
					child.loading = false;
				} else throw new Error("Failure in driver update");

			} else if (this.type == "license") {
				let picture_id = this.item.picture_id;

				if (this.form.changed) {
					const fd = new FormData();
					fd.append("img_license", this.form.img_license);

					const r_img = await Axios({
						method: "post",
						url: "/upload_license",
						data: fd,
						headers: {"Content-Type": "multipart/form-data"}
					})

					if (r_img.data.success)
						picture_id = r_img.data.results.insertId;
				}

				const r_license = await Axios.post("/update_license", {
					id: this.item.id,
					picture_id: picture_id,
					date_issued: this.form.date_issued,
					restrictions: this.form.res.join(", "),
					agency: this.form.agency,
				});

				if (r_license.data.success) {
					const next_url = `/view_info?license=1&id=${this.item.id}`;
					this.ask_proceed(next_url, 1);
					child.loading = false;
				} else throw new Error("Failure in license update");

			} else if (this.type == "vehicle") {
				const r_reg = await Axios.post("/update_registration", {
					registration_number: this.form.registration_number,
					make: this.form.make,
					motor_number: this.form.motor_number,
					chassis_number: this.form.chassis_number,
					date_issued: this.form.date_issued,
					reg_id: this.item.reg_id,
				});

				if (!r_reg.data.success) throw new Error("Failure in registration update");

				if (this.item.plate_number) {
					const r_tricycle = await Axios.post("/update_tricycle", {
						terminal_id: this.form.terminal,
						body_number: this.form.body_number,
						plate_number: this.form.plate_number,
						tricycle_id: this.item.id,
					});

					if (r_tricycle.data.success) {
						const next_url = `/view_info?vehicle=1&id=${this.item.id}`;
						this.ask_proceed(next_url, 2);
						child.loading = false;
					} else throw new Error("Failure in tricycle update");
				} else {
					const r_bukyo = await Axios.post("/update_bukyo", {
						terminal_id: this.form.terminal_id,
						body_number: this.form.body_number,
						bukyo_id: this.item.id,
					});

					if (r_bukyo.data.success) {
						const next_url = `/view_info?vehicle=2&id=${this.item.id}`;
						this.ask_proceed(next_url, 3);
						child.loading = false;
					} else throw new Error("Failure in bukyo update");
				}
			}
		},
		ask_proceed: function(next_url, tab) {
			this.$bvModal.msgBoxConfirm("Info updated successfully!", {
				okTitle: "View Result",
				cancelTitle: "Return to Dashboard",
				centered: true,
			}).then(value => {
				if (value)
					window.location.href = next_url;
				else
					window.location.href = "/dashboard?tab=" + tab;
			});
		}
	},

	data: function() {
		return {
			item: {},
			type: null,
			terminal_only: false,
			form: {},
			form_img: { data: null, changed: false, },
		}
	}
}
</script>

<style lang="scss" scoped>
.edit_info {
	padding: 32px;

	.card-header {
		text-align: center;
	}
}
</style>
