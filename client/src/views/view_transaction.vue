<template>
<div class="view_transaction">
	<b-card class="tableSection" style="font-size: 1.25rem;">
		<b-table bordered stacked :items="transaction_details" :fields="fields">

		</b-table>
	</b-card>
</div>
</template>

<script>
export default {
	name: "ViewTransaction",
	props: {
	},

	mounted: function() {
		alert(JSON.stringify(this.$route.query));

	},

	data: function() {
		return {
			transaction_details: [
				{
					transaction_id: 1,
					transaction_dt: "January 1, 2021 / 1:00 PM",
					transaction_type: "Online",
					customer_name: "John Doe",
					items: [
						{
							name: "Spoon",
							code: "spoon1",
							qty: 1,
							orig_price: 25,
							ret_price: 30,
						}
					],
				}
			],
			fields: [
				{key: "transaction_id", label: "Transaction ID", class: 'text-center', variant: "info",},
				{key: "transaction_dt", label: "Date and Time", class: 'text-center'},
				{key: "transaction_type", label: "Type", class: 'text-center', variant: "info",},
				{key: "customer_name", label: "Customer Name", class: 'text-center'},
			],
		}
	},
}
</script>

<style lang="scss" scoped>
.view_transaction
{
	width: 70%;
	display: block;
	margin: auto;
	padding: 50px;

	.tableSection
	{
		box-shadow: 0 0 2px grey;

		.itemText
		{
			text-align: center;
		}
	}
}
</style>