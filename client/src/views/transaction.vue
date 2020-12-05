<template>
<div class="transaction">

	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form @submit.prevent="handleSubmit(on_submit)">

			<input :disabled="can_submit == false" type="submit" class="btn_submit btn btn-primary mt-3" text="Submit">

			<b-tabs content-class="mt-3">
				<b-tab title="Customer Profile" active>
					<div class="formItems">
						<b-form-group class="formGroup1" label-for="input-2">
							<p class="formTitle">
								Customer Profile
							</p>

							<ValidationProvider
								name="FullName"
								rules="required"
								v-slot="{errors}"
							>
								<b-form-input
									class="formInput"
									list="customer-list"
									v-model="form.fullname"
									:state="errors[0] ? false : (valid ? true : null)"
									placeholder="Full Name"
									@update="autofill_address(form.fullname)"
								>
								</b-form-input>

								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>

								<datalist id="customer-list">
									<option v-for="customer in customer_names" :key="customer">
										{{customer.fullname}}
									</option>
								</datalist>

							</ValidationProvider>
							<ValidationProvider
								name="Address"
								rules="required"
								v-slot="{errors}"
							>
								<b-form-input
									class="formInput"
									type="text"
									v-model="form.address"
									:state="errors[0] ? false : (valid ? true : null)"
									placeholder="Address"
									:readonly="toggle_readonly"
								></b-form-input>
								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>
							</ValidationProvider>
							<ValidationProvider
								name="PurchaseMode"
								rules="required"
								v-slot="{errors}"
							>
								<div class="radioButtons">
									<label>Purchase Type:</label>

									<span>
										<input type="radio" id="online_button" value="online" v-model="form.purchase_mode">
										<label class="radio_input" for="online_button">Online</label>
									</span>

									<span>
										<input type="radio" id="walkin_button" value="walk-in" v-model="form.purchase_mode">
										<label class="radio_input" for="walkin_button">Walk-in</label>
									</span>
								</div>
								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>
							</ValidationProvider>
						</b-form-group>
					</div>
				</b-tab>

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
							@row-selected="onRowSelected"
							:items="items"
							:filter="filter"
							:fields="visible_fields"
						>
						<template #cell(selected)="{ rowSelected }">
							<template v-if="rowSelected">
								<span aria-hidden="true">&check;</span>
								<span class="sr-only">Selected</span>
							</template>
							<template v-else>
								<span aria-hidden="true">&nbsp;</span>
								<span class="sr-only">Not selected</span>
							</template>
						</template>
						</b-table>
					</div>
				</b-tab>

				<b-tab title="Item Quantity">
					<div class="formItems">
						<div v-if="selected_rows.length == 0">
							<p class="formTitle">
								Please select an item in the Item tab
							</p>
						</div>

						<b-form-group v-for="quantity_list in selected_rows" :key="quantity_list">
							<ValidationProvider
								name="ItemQuantity"
								rules="required"
								v-slot="{errors}"
							>
								<b-form-label>
									{{quantity_list.name}}
								</b-form-label>
								<b-form-input
									type="number"
									v-model="quantity_list.item_quantity"
									placeholder="Quantity"
								></b-form-input>
								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>
							</ValidationProvider>
						</b-form-group>
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
	name: "Transaction",
	components: {
	},

	mounted: function() {
		Axios.get("/get_items_list").then(res => {
			const data = res.data;
			this.items = data.results;
		});

		Axios.get("/get_customers").then(res => {
			const data = res.data;
			this.customer_names = data.results;
		});

	},

	data: function() {
		return {
			can_submit: false,
			toggle_readonly: false,
			search: "",
			filter: null,
			valid: false,
			selected_rows: [],
			form: {
				fullname: "",
				address: "",
				purchase_mode: "",
				item_details: [],
			},
			fields: [
				{key: "selected", visible: true, label: "Selected"},
				{key: "name", sortable: true, visible: true, label: "Item Name"},
				{key: "code", sortable: true, visible: true, label: "Item Code"},
				{key: "qty", sortable: true, visible: true, label: "Quantity"},
				{key: "orig_price", sortable: true, visible: true, label: "Original Price"},
				{key: "ret_price", sortable: true, visible: true, label: "Retail Price"},
			],
			items: [],
			customer_names: [],
		}
	},

	computed: {
		visible_fields: function() {
			return this.fields.filter(field => field.visible);
		}
	},

	methods: {
		on_search_change: function() {
			if (this.search.length > 0) this.filter = this.search;
			else this.filter = null;
		},

		onRowSelected(items) {
			this.selected_rows = items;
		},

		autofill_address: function(customer_name) {
			for (let i = 0; i < this.customer_names.length; i++){
				if (this.customer_names[i].fullname === customer_name){
					this.form.address = this.customer_names[i].address
					this.toggle_readonly = true;
					break;
				}
				else {
					this.toggle_readonly = false;
				}
			}
		},

		on_submit: function() {
			for (let i = 0; i < this.selected_rows.length; i++){
				this.form.item_details.push({
					item_name: this.selected_rows[i].name,
					item_quantity: this.selected_rows[i].item_quantity
				});
			}

			console.log(JSON.stringify(this.form));
		},
	}
}
</script>

<style lang="scss" scoped>
.transaction
{
	width: 80%;
	display: block;
	margin: auto;
	margin-top: 24px;

	.btn_submit
	{
		display: block;
		margin-left: auto;
	}

	.formItems
	{
		width: 50%;
		display: block;
		margin: auto;

		.formTitle
		{
			font-weight: bold;
			text-align: center;
		}

		.formInput
		{
			margin: auto;
			margin-top: 24px;
		}

		.radioButtons
		{
			margin-top: 24px;
			display: flex;
			justify-content: space-evenly;

			.radio_input
			{
				margin-left: 8px;
				margin-right: 8px;
			}
		}
	}
}
</style>
