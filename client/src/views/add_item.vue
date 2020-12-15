<template>
<div class="add_item">
	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form @submit.prevent="handleSubmit(on_submit)">
			<div class="formItems">
				<b-form-group class="formGroup1" label-for="input-2">
					<p class="formTitle">
						Item Information
					</p>
					<ValidationProvider
						name="ItemName"
						rules="required"
						v-slot="{errors}"
					>
						<h6>Item Name</h6>
						<b-form-input
							class="formInput"
							type="text"
							v-model="form.item_name"
							:state="errors[0] ? false : (valid ? true : null)"
							placeholder="Item Name"
						>
						</b-form-input>

						<b-form-invalid-feedback id="input_feedback">
							{{ errors[0] }}
						</b-form-invalid-feedback>
					</ValidationProvider>

					<ValidationProvider
						name="ItemQuantity"
						rules="required"
						v-slot="{errors}"
					>
						<h6>Item Quantity</h6>
						<div class="input-group">
							<b-form-input
								class="formInput"
								type="number"
								v-model="form.item_quantity"
								placeholder="Item Quantity"
								min="0"
							></b-form-input>
							<div class="input-group-append">
								<span class="input-group-text formInput" id="basic-addon1">qty</span>
							</div>
						</div>

						<b-form-invalid-feedback id="input_feedback">
							{{ errors[0] }}
						</b-form-invalid-feedback>
					</ValidationProvider>

					<ValidationProvider
						name="RetailPrice"
						rules="required"
						v-slot="{errors}"
					>
						<h6>Retail Price</h6>
						<div class="input-group">
							<div class="input-group-prepend">
								<span class="input-group-text formInput" id="basic-addon1">&#8369;</span>
							</div>
							<b-form-input
								class="formInput"
								type="number"
								step="any"
								v-model="form.ret_price"
								:state="errors[0] ? false : (valid ? true : null)"
								placeholder="Retail Price"
								min="0"
							></b-form-input>
						</div>

						<b-form-invalid-feedback id="input_feedback">
							{{ errors[0] }}
						</b-form-invalid-feedback>
					</ValidationProvider>

					<ValidationProvider
						name="OriginalPrice"
						rules="required"
						v-slot="{errors}"
					>
						<h6>Original Price</h6>
						<div class="input-group">
							<div class="input-group-prepend">
								<span class="input-group-text formInput" id="basic-addon1">&#8369;</span>
							</div>
							<b-form-input
								class="formInput"
								type="number"
								step="any"
								v-model="form.orig_price"
								:state="errors[0] ? false : (valid ? true : null)"
								placeholder="Original Price"
								min="0"
							></b-form-input>
						</div>
						<b-form-invalid-feedback id="input_feedback">
							{{ errors[0] }}
						</b-form-invalid-feedback>
					</ValidationProvider>

					<ValidationProvider
						name="Supplier Name"
						rules="required"
						v-slot="{errors}"
					>
						<h6>Supplier Name</h6>
						<b-form-input
							class="formInput"
							list="supplier-list"
							v-model="form.supplier_name"
							:state="errors[0] ? false : (valid ? true : null)"
							placeholder="Supplier Name"
						>
						</b-form-input>
						<b-form-invalid-feedback id="input_feedback">
							{{ errors[0] }}
						</b-form-invalid-feedback>

						<datalist id="supplier-list">
							<option v-for="supplier in supplier_list"
								:key="supplier.name">
								{{supplier.name}}
							</option>
						</datalist>
					</ValidationProvider>

					<b-form-file v-model="form.image_name" class="mt-3" plain>
					</b-form-file>
					<div class="mt-3">
						Selected file: {{ form.image_name ? form.image_name.name : '' }}
					</div>
				</b-form-group>

				<input type="submit" class="btn_submit btn btn-primary mt-3" text="Submit">
			</div>
		</b-form>
	</ValidationObserver>
</div>
</template>

<script>

export default {
	name: "AddItem",

	data: function() {
		return {
			form: {
				item_name: "",
				image_name: null,
				orig_price: 0,
				ret_price: 0,
				supplier_name: "",
			},
			valid: false,
			supplier_list: [{supplier_id: 1, name: "KitchenWareHouse"}],
		}
	},

	methods: {
		on_submit: function() {
			alert(JSON.stringify(this.form));
			console.log(this.form);
		}
	}
}
</script>

<style lang="scss" scoped>
.add_item
{
	width: 80%;
	display: block;
	margin: auto;
	margin-top: 24px;

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
			margin-bottom: 24px;
		}

		.form-control
		{
			display: inline;
		}
	}
}
</style>