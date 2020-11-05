<template>
<div class="dashboard">
	<b-tabs content-class="mt-3" v-if="signed_in && is_admin"
		justified
		v-model="tab"
		@activate-tab="on_tab_activated">
		<b-tab title="Driver" lazy>
			<TableDrivers :is_admin="is_admin" />
		</b-tab>
		<b-tab title="License" lazy>
			<TableLicenses :is_admin="is_admin" />
		</b-tab>
		<b-tab title="Tricycle" lazy>
			<TableTricycles :is_admin="is_admin" />
		</b-tab>
		<b-tab title="Bukyo" lazy>
			<TableBukyo :is_admin="is_admin" />
		</b-tab>
		<b-tab title="Terminal" lazy>
			<TableTerminals :is_admin="is_admin" />
		</b-tab>
	</b-tabs>
</div>
</template>

<script>
import TableDrivers from "@/components/table_drivers.vue"
import TableLicenses from "@/components/table_licenses.vue"
import TableTricycles from "@/components/table_tricycles.vue"
import TableBukyo from "@/components/table_bukyo.vue"
import TableTerminals from "@/components/table_terminals.vue"

const Axios = require("axios");

export default {
	name: "Dashboard",
	components: {
		TableDrivers,
		TableLicenses,
		TableTricycles,
		TableBukyo,
		TableTerminals,
	},

	mounted: function() {
		this.tab = Number(this.$route.query.tab) || 0;
		this.email = sessionStorage["email"];
		this.signed_in = sessionStorage["signed_in"];

		if (!this.signed_in) {
			alert("You must sign in first");
			this.$router.push({name: "SignIn"});
		}

		if (sessionStorage["is_admin"])
			this.is_admin = true;
		else {
			this.$router.push({
				name: "ViewInfo",
				params: {
					driver: true,
					info: this.$route.params.info,
				}
			});
		}
	},

	methods: {
		on_tab_activated: function(next) {
			const url = new URL(window.location.href);
			const sp = url.searchParams;
			sp.set("tab", next);
			url.search = sp.toString();
			const new_url = url.toString();
			window.history.replaceState({}, null, new_url);
		}
	},

	data: function() {
		return {
			is_admin: false,
			signed_in: false,
			email: null,
			tab: 0,
		}
	},
}
</script>

<style lang="scss" scoped>
.dashboard {
	padding: 16px;
}
</style>
