<template>
<div class="report">
	<b-card title="Reports" body-class="text-center">
		<div class="report_container">
			<label for="example-datepicker">Choose a report from: </label>
			<b-form-datepicker
				id="datepicker_from"
				v-model="date_from"
				:max="date_to"
				:date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
				class="datepicker mb-2"
			>
			</b-form-datepicker>

			<label for="example-datepicker">Choose a report up to: </label>
			<b-form-datepicker
				id="datepicker_to"
				v-model="date_to"
				:min="date_from"
				:max="date_today"
				:date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
				class="datepicker mb-2"
			>
			</b-form-datepicker>

			<b-button variant="primary" v-b-toggle.report_table @click="print_date">
				Generate Report
			</b-button>
		</div>
		<div>
			<b-collapse id="report_table">
				<b-table
					hover
					striped
					selectable
					multiple
					bordered
					:filter="date_from"
					:filter-function="filter_report"
					@row-clicked="on_row_clicked"
					:items="transactions"
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
			</b-collapse>
		</div>
	</b-card>
</div>
</template>

<script>

export default {
	name: "Report",
	props: {
		info: Object,
	},

	mounted: function() {

	},

	methods: {
		print_date: function(){

		},

		filter_report: function(row, filter) {
			if (row.date_sold >= filter && row.date_sold <= this.date_to){
				return true;
			}
		},
	},

	computed: {
		visible_fields: function() {
			return this.fields.filter(field => field.visible);
		},
	},

	data: function() {
		const now = new Date();
		const today = now.toISOString().split('T')[0];

		return {
			fields: [

			],
			transactions: [
				{
					item_name: "Spoon",
					quantity_sold: 3,
					total_price: 300,
					profit: 150,
					date_sold: "2021-01-18",
				},
				{
					item_name: "Fork",
					quantity_sold: 4,
					total_price: 350,
					profit: 200,
					date_sold: "2021-01-19",
				},
				{
					item_name: "Plate",
					quantity_sold: 2,
					total_price: 400,
					profit: 400,
					date_sold: "2021-01-20",
				},
			],
			date_from: "",
			date_to: today,
			date_today: today,
		}
	},
}
</script>

<style lang="scss" scoped>
.report
{
	padding: 16px;

	.report_container
	{
		display: flex;
	}

	.datepicker
	{
		width: 20%;
		margin: auto;
		box-shadow: 0 0 8px grey;
		margin-bottom: 16px;
	}

	.sample_card
	{
		width: 20%;
		margin: auto;
		background-color: red;
	}
}
</style>