<template>
<div class="view_transaction">
	<b-tabs
		content-class="mt-3"
		align="center"
		@activate-tab="on_activate_tab"
	>
		<b-tab title="Summary" active>
			<b-button-toolbar aria-label="Actions Toolbar" justify class="btn_toolbar">
				<b-button-group>
					<SaveAsExcel
						ref="save_as_excel"
						name="Transaction"
						:data="transaction_details"
						:fields="fields"
					/>
					<b-button
						variant="primary"
						@click="save_to_pdf()"
					>
						Save to PDF
					</b-button>

					<b-button
						variant="success"
						@click="save_to_pdf(true)"
					>
						Print
					</b-button>
				</b-button-group>
			</b-button-toolbar>

			<b-card class="tableSection">
				<b-table
					id="tbl_transaction"
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
			<b-img
				class="item_img"
				v-if="current_img"
				:src="current_img"
				center
			>
			</b-img>
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
					@change="on_page_change"
				>
				</b-pagination>
			</b-card>
		</b-tab>
	</b-tabs>
</div>
</template>

<script>
const Axios = require("axios");
import jsPDF from "jspdf";
import "jspdf-autotable";
import SaveAsExcel from "@/components/save_as_excel.vue"
export default {
	name: "ViewTransaction",
	components: {
		SaveAsExcel,
	},
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
					date: data.date,
					time: data.time,
					type: data.type,
					customer_name: data.fullname,
					customer_address: data.address,
					qty_sold: data.qty_sold,
					total_price: data.total_price,
					profit: data.profit,
					item_id: data.item_id,
					item_name: data.name,
					item_code: data.code,
				}
				this.transaction_details.push(t);
			}
		}
	},
	methods: {
		on_activate_tab: function(new_i) {
			if (new_i == 1) {
				this.on_page_change(1);
			}
		},
		on_page_change: async function(page_num) {
			if (this.images[page_num] == null) {
				const t = this.transaction_details[page_num - 1];
				const r_img = await Axios.get("/get_image_by_item_id/" + t.item_id);
				if (r_img.data.results.length > 0) {
					const filename = r_img.data.results[0].filename;
					const image = require("@/uploads/" + filename);
					this.images[page_num] = image;
					this.current_img = image;
				}
			} else {
				this.current_img = this.images[page_num];
			}
		},
		save_to_pdf: function(is_print) {
			const doc = new jsPDF();
			const id = this.transaction_details.transaction_id
			doc.autoTable({html: "#tbl_transaction"});
			if (is_print)
				doc.autoPrint();
			doc.save(`tbl_transaction_${id}.pdf`, {
				returnPromise: true,
			}).then(function() {
				if (is_print)
					alert("Please open the pdf file to print");
			});
		},
	},
	data: function() {
		return {
			transaction_details: [],
			current_page: 1,
			current_img: null,
			images: [],
			fields: [
				{key: "transaction_id", label: "Transaction ID", class: "text-center", variant: "info", visible: true, col_width: 5},
				{key: "date", label: "Date", class: "text-center", visible: true, col_width: 15},
				{key: "time", label: "Time", class: "text-center", visible: true, col_width: 15},
				{key: "type", label: "Type", class: "text-center", visible: true, col_width: 10},
				{key: "customer_name", label: "Customer Name", class: "text-center", visible: true, col_width: 20},
				{key: "customer_address", label: "Customer Address", class: "text-center", visible: true, col_width: 20},
				{key: "item_name", label: "Item Name", class: "text-center", visible: true, col_width: 15},
				{key: "item_code", label: "Item Code", class: "text-center", visible: true, col_width: 10},
				{key: "qty_sold", label: "Quantity Sold", class: "text-center", visible: true, col_width: 5},
				{key: "total_price", label: "Total Price", class: "text-center", visible: true, col_width: 10},
				{key: "profit", label: "Profit", class: "text-center", visible: true, col_width: 10},
			],
		}
	},
}
</script>

<style lang="scss" scoped>
.view_transaction
{
	padding: 16px;
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
	.item_img
	{
		width: 256px;
		box-shadow: 0 0 8px grey;
		margin-bottom: 8px;
	}
}
.btn_toolbar {
	margin-bottom: 32px;
	margin: auto;
}
</style>