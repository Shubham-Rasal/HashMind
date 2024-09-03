import { createClient } from "@redis/client";
export const getRedisClient = async () => {
    const client = createClient({
        url: process.env.REDIS_CONNECTION_STRING,
    });
    // const client = new Redis({
    //   url: 'https://probable-viper-51887.upstash.io',
    //   token: 'AcqvAAIjcDEyNTY0NDY0MjhjNTQ0Y2ExYjMzY2ExOWFmNTc5ZDE2N3AxMA',
    // })
    await client.connect();
    return client;
};
//# sourceMappingURL=redis.js.map