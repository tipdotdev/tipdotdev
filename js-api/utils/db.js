import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Connection URI
const uri = process.env.DATABASE_CONNECTION_URL;

// Create a new MongoClient
const client = new MongoClient(uri);

// Export the client
export default client;