import { writable } from 'svelte/store';
import { ADDED_ITEM_IDS_KEY } from './constants';

export const addedQueueItems = writable(
	typeof localStorage !== 'undefined'
		? (JSON.parse(localStorage.getItem(ADDED_ITEM_IDS_KEY) ?? '[]') as string[])
		: []
);
