<template>
<div class="edit_item">
	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form
			@submit.prevent="handleSubmit(on_submit)"
			enctype="multipart/form-data"
		>
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
						<h6>Name</h6>
						<b-form-input
							class="formInput"
							type="text"
							v-model="form.name"
							:state="errors[0] ? false : (valid ? true : null)"
							placeholder="Name"
						>
						</b-form-input>

						<b-form-invalid-feedback id="input_feedback">
							{{ errors[0] }}
						</b-form-invalid-feedback>
					</ValidationProvider>

					<ValidationProvider
						name="ItemCode"
						rules="required"
						v-slot="{errors}"
					>
						<h6>Code</h6>
						<b-form-input
							class="formInput"
							type="text"
							v-model="form.code"
							:state="errors[0] ? false : (valid ? true : null)"
							placeholder="Code"
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
						<h6>Quantity</h6>
						<div class="input-group">
							<b-form-input
								class="formInput"
								type="number"
								v-model="form.qty"
								placeholder="Quantity"
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
							@update="on_supplier_update"
							placeholder="Supplier Name"
						>
						</b-form-input>
						<b-form-invalid-feedback id="input_feedback">
							{{ errors[0] }}
						</b-form-invalid-feedback>

						<datalist id="supplier-list">
							<option v-for="supplier in supplier_list"
								:key="supplier.supplier_id">
								{{supplier.name}}
							</option>
						</datalist>
					</ValidationProvider>

					<b-form-file
						:required="images.length == 0"
						multiple
						plain
						placeholder="Choose single/multiple file(s)"
						v-model="temp_images"
						accept="image/*"
						no-drop
						@input="on_file_change"
						style="margin-top: 32px"
					>
					</b-form-file>

					<b-row class="images">
						<b-col v-for="(img, i) in images" :key="i">
							<b-img
								fluid
								:src="get_img_url(img)"
							>
							</b-img>
							<b-button class="img_btn" variant="danger" size="sm"
								@click="remove_img(i)"
							>
								<b-icon-x></b-icon-x>
							</b-button>
						</b-col>
					</b-row>
				</b-form-group>

				<b-row>
					<b-col class="text-center">
						<input
							type="submit"
							class="btn btn-primary mt-3"
							text="Submit"
							:disabled="is_submitting"
						>
					</b-col>
				</b-row>
			</div>
		</b-form>
	</ValidationObserver>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "EditItem",
	props: {
		form: Object,
		str_images: Array,
	},

	mounted: function() {
		Axios.get("/get_suppliers").then(res => {
			const data = res.data;
			this.supplier_list = data.results;
		});

		this.orig_form = {...this.form};

		for (let i = 0; i < this.str_images.length; i++) {
			const str = this.str_images[i];
			const config = {
				url: "http://localhost:8080/uploads/" + str,
				method: "get",
				responseType: "blob"
			}
			Axios.request(config).then(data => {
				const file = new File([data], str, {type: "image/png"});

				console.log(data, file)

				this.images.push(file);
				this.original_images.push(file);
				this.temp_images.push(file);
			});
		}
	},

	data: function() {
		return {
			original_images: [],
			orig_form: {},
			images: [],
			temp_images: [],
			valid: false,
			supplier_list: [],
			is_submitting: false,
		}
	},

	methods: {
		remove_img: function(i) {
			this.images.splice(i, 1);
			this.temp_images.splice(i, 1);
		},
		get_img_url: function(img) {
			return URL.createObjectURL(img);
		},
		on_file_change: function(images) {
			this.images.push(...images);
		},
		on_supplier_update: function(value) {
			for (let i = 0; i < this.supplier_list.length; i++) {
				const supplier = this.supplier_list[i];
				if (supplier.name == value)
				{
					this.form.supplier_id = supplier.supplier_id;
					break;
				}
			}
		},
		array_difference: function(array1, array2) {
			let a = [];
			let a1 = [...array1];
			let a2 = [...array2];
			let diff = [];

			for (let i = 0; i < a1.length; i++) {
				a[a1[i]] = true;
			}

			for (let i = 0; i < a2.length; i++) {
				if (a[a2[i]])
					delete a[a2[i]];
				else
					a[a2[i]] = true;
			}

			for (let k in a) {
				diff.push(k);
			}

			return diff;
		},
		on_submit: async function() {
			this.is_submitting = true;

			if (this.form.supplier_name !== this.orig_form.supplier_name) {
				const r_supplier = await Axios.post("/new_supplier", {
					name: this.form.supplier_name,
				});

				this.form.supplier_id = r_supplier.data.results.insertId;
			}

			const item_id = this.form.item_id;
			const r_item = await Axios.post("/update_item", this.form);
			console.log(r_item);

			const diffed = this.array_difference(this.original_images, this.images);

			if (diffed.length > 0) {
				const to_remove = [];
				const to_add = [];

				for (let i = 0; i < this.original_images.length; i++) {
					const vi = this.original_images[i];
					let found = false;

					for (let j = 0; j < diffed.length; j++) {
						const vj = diffed[j];

						if (vi == vj) {
							found = true;
						}
					}

					if (!found) {
						to_remove.push(vi);
					}
				}

				for (let i = 0; i < diffed.length; i++) {
					const vi = diffed[i];
					let found = false;

					for (let j = 0; j < this.images.length; j++) {
						const vj = this.images[j];

						if (vi == vj) {
							found = true;
						}
					}

					if (!found) {
						to_add.push(vi);
					}
				}

				if (to_remove.length > 0) {
					for (let i = 0; i < to_remove.length; i++) {
						const r_remove = await Axios.post("/remove_item_image", {
							item_id: item_id,
							filename: to_remove[i],
						});
						console.log(r_remove);
					}
				}

				if (to_add.length > 0) {
					const fd = new FormData();
					fd.append("item_id", item_id);

					for (let i = 0; i < to_add.length; i++) {
						const img = to_add[i];
						fd.append("img_items", img)
					}

					const r_images = await Axios({
						method: "post",
						url: "/upload_item_images",
						data: fd,
						headers: {"Content-Type": "multipart/form-data"}
					});

					if (r_images.data.success) {
						alert("Item successfully added!");
						this.$router.push({
							name: "ViewItem",
							query: {
								item_id: item_id,
							}
						});
					}
				}
				this.is_submitting = false;
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.edit_item
{
	padding: 32px;
	width: 90%;
	margin: auto;

	h6 {
		margin-top: 32px;
	}

	.formItems
	{
		width: 75%;
		margin: auto;

		.formTitle
		{
			font-weight: bold;
			text-align: center;
		}

		.formInput
		{
			margin: auto;
		}

		.form-control
		{
			display: inline;
		}
	}

	.images
	{
		margin-top: 32px;

		.img_btn
		{
			position: absolute;
			top: 0%;
			left: 100%;
			transform: translate(-100%, -50%);
		}
	}
}
</style>
