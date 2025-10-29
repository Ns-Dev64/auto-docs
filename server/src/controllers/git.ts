import { prismaClientInstance, redisInstance } from "../db";
import { Octokit } from "octokit";
import type { User } from "../generated/prisma/client";
import ApiError from "../utils/apiThrower"
import { t } from "elysia";
import type { Static } from "elysia";
import { getEnv } from "../utils/genericUtils";

export const repoConfigSchema = {
    body: t.Object({
        repoId: t.String(),
        repoFullName: t.String(),
        config: t.Object({
            docsFolder: t.String({
                default: "docs"
            }),
            enabled: t.Boolean(),
            detailLevel: t.Union([
                t.Literal('minimal'),
                t.Literal('balanced'),
                t.Literal('comprehensive')
            ]),
            includeExamples: t.Boolean(),
            includeTypeInfo: t.Boolean(),
            includedPaths: t.Array(t.String()),
            excludedPaths: t.Array(t.String()),
            fileTypes: t.Array(t.String({
                pattern: '\\.(js|ts|tsx|py|go|rs|php)$'
            })),
            branches: t.Array(t.String()),
            initialDocGeneration: t.Object({
                enabled: t.Boolean(),
                selectedFolders: t.Array(t.String())
            })
        }),
    })
}

type configSchema = Static<typeof repoConfigSchema.body>

export const getUserRepos = async ({ user }: {
    user: User,
}) => {

    const session = await redisInstance.get(`user:${user.id}:session`) as any;

    const { access_token } = JSON.parse(session);

    const octokit = new Octokit({
        auth: access_token
    });

    const repos = await octokit.request("GET /user/repos", { per_page: 100, sort: "updated" });

    return {
        success: true,
        repos
    }

}

export const repo = async ({ body, user }: {
    body: configSchema,
    user: User
}) => {

    const { ...config } = body;

    const { repoId, repoFullName } = config;
    const { config: repoConfig } = config;

    const session = await redisInstance.get(`user:${user.id}:session`) as any;
    const { access_token } = JSON.parse(session);

    const octokit = new Octokit({
        auth: access_token
    });

    const [owner, repo] = repoFullName?.split("/");
    const webHookUrl = getEnv() === "dep" ? Bun.env.WEBHOOK_URL_DEP : Bun.env.WEBHOOK_URL_DEV

    const [dbRepo, dbConfig, { data:webhookData }] = await Promise.all([
        prismaClientInstance.repo.create({
            data: {
                repId: repoId,
                repName: repoFullName,
                repOwnerId: user.id
            }
        }),
        prismaClientInstance.repoConfig.create({
            data: {
                ...repoConfig,
                repoId
            }
        }),
        octokit.rest.repos.createWebhook({
            owner: owner!,
            repo: repo!,
            config: {
                url: webHookUrl,
                secret: Bun.env.WEBHOOK_SECRET,
                content_type: "json"
            },
            events: ["push"]
        })
    ]);


}