<template>
<div class="notification">
	<b-card title="Notifications" body-class="text-center">
		<b-card v-b-toggle.tbl_low class="notif"
			@click="click_tbl_low"
		>
			<b-icon
				v-if="items_low.length > 0"
				variant="warning"
				icon="exclamation-circle-fill"
			>
			</b-icon>
			Items Running Low on Stack
		</b-card>
		<div>
			<b-collapse id="tbl_low">
				<b-table
					ref="tbl_low"
					hover
					striped
					bordered
					:busy="busy_low"
					:items="items_low"
					:fields="fields"
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

		<b-card v-b-toggle.tbl_out class="notif"
			@click="click_tbl_out"
		>
			<b-icon
				v-if="items_out.length > 0"
				variant="danger"
				icon="exclamation-circle-fill"
			>
			</b-icon>
			Items Out Of Stock
		</b-card>
		<div>
			<b-collapse id="tbl_out">
				<b-table
					ref="tbl_out"
					hover
					striped
					bordered
					:busy="busy_out"
					:items="items_out"
					:fields="fields"
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
const Axios = require("axios");
export default {
	name: "Notification",
	mounted: function() {
		this.fetch_items_low();
		this.fetch_items_out();
	},
	methods: {
		fetch_items_low: async function() {
			this.busy_low = true;
			const res = await Axios.get("/get_items_low");
			if (res.data.success && res.data.results.length > 0) {
				this.items_low = res.data.results;
			}
			this.busy_low = false;
		},
		fetch_items_out: async function() {
			this.busy_out = true;
			const res = await Axios.get("/get_items_out");
			if (res.data.success && res.data.results.length > 0) {
				this.items_out = res.data.results;
			}
			this.busy_out = false;
		},
		click_tbl_low: function() {
			this.fetch_items_low();
			this.$refs.tbl_low.refresh();
		},
		click_tbl_out: function() {
			this.fetch_items_out();
			this.$refs.tbl_out.refresh();
		}
	},
	data: function() {
		return {
			fields: [
				{key: "item_id", visible: false, label: "Item ID"},
				{key: "name", sortable: true, visible: true, label: "Item Name"},
				{key: "code", sortable: true, visible: true, label: "Item Code"},
				{key: "qty", sortable: true, visible: true, label: "Stock"},
				{key: "orig_price", sortable: true, visible: true, label: "Original Price"},
				{key: "ret_price", sortable: true, visible: true, label: "Retail Price"},
			],
			busy_low: false,
			busy_out: false,
			items_out: [],
			items_low: [],
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