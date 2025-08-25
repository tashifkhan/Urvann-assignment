const mongodb = require('mongodb');


const uri = process.env.MONGODB_URI || '';
if (!uri) {
  console.warn('MONGODB_URI is not set — database operations will fail until configured');
}

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
