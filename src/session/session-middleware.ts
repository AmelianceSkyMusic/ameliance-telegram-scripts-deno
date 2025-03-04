import { Context } from '../../deps.deno.ts';
import { createListSession, ListSessionData } from './create-list-session.ts';
import { createMapSession, MapSessionData } from './create-map-session.ts';

type SessionFactory = typeof createListSession | typeof createMapSession;

export function sessionMiddleware<T>(sessionKeys: Record<string, SessionFactory>) {
	return (ctx: Context & { session: T }, next: () => Promise<void>) => {
		if (!ctx.session) return next();

		for (const [key, factory] of Object.entries(sessionKeys)) {
			if (!ctx.session[key]) continue;

			try {
				const sessionData = ctx.session[key];
				if (typeof sessionData !== 'object' || !sessionData) continue;

				let instance;
				if (factory === createListSession) {
					const data = (sessionData as ListSessionData<any>).data || [];
					const initialData = Array.isArray(data) ? data : [];
					instance = createListSession(initialData);
				} else if (factory === createMapSession) {
					const data = (sessionData as MapSessionData<any>).data;
					const initialData = typeof data === 'object' && data !== null ? data : {};
					instance = createMapSession([], initialData);
				}

				//* We replace data in session
				if (instance) ctx.session[key] = instance;
			} catch (error) {
				console.error(`Error hydrating session for key ${key}:`, error);
				ctx.session[key] = factory === createListSession
					? createListSession([])
					: createMapSession([], {});
			}
		}

		return next();
	};
}
