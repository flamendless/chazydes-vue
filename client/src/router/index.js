import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/home.vue"
import Dashboard from "../views/dashboard.vue"
import AddTransaction from "../views/add_transaction.vue"
import AllTransactions from "../views/all_transactions.vue"
import ViewItem from "../views/view_item.vue"
import AddItem from "../views/add_item.vue"
import ViewTransaction from "../views/view_transaction.vue"

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
		path: "/add_transaction",
		name: "AddTransaction",
		component: AddTransaction,
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
		path: "/all_transactions",
		name: "AllTransactions",
		component: AllTransactions,
	},
	{
		path: "/TID",
		name: "ViewTransaction",
		component: ViewTransaction,
		props: (route) => ({
			...route.params
		}),
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router
