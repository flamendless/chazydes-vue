<template>
<div class="dashboard">
	<b-tabs content-class="mt-3" v-if="signed_in && is_admin"
		justified
		v-model="tab"
		@activate-tab="on_tab_activated">
		<!-- <b&#45;tab title="Driver" lazy> -->
		<!-- 	<TableDrivers :is_admin="is_admin" /> -->
		<!-- </b&#45;tab> -->
	</b-tabs>
	<div>
		<b-card-group deck class="dashboard_gallery" v-for="i in (items.length / items_per_row)" :key="'item' + i">
			<b-card class="gallery-item" v-for="j in items_per_row" :key="'card' + j">
				<b-link
					:to="{
						name: 'Item',
						path: '/dashboard/' + items[index(i,j)].code,
						params: {
							name: items[index(i,j)].name,
							code: items[index(i,j)].code,
							qty: items[index(i,j)].qty,
							orig_price: items[index(i,j)].orig_price,
							ret_price: items[index(i,j)].ret_price,
						},
					}"
				>

				<b-card-img class="item-image" src="../uploads/goblet.png" />
				<b-card-title class="card-title">{{items[index(i,j)].name}}</b-card-title>
				<b-card-text><b>Code: </b>{{items[index(i,j)].code}}</b-card-text>
				<b-card-footer>
					<b-badge variant="primary">Quantity: {{items[index(i,j)].qty}}</b-badge>
					<b-badge variant="info">Original Price: <span>&#8369;</span>{{items[index(i,j)].orig_price}}</b-badge>
					<b-badge variant="success">Retail Price: <span>&#8369;</span>{{items[index(i,j)].ret_price}}</b-badge>
				</b-card-footer>
				</b-link>
			</b-card>
			<br />
		</b-card-group>
	</div>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "Dashboard",
	components: {

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
			console.log("Item Length: " + data.results.length)
			this.items.forEach(function(item) {
				console.log("Name: " + item.name)
			})
		});
	},

	methods: {
		on_tab_activated: function(next) {
			const url = new URL(window.location.href);
			const sp = url.searchParams;
			sp.set("tab", next);
			url.search = sp.toString();
			const new_url = url.toString();
			window.history.replaceState({}, null, new_url);
		},

		index: function(i, j){
			this.items_per_row = 5;
			return (this.items_per_row * (i-1) + (j-1));
		}
	},

	data: function() {
		return {
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
.dashboard {
	padding: 16px;
}

.dashboard .dashboard_gallery
{
	margin: 16px;
}

.dashboard .dashboard_gallery .gallery-item
{
	padding: 16px;
	box-shadow: 0 0 8px grey;
}

.dashboard .dashboard_gallery
.gallery-item .item-image
{
	padding: 8px;
	box-shadow: 0 0 4px grey;
}

.dashboard .dashboard_gallery
.gallery-item .card-title
{
	padding: 16px;
	text-align: center;
}
</style>
