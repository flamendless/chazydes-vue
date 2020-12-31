<template>
<div class="notification">
	<b-card title="Notifications" body-class="text-center">
		<b-card v-b-toggle.table1 class="notif">
			Items Out Of Stock
		</b-card>
		<div>
			<b-collapse id="table1">
				<b-table
					hover
					striped
					selectable
					multiple
					bordered
					@row-clicked="on_row_clicked"
					:items="items1"
					:filter="filter"
					:fields="visible_fields"
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

		<b-card v-b-toggle.table2 class="notif">
			Items Running Low on Stack
		</b-card>

		<div>
			<b-collapse id="table2">
				<b-table
					hover
					striped
					selectable
					multiple
					bordered
					@row-clicked="on_row_clicked"
					:items="items2"
					:filter="filter"
					:fields="visible_fields"
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
						<b-badge class="price_badge" v-if="data.item.qty < 20" variant="warning">
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
const Axios = require("axios");

export default {
	name: "Notification",
	props: {
		info: Object,
	},

	mounted: function() {
		Axios.get("/get_items_list").then(res => {
			const data = res.data;

			this.items1 = data.results;
			this.items2 = data.results;

			this.items1 = this.items1.filter(item => item.qty == 0);
			this.items2 = this.items2.filter(item => item.qty < 10);
		});
	},

	data: function() {
		return {
			fields: [
				{key: "selected", visible: true, label: "Selected"},
				{key: "item_id", visible: false, label: "Item ID"},
				{key: "name", sortable: true, visible: true, label: "Item Name"},
				{key: "code", sortable: true, visible: true, label: "Item Code"},
				{key: "qty", sortable: true, visible: true, label: "Stock"},
				{key: "orig_price", sortable: true, visible: true, label: "Original Price"},
				{key: "ret_price", sortable: true, visible: true, label: "Retail Price"},
			],
			items1: [],
			items2: [],
		}
	},
}
</script>

<style lang="scss" scoped>
.notification
{
	.notif
	{
		width: 50%;
		margin: auto;
		box-shadow: 0 0 8px grey;
		margin-bottom: 16px;
	}

	.price_badge
	{
		padding: 8px;
	}
}
</style>
