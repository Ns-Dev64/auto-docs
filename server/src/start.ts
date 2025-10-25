import { redisInstance, prismaClientInstance } from "./db";

export const startAll = async () => {

    try {
        await Promise.all([
            redisInstance.connect(),
            prismaClientInstance.$connect()
        ]);

        console.log(`DB and cache setup done successfully`);


    }

    catch (err) {
        console.error(err)
        process.exit(0);
    }
}