<template>
<div class="upload_driver">
	<div class="text-center">
		<b-img v-if="url_image" :src="url_image" width="360px"></b-img>
	</div>

	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form
			@submit.prevent="handleSubmit(on_submit)"
			enctype="multipart/form-data">
			<ValidationProvider
				rules="required"
				v-slot="{valid, errors}">
				<b-form-group
					label="Picture of Driver:"
					label-for="lbl_driver">
					<b-form-file
						name="img_driver"
						v-model="img_driver"
						accept="image/jpeg, image/png"
						@change="on_file_change"
						:state="Boolean(img_driver)"
						:placeholder="img_driver ? img_driver.name : 'Choose image'"
						no-drop>
					</b-form-file>
					<b-form-invalid-feedback id="input_feedback">
						{{ errors[0] }}
					</b-form-invalid-feedback>
				</b-form-group>
			</ValidationProvider>

			<b-row v-if="!is_edit">
				<b-col class="text-center">
					<b-button class="btn" type="submit" variant="primary" size="lg">
						<b-spinner small v-if="loading"></b-spinner>
						Next
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</ValidationObserver>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "UploadImage",
	props: {
		driver: Object,
		is_edit: Boolean,
	},

	mounted: function() {
		this.loading = false;

		if (this.is_edit) {
			Axios.get("/get_image/" + this.driver.picture_id)
			.then(res => {
				const data = res.data;
				if (data.results.length > 0)
					this.url_image = require("@/uploads/" + data.results[0].name);
			});
		}
	},

	watch: {
		img_driver: function() {
			this.driver.changed = true;
			this.driver.img_driver = this.img_driver;
		}
	},

	methods: {
		on_file_change: function(e) {
			const file = e.target.files[0];
			this.url_image = URL.createObjectURL(file);
		},
		on_submit: function() {
			this.loading = true;

			const fd = new FormData();
			fd.append("img_driver", this.img_driver);

			Axios({
				method: "post",
				url: "/upload_driver",
				data: fd,
				headers: {"Content-Type": "multipart/form-data"}
			})
			.then(res => {
				const data = res.data;
				if (data.success)
				{
					this.driver.data = data;
					this.$localStorage.set("driver", JSON.stringify(this.driver));
					window.location.href = "/registration?page=3";
					this.loading = false;
				}
			});
		},
	},

	data: function() {
		return {
			url_image: null,
			img_driver: null,
			loading: false,
			show_alert: false,
		}
	},
}
</script>

<style lang="scss" scoped>
.upload_driver {
	padding: 16px;
}

.btn {
	margin-left: 32px;
	margin-right: 32px;
}
</style>
