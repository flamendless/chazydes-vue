<template>
<div class="tbl_drivers">
	<b-button-toolbar aria-label="Actions Toolbar" justify class="btn_toolbar">
		<b-form-group>
			<b-input-group>
				<b-form-input
					v-model="search" placeholder="Search here"
					@update="on_search_change">
				</b-form-input>
				<b-input-group-append>
					<b-input-group-text>
						<font-awesome-icon icon="search" />
					</b-input-group-text>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>

		<b-form-group>
			<b-dropdown right text="views">
				<b-dropdown-form v-for="field in fields" :key="field.id">
					<b-form-checkbox :disabled="visible_fields.length == 1 && field.visible"
						v-model="field.visible">
						{{ field.label }}
					</b-form-checkbox>
				</b-dropdown-form>
			</b-dropdown>
		</b-form-group>

		<b-button-group>
			<b-button :variant="var_verify" :disabled="is_disabled(true)"
				@click="on_verify">
				Verify
			</b-button>
			<b-button :variant="var_edit" :disabled="is_disabled()"
				@click="on_edit">
				Edit
			</b-button>
			<b-button :variant="var_delete" :disabled="is_disabled()"
				@click="on_delete">
				Delete
			</b-button>
		</b-button-group>
	</b-button-toolbar>

	<b-table
		responsive
		bordered
		hover
		striped
		caption-top
		selectable
		select-mode="single"
		selected-variant=""
		@row-clicked="on_row_click"
		:filter="filter"
		:busy="is_busy"
		:items="items"
		:fields="visible_fields"
		:tbody-tr-class="row_class">

		<template #table-caption v-if="unverified">
			* Red highlighted row means the account is unverified
		</template>

		<template #cell(lname)="data">
			<a :href="data.item.driver">
				{{ data.item.lname }}
			</a>
			<b-badge v-if="data.item.verified == 'false'">Unverified</b-badge>
		</template>

		<template #cell(license)="data">
			<a :href="data.item.license" v-if="data.item.license_id">
				License#{{ data.item.license_id }}
			</a>
		</template>

		<template #cell(vehicle)="data">
			<a v-if="data.item.tricycle_id" :href="data.item.vehicle">
				Tricycle#{{ data.item.tricycle_id }}
			</a>
			<a v-else-if="data.item.bukyo_id" :href="data.item.vehicle">
				Bukyo#{{ data.item.bukyo_id }}
			</a>
		</template>

		<template #table-busy>
			<div class="text-center text-danger my-2">
				<b-spinner class="align-middle"></b-spinner>
				<strong>Fetching data</strong>
			</div>
		</template>
	</b-table>
</div>
</template>

<script>
const Axios = require("axios");

export default {
	name: "TableDrivers",
	props: {
		is_admin: Boolean,
	},

	mounted: function() {
		Axios.get("/get_drivers_list/" + this.is_admin)
		.then(res => {
			const data = res.data;
			if (data.success && data.results != null) {
				this.items = data.results;

				const _data = this;

				this.items.forEach(function(item) {
					if (item.verified == "false")
						_data.unverified = true;

					item.driver = "/view_info?driver=1&id=" + item.id;
					item.license = "/view_info?license=1&id=" + item.license_id;

					if (item.tricycle_id)
						item.vehicle = "/view_info?vehicle=1&id=" + item.tricycle_id;
					else if (item.bukyo_id)
						item.vehicle = "/view_info?vehicle=2&id=" + item.bukyo_id;
				});

				this.is_busy = false;
			}
		});
	},

	methods: {
		row_class: function(item, type) {
			if (!item || type !== "row") return
			if (item.verified == "false") return "table-danger"
		},
		on_row_click: function(item, i, e) {
			this.selected_item = item;
			this.selected_index = i;
			e.stopPropagation();
		},
		on_search_change: function() {
			if (this.search.length > 0) this.filter = this.search;
			else this.filter = null;
		},
		is_disabled: function(need_verify) {
			if (this.selected_item == null) return true;

			if (need_verify)
				return this.selected_item.verified != "false";

			return false;
		},
		on_verify: function() {
			if (window.confirm("Are you sure you want to verify this data?"))
			{
				Axios.post("/verify_account", {email: this.selected_item.email})
					.then(res => {
						const data = res.data;
						if (data.success) alert("Account verified successfully");
						else alert("Account verified unsuccessfully");

						this.items[this.selected_index].verified = data.success;

						this.selected_item = null;
						this.selected_index = null;
					});
			}
		},
		on_edit: function() {
			this.$router.push({
				name: "EditInfo",
				params: {
					type: "driver",
					item: this.selected_item,
				}
			});
		},
		on_delete: function() {
			if (window.confirm("Are you sure you want to delete this data?"))
			{
				Axios.post("/delete_driver", {driver_id: this.selected_item.id})
				.then(res => {
					const data = res.data;
					if (data.success) {
						const i = this.selected_index;
						this.items = this.items.slice(0, i)
							.concat(this.items.slice(i + 1, this.items.length));

						this.selected_item = null;
						this.selected_index = null;
					} else throw new Error("error in deleting data");
				}).catch(err => {
					alert(err);
				});
			}
		}
	},

	computed: {
		visible_fields: function() {
			return this.fields.filter(field => field.visible);
		}
	},

	watch: {
		selected_item: function() {
			if (this.selected_item) {
				if (this.selected_item.verified == "false")
					this.var_verify = "success";
				else
					this.var_verify = null;

				this.var_edit = "primary";
				this.var_delete = "danger";
			} else {
				this.var_verify = null;
				this.var_edit = null;
				this.var_delete = null;
			}
		}
	},

	data: function() {
		return {
			is_busy: true,
			unverified: false,
			selected_item: null,
			selected_index: null,
			search: "",
			filter: null,
			var_verify: null,
			var_edit: null,
			var_delete: null,
			fields: [
				{key: "lname", sortable: true, visible: true, label: "Last Name"},
				{key: "mname", sortable: true, visible: true, label: "Middle Name"},
				{key: "fname", sortable: true, visible: true, label: "First Name"},
				{key: "license", sortable: true, visible: true, label: "License"},
				{key: "vehicle", sortable: true, visible: true, label: "Vehicle"},
				{key: "email", sortable: true, visible: true, label: "E-Mail"},
				{key: "birthdate", sortable: true, visible: true, label: "Birthdate"},
				{key: "sex", sortable: true, visible: false, label:  "Sex"},
				{key: "address", sortable: true, visible: true, label: "Address"},
				{key: "status", sortable: true, visible: false, label: "Status"},
				{key: "contact_number", sortable: true, visible: true, label: "Contact Number"},
				{key: "weight", sortable: true, visible: false, label: "Weight"},
				{key: "height", sortable: true, visible: false, label: "Height"},
			],
			items: [],
		}
	},
}
</script>

<style lang="scss" scoped>
.tbl_drivers {
	.btn_toolbar {
		margin-bottom: 32px;
	}
}
</style>
