(function () {
	function publish(payload) {
		alert(`HELLO from the external extension script! Payload: ${JSON.stringify(payload, null, 2)}`);
	}

	// Function to mark an item for synchronization
	function markToSync(payload) {
		// Here, you can add your logic to mark the item for synchronization

		console.log('markToSync');
		console.log(payload?.element);
		if (payload?.element) {
			
		  returnData = {
		    data: element.data,
		    isUnsaved: true,
		    externalIndicator: { iconURL: 'https://www.i3s.es/wp-content/uploads/2021/11/transfer-1.png' },
		  };
		  console.log(returnData);
		  window.RHAPSODYSE.updateElement(returnData);
		  console.log('updateElement');
		}
		alert(`${payload.element.data._elementId} marked for synchronization`);
	}

	// Function to unmark an item from synchronization
	function unMarkToSync(payload) {
		// Here, you can add your logic to unmark the item from synchronization
		console.log(payload);
		alert(`Item unmarked from synchronization`);
	}

	window.extensionTeamCenter = {
		publish,
		markToSync,
		unMarkToSync,
	};
})();
