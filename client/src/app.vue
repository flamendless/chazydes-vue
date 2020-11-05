<template>
<div id="app">
	<NavBar :website_name="website_name" />

	<div class="content">
		<router-view/>
	</div>

	<!-- <Footer /> -->
</div>
</template>

<script>
import NavBar from "@/components/navbar.vue"
// import Footer from "@/components/footer.vue"

export default {
	name: "App",
	components: {
		NavBar,
		// Footer,
	},
	data: function() {
		return {
			website_name: "Chazydes",
		}
	},

	meta_info: {
		titleTemplate: "%s | Chazydes",
		meta: [
			{charset: "utf-8"},
			{name: "viewport", content: "width=device-width, initial-scale=1"},
			{name: "description", content: "Chazydes"},
			{name: "keywords", content: "shop,kitchen,supplies"},
			{name: "robots", content: "index,follow"},
			{property: "og:title", content: "Chazydes"},
			{property: "og:site_name", content: "Chazydes"},
			{property: "og:type", content: "website"},
		]
	},
}
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background-color: white;
}
</style>
