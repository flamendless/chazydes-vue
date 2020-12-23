<template>
<div class="view_transaction">
	<b-card class="tableSection" style="font-size: 1.25rem;">
		<b-table bordered stacked :items="transaction" :fields="fields">

		</b-table>
	</b-card>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "ViewTransaction",
	props: {
	},

	mounted: function() {
		Axios.get("/get_transactions").then(res => {
			const data = res.data;
			if (data.success) {
				this.transaction.push(data.results[0]);
			}
		});
	},

	data: function() {
		return {
			transaction: [],
			fields: [
				{key: "transaction_id", label: "Transaction ID", class: 'text-center', variant: "info",},
				{key: "transaction_dt", label: "Date and Time", class: 'text-center'},
				{key: "type", label: "Type", class: 'text-center', variant: "info",},
				{key: "customer_id", label: "Customer ID", class: 'text-center'},
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