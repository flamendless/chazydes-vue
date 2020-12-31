<template>
<div class="all_transactions">
	<b-card>
		<p class="cardTitle">
			All Transactions
		</p>
		<b-table
			hover
			striped
			selectable
			multiple
			@row-clicked="on_row_clicked"
			:items="transactions"
			:filter="filter"
			:fields="visible_fields"
		>
			<template #cell(transaction_id)="data">
				<a :href="'/view_transaction?transaction_id=' + data.item.transaction_id">
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
		Axios.get("/get_all_transactions").then(res => {
			const data = res.data;
			this.transactions = data.results;

			for (let i = 0; i < this.transactions.length; i++) {
				const t = this.transactions[i];

				if (t.type == "walk_in")
					t.transaction_type = "Walk In";
				else if (t.type == "online")
					t.transaction_type = "Online";
			}
		});
	},

	methods:  {

	},

	data: function() {
		return {
			fields: [
				{key: "transaction_id", visible: true, label: "Transaction ID", class: 'text-center'},
				{key: "transaction_dt", sortable: true, visible: true, label: "Date and Time"},
				{key: "transaction_type", sortable: true, visible: true, label: "Type"},
				{key: "fullname", sortable: true, visible: true, label: "Customer Name"},
				{key: "address", sortable: true, visible: true, label: "Address"},
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
	margin: auto;
	padding: 30px;

	.cardTitle
	{
		font-weight: bold;
		text-align: center;
	}


}
</style>
