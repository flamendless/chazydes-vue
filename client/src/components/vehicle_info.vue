<template>
<div class="vehicle_info">
	<b-card>
		<b-card-header style="font-size: 1.75em;">
			Vehicle Info: {{ info.is_tricycle ? "Tricycle" : "Bukyo" }}
		</b-card-header>

		<b-card-body style="font-size: 1.25em;">
			<b-table stacked :items="info_array" :fields="fields">
			</b-table>
		</b-card-body>
	</b-card>
</div>
</template>

<script>
export default {
	name: "DriverInfo",
	props: {
		info: Object,
	},

	mounted: function() {
		const keys = Object.keys(this.info);
		const d = {};

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			d[key] = this.info[key];
		}

		this.info_array.push(d);
	},

	data: function() {
		return {
			img: null,
			info_array: [],
			fields: [
				{key: "driver_name", label: "Driver Name: "},
				{key: "registration_number", label: "Registration Number: "},
				{key: "date_issued", label: "Date Issued: "},
				{key: "terminal_name", label: "Terminal: "},
				{key: "plate_number", label: "Plate Number: "},
				{key: "body_number", label: "Body Number: "},
				{key: "chassis_number", label: "Chassis Number: "},
				{key: "motor_number", label: "Motor Number: "},
				{key: "make", label: "Make: "},
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.vehicle_info {
	padding: 32px;
	text-align: center;
}
</style>
