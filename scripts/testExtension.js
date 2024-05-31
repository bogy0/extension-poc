(function () {
	function publish() {
		alert('HELLO from the external extension script!');
	}

	window.extensionTeamCenter = {
		publish,
	};
})();
