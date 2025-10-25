import { RedisClient } from "bun";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

export const redisInstance = new RedisClient();
export const prismaClientInstance =  new PrismaClient().$extends(withAccelerate());