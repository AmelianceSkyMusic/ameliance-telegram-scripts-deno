import process from 'node:process';
import mongoose from 'npm:mongoose@8.12.1';
import { CallbackError, Connection } from '../../deps.deno.ts';

const DB = Deno.env.get('MONGODB');
const USER = Deno.env.get('MONGODB_USER');
const PASSWORD = Deno.env.get('MONGODB_PASSWORD')
	? encodeURIComponent(Deno.env.get('MONGODB_PASSWORD') || '')
	: null;
const HOST = Deno.env.get('MONGODB_HOST');
const NAME = Deno.env.get('MONGODB_NAME');
const PARAMS = Deno.env.get('MONGODB_PARAMS');

if (!DB) console.error('MONGODB: MONGODB is not set');
if (!USER) console.error('MONGODB: MONGODB_USER is not set');
if (!PASSWORD) console.error('MONGODB: MONGODB_PASSWORD is not set');
if (!HOST) console.error('MONGODB: MONGODB_HOST is not set');
if (!NAME) console.error('MONGODB: MONGODB_NAME is not set');
if (!PARAMS) console.error('MONGODB: MONGODB_NAME is not set');

const DB_URL = `${DB}${USER}:${PASSWORD}@${HOST}/${NAME}${PARAMS}`;

let cachedConnection: Connection | null = null;

export async function connectToDatabase() {
	try {
		if (cachedConnection) {
			console.log('MONGODB: Using cached connection');
			return cachedConnection;
		}

		const options = {
			socketTimeoutMS: 30_000,
			connectTimeoutMS: 30_000,
			serverSelectionTimeoutMS: 30_000,
			retryWrites: true,
			maxPoolSize: 20,
			minPoolSize: 5,
		};

		const connection = await mongoose.connect(DB_URL, options);

		cachedConnection = connection.connection;

		if (mongoose.connection.readyState) console.log('MONGODB: Connected to MongoDB');

		cachedConnection.on('error', (err: CallbackError) => {
			console.error('MONGODB: Error connecting to MongoDB:', err);
		});

		cachedConnection.on('disconnected', () => {
			console.log('MONGODB: MongoDB disconnected. Trying to reconnect...');
		});

		cachedConnection.on('reconnected', () => {
			console.log('MONGODB: MongoDB reconnected successfully');
		});

		return cachedConnection;
	} catch (error) {
		console.error('MONGODB: Error connecting to MongoDB:', error);
		process.exit(1);
	}
}
