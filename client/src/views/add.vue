<template>
<div class="add">
	<b-card>
		<b-card-header style="font-size: 1.75em;">
			Add {{ type }}
		</b-card-header>

		<b-card-body style="font-size: 1.25em;">
			<ValidationObserver ref="observer" v-slot="{handleSubmit}">
				<div v-if="type == 'admin'">
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
					</b-form>
				</div>

				<div v-else-if="type == 'terminal'">
					<ValidationProvider
						name="terminal"
						rules="required"
						v-slot="{valid, errors}">
						<b-form-group
							label="Terminal:"
							label-for="lbl_terminal">
							<b-form-input
								type="text"
								v-model="form.name"
								:state="errors[0] ? false : (valid ? true : null)"
								placeholder="Enter Terminal Name">
							</b-form-input>
							<b-form-invalid-feedback id="input_feedback">
								{{ errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</ValidationProvider>
				</div>

				<b-row>
					<b-col class="text-center">
						<b-button class="btn" type="submit" variant="primary" size="lg">
							<b-spinner small v-if="loading"></b-spinner>
							Submit
						</b-button>
					</b-col>
				</b-row>
			</ValidationObserver>
		</b-card-body>
	</b-card>
</div>
</template>

<script>

const Axios = require("axios");

export default {
	name: "Add",

	mounted: function() {
		this.loading = false;

		const params = this.$route.params;
		this.type = params.type;

		if (this.type == "terminal") {
			this.form = {
				name: "",
			}
		} else if (this.type == "admin") {
			this.form = {
				email: "",
				password: "",
				confirm_password: "",
			}
		}
	},

	methods: {
		on_ask: function(msg, tab) {
			this.$bvModal.msgBoxConfirm(msg, {
				okTitle: "Add another",
				cancelTitle: "Return to Dashboard",
				centered: true,
			}).then(value => {
				if (value)
					window.location.reload();
				else
					window.location.href = "/dashboard?tab=" + tab;
			});
		},
		on_submit: async function() {
			this.loading = true;

			if (this.type == "terminal") {
				Axios.post("/register_terminal", {name: this.form.name})
				.then(res => {
					const data = res.data;
					if (data.success) {
						this.loading = false;
						alert("Terminal added");
						this.on_ask("Terminal added", 4);
					}
				});
			} else if (this.type == "admin") {
				Axios.post("/register_admin", {
					email: this.form.email,
					password: this.form.password,
				})
				.then(res => {
					const data = res.data;
					if (data.success) {
						this.loading = false;
						alert("Admin account added");
						this.on_ask("Admin added", 0);
					}
				});
			}
		},
	},

	data: function() {
		return {
			type: null,
			form: null,
			loading: false,
		}
	}
}
</script>

<style lang="scss" scoped>
.add {
	padding: 32px;

	.card-header {
		text-align: center;
	}
}
</style>
