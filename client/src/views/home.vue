<template>
<div id="home">
	<div class="body" v-if="signed_in == false">
		<b-jumbotron
			header="Welcome"
			:lead="website_name"
			class="text-center">

			<hr class="my-4">

			<b-button variant="primary" :href="href_sign_in" class="btn" size="lg">
				Sign In
			</b-button>

			<b-button variant="info" :href="href_sign_up" class="btn" size="lg">
				Sign Up
			</b-button>
		</b-jumbotron>
	</div>
</div>
</template>

<script>
export default {
	name: "Home",

	mounted: function() {
		if (sessionStorage["signed_in"])
		{
			this.signed_in = true;
			this.$router.push({
				name: "Dashboard",
			});
		}
	},

	data: function() {
		return {
			signed_in: false,
			href_sign_in: "/sign_in",
			href_sign_up: "/registration",
			website_name: "Regulatory Board of Tricycle and Bukyo Zone-3 TODA",
		}
	},
}
</script>

<style lang="scss" scoped>
.body {
	padding: 16px;
}

.btn {
	margin-left: 32px;
	margin-right: 32px;
}
</style>
