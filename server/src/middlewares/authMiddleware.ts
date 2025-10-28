import { Elysia } from "elysia";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiThrower";
import { redisInstance } from "../db";
import type { User } from "../generated/prisma/client";

const authMiddleware = new Elysia()

    .derive({as: 'scoped'},async({headers})=>{

        const authorization = headers.authorization;

        if (!authorization) throw new ApiError(401, "Unauthorized");

        const token = authorization.split(' ')[1];

        if (!token) throw new ApiError(401, "Invalid token");

        const secret = Bun.env.JWT_SECRET!;
        const payload = jwt.verify(token, secret) as User;

        const cache = await redisInstance.get(`user:${payload.id}:session`) ?? '' as any ;

        const {authToken} = JSON.parse(cache);

        if(!authToken || authToken !== token){
            throw new ApiError(401,"Unauthorized")
        }

        return {user: payload}

    })


export default authMiddleware