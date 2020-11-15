<template>
<div class="transaction">
	<b-button class="submitButton" variant="primary">Submit</b-button>
	<b-tabs content-class="mt-3">
		<b-tab title="Customer Profile" active>
			<div class="formItems">
				<b-form-group class="formGroup1" label-for="input-2">
					<b-form-label>
						<p class="formTitle1">
							Customer Profile
						</p>
					</b-form-label>
					<b-form-input
						class="formInput"
						required
						placeholder="First Name"
					></b-form-input>
					<b-form-input
						class="formInput"
						required
						placeholder="Last Name"
					></b-form-input>
					<b-form-input
						class="formInput"
						required
						placeholder="Address"
					></b-form-input>
				</b-form-group>
			</div>
		</b-tab>
		<b-tab title="Item Information">
			<div>
				<b-col lg="6" class="my-1">

				<b-form-group>
					<b-input-group size="sm">
					<b-form-input
						v-model="search"
						placeholder="Search here"
						@update="on_search_change">
					</b-form-input>
					</b-input-group>
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
				</b-form-group>

				</b-col>
				<b-table
					:items="items"
					:filter="filter"
					:fields="visible_fields"
				>

				</b-table>
			</div>
		</b-tab>
		<b-tab title="Item Quantity">
			<div class="formItems">
				<b-form-group>
					<div class="custom-control custom-radio">
						<input type="radio" id="customRadio2" name="customRadio" class="custom-control-input" />
						<label class="custom-control-label" for="customRadio2">Online</label>
					</div>
					<div class="custom-control custom-radio">
						<input type="radio" id="customRadio1" name="customRadio" class="custom-control-input" />
						<label class="custom-control-label" for="customRadio1">Walk-in</label>
					</div>
					<b-form-input
						class="formInput"
						required
						type="number"
						placeholder="Quantity"
					></b-form-input>
				</b-form-group>
			</div>
		</b-tab>
	</b-tabs>
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
			search: "",
			fields: [
				{key: "id", sortable: true, visible: true, label: "Item ID"},
				{key: "name", sortable: true, visible: true, label: "Item Name"},
				{key: "code", sortable: true, visible: true, label: "Item Code"},
				{key: "qty", sortable: true, visible: true, label: "Quantity"},
				{key: "orig_price", sortable: true, visible: true, label: "Original Price"},
				{key: "ret_price", sortable: true, visible: true, label: "Retail Price"},
			],
			items: [
			],
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
			if (this.search.length > 0) this.filter = this.search;
			else this.filter = null;
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

.submitButton
{
	display: block;
	margin-left: auto;
}
.formTitle1
{
	font-weight: bold;
	text-align: center;
}

.formInput
{
	margin: auto;
	margin-top: 24px;
}

.formItems
{
	width: 50%;
	display: block;
	margin: auto;
}
</style>