<template>
<div class="all_transactions">
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
			<a :href="'/TID?transaction_id=' + data.item.transaction_id">
				TID#{{data.item.transaction_id }}
			</a>
		</template>
	</b-table>
</div>
</template>

<script>

export default {
	name: "AllTransactions",

	mounted: function() {

	},

	methods:  {

	},

	data: function() {
		return {
			fields: [
				{key: "transaction_id", visible: true, label: "Transaction ID", class: 'text-center'},
				{key: "transaction_dt", sortable: true, visible: true, label: "Date and Time"},
				{key: "transaction_type", sortable: true, visible: true, label: "Type"},
				{key: "customer_name", sortable: true, visible: true, label: "Customer Name"},
			],
			filter: null,
			transactions: [
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
	margin-top: 24px;
}
</style>
