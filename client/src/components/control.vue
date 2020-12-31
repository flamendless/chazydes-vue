<template>
	<b-card
		overlay
		text-variant="white"
		:title="this.name"
		body-class="text-left"
		:img-src="this.background"
		class="control_panel"
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
		name: Object,
		background: Object,
		desc: Object,
		href: Object,
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

.control_panel
{
	padding: 16px;
	cursor: pointer;
}
</style>