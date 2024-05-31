(function () {
	function publish() {
		alert('HELLO from extension script!');
	}

	window.extensionTeamCenter = {
		publish,
	};
})();
