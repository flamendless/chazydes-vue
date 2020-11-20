<template>
<div class="item">
	<b-tabs content-class="mt-3">
		<b-tab title="View Item" active>
			<div class="tabContent">
				<b-card class="pictureSection">
					<b-card-img class="itemPic" src="../uploads/goblet.png" />
					<b-button class="changeButton" variant="primary">Upload Picture</b-button>
					<b-card-footer>
					<b-badge class="itemBadge" variant="primary">Quantity: {{qty}}</b-badge>
					<b-badge class="itemBadge" variant="info">Original Price: <span>&#8369;</span>{{orig_price}}</b-badge>
					<b-badge class="itemBadge" variant="success">Retail Price: <span>&#8369;</span>{{ret_price}}</b-badge>
				</b-card-footer>
				</b-card>
				<b-card class="tableSection">
					<b-table bordered stacked :items="items" :fields="fields">
					</b-table>
				</b-card>
			</div>
		</b-tab>
		<b-tab title="Edit Item" class="tabContent">
		</b-tab>
	</b-tabs>

</div>
</template>

<script>
export default {

	name: "Item",
	components: {
	},

	props: ['name', 'code', 'qty', 'ret_price', 'orig_price'],

	data: function() {
		return {
			fields: [
				{
					key: 'item_name',
					variant: 'info',
				},
				{
					key: 'item_code',
				},
				{
					key: 'item_quantity',
					variant: 'info',
				},
				{
					key: 'retail_price',

				},
				{
					key: 'original_price',
					variant: 'info',
				},
			],


			items: [
				{item_name: this.name, item_code: this.code, item_quantity: this.qty,
				retail_price: this.ret_price, original_price: this.orig_price},
			],
		}
	},
}
</script>

<style>
.item
{
	width: 80%;
	display: block;
	margin: auto;
	margin-top: 24px;
}

.item .tabContent
{
	display: flex;
	flex-direction: row;
}

.item .tabContent .pictureSection
{
	width: 30%;
	margin-right: 20px;
	box-shadow: 0 0 2px grey;
}

.item .tabContent
.pictureSection .itemBadge
{
	width: 50%;
	display: block;
	margin: auto;
	margin-top: 8px;
}

.item .tabContent
.pictureSection .itemPic
{
	width: 70%;
	display: block;
	margin: auto;
}

.item .tabContent
.pictureSection .changeButton
{
	display: block;
	margin: auto;
	margin-top: 20px;
	margin-bottom: 20px;
}

.item .tabContent .tableSection
{
	width: 70%;
	box-shadow: 0 0 2px grey;
}

.item .tabContent
.tableSection .itemText
{
	text-align: center;
}

</style>