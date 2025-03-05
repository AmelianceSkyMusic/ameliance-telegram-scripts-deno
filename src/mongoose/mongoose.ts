import process from 'node:process';
import { default as mongoose } from 'npm:mongoose@^8.8.3';
import { CallbackError, Connection } from '../../deps.deno.ts';

const DB = Deno.env.get('MONGODB');
const USER = Deno.env.get('MONGODB_USER');
const PASSWORD = Deno.env.get('MONGODB_PASSWORD')
	? encodeURIComponent(Deno.env.get('MONGODB_PASSWORD') || '')
	: null;
const HOST = Deno.env.get('MONGODB_HOST');
const NAME = Deno.env.get('MONGODB_NAME');
const PARAMS = Deno.env.get('MONGODB_PARAMS');

if (!DB) console.error('MONGODB: MONGODB is not defined');
if (!USER) console.error('MONGODB: MONGODB_USER is not defined');
if (!PASSWORD) console.error('MONGODB: MONGODB_PASSWORD is not defined');
if (!HOST) console.error('MONGODB: MONGODB_HOST is not defined');
if (!NAME) console.error('MONGODB: MONGODB_NAME is not defined');
if (!PARAMS) console.error('MONGODB: MONGODB_NAME is not defined');

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

		connection.connection.on('error', (err: CallbackError) => {
			console.error('MONGODB: Error connecting to MongoDB:', err);
		});

		connection.connection.on('disconnected', () => {
			console.log('MONGODB: MongoDB disconnected. Trying to reconnect...');
		});

		connection.connection.on('reconnected', () => {
			console.log('MONGODB: MongoDB reconnected successfully');
		});

		return connection.connection;
	} catch (error) {
		console.error('MONGODB: Error connecting to MongoDB:', error);
		process.exit(1);
	}
}
