<template>
<div class="registration">
	<div>
		<b-jumbotron
			header="Registration"
			class="text-center"
			fluid
			header-level="4"
			bg-variant="info"
			text-variant="white">
		</b-jumbotron>
	</div>

	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form @submit.prevent="handleSubmit(on_submit)">
			<ValidationProvider
				name="email"
				rules="required|email"
				v-slot="{valid, errors}">
				<b-form-group
					label="Email Address:"
					label-for="lbl_email">
					<b-form-input
						type="email"
						v-model="form.email"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter E-Mail">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<b-row>
				<b-col>
					<ValidationProvider
						name="Password"
						vid="password"
						rules="required|min:8"
						v-slot="{valid, errors}">
						<b-form-group label="Password:">
							<b-form-input
								type="password"
								v-model="form.password"
								:state="errors[0] ? false : (valid ? true : null)"
								placeholder="Enter Password">
							</b-form-input>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</b-col>

				<b-col>
					<ValidationProvider
						name="Password Confirmation"
						rules="required|confirmed:password"
						v-slot="{valid, errors}">
						<b-form-group label="Confirm Password:">
							<b-form-input
								type="password"
								v-model="form.confirm_password"
								:state="errors[0] ? false : (valid ? true : null)"
								placeholder="Confirm Password">
							</b-form-input>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<ValidationProvider
						name="First Name"
						:rules="{ required: true, regex: /^[a-zA-Z- ]+$/ }"
						v-slot="{valid, errors}">
						<b-form-group
							label="First Name:"
							label-for="lbl_fname">
							<b-form-input
								type="text"
								v-model="form.fname"
								:state="errors[0] ? false : (valid ? true : null)"
								placeholder="Enter First Name">
							</b-form-input>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</b-col>

				<b-col>
					<ValidationProvider
						name="Middle Name"
						:rules="{ required: true, regex: /^[a-zA-Z- ]+$/ }"
						v-slot="{valid, errors}">
						<b-form-group
							label="Middle Name:"
							label-for="lbl_mname">
							<b-form-input
								type="text"
								v-model="form.mname"
								:state="errors[0] ? false : (valid ? true : null)"
								placeholder="Enter Middle Name">
							</b-form-input>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</b-col>
			</b-row>

			<ValidationProvider
				name="Last Name"
				:rules="{ required: true, regex: /^[a-zA-Z- ]+$/ }"
				v-slot="{valid, errors}">
				<b-form-group
					label="Last Name:"
					label-for="lbl_lname">
					<b-form-input
						type="text"
						v-model="form.lname"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Last Name">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<b-row>
				<b-col>
					<ValidationProvider
						name="Birthdate"
						rules="required"
						v-slot="{valid, errors}">
						<b-form-group
							label="Birthdate:"
							label-for="lbl_birthdate">
							<b-form-datepicker
								no-flip
								:max="get_current_date"
								v-model="form.birthdate"
								:state="errors[0] ? false : (valid ? true : null)">
							</b-form-datepicker>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</b-col>
			</b-row>

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
	name: "Registration",

	mounted: function() {
		this.loading = false;
		this.fail = false;
		this.error_msg = "";
	},

	methods: {
		on_submit: async function() {
			const valid_email = await Axios.get("/validate_email/" + this.form.email);

			if (valid_email.data.success && valid_email.data.results.length > 0)
			{
				this.$refs.observer.setErrors({
					email: "E-Mail already registered"
				});
				this.loading = false;
			}
			else
			{
				this.loading = false;
				const form = this.form;
				const r_sign_up = await Axios.post("/register_user", {
					email: form.email,
					password: form.password,
					fname: form.fname,
					mname: form.mname,
					lname: form.lname,
					birthdate: form.birthdate,
				});

				if (r_sign_up.data.success) window.location.href = "/sign_in";
				else throw new Error("Failed registration");
			}
		},
	},

	computed: {
		get_current_date: function() {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			return today;
		}
	},

	data: function() {
		return {
			loading: false,
			fail: false,
			error_msg: "",
			form: {
				email: "",
				password: "",
				confirm_password: "",
				fname: "",
				mname: "",
				lname: "",
				birthdate: "",
			},
		}
	}
}
</script>

<style lang="scss" scoped>
.registration {
	padding: 16px;
}

.btn {
	margin-left: 32px;
	margin-right: 32px;
}
</style>
