(function () {
	function publish(payload) {
		alert(`HELLO from the external extension script! ${JSON.stringify(payload, null, 2)}`);
	}

	window.extensionTeamCenter = {
		publish,
	};
})();
