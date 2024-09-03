import { createClient } from "@redis/client";
import { RedisClientType } from "@redis/client";
import { Redis } from '@upstash/redis'

export const getRedisClient = async (): Promise<RedisClientType> => {
  const client = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });

  // const client = new Redis({
  //   url: 'https://probable-viper-51887.upstash.io',
  //   token: 'AcqvAAIjcDEyNTY0NDY0MjhjNTQ0Y2ExYjMzY2ExOWFmNTc5ZDE2N3AxMA',
  // })


  await client.connect();
  return client as RedisClientType;
};
