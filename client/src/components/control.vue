<template>
	<b-card
		overlay
		text-variant="white"
		:title="this.name"
		body-class="text-left"
		:img-src="this.background"
		class="control"
		@click="panel_on_click()"
	>
		<b-card-text>
			{{this.desc}}
		</b-card-text>
	</b-card>
</template>

<script>
export default {
	name: "Control",
	props: {
		name: String,
		background: String,
		desc: String,
		href: String,
	},
	methods: {
		panel_on_click: function()
		{
			this.$router.push({
				path: this.href
			});
		}
	},
}
</script>

<style lang="scss" scoped>
.control
{
	margin: 32px;
	box-shadow: 0 0 8px grey;
	cursor: pointer;
}
</style>