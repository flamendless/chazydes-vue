<template>
<b-navbar toggleable="lg" type="dark" variant="info" :sticky=true>
	<b-navbar-brand :href="home">
		{{ website_name }}
	</b-navbar-brand>


	<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

	<b-collapse id="nav-collapse" is-nav>
		<b-navbar-nav class="add-button">
			<b-nav-item  to="/transaction">
				<img class="add-button-img" src="../assets/add.png">
			</b-nav-item>
		</b-navbar-nav>
		<b-navbar-nav class="ml-auto">
			<b-nav-item
				v-for="(item, i) in items" :key="i"
				:to="item.route"
				:title="item.title"
				:active="current_route == item.route || current_route == item.route2"
			>
				{{ item.title }}
			</b-nav-item>

			<b-nav-item-dropdown right v-if="is_admin">
				<template #button-content>Add</template>
				<b-dropdown-item @click="on_add_admin">Add Admin</b-dropdown-item>
				<b-dropdown-item @click="on_add_terminal">Add Terminal</b-dropdown-item>
			</b-nav-item-dropdown>

			<b-nav-item-dropdown right>
				<template #button-content v-if="is_admin">Admin</template>
				<template #button-content v-else>Account</template>

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
		const email = sessionStorage["email"];
		const is_admin = sessionStorage["is_admin"];

		if (email) this.signed_in = true;
		if (is_admin) this.is_admin = true;
	},

	methods: {
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

	data: function() {
		return {
			home: "/",
			href_sign_in: "/sign_in",
			href_sign_up: "/registration",
			signed_in: false,
			is_admin: false,
			items: [
				{
					route: "#home",
					route2: "/",
					title: "Home",
				},
				{
					route: "#profile",
					route2: "/profile",
					title: "Profile",
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

.add-button{
	width: 5%;
}

.add-button-img{
	width: 100%;
}
</style>
