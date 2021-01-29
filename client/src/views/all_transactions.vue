<template>
<div class="all_transactions">
	<b-card>
		<p class="cardTitle">
			All Transactions
		</p>

		<b-button-toolbar aria-label="Actions Toolbar" justify class="btn_toolbar">
			<b-form-group>
				<b-input-group>
					<b-form-input
						v-model="search" placeholder="Search here"
						@update="on_search_change">
					</b-form-input>
					<b-input-group-append>
						<b-input-group-text>
							<font-awesome-icon icon="search" />
						</b-input-group-text>
					</b-input-group-append>
				</b-input-group>
			</b-form-group>

			<b-button-group>
				<SaveAsExcel
					ref="save_as_excel"
					name="AllTransactions"
					:data="transactions"
					:fields="visible_fields"
					:filter="filter"
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

		<b-table
			id="tbl_all_transactions"
			hover
			striped
			selectable
			multiple
			:items="transactions"
			:filter="filter"
			:fields="visible_fields"
		>
			<template #cell(transaction_id)="data">
				<a :href="'/view_transaction?t_id=' + data.item.transaction_id">
					TID#{{data.item.transaction_id }}
				</a>
			</template>
		</b-table>
	</b-card>
</div>
</template>

<script>
const Axios = require("axios");
import jsPDF from "jspdf";
import "jspdf-autotable";
import SaveAsExcel from "@/components/save_as_excel.vue"
export default {
	name: "AllTransactions",
	components: {
		SaveAsExcel,
	},
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
		on_search_change: function() {
			if (this.search.length > 0) this.filter = this.search;
			else this.filter = null;
		},
		save_to_pdf: function(is_print) {
			const doc = new jsPDF();
			doc.autoTable({html: "#tbl_all_transactions"});
			if (is_print)
				doc.autoPrint();
			doc.save("tbl_all_transactions.pdf", {
				returnPromise: true,
			}).then(function() {
				if (is_print)
					alert("Please open the pdf file to print");
			});
		},
	},
	data: function() {
		return {
			fields: [
				{key: "transaction_id", visible: true, label: "Transaction ID", class: "text-center", col_width: 5},
				{key: "date", sortable: true, visible: true, label: "Date", col_width: 15},
				{key: "time", sortable: true, visible: true, label: "Time", col_width: 15},
				{key: "transaction_type", sortable: true, visible: true, label: "Type", col_width: 10},
				{key: "fullname", sortable: true, visible: true, label: "Customer Name", col_width: 25},
				{key: "address", sortable: true, visible: true, label: "Address", col_width: 25},
			],
			filter: null,
			search: "",
			transactions: []
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
	width: 90%;
	margin: auto;
	padding: 16px;
	.cardTitle
	{
		font-weight: bold;
		text-align: center;
	}
	.btn_toolbar {
		margin-bottom: 32px;
	}
}
</style>