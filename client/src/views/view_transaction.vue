<template>
<div class="view_transaction">
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
		<template #cell(selected)="data">
			<b-icon-check v-if="data.value">
			</b-icon-check>
		</template>
	</b-table>
</div>
</template>

<script>

export default {
	name: "ViewTransaction",

	mounted: function() {
	},

	data: function() {
		return {
			fields: [
				{key: "transaction_id", visible: true, label: "Transaction ID"},
				{key: "transaction_dt", sortable: true, visible: true, label: "Date and Time"},
				{key: "transaction_type", sortable: true, visible: true, label: "Type"},
				{key: "customer_name", sortable: true, visible: true, label: "Customer Name"},
				{key: "items", sortable: true, visible: true, label: "Items"},
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
.view_transaction
{
	width: 80%;
	display: block;
	margin: auto;
	margin-top: 24px;
}
</style>
