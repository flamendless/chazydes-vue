<template>
<div class="dashboard">
	<div class="notification_section">
		<Notification />
	</div>

	<div class="control_section">
		<h2 align="center">Menu</h2>
		<b-card-group deck>
			<Control
				name="View All Items"
				desc="View All Items and its Stock from the Inventory."
				:background='require("@/assets/banner1.jpeg")'
				:href="'/all_items'"
			/>
			<Control
				name="Add Item"
				desc="Add a New Item in the Inventory."
				:background='require("@/assets/banner1.jpeg")'
				:href="'/add_item'"
			/>
		</b-card-group>
		<b-card-group deck>
			<Control
				name="View All Transactions"
				desc="View All Transactions, Buyer and Item Details."
				:background='require("@/assets/banner2.jpeg")'
				:href="'/all_transactions'"
			/>
			<Control
				name="Add Transaction"
				desc="Add a Buyer Transaction."
				:background='require("@/assets/banner2.jpeg")'
				:href="'/add_transaction'"
			/>
		</b-card-group>
	</div>
</div>
</template>

<script>
import Notification from "@/components/notification.vue"
import Control from "@/components/control.vue"

export default {
	name: "Dashboard",
	components: {
		Notification,
		Control,
	},
}

</script>

<style lang="scss" scoped>
.dashboard
{
	padding: 16px;

	.notification_section
	{
		margin-bottom: 16px;
	}
}

</style>
