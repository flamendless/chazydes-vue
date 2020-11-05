<template>
<div class="sign_up">
	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form @submit.prevent="handleSubmit(on_submit)" @reset="reset_form">
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

				<b-col>
					<ValidationProvider
						name="Contact Number"
						rules="required|digits:11"
						v-slot="{valid, errors}">
						<b-form-group
							label="Contact Number:"
							label-for="lbl_contact">
							<b-form-input
								v-model="form.contact_number"
								:state="errors[0] ? false : (valid ? true : null)"
								placeholder="Enter Contact Number">
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
						name="Sex"
						rules="required"
						v-slot="{valid, errors}">
						<b-form-group
							id="input_sex"
							label="Sex:"
							label-for="lbl_sex">
							<b-input-group>
								<b-form-select
									id="lbl_sex"
									:state="errors[0] ? false : (valid ? true : null)"
									v-model="form.sex">
									<b-form-select-option :value="null">
										Please select sex
									</b-form-select-option>
									<b-form-select-option value="male">
										Male
									</b-form-select-option>
									<b-form-select-option value="female">
										Female
									</b-form-select-option>
								</b-form-select>

								<b-input-group-append>
									<b-input-group-text>
										<font-awesome-icon icon="question"
											v-if="form.sex == null" />
										<font-awesome-icon icon="mars"
											v-if="form.sex == 'male'" />
										<font-awesome-icon icon="venus"
											v-if="form.sex == 'female' "/>
									</b-input-group-text>
								</b-input-group-append>
							</b-input-group>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</b-col>

				<b-col>
					<ValidationProvider
						name="Status"
						rules="required"
						v-slot="{valid, errors}">
						<b-form-group
							id="input_status"
							label="Status:"
							label-for="lbl_status">
							<b-input-group>
								<b-form-select
									id="lbl_status"
									:state="errors[0] ? false : (valid ? true : null)"
									v-model="form.status">
									<b-form-select-option :value="null">
										Please select status
									</b-form-select-option>
									<b-form-select-option value="single">
										Single
									</b-form-select-option>
									<b-form-select-option value="married">
										Married
									</b-form-select-option>
								</b-form-select>

								<b-input-group-append>
									<b-input-group-text>
										<font-awesome-icon icon="question"
											v-if="form.status == null" />
										<font-awesome-icon icon="user"
											v-if="form.status == 'single'" />
										<font-awesome-icon icon="venus-mars"
											v-if="form.status == 'married' "/>
									</b-input-group-text>
								</b-input-group-append>
							</b-input-group>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</b-col>
			</b-row>

			<ValidationProvider
				name="Address"
				rules="required"
				v-slot="{valid, errors}">
				<b-form-group
					label="Address:"
					label-for="lbl_address">
					<b-form-input
						v-model="form.address"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Address">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<b-row>
				<b-col>
					<ValidationProvider
						name="Weight"
						rules="required|min_value:1"
						v-slot="{valid, errors}">
						<b-form-group
							label="Weight:"
							label-for="lbl_weight">
							<b-input-group append="kg">
								<b-form-input
									type="number"
									step="any"
									v-model="form.weight"
									:state="errors[0] ? false : (valid ? true : null)">
								</b-form-input>
							</b-input-group>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</b-col>

				<b-col>
					<ValidationProvider
						name="Height"
						rules="required|min_value:1"
						v-slot="{valid, errors}">
						<b-form-group
							label="Height:"
							label-for="lbl_height">
							<b-input-group append="m">
								<b-form-input
									type="number"
									step="any"
									v-model="form.height"
									:state="errors[0] ? false : (valid ? true : null)">
								</b-form-input>
							</b-input-group>
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
						Next
					</b-button>
					<b-button class="btn" type="reset" variant="danger" size="lg">
						Reset
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
	name: "SignUp",
	props: {
		form: Object,
		override_submit: Function,
		is_edit: Boolean,
	},

	mounted: function() {
		this.loading = false;
		this.fail = false;
		this.error_msg = "";
	},

	computed: {
		get_current_date: function() {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			return today;
		}
	},

	methods: {
		on_submit: function() {
			this.loading = true;

			if (this.override_submit) {
				this.override_submit(this).catch(err => {
					this.fail = true;
					this.error_msg = err;
					this.loading = false;
				});
			} else {
				Axios.get("/validate_email/" + this.form.email)
				.then(res => {
					const data = res.data;
					if (data.success && data.results.length > 0)
					{
						this.$refs.observer.setErrors({
							email: "E-Mail already registered"
						});
						this.loading = false;
					}
					else
					{
						this.$localStorage.set("form", JSON.stringify(this.form));
						window.location.href = "/registration?page=2";
						this.loading = false;
					}
				});
			}
		},

		reset_form: function() {
			if (window.confirm("Are you sure you want to reset the fields?"))
			{
				this.form.email = "";
				this.form.password = "";
				this.form.confirm_password = "";
				this.form.fname = "";
				this.form.mname = "";
				this.form.lname = "";
				this.form.birthdate = null;
				this.form.sex = null;
				this.form.address = "";
				this.form.status = null;
				this.form.contact_number = "";
				this.form.weight = 0;
				this.form.height = 0;

				requestAnimationFrame(() => {
					this.$refs.observer.reset();
				});
			}
		}
	},

	data: function() {
		return {
			loading: false,
			fail: false,
			error_msg: "",
		}
	},
}
</script>

<style lang="scss" scoped>
.sign_up {
	padding: 16px;
}

.btn {
	margin-left: 32px;
	margin-right: 32px;
}
</style>
