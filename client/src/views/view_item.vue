<template>
<div class="view_item">
	<b-tabs content-class="mt-3">
		<b-tab title="View Item" active>
			<div class="tabContent">
				<b-card class="pictureSection" v-if="item">
					<b-card-img class="itemPic" src="../uploads/goblet.png" />
					<b-button class="changeButton" variant="primary" size="sm">
						Upload Picture
					</b-button>

					<b-card-footer>
						<b-badge :variant="get_qty_variant(item)">
							Qty: {{item.qty}}
						</b-badge>
						<b-badge variant="info">
							Orig. Price: <span>&#8369;</span>{{item.orig_price}}
						</b-badge>
						<b-badge variant="success">
							Ret. Price: <span>&#8369;</span>{{item.ret_price}}
						</b-badge>
					</b-card-footer>
				</b-card>

				<b-card class="tableSection">
					<b-table bordered stacked :items="items" :fields="fields">
					</b-table>
				</b-card>
			</div>
		</b-tab>

		<b-tab title="Edit Item" class="tabContent">
		</b-tab>
	</b-tabs>

</div>
</template>

<script>
export default {
	name: "ViewItem",

	mounted: function() {
		this.item = this.$route.params;
		this.items.push(this.item);
	},

	methods: {
		get_qty_variant: function(item) {
			const qty = item.qty;
			if (qty == 0) return "danger";
			else if (qty < 10) return "warning";
			else return "primary";
		},
	},

	data: function() {
		return {
			item: null,
			items: [],
			fields: [
				{
					key: "name",
					variant: "info",
				},
				{
					key: "code",
				},
				{
					key: "qty",
					variant: "info",
				},
				{
					key: "ret_price",
				},
				{
					key: "orig_price",
					variant: "info",
				},
			],
		}
	},
}
</script>

<style lang="scss" scoped>
.view_item
{
	width: 80%;
	display: block;
	margin: auto;
	margin-top: 24px;

	.tabContent
	{
		display: flex;
		flex-direction: row;

		.pictureSection
		{
			width: 30%;
			margin-right: 20px;
			box-shadow: 0 0 2px grey;

			.itemPic
			{
				width: 70%;
				display: block;
				margin: auto;
			}

			.changeButton
			{
				display: block;
				margin: auto;
				margin-top: 16px;
				margin-bottom: 16px;
			}

			.card-footer
			{
				border: none;
				padding: 0;
				background-color: white;

				.badge
				{
					margin-left: 4px;
					margin-right: 4px;
				}
			}
		}

		.tableSection
		{
			width: 70%;
			box-shadow: 0 0 2px grey;

			.itemText
			{
				text-align: center;
			}
		}
	}
}
</style>
