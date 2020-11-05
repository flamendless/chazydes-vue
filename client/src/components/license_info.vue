<template>
<div class="license_info">
	<b-card>
		<b-card-header style="font-size: 1.75rem;">
			License Info
		</b-card-header>

		<b-card-title>
			<div class="text-center img">
				<b-img :src="img" width="256" v-if="img"></b-img>
				<b-avatar size="128px" v-else></b-avatar>
			</div>
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

	data: function() {
		return {
			img: null,
			info_array: [],
			fields: [
				{key: "driver_name", label: "Driver Name: "},
				{key: "date_issued", label: "Date Issued: "},
				{key: "agency_code", label: "Agency Code: "},
				{key: "restrictions", label: "Restrictions: "},
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.license_info {
	padding: 32px;
	text-align: center;

	.img {
		padding: 16px;
	}
}
</style>
