(function () {
	function publish(payload) {
		alert(`HELLO from the external extension script! Payload: ${JSON.stringify(payload, null, 2)}`);
	}

	window.extensionTeamCenter = {
		publish,
	};
})();
