<template>
<div class="vehicle">
	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form @submit.prevent="handleSubmit(on_submit)">

			<ValidationProvider
				v-if="vehicle.kind"
				name="kind"
				rules="required"
				v-slot="{valid, errors}">
				<b-form-group
					label="Vehicle Type:"
					label-for="lbl_kind">
					<b-form-checkbox switch size="lg" v-model="vehicle.kind">
						{{ vehicle.kind == true ? "Tricycle" : "Bukyo" }}
					</b-form-checkbox>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="terminal"
				rules="required|max:200"
				v-slot="{valid, errors}">
				<b-form-group
					label="Terminal:"
					label-for="lbl_terminal">
					<b-form-select
						id="lbl_terminal"
						:state="errors[0] ? false : (valid ? true : null)"
						v-model="vehicle.terminal">
						<b-form-select-option :value="null">
							Please select terminal
						</b-form-select-option>
						<b-form-select-option
							v-for="item in terminals" :key="item.id"
							:value="item.id">
							{{ item.name }}
						</b-form-select-option>
					</b-form-select>

					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="body_number"
				rules="required|digits:4"
				v-slot="{valid, errors}">
				<b-form-group
					label="Body Number:"
					label-for="lbl_body_number">
					<b-form-input
						v-model="vehicle.body_number"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Body Number">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="plate_number"
				rules="required|max:6"
				v-slot="{valid, errors}" v-if="vehicle.plate_number">
				<b-form-group
					label="Plate Number:"
					label-for="lbl_plate_number">
					<b-form-input
						v-model="vehicle.plate_number"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Plate Number">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="reg_number"
				rules="required|max:30"
				v-slot="{valid, errors}">
				<b-form-group
					label="Registration Number:"
					label-for="lbl_reg_number">
					<b-form-input
						v-model="vehicle.registration_number"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Registration Number">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="make"
				rules="required|max:30"
				v-slot="{valid, errors}">
				<b-form-group
					label="Make:"
					label-for="lbl_make">
					<b-form-input
						v-model="vehicle.make"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Make">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="motor_number"
				rules="required|max:30"
				v-slot="{valid, errors}">
				<b-form-group
					label="Motor Number:"
					label-for="lbl_motor_number">
					<b-form-input
						v-model="vehicle.motor_number"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Motor Number">
					</b-form-input>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<ValidationProvider
				name="chassis_number"
				rules="required|max:30"
				v-slot="{valid, errors}">
				<b-form-group
					label="Chassis Number:"
					label-for="lbl_chassis_number">
					<b-form-input
						v-model="vehicle.chassis_number"
						:state="errors[0] ? false : (valid ? true : null)"
						placeholder="Enter Chassis Number">
					</b-form-input>
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
						v-model="vehicle.date_issued"
						:state="errors[0] ? false : (valid ? true : null)">
					</b-form-datepicker>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<b-row>
				<b-col class="text-center">
					<b-button class="btn" type="submit" variant="primary" size="lg">
						<b-spinner small v-if="loading"></b-spinner>
						Next
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
	name: "Vehicle",
	props: {
		vehicle: Object,
		override_submit: Function,
		is_edit: Boolean,
	},

	mounted: function() {
		this.loading = false;
		this.fail = false;
		this.error_msg = "";

		Axios.get("/get_terminals")
		.then(res => {
			const data = res.data;
			if (data.success && data.results.length > 0) {
				this.terminals = data.results;
			}
		});
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
				this.$localStorage.set("vehicle", JSON.stringify(this.vehicle));
				window.location.href = "/registration?page=4";
			}
		},
	},

	data: function() {
		return {
			loading: false,
			terminals: [],
			fail: false,
			error_msg: "",
		}
	}
}
</script>

<style lang="scss" scoped>
.vehicle {
	padding: 32px;
}
</style>
