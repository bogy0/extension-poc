(function () {
	function publish(payload) {
		alert(`HELLO from the external extension script! Payload: ${JSON.stringify(payload, null, 2)}`);
	}

	// Function to mark an item for synchronization
	function markToSync(payload) {
		// Here, you can add your logic to mark the item for synchronization
		if (payload?.element) {
		  const returnData = {
		    data: payload.element.data,
		    isUnsaved: false,
		    externalIndicator: { iconURL: 'https://www.i3s.es/wp-content/uploads/2021/11/transfer-1.png' },
		  };
		  window.RHAPSODYSE.updateElement(returnData);
		}
		alert(`${payload.element.data._elementId} marked for synchronization`);
	}

	// Function to unmark an item from synchronization
	function unMarkToSync(payload) {
		// Here, you can add your logic to unmark the item from synchronization
		if (payload?.element) {
		  const returnData = {
		    data: payload.element.data,
		    isUnsaved: false,
		    externalIndicator: null,
		  };
		  window.RHAPSODYSE.updateElement(returnData);
		}
		alert(`${payload.element.data._elementId} unmarked for synchronization`);
	}

	window.extensionTeamCenter = {
		publish,
		markToSync,
		unMarkToSync,
	};
})();
