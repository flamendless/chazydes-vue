<template>
<div class="report">
	<h2 align="center">
		Reports
	</h2>

	<b-form @submit.prevent="handleSubmit(on_submit)">
		<b-row style="padding: 32px;">
			<b-col>
				<b-form-group>
					<label for="datepicker_from">Select begin date</label>
					<b-form-datepicker
						id="datepicker_from"
						v-model="date_from"
						:max="date_to"
					>
					</b-form-datepicker>
				</b-form-group>
			</b-col>

			<b-col>
				<b-form-group>
					<label for="datepicker_to">Select end date</label>
					<b-form-datepicker
						id="datepicker_to"
						v-model="date_to"
						:min="date_from"
						:max="date_today"
					>
					</b-form-datepicker>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row>
			<b-col class="text-center">
				<b-button class="btn" variant="primary" size="lg"
					:disabled="date_from == null || date_to == null"
					@click="generate_report"
				>
					Generate Report
				</b-button>
			</b-col>
		</b-row>
	</b-form>

	<b-row
		style="padding: 32px;"
		v-if="transactions.length > 0"
	>
		<b-button-toolbar aria-label="Actions Toolbar" justify class="btn_toolbar">
			<b-form-group style="margin-right: 64px;">
				<b-dropdown right text="views">
					<b-dropdown-form v-for="field in fields" :key="field.transaction_id">
						<b-form-checkbox :disabled="visible_fields.length == 1 && field.visible"
							v-model="field.visible">
							{{ field.label }}
						</b-form-checkbox>
					</b-dropdown-form>
				</b-dropdown>
			</b-form-group>

			<b-button-group>
				<SaveAsExcel
					ref="save_as_excel"
					name="Report"
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
			id="tbl_report"
			hover
			striped
			bordered
			small
			:fields="visible_fields"
			:items="transactions"
			:busy="is_busy"
		>
			<template #cell(orig_price)="data">
				<b-badge class="price_badge" variant="info">
					&#8369;
					{{data.item.orig_price}}
				</b-badge>
			</template>
			<template #cell(ret_price)="data">
				<b-badge class="price_badge" variant="success">
					&#8369;
					{{data.item.ret_price}}
				</b-badge>
			</template>
			<template #cell(qty)="data">
				<b-badge class="price_badge" v-if="data.item.qty == 0" variant="danger">
					{{data.item.qty}}
				</b-badge>
			</template>
		</b-table>

	</b-row>

	<div v-if="empty">
		<h1 align="center" style="margin: 32px;">
			No data found within selected dates.
			Try selecting a lower "begin date".
		</h1>
	</div>
</div>
</template>

<script>
const Axios = require("axios");
import jsPDF from "jspdf";
import "jspdf-autotable";
import SaveAsExcel from "@/components/save_as_excel.vue"

export default {
	name: "Report",
	props: {
		info: Object,
	},
	components: {
		SaveAsExcel,
	},

	methods: {
		generate_report: async function() {

			this.is_busy = true;
			const r_report = await Axios.post("/get_transactions_range", {
				date_from: this.date_from,
				date_to: this.date_to,
			});

			if (r_report.data.success && r_report.data.results > 0) {
				this.empty = false;
				this.transactions = r_report.data.results;
			} else {
				this.empty = true;
			}
			this.is_busy = false;
		},
		save_to_pdf: function(is_print) {
			const doc = new jsPDF();
			doc.autoTable({html: "#tbl_report"});

			if (is_print)
				doc.autoPrint();

			doc.save("tbl_report.pdf", {
				returnPromise: true,
			}).then(function() {
				if (is_print)
					alert("Please open the pdf file to print");
			});
		},
	},

	computed: {
		visible_fields: function() {
			return this.fields.filter(field => field.visible);
		},
	},

	data: function() {
		return {
			fields: [
				{key: "transaction_id", label: "Transaction ID", class: "text-center", visible: true, col_width: 5},
				{key: "date", label: "Date", class: "text-center", visible: true, col_width: 15},
				{key: "time", label: "Time", class: "text-center", visible: true, col_width: 15},
				{key: "type", label: "Type", class: "text-center", visible: true, col_width: 10},
				{key: "customer_name", label: "Customer Name", class: "text-center", visible: true, col_width: 20},
				{key: "customer_address", label: "Customer Address", class: "text-center", visible: true, col_width: 25},
				{key: "item_name", label: "Item Name", class: "text-center", visible: true, col_width: 15},
				{key: "item_code", label: "Item Code", class: "text-center", visible: true, col_width: 10},
				{key: "qty_sold", label: "Quantity Sold", class: "text-center", visible: true, col_width: 5},
				{key: "total_price", label: "Total Price", class: "text-center", visible: true, col_width: 10},
				{key: "profit", label: "Profit", class: "text-center", visible: true, col_width: 10},
			],
			filter: null,
			transactions: [],
			is_busy: false,
			empty: false,
			date_from: null,
			date_to: new Date(),
			date_today: new Date(),
		}
	},
}
</script>

<style lang="scss" scoped>
.report
{
	padding: 16px;
}

.btn_toolbar {
	margin-bottom: 32px;
}
</style>
