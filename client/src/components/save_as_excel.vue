<template>
	<b-button
		variant="success"
		@click="save_as_excel"
	>
		Save as Excel
	</b-button>
</template>

<script>
const excel = require("exceljs");
const FileSaver = require("file-saver");

export default {
	name: "SaveAsExcel",
	props: {
		name: String,
		data: Array,
		fields: Array,
		filter: String,
	},

	data: function() {
		return {
			blob_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
		}
	},

	methods: {
		save_as_excel: async function() {
			const wb = new excel.Workbook();
			const ws = wb.addWorksheet(this.name);
			const filename = `export_${this.name}.xlsx`;
			const cols = [];

			for (let i = 0; i < this.fields.length; i++) {
				const field = this.fields[i];
				const width = (field.label.length > field.col_width) ? field.label.length : field.col_width;

				if (field.visible) {
					cols.push({
						header: field.label,
						key: field.key,
						width: width,
					});
				}
			}

			ws.columns = cols;
			ws.addRows(this.data);

			const res = await wb.xlsx.writeBuffer();
			const blob = new Blob([res], { type: this.blob_type });
			FileSaver.saveAs(blob, filename);
		},
	},
}
</script>

<style lang="scss" scoped>
</style>
