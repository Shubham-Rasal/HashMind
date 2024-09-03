import { createClient } from "@redis/client";
import { RedisClientType } from "@redis/client";
import { Redis } from '@upstash/redis'

export const getRedisClient = async (): Promise<RedisClientType> => {
  const client = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });


  await client.connect();
  return client as RedisClientType;
};
