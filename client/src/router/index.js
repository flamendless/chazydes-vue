import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/home.vue"
import Dashboard from "../views/dashboard.vue"
import ViewItem from "../views/view_item.vue"
import AddItem from "../views/add_item.vue"
import AllItems from "../views/all_items.vue"
import AddTransaction from "../views/add_transaction.vue"
import ViewTransaction from "../views/view_transaction.vue"
import AllTransactions from "../views/all_transactions.vue"

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
		path: "/add_item",
		name: "AddItem",
		component: AddItem,
		props: true
	},
	{
		path: "/view_item",
		name: "ViewItem",
		component: ViewItem,
		props: true
	},
	{
		path: "/all_items",
		name: "AllItems",
		component: AllItems,
	},

	{
		path: "/add_transaction",
		name: "AddTransaction",
		component: AddTransaction,
	},
	{
		path: "/view_transaction",
		name: "ViewTransaction",
		component: ViewTransaction,
	},
	{
		path: "/all_transactions",
		name: "AllTransactions",
		component: AllTransactions,
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router
