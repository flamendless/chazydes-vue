<template>
<div class="all_transactions">
	<b-card>
		<p class="cardTitle">
			All Transactions
		</p>
		<b-table
			hover
			striped
			bordered
			@row-clicked="on_row_clicked"
			:items="transactions"
			:filter="filter"
			:fields="visible_fields"
		>
			<template #cell(transaction_id)="data">
				<a :href="'/TID?transaction_id=' + data.item.transaction_id">
					TID#{{data.item.transaction_id }}
				</a>
			</template>
		</b-table>
	</b-card>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "AllTransactions",

	mounted: function() {
		Axios.get("/get_transactions").then(res => {
			const data = res.data;
			this.transactions = data.results;
		});
	},

	methods:  {

	},

	data: function() {
		return {
			fields: [
				{key: "transaction_id", visible: true, label: "Transaction ID", class: 'text-center'},
				{key: "transaction_dt", sortable: true, visible: true, label: "Date and Time"},
				{key: "type", sortable: true, visible: true, label: "Type"},
				{key: "customer_id", sortable: true, visible: true, label: "Customer ID"},
			],
			filter: null,
			transactions: [
				{

				}
			]
		}
	},

	computed: {
		visible_fields: function() {
			return this.fields.filter(field => field.visible);
		},
	},
}
</script>


<style lang="scss" scoped>
.all_transactions
{
	width: 80%;
	display: block;
	margin: auto;
	padding: 30px;

	.cardTitle
	{
		font-weight: bold;
		text-align: center;
	}


}
</style>
