import { prismaClientInstance, redisInstance } from "../db";
import { Octokit } from "octokit";
import type { User } from "../generated/prisma/client";
import ApiError from "../utils/apiThrower"

export const getUserRepos = async({user}:{
    user:User,
}) =>{

    const session = await redisInstance.get(`user:${user.id}:session`) as any ;

    const { access_token } =JSON.parse(session);

    const octokit = new Octokit({
        auth: access_token
    });

    const repos = await octokit.request("GET /user/repos",{per_page: 100,sort:"updated"});

    return {
        success: true,
        repos
    }

}