<template>
<div class="dashboard">
	<b-tabs content-class="mt-3" v-if="signed_in && is_admin"
		justified
		v-model="tab"
		@activate-tab="on_tab_activated">
		<!-- <b&#45;tab title="Driver" lazy> -->
		<!-- 	<TableDrivers :is_admin="is_admin" /> -->
		<!-- </b&#45;tab> -->
	</b-tabs>
</div>
</template>

<script>
// import TableDrivers from "@/components/table_drivers.vue"

export default {
	name: "Dashboard",
	components: {
		// TableDrivers,
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
