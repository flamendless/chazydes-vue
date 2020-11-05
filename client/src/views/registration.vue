<template>
<div class="registration">
	<div>
		<b-jumbotron
			header="Registration"
			:lead="lead"
			class="text-center"
			fluid
			header-level="4"
			bg-variant="info"
			text-variant="white">
		</b-jumbotron>
	</div>

	<SignUp :form="form" :override_submit="override_submit"/>
</div>
</template>

<script>
import SignUp from "@/components/sign_up.vue"

const Axios = require("axios");

export default {
	name: "Registration",
	components: {
		SignUp,
	},

	mounted: function() {
	},

	methods: {
		override_submit: async function(child) {
			const valid_email = Axios.get("/validate_email/" + this.form.email)

			if (valid_email.data.success && valid_email.data.results.length > 0)
			{
				this.$refs.observer.setErrors({
					email: "E-Mail already registered"
				});
				child.loading = false;
			}
			else
			{
				child.loading = false;
				const form = this.form;
				const r_sign_up = await Axios.post("/register_user", {
					email: form.email,
					password: form.password,
					fname: form.fname,
					mname: form.mname,
					lname: form.lname,
					birthdate: form.birthdate,
				});

				if (r_sign_up.data.success) window.location.href = "/sign_in";
				else throw new Error("Failed registration");
			}
		},
	},

	data: function() {
		return {
			page_num: 1,
			form: {
				email: "",
				password: "",
				confirm_password: "",
				fname: "",
				mname: "",
				lname: "",
				birthdate: "",
			},
		}
	}
}
</script>

<style lang="scss" scoped>
.registration {
	padding: 16px;
}
</style>
