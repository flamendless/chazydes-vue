<template>
<div class="upload_license">
	<div class="text-center">
		<b-img v-if="url_image" :src="url_image" width="360px"></b-img>
	</div>

	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form
			@submit.prevent="handleSubmit(on_submit)"
			enctype="multipart/form-data">
			<ValidationProvider
				rules="required"
				v-slot="{valid, errors}">
				<b-form-group
					label="Picture of License:"
					label-for="lbl_license">
					<b-form-file
						name="img_license"
						v-model="img_license"
						accept="image/jpeg, image/png"
						@change="on_file_change"
						:state="Boolean(img_license)"
						:placeholder="img_license ? img_license.name : 'Choose image'"
						no-drop>
					</b-form-file>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="DateIssued"
				rules="required"
				v-slot="{valid, errors}">
				<b-form-group
					label="Date Issued:"
					label-for="lbl_date_issued">
					<b-form-datepicker
						no-flip
						:max="get_current_date"
						v-model="license.date_issued"
						:state="errors[0] ? false : (valid ? true : null)">
					</b-form-datepicker>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="Restrictions"
				rules="required"
				v-slot="{valid, errors}">
				<b-form-group label="Restrictions" label-for="lbl_res" id="restrictions">
					<b-form-checkbox-group v-model="license.res"
						:state="errors[0] ? false : (valid ? true : null)">
						<b-form-checkbox value="1">1</b-form-checkbox>
						<b-form-checkbox value="2">2</b-form-checkbox>
						<b-form-checkbox value="3">3</b-form-checkbox>
						<b-form-checkbox value="4">4</b-form-checkbox>
						<b-form-checkbox value="5">5</b-form-checkbox>
						<b-form-checkbox value="6">7</b-form-checkbox>
						<b-form-checkbox value="8">8</b-form-checkbox>
					</b-form-checkbox-group>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="agency"
				rules="required|max:8"
				v-slot="{valid, errors}">
				<b-form-group
					label="Agency:"
					label-for="lbl_agency">
					<b-form-input
						v-model="license.agency"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Agency">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<b-row>
				<b-col class="text-center">
					<b-button class="btn" type="submit" variant="primary" size="lg">
						<b-spinner small v-if="loading"></b-spinner>
						Submit
					</b-button>
				</b-col>
			</b-row>
		</b-form>

		<b-alert v-model="fail" variant="danger" style="margin-top: 32px;">
			There is an error {{ error_msg }}
		</b-alert>
	</ValidationObserver>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "License",
	props: {
		license: Object,
		override_submit: Function,
		is_edit: Boolean,
		on_final: Function,
	},

	data: function() {
		return {
			url_image: null,
			img_license: null,
			loading: false,
			fail: false,
			error_msg: "",
		}
	},

	mounted: function() {
		this.loading = false;

		if (this.is_edit) {
			Axios.get("/get_image/" + this.license.picture_id)
			.then(res => {
				const data = res.data;
				if (data.results.length > 0)
					this.url_image = require("@/uploads/" + data.results[0].name);
			});
		}
	},

	computed: {
		get_current_date: function() {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			return today;
		}
	},

	watch: {
		img_license: function() {
			this.license.changed = true;
			this.license.img_license = this.img_license;
		}
	},

	methods: {
		on_file_change: function(e) {
			const file = e.target.files[0];
			this.url_image = URL.createObjectURL(file);
		},
		on_submit: function() {
			this.loading = true;

			if (this.override_submit) {
				this.override_submit(this).catch(err => {
					this.fail = true;
					this.error_msg = err;
					this.loading = false;
				});
			} else {
				const fd = new FormData();
				fd.append("img_license", this.img_license);

				Axios({
					method: "post",
					url: "/upload_license",
					data: fd,
					headers: {"Content-Type": "multipart/form-data"}
				})
				.then(res => {
					const data = res.data;
					if (data.success)
					{
						this.license.data = data;
						this.$localStorage.set("license", JSON.stringify(this.license));
						this.on_final();
						this.loading = false;
					}
				});
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.upload_license {
	padding: 16px;
}

.btn {
	margin-left: 32px;
	margin-right: 32px;
}
</style>
