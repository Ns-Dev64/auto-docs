import { Elysia } from "elysia";
import {
getSecondsFromHours,
    generateToken,
    getEnv } from "../utils/genericUtils";
import jwt from "jsonwebtoken";
import { prismaClientInstance, redisInstance } from "../db";
import { Octokit } from "octokit";
import { oauth2 } from "elysia-oauth2";
import type { User } from "../generated/prisma/client";

const gitRedirectUri = getEnv() === "dev" ? Bun.env.DEV_REDIRECT_URI! : Bun.env.DEP_REDIRECT_URI!;
const gitClientId = Bun.env.GIT_CLIENT_ID!;
const gitClientSecret = Bun.env.GIT_CLIENT_SECRET!;


const oauthMiddleware = new Elysia()
    .use(
        oauth2({
            GitHub: [
                gitClientId,
                gitClientSecret,
                gitRedirectUri
            ]
        })
    )
    .get("/github", async ({ oauth2, redirect }) => {
        const url = oauth2.createURL("GitHub", ["user", "repo", "email"]);
        return redirect(url.href);
    })
    .get("/github/callback", async ({ oauth2, redirect }) => {
        const token = await oauth2.authorize("GitHub");

        const access_token: string = (token.data as any).access_token;
        
        const octokit = new Octokit({
            auth: access_token
        });

        const [{data},{data: email}] = await Promise.all([
            octokit.request("GET /user"),
            octokit.request("GET /user/emails")
        ])

        const userPayload: Omit<User, "createdAt" | "updatedAt" | "id"> = {
            email: email[0]?.email!,
            type: "Github",
            userName: data.name!,
            image: data.avatar_url!
        };


        let user = await prismaClientInstance.user.findUnique({
            where: {
                email: userPayload.email
            }
        });

        if (!user) {
            user = await prismaClientInstance.user.create({
                data: userPayload
            })
        };

        const tokenPayload: User = { ...user };

        const authToken = generateToken(tokenPayload);

        await Promise.all([
            redisInstance.set(`user:${user.id}:session`, JSON.stringify({access_token, authToken}), "EX", getSecondsFromHours(24) ),
            redisInstance.set(`user:${user.id}`, JSON.stringify(user), "EX", getSecondsFromHours(24))
        ]);
        
        const frontendUrl = getEnv() === "dep" 
            ? Bun.env.FRONTEND_URL || 'http://localhost:3000'
            : 'http://localhost:3000';

        const redirectUrl = new URL('/auth/success', frontendUrl);
        redirectUrl.searchParams.set('token', authToken);
        redirectUrl.searchParams.set('user', JSON.stringify({
            id: tokenPayload.id,
            userName: tokenPayload.userName,
            email: tokenPayload.email,
            createdAt: tokenPayload.createdAt
        }));

        return redirect(redirectUrl.toString());

    })

export default oauthMiddleware;