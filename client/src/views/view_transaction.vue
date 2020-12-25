<template>
<div class="view_transaction">
	<b-tabs content-class="mt-3">
		<b-tab title="Summary" active>
			<b-card class="tableSection">
				<b-table
					bordered
					stacked
					:items="transaction_details"
					:fields="fields"
					small
				>
				</b-table>
			</b-card>
		</b-tab>

		<b-tab title="Single">
			<b-card class="tableSection">
				<b-table
					id="tbl_transaction"
					bordered
					stacked
					:items="transaction_details"
					:fields="fields"
					per-page="1"
					:current-page="current_page"
					small
				>
				</b-table>
				<b-pagination
					v-model="current_page"
					per-page="1"
					:total-rows="transaction_details.length"
					aria-controls="tbl_transaction"
					align="center"
				>
				</b-pagination>
			</b-card>
		</b-tab>
	</b-tabs>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "ViewTransaction",

	mounted: async function() {
		const q = this.$route.query;
		const t_id = q.t_id;

		const r_transaction = await Axios.get("/get_transaction/" + t_id);

		const res = r_transaction.data.results
		if (res.length > 0) {
			for (let i = 0; i < res.length; i++) {
				const data = res[i];
				const t = {
					transaction_id: data.transaction_id,
					transaction_dt: data.transaction_dt,
					type: data.type,
					customer_name: data.fullname,
					customer_address: data.address,
					qty_sold: data.qty_sold,
					total_price: data.total_price,
					profit: data.profit,
					item_name: data.name,
					item_code: data.code,
				}

				this.transaction_details.push(t);
			}
		}
	},

	data: function() {
		return {
			transaction_details: [],
			current_page: 1,
			fields: [
				{key: "transaction_id", label: "Transaction ID", class: 'text-center', variant: "info",},
				{key: "transaction_dt", label: "Date and Time", class: 'text-center'},
				{key: "type", label: "Type", class: 'text-center'},
				{key: "customer_name", label: "Customer Name", class: 'text-center'},
				{key: "customer_address", label: "Customer Address", class: 'text-center'},
				{key: "item_name", label: "Item Name", class: 'text-center'},
				{key: "item_code", label: "Item Code", class: 'text-center'},
				{key: "qty_sold", label: "Quantity Sold", class: 'text-center'},
				{key: "total_price", label: "Total Price", class: 'text-center'},
				{key: "profit", label: "Profit", class: 'text-center'},
			],
		}
	},
}
</script>

<style lang="scss" scoped>
.view_transaction
{
	.tableSection
	{
		margin: auto;
		width: 80%;
		border: none;

		.itemText
		{
			text-align: center;
		}
	}
}
</style>
