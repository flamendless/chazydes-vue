<template>
<div class="tbl_licenses">
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

		<template #cell(license)="data">
			<a :href="data.item.license">
				License# {{data.item.id}}
			</a>
		</template>

		<template #cell(name)="data">
			<a :href="data.item.driver_id">{{ data.item.name }}</a>
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
	name: "TableLicenses",
	props: {
		is_admin: Boolean,
	},

	mounted: function() {
		Axios.get("/get_licenses_list/" + this.is_admin)
			.then(res => {
				const data = res.data;
				if (data.success && data.results != null) {
					this.items = data.results;

					data.results.forEach(function(item) {
						item.driver_id = "/view_info?driver=1&id=" + item.driver_id;
						item.license = "/view_info?license=1&id=" + item.id;
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
		is_disabled: function() {
			if (this.selected_item == null) return true;
			return false;
		},
		on_edit: function() {
			this.$router.push({
				name: "EditInfo",
				params: {
					type: "license",
					item: this.selected_item,
				}
			});
		},
		on_delete: function() {
			if (window.confirm("Are you sure you want to delete this data?"))
			{
				Axios.post("/delete_license", {
					license_id: this.selected_item.id
				})
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
				this.var_edit = "primary";
				this.var_delete = "danger";
			} else {
				this.var_edit = null;
				this.var_delete = null;
			}
		}
	},

	data: function() {
		return {
			is_busy: true,
			selected_item: null,
			selected_index: null,
			search: "",
			filter: null,
			var_edit: null,
			var_delete: null,
			fields: [
				{key: "license", sortable: false, visible: true, label: "License ID"},
				{key: "name", sortable: false, visible: true, label: "Driver"},
				{key: "date_issued", sortable: true, visible: true, label: "Date Issued"},
				{key: "restrictions", sortable: true, visible: true, label: "Restrictions"},
				{key: "agency_code", sortable: true, visible: true, label: "Agency Code"},
			],
			items: [],
		}
	},
}
</script>

<style lang="scss" scoped>
.tbl_licenses {
	.btn_toolbar {
		margin-bottom: 32px;
	}
}
</style>
