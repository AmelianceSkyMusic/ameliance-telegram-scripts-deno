export type MapSessionData<T> = {
	readonly type: 'map';
	readonly data: Record<string, T[]>;
};

type CreateMapSessionReturn<T> = MapSessionData<T> & {
	clear(): void;
	reset(): void;
	get(key: string): T[];
	hasKey(key: string): boolean;
	size: number;
};

export function createMapSession<T>(
	initialKeyData: T[] = [],
	initialData: Record<string, T[]> = {},
): CreateMapSessionReturn<T> {
	const _data: Record<string, T[]> = { ...initialData };
	const _initialKeyData = [...initialKeyData];
	const _type = 'map';

	return new Proxy(
		{
			type: _type,
			get data(): Record<string, T[]> {
				return _data;
			},
			clear() {
				Object.keys(_data).forEach((key) => delete _data[key]);
			},
			reset() {
				Object.keys(_data).forEach((key) => delete _data[key]);
				Object.assign(_data, initialData);
			},
			get(key: string) {
				if (!this.hasKey(key)) return null;
				return _data[key];
			},
			hasKey(key: string) {
				return key in _data;
			},

			get size() {
				return Object.keys(_data).length;
			},
		} as CreateMapSessionReturn<T>,
		{
			get(target, key: string) {
				if (key in target) return target[key];

				if (!(key in _data)) _data[key] = [];

				return {
					get data(): T[] {
						return [..._data[key]];
					},
					set data(value: T[]) {
						_data[key] = [...value];
					},
					add(...item: T[]) {
						_data[key].push(...item);
					},
					clear() {
						_data[key] = [];
					},
					reset() {
						_data[key] = [..._initialKeyData];
					},
					get size() {
						return _data[key].length;
					},
				};
			},
		},
	);
}
