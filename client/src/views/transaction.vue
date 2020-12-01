<template>
<div class="transaction">

	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form @submit.prevent="handleSubmit(on_submit)">
			<input type="submit" class="btn btn-primary mt-3" text="Submit">
			<b-tabs content-class="mt-3">
				<b-tab title="Customer Profile" active>
					<div class="formItems">
						<b-form-group class="formGroup1" label-for="input-2">
							<b-form-label>
								<p class="formTitle1">
									Customer Profile
								</p>
							</b-form-label>
							<ValidationProvider
								name="FirstName"
								rules="required"
								v-slot="{errors}"
							>
								<b-form-input
									type="text"
									v-model="form.fname"
									:state="errors[0] ? false : (valid ? true : null)"
									placeholder="First Name"
								>
								</b-form-input>
								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>
							</ValidationProvider>
							<ValidationProvider
								name="LastName"
								rules="required"
								v-slot="{errors}"
							>
								<b-form-input
									type="text"
									v-model="form.lname"
									:state="errors[0] ? false : (valid ? true : null)"
									placeholder="Last Name"
								>
								</b-form-input>
								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>
							</ValidationProvider>
							<ValidationProvider
								name="Address"
								rules="required"
								v-slot="{errors}"
							>
								<b-form-input
									type="text"
									v-model="form.address"
									:state="errors[0] ? false : (valid ? true : null)"
									placeholder="Address"
								></b-form-input>
								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>
							</ValidationProvider>
						</b-form-group>
					</div>
				</b-tab>
				<b-tab title="Item Information">
					<div>
						<b-col lg="6" class="my-1">

						<b-form-group>
							<ValidationProvider
								name="Address"
								rules="required"
								v-slot="{errors}"
							>
								<b-input-group size="sm">
								<b-form-input
									v-model="form.item_name"
									placeholder="Search here"
									list="item-list"
									@update="on_search_change">
								</b-form-input>
								</b-input-group>
								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>
							</ValidationProvider>

						</b-form-group>

						<b-form-group>
						<b-dropdown right text="views">
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
						<b-table
							hover
							striped
							selectable
							@row-selected="onRowSelected"
							:select-mode="selectMode"
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
						<p>
							Selected Rows: {{selectedRows}}
						</p>
					</div>
				</b-tab>
				<b-tab title="Item Quantity">
					<div class="formItems">
						<b-form-group>
							<ValidationProvider
								name="PurchaseMode"
								rules="required"
								v-slot="{errors}"
							>
								<input type="radio" id="online_button" value="online" v-model="form.purchase_mode">
								<label for="online_button"> Online</label>
								<br>
								<input type="radio" id="walkin_button" value="walk-in" v-model="form.purchase_mode">
								<label for="walkin_button"> Walk-in</label>
								<b-form-invalid-feedback id="input_feedback">
									{{ errors[0] }}
								</b-form-invalid-feedback>
							</ValidationProvider>
							<ValidationProvider
								name="ItemQuantity"
								rules="required"
								v-slot="{errors}"
							>
								<b-form-input
									type="number"
									v-model="form.item_quantity"
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
		Axios.get("/get_items/10").then(res => {
			const data = res.data;
			this.items = data.results;
		});
	},

	data: function() {
		return {
			selectMode: 'multiple',
			form: {
				fname: "",
				lname: "",
				address: "",
				item_name: "",
				purchase_mode: "",
				item_quantity: 0,
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
			selectedRows: [],
		}
	},

	computed: {
		visible_fields: function() {
			return this.fields.filter(field => field.visible);
		}
	},

	methods: {
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length;
			this.currentPage = 1;
		},

		on_search_change: function() {
			if (this.form.item_name.length > 0) this.filter = this.form.item_name;
			else this.filter = null;
		},

		on_submit: function() {
			console.dir("Form: " + this.form);
		},

		onRowSelected(items) {
			this.selectedRows = items;
		},
	}
}

</script>


<style lang="scss" scoped>
.transaction
{
	width: 65%;
	display: block;
	margin: auto;
	margin-top: 24px;
}

.transaction .submitButton
{
	display: block;
	margin-left: auto;
}
.transaction .formItems
.formTitle1
{
	font-weight: bold;
	text-align: center;
}

.transaction .formItems
.formInput
{
	margin: auto;
	margin-top: 24px;
}

.transaction .formItems
{
	width: 50%;
	display: block;
	margin: auto;
}
</style>