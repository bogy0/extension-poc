(function () {
	const indicators = [
	    {
	        indicatorURL: "https://extension-poc.vercel.app/assets/back-up.png",
	        indicatorTooltip: "Backup Indicator"
	    },
	    {
	        indicatorURL: "https://extension-poc.vercel.app/assets/check-circle.png",
	        indicatorTooltip: "Check Circle Indicator"
	    },
	    {
	        indicatorURL: "https://extension-poc.vercel.app/assets/globe.png",
	        indicatorTooltip: "Globe Indicator"
	    },
	    {
	        indicatorURL: "https://extension-poc.vercel.app/assets/warning.png",
	        indicatorTooltip: "Warning Indicator"
	    }
	];

	function getRandomIndicator() {
	    const randomIndex = Math.floor(Math.random() * indicators.length);
	    return indicators[randomIndex];
	}

	async function getIndicators(elementIDs) {
	    const results = [];
	
	    for (const elementID of elementIDs) {
	        // Simulate an asynchronous operation
	        await new Promise(resolve => setTimeout(resolve, 100));
	
	        const randomIndicator = getRandomIndicator();
	        results.push({
	            elementID: elementID,
	            externalIndicator: {
	                indicatorURL: randomIndicator.indicatorURL,
	                indicatorTooltip: randomIndicator.indicatorTooltip
	            }
	        });
	    }
	
	    return results;
	}
	
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
	}

	// Function to unmark an item from synchronization
	function unMarkToSync(payload) {
		// Here, you can add your logic to unmark the item from synchronization
		if (payload?.element) {
		  const returnData = {
		    data: payload.element.data,
		    isUnsaved: false,
		    externalIndicator: false,
		  };
		  window.RHAPSODYSE.updateElement(returnData);
		}
	}

	window.extensionTeamCenter = {
		publish,
		markToSync,
		unMarkToSync,
		getIndicators,
	};
})();
