<template>
<div class="dashboard">
	<b-tabs content-class="mt-3" v-if="signed_in && is_admin"
		justified
		v-model="tab"
		@activate-tab="on_tab_activated">
	</b-tabs>
	<div>
		<b-card-group deck class="gallery"
			v-for="i in (items.length / items_per_row)" :key="'item' + i">
			<b-card class="gallery-item"
				v-for="j in items_per_row" :key="'card' + j"
				@click="item_on_click(i, j)">

				<b-card-img class="item-image" src="../uploads/goblet.png" />
				<b-card-title class="card-title">
					{{get_item(i, j).name}}
				</b-card-title>
				<b-card-text><b>Code: </b>
					{{get_item(i, j).code}}
				</b-card-text>
				<b-card-footer>
					<b-badge :variant="get_qty_variant(items[index(i, j)])">
						Qty: {{get_item(i, j).qty}}
					</b-badge>
					<b-badge variant="info">
						Orig. Price: <span>&#8369;</span>
						{{get_item(i, j).orig_price}}
					</b-badge>
					<b-badge variant="success">
						Ret. Price: <span>&#8369;</span>
						{{get_item(i, j).ret_price}}
					</b-badge>
				</b-card-footer>
			</b-card>
		</b-card-group>
	</div>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "Dashboard",

	created: function() {
		window.addEventListener("resize", this.resize);
	},

	destroyed: function() {
		window.removeEventListener("resize", this.resize);
	},

	mounted: function() {
		this.tab = Number(this.$route.query.tab) || 0;
		this.email = sessionStorage["email"];
		this.signed_in = sessionStorage["signed_in"];

		if (!this.signed_in) {
			alert("You must sign in first");
			this.$router.push({name: "SignIn"});
		}

		if (sessionStorage["is_admin"])
			this.is_admin = true;

		Axios.get("/get_items/10").then(res => {
			const data = res.data;
			this.items = data.results;
			// console.log("Item Length: " + data.results.length)
			// this.items.forEach(function(item) {
			// 	console.log("Name: " + item.name)
			// })
		});

		this.$nextTick(function () {
			this.width = window.innerWidth;
		})
	},

	watch: {
		width: function(new_width){
			if (new_width > 900) this.items_per_row = 5;
			else if (new_width > 640) this.items_per_row = 4;
		}
	},

	methods: {
		resize: function(e) {
			const w = e.currentTarget.innerWidth;
			this.width = w;
		},

		get_item: function(i, j) {
			const idx = this.index(i, j);

			if (idx < this.items.length) {
				return this.items[idx];
			} else
				return {
					name: "",
					code: "",
					qty: "",
					orig_price: "",
					ret_price: "",
				};
		},

		item_on_click: function(i, j) {
			const idx = this.index(i, j);

			if (idx < this.items.length) {
				const item = this.items[idx];

				this.$router.push({
					name: "ViewItem",
					params: {
						name: item.name,
						code: item.code,
						qty: item.qty,
						orig_price: item.orig_price,
						ret_price: item.ret_price,
					}
				});
			}
		},

		get_qty_variant: function(item) {
			const qty = item.qty;
			if (qty == 0) return "danger";
			else if (qty < 10) return "warning";
			else return "primary";
		},

		on_tab_activated: function(next) {
			const url = new URL(window.location.href);
			const sp = url.searchParams;
			sp.set("tab", next);
			url.search = sp.toString();
			const new_url = url.toString();
			window.history.replaceState({}, null, new_url);
		},

		index: function(i, j){
			return (this.items_per_row * (i-1) + (j-1));
		},
	},

	data: function() {
		return {
			width: 0,
			is_admin: false,
			signed_in: false,
			email: null,
			tab: 0,
			items_per_row: 5,
			items: [],
		}
	},

}
</script>

<style lang="scss" scoped>
.dashboard
{
	padding: 16px;

	.gallery
	{
		margin: 16px;

		.gallery-item
		{
			box-shadow: 0 0 8px grey;

			.item-image
			{
				padding: 8px;
				box-shadow: 0 0 4px grey;
			}

			.card-title
			{
				padding-top: 12px;
				padding-bottom: 12px;
				text-align: center;
			}

			.card-footer
			{
				border: none;
				padding: 0;
				background-color: white;

				.badge
				{
					margin-left: 4px;
					margin-right: 4px;
				}
			}
		}
	}
}

</style>
