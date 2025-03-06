import { Context } from '../../deps.deno.ts';
import { createListSession, ListSessionData } from './create-list-session.ts';
import { createMapSession, MapSessionData } from './create-map-session.ts';

type ListFactory<T> = typeof createListSession<T>;
type MapFactory<T> = typeof createMapSession<T>;
type SessionFactory<T> = ListFactory<T> | MapFactory<T>;

export function sessionMiddleware<TData>(sessionKeys: Record<string, SessionFactory<TData>>) {
	return <
		C extends Context & {
			session: Record<string, ListSessionData<TData> | MapSessionData<TData>>;
		},
	>(
		ctx: C,
		next: () => Promise<void>,
	) => {
		// Ensure session object exists
		if (!ctx.session) ctx.session = {} as C['session'];

		// Initialize or update each session key
		for (const [key, factory] of Object.entries(sessionKeys)) {
			try {
				const sessionData = ctx.session[key];

				// Initialize if session data doesn't exist or is invalid
				if (!sessionData || typeof sessionData !== 'object') {
					ctx.session[key] = factory === createListSession
						? createListSession<TData>([])
						: createMapSession<TData>([], {});
					continue;
				}

				// Handle existing session data
				let instance;
				if (factory === createListSession) {
					const data = (sessionData as ListSessionData<TData>).data;
					const initialData = Array.isArray(data) ? data : [];
					instance = createListSession<TData>(initialData);
				} else if (factory === createMapSession) {
					const data = (sessionData as MapSessionData<TData>).data;
					const initialData = typeof data === 'object' && data !== null ? data : {};
					instance = createMapSession<TData>([], initialData);
				}

				// Update session with new instance
				if (instance) {
					ctx.session[key] = instance;
				}
			} catch (error) {
				console.error(`Error hydrating session for key ${key}:`, error);
				// Initialize with empty data on error
				ctx.session[key] = factory === createListSession
					? createListSession<TData>([])
					: createMapSession<TData>([], {});
			}
		}

		return next();
	};
}
