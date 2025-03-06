export type ListSessionData<T> = {
	readonly type: 'list';
	data: T[];
};

export type ListSession<T> = ListSessionData<T> & {
	add(item: T): void;
	clear(): void;
	reset(): void;
	size: number;
};

export function createListSession<T>(initialData: T[] = []): ListSession<T> {
	//* Private data in closure
	const _data = [...initialData];
	const _type = 'list';

	//* We return the object only with the required methods
	return {
		type: _type,
		get data(): T[] {
			return [..._data];
		},
		set data(value: T[]) {
			_data.length = 0;
			_data.push(...value);
		},
		add(item: T) {
			_data.push(item);
		},
		clear() {
			_data.length = 0;
		},
		reset() {
			_data.length = 0;
			_data.push(...initialData);
		},
		get size() {
			return _data.length;
		},
	};
}
