<template>
<div class="driver_info">
	<b-card>
		<b-card-header style="font-size: 1.75rem;">
			Driver Info
		</b-card-header>

		<b-card-title>
			<div class="text-center img">
				<b-img :src="img" width="256" v-if="img"></b-img>
				<b-avatar size="128px" v-else></b-avatar>
			</div>

			<b-badge :variant="get_variant(info.verified)" @click="on_verify"
				v-b-tooltip.hover.bottom title="click to verify/unverify account">
				{{ info.verified == 0 ? "unverified" : "verified" }}
			</b-badge>

			<b-badge :variant="get_variant(info.license_id)" @click="on_license"
				v-b-tooltip.hover.bottom title="click to view license">
				License
			</b-badge>

			<b-badge :variant="get_variant(info.tricycle_id)" @click="on_vehicle"
				v-b-tooltip.hover.bottom title="click to view tricycle" v-if="info.tricycle_id">
				Tricycle
			</b-badge>

			<b-badge :variant="get_variant(info.bukyo_id)" @click="on_vehicle"
				v-b-tooltip.hover.bottom title="click to view bukyo" v-if="info.bukyo_id">
				Bukyo
			</b-badge>
		</b-card-title>

		<b-card-body style="font-size: 1.25rem;">
			<b-table stacked :items="info_array" :fields="fields">
			</b-table>
		</b-card-body>
	</b-card>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "DriverInfo",
	props: {
		info: Object,
	},

	mounted: function() {
		Axios.get("/get_image/" + this.info.picture_id)
		.then(res => {
			const data = res.data;
			if (data.results.length > 0)
				this.img = require("@/uploads/" + data.results[0].name);
		});

		const keys = Object.keys(this.info);
		const d = {};

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			d[key] = this.info[key];
		}

		this.info_array.push(d);
	},

	methods: {
		on_verify: function() {
			if (sessionStorage["is_admin"]) {
				if (window.confirm("Are you sure you want to verify this data?"))
				{
					Axios.post("/verify_account", {email: this.info.email})
						.then(res => {
							const data = res.data;
							if (data.success) alert("Account verified successfully");
							else alert("Account verified unsuccessfully");

							this.info.verified = true;
						});
				} else alert("You must contact the admin for verification");
			}
		},
		on_license: function() {
			if (this.info.license_id)
				window.location.href = "/view_info?license=1&id=" + this.info.license_id;
			else
				alert("Has no registered license")
		},
		on_vehicle: function() {
			if (this.info.tricycle_id)
				window.location.href = "/view_info?vehicle=1&id=" + this.info.tricycle_id;
			else if (this.info.bukyo_id)
				window.location.href = "/view_info?vehicle=2&id=" + this.info.bukyo_id;
			else
				alert("Has no registered vehicle")
		},
		get_variant: function(item) {
			if (item)
				return "success";
			return "danger";
		}
	},

	data: function() {
		return {
			img: null,
			info_array: [],
			fields: [
				{key: "email", label: "E-Mail: "},
				{key: "lname", label: "Last Name: "},
				{key: "mname", label: "Middle Name: "},
				{key: "fname", label: "First Name: "},
				{key: "birthdate", label: "Birthdate: "},
				{key: "sex", label: "Sex: "},
				{key: "address", label: "Address: "},
				{key: "status", label: "Status: "},
				{key: "contact_number", label: "Contact Number: "},
				{key: "weight", label: "Weight (kg): "},
				{key: "height", label: "Height (m): "},
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.driver_info {
	padding: 32px;
	text-align: center;

	.badge {
		cursor: pointer;
		box-shadow: 0 0 8px grey;
		margin-left: 16px;
		margin-right: 16px;
	}

	.img {
		padding: 16px;
	}
}
</style>
