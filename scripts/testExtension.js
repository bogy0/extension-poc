(function () {
	const indicators = [
	    {
	        indicatorURL: "https://extension-poc.vercel.app/assets/diamond-exclamation.png",
	        indicatorTooltip: "Teamcenter Error",
		indicatorDescription: "An error occurred during the publishing process. This could be due to a variety of reasons such as network issues, server problems, or invalid data inputs. Please check the system logs for more detailed information about the cause of the error, and try to publish again after resolving any identified issues."
	    },
	    {
	        indicatorURL: "https://extension-poc.vercel.app/assets/check-circle.png",
	        indicatorTooltip: "Teamcenter - Published successfully",
		indicatorDescription: "The content was published successfully"
	    },
	    {
	        indicatorURL: "https://extension-poc.vercel.app/assets/rotate-square.png",
	        indicatorTooltip: "Teamcenter - Synced successfully",
		indicatorDescription: "Synchronization completed successfully"
	    },
	    {
	        indicatorURL: "https://extension-poc.vercel.app/assets/triangle-warning.png",
	        indicatorTooltip: "Teamcenter - Warning",
		indicatorDescription: "There is a warning that needs your attention"
	    }
	];

	function getRandomIndicators() {
	    const randomIndicators = [];
	    const usedIndices = new Set();
	    const count = Math.floor(Math.random() * indicators.length) + 1;
	
	    while (randomIndicators.length < count) {
	        const randomIndex = Math.floor(Math.random() * indicators.length);
	        if (!usedIndices.has(randomIndex)) {
	            randomIndicators.push(indicators[randomIndex]);
	            usedIndices.add(randomIndex);
	        }
	    }
	
	    return randomIndicators;
	}

	async function getIndicators(elementIDs) {
	    const results = [];
	
	    for (const elementID of elementIDs) {
	        // Simulate an asynchronous operation
	        await new Promise(resolve => setTimeout(resolve, 100));
	
	        const randomIndicators = getRandomIndicators();
	        results.push({
	            elementID: elementID,
	            externalIndicators: randomIndicators
	        });
	    }
	
	    return results;
	}
	
	function publish(payload) {
		alert(`HELLO from the external extension script! Payload: ${JSON.stringify(payload, null, 2)}`);
		// clear Project Indicator
		window.RHAPSODYSE.updateProjectIndicator([]);
	}

	async function markToSync(payload) {
	    if (!Array.isArray(payload.elementIds) || payload.elementIds.length === 0 || !payload.elementIds.every(id => typeof id === 'string')) {
	        throw new Error('Invalid elementIds: Must be a non-empty array of strings.');
	    }
	
	    if (typeof payload.Authorization !== 'string' || payload.Authorization.trim() === '') {
	        throw new Error('Invalid Authorization: Must be a non-empty string.');
	    }
	
	    if (typeof payload.ProjectId !== 'string' || payload.ProjectId.trim() === '') {
	        throw new Error('Invalid ProjectId: Must be a non-empty string.');
	    }
	
	    if (typeof payload.ConfigurationId !== 'string' || payload.ConfigurationId.trim() === '') {
	        throw new Error('Invalid ConfigurationId: Must be a non-empty string.');
	    }

	    // update RHAPSODY SE Project Indicator (indicator next to the Project Name):
	    window.RHAPSODYSE.updateProjectIndicator(indicators);
	    // Call getIndicators with the elementIds from the payload
	    return await getIndicators(payload.elementIds);
	}

	// Function to unmark an item from synchronization
	async function unMarkToSync(payload) {
	    if (!Array.isArray(payload.elementIds) || payload.elementIds.length === 0 || !payload.elementIds.every(id => typeof id === 'string')) {
	        throw new Error('Invalid elementIds: Must be a non-empty array of strings.');
	    }
	
	    if (typeof payload.Authorization !== 'string' || payload.Authorization.trim() === '') {
	        throw new Error('Invalid Authorization: Must be a non-empty string.');
	    }
	
	    if (typeof payload.ProjectId !== 'string' || payload.ProjectId.trim() === '') {
	        throw new Error('Invalid ProjectId: Must be a non-empty string.');
	    }
	
	    if (typeof payload.ConfigurationId !== 'string' || payload.ConfigurationId.trim() === '') {
	        throw new Error('Invalid ConfigurationId: Must be a non-empty string.');
	    }
	
	    // Simulate unmarking process
	    const results = payload.elementIds.map(elementID => ({
	        elementID: elementID,
	        externalIndicators: null // RESET here the externalIndicators 
	    }));
	
	    return results;
	}

	window.extensionTeamCenter = {
		publish,
		markToSync,
		unMarkToSync,
	};
})();
