<template>
<div class="add_transaction">

	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form @submit.prevent="handleSubmit(on_submit)">
			<b-tabs content-class="mt-3">
				<b-tab title="Customer Profile" active>
					<b-form-group class="formTab1" label-for="input-2">
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
								<option v-for="customer in customer_names"
									:key="customer.id">
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

						{{selected_rows}}
					</div>
				</b-tab>

				<b-tab title="Quantity and Price">
					<div class="formTab3">
						<div class="itemSection">
							<div v-if="selected_rows.length == 0">
								<p class="formTitle">
									Please select an item in the Item tab
								</p>
							</div>
							<b-form-group v-for="item in selected_rows"
								:key="item.index" >
								<ValidationProvider
									name="ItemQuantity"
									rules="required"
									v-slot="{errors}"
								>
									<p>
										{{item.name}}
									</p>

									<b-form-input
										type="number"
										v-model="item.item_quantity"
										placeholder="Quantity"
										min="0"
										@update="calculate_total_price"
									></b-form-input>

									<h5>
										<b-badge class="item_badge" variant="primary">
											&#8369;
											{{item.ret_price}}
										</b-badge>
										x
										<b-badge class="item_badge" variant="info">
											{{item.item_quantity || 0}}
										</b-badge>
										=
										<b-badge class="item_badge" variant="success">
											&#8369;
											{{item.ret_price *
											(item.item_quantity || 0)}}
										</b-badge>
									</h5>

									<b-form-invalid-feedback id="input_feedback">
										{{ errors[0] }}
									</b-form-invalid-feedback>
								</ValidationProvider>

								<hr>
							</b-form-group>
						</div>
						<div class="buttonSection">
							<h4>
								<b-badge class="total_badge" variant="success">
									Total:
									&#8369;
									{{total_price}}
								</b-badge>
							</h4>

							<input :disabled="can_submit == true" type="submit" class="btn_submit btn btn-primary mb-3" text="Submit">
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
	name: "AddTransaction",
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
			total_price: 0,
		}
	},

	computed: {
		visible_fields: function() {
			return this.fields.filter(field => field.visible);
		},
	},

	watch: {
		selected_rows: {
			handler: function() { this.calculate_total_price(); },
			deep: true,
		}
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
				item.item_quantity = null;
				item.selected = true;
				this.selected_rows.push(item);
			}
		},

		calculate_total_price: function() {
			let sum = 0;
			this.selected_rows.forEach(e => {
				sum += e.ret_price * e.item_quantity;
			});
			this.total_price = sum;
		},

		on_update_qty: function() {
			this.calculate_total_price();
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

			alert(JSON.stringify(this.form));
		},
	}
}
</script>

<style lang="scss" scoped>
.add_transaction
{
	width: 80%;
	display: block;
	margin: auto;
	margin-top: 24px;

	.formTab1
	{
		display: block;
		margin: auto;
		width: 50%;

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

	.formTab2
	{

	}

	.formTab3
	{
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		margin-left: auto;

		.itemSection
		{
			display: block;
			margin: auto;
		}

		.buttonSection
		{
			display: flex;
			flex-direction: column;
			height: 100%;
			position: sticky;
			top: 80px;
			z-index: 1020;

			.total_price
			{

			}

			.btn_submit
			{

			}


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
