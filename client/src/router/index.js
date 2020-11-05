import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/home.vue"
import Dashboard from "../views/dashboard.vue"

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
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router
