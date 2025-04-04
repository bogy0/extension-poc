(function () {
	// Access to exposed RHAPSODYSE events and functions
	const {
		EXTENSION_EVENTS, // Events that extensions can emit
		CLIENT_EVENTS, // Events from the client that extensions can listen to
		LAYOUT_PLACEMENT, // Placement options for extension UI components
		sendEvent, // Function to send events from extension to client
		subscribe, // Function to subscribe to client events
		settings, // Application settings and configuration data (API URLs, etc.)
		modelAPI, // Read and update model
	} = window.RHAPSODYSE;

	// NOTIFICATION type constants
	const notificationKind = Object.freeze({
		ERROR: 'error',
		INFO: 'info',
		INFO_SQUARE: 'info-square',
		SUCCESS: 'success',
		WARNING: 'warning',
		WARNING_ALT: 'warning-alt',
	});

	// SAMPLE INDICATOR variants
	const indicators = [
		{
			indicatorURL: 'https://extension-poc.vercel.app/assets/diamond-exclamation.png',
			indicatorTooltip: 'Extension Error',
			indicatorDescription:
				'An error occurred during the publishing process. This could be due to a variety of reasons such as network issues, server problems, or invalid data inputs. Please check the system logs for more detailed information about the cause of the error, and try to publish again after resolving any identified issues.',
		},
		{
			indicatorURL: 'https://extension-poc.vercel.app/assets/check-circle.png',
			indicatorTooltip: 'Extension - Published successfully',
			indicatorDescription: 'The content was published successfully',
		},
		{
			indicatorURL: 'https://extension-poc.vercel.app/assets/rotate-square.png',
			indicatorTooltip: 'Extension - Synced successfully',
			indicatorDescription: 'Synchronization completed successfully',
		},
		{
			indicatorURL: 'https://extension-poc.vercel.app/assets/triangle-warning.png',
			indicatorTooltip: 'Extension - Warning',
			indicatorDescription: 'There is a warning that needs your attention',
		},
	];

	// UTILITY FUNCTIONS starts
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

	async function getIndicators(elementIds) {
		const results = [];

		for (const elementId of elementIds) {
			// Simulate an asynchronous operation
			await new Promise((resolve) => setTimeout(resolve, 100));

			const randomIndicators = getRandomIndicators();
			results.push({
				elementId: elementId,
				externalIndicators: randomIndicators,
			});
		}

		return results;
	}

	function validatePayload(payload) {
		if (!payload.config || !payload.data) {
			throw new Error('Invalid payload format.');
		}

		const { data, config } = payload;
		if (!Array.isArray(data.elementIds) || !data.elementIds.every((id) => typeof id === 'string')) {
			throw new Error('Invalid elementIds: Must be a non-empty array of strings.');
		}
		for (const key of ['Authorization', 'ProjectId', 'ConfigurationId']) {
			if (typeof config[key] !== 'string' || config[key].trim() === '') {
				throw new Error(`Invalid ${key}: Must be a non-empty string.`);
			}
		}
	}

	async function addPorts(payload) {
			var selectedEl = { elementId: payload.data.elementIds[0] };
			const elName = (await modelAPI.getPropertyValue(selectedEl, "declaredName"))
					.data;
			let portNames = ["p1", "p2"];
			let portProperties = [
				[{ key: "direction", value: "in" }],
				[{ key: "direction", value: "out" }],
			];
			if (elName === "lightControl") {
				portNames = ["pDoorHandling", "pLight"];
			}
			else if (elName === "temperatureControl") {
				portNames = ["pTemperature", "pHeater"];
			}
			const createdPorts = [];
			let index = 0;
			for (const name of portNames) {
				const props = portProperties ? portProperties[index++] : [];
				const newEl = (await modelAPI.addNewMemberElement(selectedEl, "PortUsage", [
					{ key: "declaredName", value: name },
					...props,
				])).data;
				let portsList = [];
				for (const port of createdPorts) {
					portsList.push((await modelAPI.getPropertyValue(port, "declaredName")).data);
				}
				const notificationData = {
					title: "Add some ports",
					subtitle: portsList.length
						? `Successfully created port: ${portsList.join(", ")}`
						: "No ports were created",
					kind: notificationKind.SUCCESS,
					timeout: 10000,
				};
				// show notification with success message
				sendEvent(EXTENSION_EVENTS.SHOW_NOTIFICATION, notificationData);
			}
    }

	// UTILITY FUNCTIONS ends

	//  INITIALIZE THE EXTENSION by sending an INIT event to define:
	// - extra buttons / actions in the client like "Publish" etc.
	// - callback functions (all callback receives in the first parameter the following information: Authorization, ProjectId, ConfigurationId)
	const initActions = {
		actions: {
			[LAYOUT_PLACEMENT.GLOBAL_EDITOR_TOOLBAR]: [
				{
					id: 'publish',
					label: 'Publish',
					onAction: publish,
				},
				{
					id: 'settingsInfo',
					label: 'Settings Info',
					onAction: () => {
						// SAMPLE CODE to get exposed settings data from the client
						alert(JSON.stringify(settings, null, 2));
					},
				},
				{
					id: 'extendParts',
					label: 'Extend Parts',
					onAction: extendParts,
					actionInfo: {
						afterSeparator: true,
						isDanger: true,
					},
				},
				{
					id: "add ports",
					label: "Add some port",
					onAction: addPorts,
					actionInfo: { applicableTo: "PartUsage" },
				},
			],
			[LAYOUT_PLACEMENT.EXPLORER_OVERFLOW_MENU]: [
				{
					id: 'markToSync',
					label: 'Mark to Sync',
					onAction: markToSync,
				},
				{
					id: 'unmarkToSync',
					label: 'Unmark to Sync',
					onAction: unMarkToSync,
					actionInfo: { enabled: false },
				},
			],
		},
	};

	sendEvent(EXTENSION_EVENTS.INIT, initActions);


	const unsubscribe = subscribe(CLIENT_EVENTS.ELEMENTS_LOADED, async ({ data, config }) => {
		// example logic to select elements to add indicators, you can write any logic here
		const elementId = data.find((element) => {
			return (
				element._elementId === '5f891ca4-9a65-46d0-ad6b-819c207afa27' ||
				element._elementId === '53451cf6-2d85-4600-af0d-8dba8d0536bd'
			);
		})?._elementId;

		if (!elementId) {
			return;
		}

		// get indicators for the selected element
		const elementIndicators = await getIndicators([elementId]);

		// send event to RSE client to update indicators on the selected element
		sendEvent(EXTENSION_EVENTS.UPDATE_ELEMENT_INDICATORS, elementIndicators);
	});

	// Examples to SUBSCRIBE to CLIENT_EVENTS
	subscribe(CLIENT_EVENTS.ELEMENTS_ADDED, async (payload) => {
		console.log('EXT elements added', payload);
	});

	subscribe(CLIENT_EVENTS.ELEMENTS_UPDATED, async (payload) => {
		console.log('EXT elements updated', payload);
	});

	subscribe(CLIENT_EVENTS.ELEMENTS_DELETED, async (payload) => {
		console.log('EXT elements deleted', payload);
	});

	subscribe(CLIENT_EVENTS.ELEMENTS_SHOWN_IN_BROWSER, async (payload) => {
		console.log('EXT elements shown in browser', payload);

		// get indicators for the selected elements
		const elementIds = payload.data.map((element) => element._elementId);
		const elementIndicators = await getIndicators(elementIds);
		console.log('EXT elements shown in browser response: ', elementIndicators);
		// send event to RSE client to update indicators on the selected elements
		sendEvent(EXTENSION_EVENTS.UPDATE_ELEMENT_INDICATORS, elementIndicators);
	});

	// ACTION function definitions starts
	function publish(payload) {
		const notificationData = {
			title: 'Published successfully',
			subtitle: `The content was published successfully for the project with id: ${payload.ProjectId}`,
			kind: notificationKind.SUCCESS,
			timeout: 10000,
			isActionable: true, // optional, required if actionButtonLabel is provided
			actionButtonLabel: 'Action after publish', // optional, required if isActionable is true
			onAction: () => {
				console.log('Optionally, you can handle the clicking of the action button here');
			},
			onClose: () => {
				console.log('Optionally, you can handle the close event here');
			},
		};

		// update project indicators with Published indicator
		sendEvent(EXTENSION_EVENTS.UPDATE_PROJECT_INDICATORS, [indicators[1]]);
		// show notification with success message
		sendEvent(EXTENSION_EVENTS.SHOW_NOTIFICATION, notificationData);
	}

	async function extendParts(payload) {
		sendEvent(EXTENSION_EVENTS.SYNC_ACTIONS, {
			actions: {
				EXPLORER_OVERFLOW_MENU: [
					{
						id: 'markToSync',
						label: 'Mark to Sync',
						onAction: markToSync,
					},
					{
						id: 'unmarkToSync',
						label: 'Unmark to Sync',
						onAction: unMarkToSync,
						actionInfo: { enabled: false },
					},
					{
						id: 'updatedPartsAction',
						label: 'Updated Parts Action',
						onAction: () => {
							console.log('Updated Parts Action');
						},
						actionInfo: {
							// the applicableTo is used to only apply the action to the specific element type defined in the array.
							// meaning the 'Updated Parts Action' option will only be visible for the 'PartUsage' element types in the Explorer Overflow Menu
							applicableTo: ['PartUsage'],
						},
					},
				],
			},
		});
	}

	async function markToSync(payload) {
		validatePayload(payload);

		// get indicators for the selected element
		const elementIndicators = await getIndicators(payload.data.elementIds);
		// send event to RSE client to update indicators on the selected element
		sendEvent(EXTENSION_EVENTS.UPDATE_ELEMENT_INDICATORS, elementIndicators);

		// update actions disabled state for the specific element from the payload
		// disable markToSync action and enable unmarkToSync action
		payload.data.elementIds.forEach((elementId) => {
			sendEvent(EXTENSION_EVENTS.UPDATE_ACTIONS, [
				{
					elementId: elementId,
					actionId: 'markToSync',
					actionInfo: { enabled: false },
				},
				{
					elementId: elementId,
					actionId: 'unmarkToSync',
					actionInfo: { enabled: true },
				},
			]);
		});
	}

	async function unMarkToSync(payload) {
		validatePayload(payload);

		const elementIndicators = payload.data.elementIds.map((elementId) => ({
			elementId: elementId,
			externalIndicators: null,
		}));
		sendEvent(EXTENSION_EVENTS.UPDATE_ELEMENT_INDICATORS, elementIndicators);

		payload.data.elementIds.forEach((elementId) => {
			sendEvent(EXTENSION_EVENTS.UPDATE_ACTIONS, [
				{
					elementId: elementId,
					actionId: 'markToSync',
					actionInfo: { enabled: true },
				},
				{
					elementId: elementId,
					actionId: 'unmarkToSync',
					actionInfo: { enabled: false },
				},
			]);
		});
	}
})();
