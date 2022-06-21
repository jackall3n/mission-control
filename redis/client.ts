import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', error => console.error(error));

redis.on('connect', () => {
  console.log("connected");
})

redis.connect().then(() => console.log('connected'));

export default redis;
