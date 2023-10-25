import { ADDED_ITEM_IDS_KEY } from './constants';
import { addedQueueItems } from './store';

let timer: NodeJS.Timeout | undefined = undefined;

export const debounce = (cb: () => void, delayMs = 300) => {
	clearTimeout(timer);

	timer = setTimeout(() => {
		cb();
	}, delayMs);
};

export const formatDuration = (seconds: number) => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const formattedHours = hours > 0 ? hours + ' hours ' : '';
	const formattedMinutes = minutes > 0 ? minutes + ' minutes ' : '';
	const formattedSeconds = remainingSeconds + ' seconds';

	return formattedHours + formattedMinutes + formattedSeconds;
};

export const updateAddedItems = (queueItemId: string) => {
	const addedItemIds = JSON.parse(localStorage.getItem(ADDED_ITEM_IDS_KEY) ?? '[]') as string[];

	const updatedAddedItems = [...addedItemIds, queueItemId];

	localStorage.setItem(ADDED_ITEM_IDS_KEY, JSON.stringify(updatedAddedItems));
	addedQueueItems.set(updatedAddedItems);
};
