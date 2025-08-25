const mongodb = require('mongodb');

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env');
}

const uri = process.env.MONGODB_URI;

// Use a simple global to cache the promise in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: any;
}

let clientPromise: Promise<any>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new mongodb.MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new mongodb.MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
