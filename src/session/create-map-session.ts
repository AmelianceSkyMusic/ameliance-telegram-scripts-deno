export type MapSessionData<T> = {
	readonly type: 'map';
	data: Record<string, T[]>;
};

export type MapSession<T> = MapSessionData<T> & {
	clear(): void;
	reset(): void;
	has(key: string): boolean;
	size: number;
	keys: string[];
	get(key: string):
		| {
			data: T[];
			add(item: T): void;
			clear(): void;
			reset(): void;
			size: number;
		}
		| undefined;
};

export function createMapSession<T>(
	initialKeyData: T[] = [],
	initialData: Record<string, T[]> = {},
): MapSession<T> {
	const _data: Record<string, T[]> = { ...initialData };
	const _type = 'map';

	return {
		type: _type,
		get data(): Record<string, T[]> {
			return { ..._data };
		},
		clear() {
			Object.keys(_data).forEach((key) => delete _data[key]);
		},
		reset() {
			Object.keys(_data).forEach((key) => delete _data[key]);
			Object.assign(_data, initialData);
		},
		has(key: string) {
			return key in _data;
		},
		get keys(): string[] {
			return Object.keys(_data);
		},
		get size() {
			return Object.keys(_data).length;
		},
		get(key: string) {
			if (!(key in _data)) {
				_data[key] = [];
			}
			return {
				get data(): T[] {
					return _data[key];
				},
				set data(value: T[]) {
					_data[key] = [...value];
				},
				add(item: T) {
					_data[key].push(item);
				},
				clear() {
					_data[key] = [];
				},
				reset() {
					_data[key] = [...initialKeyData];
				},
				get size() {
					return _data[key].length;
				},
			};
		},
	};
}
