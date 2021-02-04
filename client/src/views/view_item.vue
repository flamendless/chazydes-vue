<template>
<div class="view_item">
	<b-tabs
		content-class="mt-3"
		align="center"
	>
		<b-tab title="View Item" active>
			<div class="tabContent">
				<b-card class="pictureSection" v-if="item">
					<b-card-img
						class="itemPic"
						v-if="images[current_image]"
						:src="images[current_image]"
					/>
					<b-card-img
						class="itemPic"
						v-else
						src="../assets/template_qm.png"
					/>

					<b-row class="image_row">
						<b-col
							v-for="(img, i) in images"
							:key="'image' + i"
						>
							<b-button
								variant="link"
								@click="current_image = i"
							>
								<b-card-img
									fluid
									:src="images[i]"
								>
								</b-card-img>
							</b-button>
						</b-col>
					</b-row>

					<b-card-footer>
						<b-badge :variant="get_qty_variant(item)">
							Qty: {{item.qty}}
						</b-badge>
						<b-badge variant="info">
							Orig. Price: <span>&#8369;</span>{{item.orig_price}}
						</b-badge>
						<b-badge variant="success">
							Ret. Price: <span>&#8369;</span>{{item.ret_price}}
						</b-badge>
					</b-card-footer>
				</b-card>

				<b-card class="tableSection">
					<b-table
						bordered
						stacked
						:items="items"
						:fields="fields">
					</b-table>
				</b-card>
			</div>
		</b-tab>

		<b-tab title="Edit Item" class="tabContent" lazy>
			<EditItem :form="form" :str_images="str_images" />
		</b-tab>
		<b-tab title="Delete Item" class="tabContent" lazy>
			<DeleteItem :form="form" :str_images="str_images" />
		</b-tab>
	</b-tabs>
</div>
</template>

<script>
const Axios = require("axios");
import EditItem from "@/components/edit_item.vue";
import DeleteItem from "@/components/delete_item.vue";

export default {
	name: "ViewItem",
	components: {
		EditItem,
		DeleteItem
	},

	mounted: async function() {
		const q = this.$route.query;
		const item_id = q.item_id;

		const r_item = await Axios.get("/get_item/" + item_id);
		const results = r_item.data.results;

		for (let i = 0; i < results.length; i++) {
			const filename = results[i].filename;
			const image = require("@/uploads/" + filename);

			this.str_images.push(filename);
			this.images.push(image);
		}

		this.item = results[0];
		this.items.push(this.item);

		this.form.item_id = this.item.item_id;
		this.form.name = this.item.name;
		this.form.code = this.item.code;
		this.form.qty = this.item.qty;
		this.form.orig_price = this.item.orig_price;
		this.form.ret_price = this.item.ret_price;
		this.form.supplier_id = this.item.supplier_id;
		this.form.supplier_name = this.item.supplier_name;
	},

	methods: {
		get_qty_variant: function(item) {
			const qty = item.qty;
			if (qty == 0) return "danger";
			else if (qty < 10) return "warning";
			else return "primary";
		},
	},

	data: function() {
		return {
			str_images: [],
			images: [],
			current_image: 0,
			item: null,
			items: [],
			form: {},
			fields: [
				{key: "name", label: "Name:"},
				{key: "code", label: "Code:"},
				{key: "qty", label: "Qty/Stock:"},
				{key: "ret_price", label: "Retail Price:"},
				{key: "orig_price", label: "Original Price:"},
				{key: "supplier_name", label: "Supplier:"},
			],
		}
	},
}
</script>

<style lang="scss" scoped>
.view_item
{
	padding: 16px;

	.tabContent
	{
		padding: 32px;
		display: flex;
		flex-direction: row;

		.image_row
		{
			padding: 8px;
			margin-bottom: 16px;
		}

		.pictureSection
		{
			width: 40%;
			box-shadow: 0 0 2px grey;
			margin-right: 32px;

			.itemPic
			{
				margin-bottom: 16px;
			}

			.card-footer
			{
				border: none;
				padding: 0;
				background-color: white;
				text-align: center;

				.badge
				{
					margin-left: 4px;
					margin-right: 4px;
				}
			}
		}

		.tableSection
		{
			width: 70%;
			box-shadow: 0 0 2px grey;

			.itemText
			{
				text-align: center;
			}
		}
	}
}
</style>
