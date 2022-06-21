import { createClient } from 'redis';

const redis = createClient();

redis.on('error', error => console.error(error));

redis.connect().then();

export default redis;
