<template>
<div class="delete_item">
	<ValidationObserver ref="observer" v-slot="{handleSubmit}">
		<b-form
			@submit.prevent="handleSubmit(on_submit)"
		>
			<b-card class="delete_section">
				Performing this action will permanently delete the item "<b>{{form.name}}</b>".
				<br>
				<br>
				Please type the item code <b>{{form.code}}</b> and click the button below to delete the item.

				<b-form-group>
					<b-form-input
						class="formInput"
						type="text"
						placeholder="Item Code"
					>
					</b-form-input>
				</b-form-group>
				<b-row>
					<b-col class="text-center">
						<input
							type="submit"
							class="btn btn-danger mt-3"
							value="Delete Item"
							:disabled="is_submitting"
						>
					</b-col>
				</b-row>
			</b-card>
		</b-form>
	</ValidationObserver>
</div>
</template>

<script>


export default {
	name: "EditItem",
	props: {
		form: Object,
		str_images: Array,
	},
}

</script>

<style lang="scss" scoped>

.delete_item
{
	padding: 16px;
	width: 50%;
	margin: auto;

	.delete_section
	{

	}
}

</style>