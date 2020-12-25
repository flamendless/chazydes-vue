<template>
<b-navbar toggleable="lg" type="dark" variant="info" :sticky=true>
	<b-navbar-brand :href="home">
		{{ website_name }}
	</b-navbar-brand>

	<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

	<b-collapse id="nav-collapse" is-nav>
		<b-navbar-nav class="ml-auto">
			<b-nav-item
				v-for="(item, i) in items" :key="i"
				:to="item.route"
				:title="item.title"
				:active="current_route == item.route || current_route == item.route2"
			>
				{{ signed_in ? item.title2 : item.title }}
			</b-nav-item>

			<b-nav-item-dropdown v-if="signed_in">
				<template #button-content>Item</template>

				<b-dropdown-item to="/add_item">
					Add Item
				</b-dropdown-item>

				<b-dropdown-item to="/all_items">
					View All Items
				</b-dropdown-item>
			</b-nav-item-dropdown>

			<b-nav-item-dropdown v-if="signed_in">
				<template #button-content>Transaction</template>

				<b-dropdown-item to="/add_transaction">
					Add Transaction
				</b-dropdown-item>

				<b-dropdown-item to="/all_transactions">
					View All Transactions
				</b-dropdown-item>
			</b-nav-item-dropdown>

			<b-nav-item-dropdown right>
				<template #button-content>Account</template>

				<div v-if="signed_in">
					<b-dropdown-item @click="on_sign_out">Sign Out</b-dropdown-item>
				</div>

				<div v-else>
					<b-dropdown-item :to="href_sign_in">Sign In</b-dropdown-item>
					<b-dropdown-item :to="href_sign_up">Sign Up</b-dropdown-item>
				</div>
			</b-nav-item-dropdown>
		</b-navbar-nav>
	</b-collapse>
</b-navbar>
</template>

<script>
export default {
	name: "NavBar",
	props: {
		website_name: String,
	},

	computed: {
		current_route() {
			return this.$route.path;
		}
	},

	mounted: function() {
		this.check_signed_in();
	},

	watch: {
		$route(to) {
			if (to.hash == "#home") {
				if (this.signed_in == false)
					this.$router.push({name: "Home"});
				else
					this.$router.push({name: "Dashboard"});
			}
		}
	},

	methods: {
		check_signed_in: function() {
			const email = sessionStorage["email"];

			if (email) this.signed_in = true;
		},

		on_sign_out: function() {
			if (window.confirm("Are you sure you want to sign out?"))
			{
				sessionStorage.clear();
				window.location.href = "/";
			}
		},
		on_add_terminal: function() {
			this.$router.push({
				name: "Add",
				params: {type: "terminal"}
			});
		},
		on_add_admin: function() {
			this.$router.push({
				name: "Add",
				params: {type: "admin"}
			});
		},
	},

	updated: function() {
		this.$nextTick(function() {
			this.check_signed_in();
		});
	},

	data: function() {
		return {
			home: "/",
			href_sign_in: "/sign_in",
			href_sign_up: "/registration",
			signed_in: false,
			items: [
				{
					route: "#home",
					route2: "/",
					title: "Home",
					title2: "Dashboard",
				},
			],
		}
	}
}
</script>

<style lang="scss" scoped>
.navbar-brand {
	font-weight: 900;
}

.nav-item {
	font-weight: bold;
	margin-left: 8px;
	margin-right: 8px;
}
</style>
