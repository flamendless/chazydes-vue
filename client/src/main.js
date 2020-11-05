import Vue from "vue"
import App from "./app.vue"
import router from "./router"

//Vue Meta
import Meta from "vue-meta"

Vue.use(Meta, {
	keyName: "meta_info",
	refreshOnceOnNavigation: true,
});

//Vee-validate
import {
  ValidationObserver,
  ValidationProvider,
  extend,
} from "vee-validate";
import * as rules from "vee-validate/dist/rules"
import "@/vee_validate.js"

Object.keys(rules).forEach(rule => {
	extend(rule, rules[rule]);
});

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

//Bootstrap
import {BootstrapVue, IconsPlugin} from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

//Vue Storage
import VueLocalStorage from "vue-localstorage"
Vue.use(VueLocalStorage);

//Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core"
import { faMars, faVenus, faQuestion, faVenusMars, faUser, faSearch }
	from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add([faMars, faVenus, faQuestion, faVenusMars, faUser, faSearch]);
Vue.component("font-awesome-icon", FontAwesomeIcon);

const axios = require("axios");
axios.defaults.baseURL = "http://localhost:4000";

//Main
Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount("#app")
