<template>
<div class="resupply">
	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form @submit.prevent="handleSubmit(on_submit)">
			<b-tabs content-class="mt-3" align="center">
				<b-tab title="Item">
					<div>
						<b-row>
							<b-col lg="6" class="my-1">
								<b-form-group>
										<b-input-group size="sm">
										<b-form-input
											placeholder="Search here"
											v-model="search"
											@update="on_search_change"
										>
										</b-form-input>
										</b-input-group>
								</b-form-group>
							</b-col>

							<b-col lg="6" class="my-1">
								<b-form-group>
									<b-dropdown right text="views" size="sm">
										<b-dropdown-form v-for="field in fields" :key="field.id">
											<b-form-checkbox :disabled="visible_fields.length == 1 && field.visible"
												v-model="field.visible">
												{{ field.label }}
											</b-form-checkbox>
										</b-dropdown-form>
									</b-dropdown>
									<br>
								</b-form-group>
							</b-col>
						</b-row>

						<b-table
							hover
							striped
							selectable
							multiple
							@row-clicked="on_row_clicked"
							:items="items"
							:filter="filter"
							:fields="visible_fields"
						>
							<template #cell(selected)="data">
								<b-icon-check v-if="data.value">
								</b-icon-check>
							</template>
						</b-table>
					</div>
				</b-tab>
				<b-tab title="Supply" lazy>
					<div class="quantityTab">
						<div class="itemSection">
							<div v-if="selected_rows.length == 0">
								<p class="formTitle">
									Please select an item in the Item tab and adjust its supply.
								</p>
							</div>
							<b-form-group v-for="item in selected_rows"
								:key="item.index"
								class="each_item"
							>
								<ValidationProvider
									name="ItemQuantity"
									rules="required"
									v-slot="{errors}"
								>
									<b-row style="margin-bottom: 16px;">
										<b-col>
											<h4>{{item.name}}</h4>
											<b-badge variant="warning">
												Item Code: {{item.code}}
											</b-badge>
											<b-badge variant="danger">
												Qty. in Stock: {{item.qty}}
											</b-badge>
										</b-col>
									</b-row>

									<b-form-input
										type="number"
										v-model="item.qty_sold"
										placeholder="Quantity"
										min="1"
									></b-form-input>

									<b-form-invalid-feedback id="input_feedback">
										{{ errors[0] }}
									</b-form-invalid-feedback>
								</ValidationProvider>
							</b-form-group>
						</div>

						<div class="buttonSection">
							<input
								:disabled="is_submitting == true"
								type="submit"
								class="btn_submit btn btn-primary mb-3"
								text="Submit"
							>
						</div>
					</div>
				</b-tab>
			</b-tabs>
		</b-form>
	</ValidationObserver>
</div>
</template>

<script>

const Axios = require("axios");

export default {
	name: "Resupply",

	mounted: function() {
		Axios.get("/get_items_list").then(res => {
			const data = res.data;
			this.items = data.results;
		});
	},

	data: function() {
		return {
			is_submitting: false,
			toggle_readonly: false,
			search: "",
			filter: null,
			valid: false,
			selected_rows: [],
			form: {
				customer_id: null,
				customer_fullname: "",
				customer_address: "",
				item_details: [],
				purchase_mode: null,
			},
			fields: [
				{key: "selected", visible: true, label: "Selected"},
				{key: "item_id", visible: false, label: "Item ID"},
				{key: "name", sortable: true, visible: true, label: "Item Name"},
				{key: "code", sortable: true, visible: true, label: "Item Code"},
				{key: "qty", sortable: true, visible: true, label: "Stock"},
				{key: "orig_price", sortable: true, visible: true, label: "Original Price"},
				{key: "ret_price", sortable: true, visible: true, label: "Retail Price"},
			],
			items: [],
		}
	},

	computed: {
		visible_fields: function() {
			return this.fields.filter(field => field.visible);
		},
	},

	methods: {
		on_search_change: function() {
			if (this.search.length > 0) this.filter = this.search;
			else this.filter = null;
		},

		on_row_clicked(item) {
			let found = false;
			for (let i = 0; i < this.selected_rows.length; i++) {

				const e = this.selected_rows[i];

				if (e == item) {
					item.selected = false;
					this.selected_rows.splice(i, 1);
					found = true;
					break;
				}
			}

			if (!found) {
				item.qty_sold = null;
				item.selected = true;
				this.selected_rows.push(item);
			}
		},

		on_submit: async function() {

		},
	}
}
</script>

<style lang="scss" scoped>
.resupply
{
	margin: auto;
	margin-top: 24px;
	padding: 16px;

	.quantityTab
	{
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		margin-left: auto;

		.itemSection
		{
			display: flex;
			flex-direction: column;
			margin: auto;
			width: 80%;
			padding: 8px;

			.each_item
			{
				padding: 8px;
				margin-bottom: 32px;
				box-shadow: 0px 0px 8px grey;
				border-radius: 16px;
			}
		}

		.buttonSection
		{
			display: flex;
			flex-direction: column;
			height: 100%;
			position: sticky;
			top: 80px;
			z-index: 1020;
		}

		.formInput
		{
			margin: auto;
			margin-top: 24px;
		}

		.item_badge
		{
			margin: 12px;
			padding: 8px;
		}
	}
}
</style>