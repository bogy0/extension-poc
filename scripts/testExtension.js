(function () {
	function publish(payload) {
		alert(`HELLO from the external extension script! Payload: ${JSON.stringify(payload, null, 2)}`);
	}

	// Function to mark an item for synchronization
	function markToSync(element) {
		// Here, you can add your logic to mark the item for synchronization
		console.log({ element });
		alert(`Item marked for synchronization`);
	}

	// Function to unmark an item from synchronization
	function unMarkToSync(element) {
		// Here, you can add your logic to unmark the item from synchronization
		console.log({ element });
		alert(`Item unmarked from synchronization`);
	}

	window.extensionTeamCenter = {
		publish,
		markToSync,
		unMarkToSync,
	};
})();
