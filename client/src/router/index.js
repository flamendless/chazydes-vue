import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/home.vue"
import Dashboard from "../views/dashboard.vue"
import Transaction from "../views/transaction.vue"
import Item from "../views/item.vue"
import Add_Item from "../views/add_item.vue"

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/sign_in",
		name: "SignIn",
		component: () => import("../views/sign_in.vue")
	},
	{
		path: "/registration",
		name: "Registration",
		component: () => import("../views/registration.vue")
	},
	{
		path: "/dashboard",
		name: "Dashboard",
		component: Dashboard,
	},
	{
		path: "/transaction",
		name: "Transaction",
		component: Transaction,
	},
	{
		path: "/item",
		name: "Item",
		component: Item,
		props: true
	},
	{
		path: "/add_item",
		name: "AddItem",
		component: Add_Item,
		props: true
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router
