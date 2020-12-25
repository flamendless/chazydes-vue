<template>
<div class="all_items">
	<b-tabs content-class="mt-3" v-if="signed_in && is_admin"
		justified
		v-model="tab"
		@activate-tab="on_tab_activated">
	</b-tabs>

	<div v-if="items.length > 0">
		<b-card-group deck class="gallery"
			v-for="i in get_item_count" :key="'item' + i"
		>
			<b-card
				:class="{gallery_item: check_valid_item(i, j) == true}"
				v-for="j in items_per_row" :key="'card' + j"
				@click="item_on_click(i, j)">

				<b-card-img
					v-if="check_valid_item(i, j)"
					class="item-image"
					:src="get_item(i, j).image"
				/>
				<b-card-title v-if="check_valid_item(i, j)" class="card-title">
					{{get_item(i, j).name}}
				</b-card-title>

				<b-card-text v-if="check_valid_item(i, j)">
					<b>Code: </b>
					{{get_item(i, j).code}}
				</b-card-text>

				<b-card-footer v-if="check_valid_item(i, j)">
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
	name: "AllItems",

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

		Axios.get("/get_items").then(res => {
			const data = res.data;
			this.items = data.results;

			for (let i = 0; i < this.items.length; i++) {
				const item = this.items[i];

				if (item.filename) {
					item.image = require("@/uploads/" + item.filename);
				} else {
					item.image = require("@/assets/template_qm.png");
				}
			}
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

	computed: {
		get_item_count: function() {
			const r = Math.ceil(this.items.length/this.items_per_row);
			return r;
		},
	},

	methods: {
		index: function(i, j){
			return (this.items_per_row * (i-1) + (j-1));
		},
		check_valid_item: function(i, j) {
			const idx = this.index(i, j);
			return idx < this.items.length;
		},
		resize: function(e) {
			const w = e.currentTarget.innerWidth;
			this.width = w;
		},
		check_valid: function(i) {
			const n = Math.floor(this.items.length/i);
			let d = this.items_per_row;

			if (this.items.length - n > 0)
				d = this.items.length - n - i;

			return d;
		},

		get_item: function(i, j) {
			const idx = this.index(i, j);

			if (idx < this.items.length) {
				return this.items[idx];
			} else
				return {
					name: "",
					code: "",
					qty: 0,
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
.all_items
{
	padding: 16px;

	.gallery
	{
		margin: 16px;

		.card {
			border: none;
		}

		.gallery_item
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