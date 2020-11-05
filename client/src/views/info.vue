<template>
<div class="info">
	<DriverInfo v-if="is_driver" :info="item" />
	<LicenseInfo v-if="is_license" :info="item" />
	<VehicleInfo v-if="is_vehicle" :info="item" />
</div>
</template>

<script>
import DriverInfo from "@/components/driver_info.vue"
import LicenseInfo from "@/components/license_info.vue"
import VehicleInfo from "@/components/vehicle_info.vue"

const Axios = require("axios");

export default {
	name: "Info",
	components: {
		DriverInfo,
		LicenseInfo,
		VehicleInfo,
	},

	mounted: function() {
		this.is_driver = false;
		this.is_license = false;
		this.is_vehicle = false;

		const params = this.$route.params;

		if (params && params.driver) {
			this.is_driver = true;
			this.item = params.info;
		} else if (params && params.license) {
			this.is_license = true;
			this.item = params.info;
		} else {
			const query = this.$route.query;
			const id = query.id;

			if (query.driver) {
				Axios.get("/get_driver/" + id)
					.then(res => {
						const data = res.data;
						if (data.success) {
							this.item = data.results[0];
							this.is_driver = true;
						}
					});
			} else if (query.license) {
				Axios.get("/get_license/" + id)
					.then(res => {
						const data = res.data;
						if (data.success) {
							this.item = data.results[0];
							this.is_license = true;
						}
					});
			} else if (query.vehicle == 1) {
				Axios.get("/get_tricycle/" + id)
					.then(res => {
						const data = res.data;
						if (data.success) {
							this.item = data.results[0];
							this.item.is_tricycle = true;
							this.is_vehicle = true;
						}
					});
			} else if (query.vehicle == 2) {
				Axios.get("/get_bukyo/" + id)
					.then(res => {
						const data = res.data;
						if (data.success) {
							this.item = data.results[0];
							this.item.is_tricycle = false;
							this.is_vehicle = true;
						}
					});
			}
		}
	},

	data: function() {
		return {
			item: {},
			is_driver: false,
			is_license: false,
			is_vehicle: false,
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
